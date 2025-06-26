// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SortifyEcosystem.sol";
import "../src/SortifyToken.sol";
import "../src/RecyclingBadge.sol";

// Mock Unlock Protocol lock for testing
contract MockPublicLock {
    mapping(address => bool) private _hasValidKey;
    uint256 public keyPrice = 0.01 ether;
    
    function setValidKey(address user, bool valid) external {
        _hasValidKey[user] = valid;
    }
    
    function getHasValidKey(address user) external view returns (bool) {
        return _hasValidKey[user];
    }
    
    function balanceOf(address) external pure returns (uint256) {
        return 1;
    }
    
    function keyExpirationTimestampFor(address) external pure returns (uint256) {
        return block.timestamp + 365 days;
    }
    
    function purchaseFor(
        address recipient,
        uint256,
        bytes calldata,
        bytes calldata
    ) external payable {
        require(msg.value >= keyPrice, "Insufficient payment");
        _hasValidKey[recipient] = true;
    }
}

contract SortifyEcosystemTest is Test {
    SortifyEcosystem public ecosystem;
    SortifyToken public token;
    RecyclingBadge public badge;
    MockPublicLock public collectorLock;
    MockPublicLock public recyclerLock;
    MockPublicLock public verifierLock;
    
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public collector1 = makeAddr("collector1");
    address public recycler1 = makeAddr("recycler1");
    address public verifier1 = makeAddr("verifier1");
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy mock locks
        collectorLock = new MockPublicLock();
        recyclerLock = new MockPublicLock();
        verifierLock = new MockPublicLock();
        
        // Deploy token and badge contracts
        token = new SortifyToken(owner);
        badge = new RecyclingBadge(owner);
        
        // Deploy ecosystem contract
        ecosystem = new SortifyEcosystem(
            owner,
            address(token),
            address(badge),
            address(collectorLock),
            address(recyclerLock),
            address(verifierLock)
        );
        
        // Set ecosystem as minter for token and badge
        token.setMinter(address(ecosystem), true);
        badge.setMinter(address(ecosystem));
        
        // Setup memberships for test users
        collectorLock.setValidKey(collector1, true);
        recyclerLock.setValidKey(recycler1, true);
        verifierLock.setValidKey(verifier1, true);
        
        vm.stopPrank();
        
        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(collector1, 10 ether);
        vm.deal(recycler1, 10 ether);
        vm.deal(verifier1, 10 ether);
    }
    
    function testRequestWasteCollection() public {
        vm.startPrank(user1);
        
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](2);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000 // 1kg in grams
        });
        wasteItems[1] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PAPER,
            amount: 500 // 0.5kg in grams
        });
        
        vm.expectEmit(true, true, false, true);
        emit SortifyEcosystem.CollectionRequested(1, user1, 6.5 ether); // 5 + 1.5 tokens
        
        ecosystem.requestWasteCollection(
            wasteItems,
            "123 Test Street",
            123456789,
            987654321,
            "Please collect from front door"
        );
        
        // Verify request was created
        SortifyEcosystem.CollectionRequest memory request = ecosystem.getCollectionRequest(1);
        assertEq(request.id, 1);
        assertEq(request.requester, user1);
        assertEq(request.location, "123 Test Street");
        assertEq(uint256(request.status), uint256(SortifyEcosystem.CollectionStatus.REQUESTED));
        assertEq(request.pendingReward, 6.5 ether);
        
        vm.stopPrank();
    }
    
    function testAcceptCollectionRequest() public {
        // First create a request
        vm.startPrank(user1);
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000
        });
        
        ecosystem.requestWasteCollection(
            wasteItems,
            "123 Test Street",
            123456789,
            987654321,
            "Test collection"
        );
        vm.stopPrank();
        
        // Accept the request as collector
        vm.startPrank(collector1);
        
        vm.expectEmit(true, true, false, false);
        emit SortifyEcosystem.CollectionAccepted(1, collector1);
        
        ecosystem.acceptCollectionRequest(1);
        
        // Verify request was accepted
        SortifyEcosystem.CollectionRequest memory request = ecosystem.getCollectionRequest(1);
        assertEq(uint256(request.status), uint256(SortifyEcosystem.CollectionStatus.ACCEPTED));
        assertEq(request.assignedCollector, collector1);
        
        vm.stopPrank();
    }
    
    function testCompleteCollection() public {
        // Setup: Create and accept a request
        _createAndAcceptRequest();
        
        // Complete the collection
        vm.startPrank(collector1);
        
        vm.expectEmit(true, true, false, false);
        emit SortifyEcosystem.CollectionCompleted(1, collector1);
        
        ecosystem.completeCollection(1);
        
        // Verify completion
        SortifyEcosystem.CollectionRequest memory request = ecosystem.getCollectionRequest(1);
        assertEq(uint256(request.status), uint256(SortifyEcosystem.CollectionStatus.COMPLETED));
        
        vm.stopPrank();
    }
    
    function testVerifyCollection() public {
        // Setup: Create, accept, and complete a request
        _createAcceptAndCompleteRequest();
        
        // Verify the collection
        vm.startPrank(verifier1);
        
        uint256 initialUserBalance = token.balanceOf(user1);
        uint256 initialCollectorBalance = token.balanceOf(collector1);
        uint256 initialVerifierBalance = token.balanceOf(verifier1);
        
        ecosystem.verifyCollection(1, true, "Collection verified successfully");
        
        // Check rewards were distributed correctly
        uint256 expectedUserReward = (5 ether * 80) / 100; // 4 tokens
        uint256 expectedCollectorReward = (5 ether * 10) / 100; // 0.5 tokens
        uint256 expectedVerifierReward = (5 ether * 10) / 100; // 0.5 tokens
        
        assertEq(token.balanceOf(user1), initialUserBalance + expectedUserReward);
        assertEq(token.balanceOf(collector1), initialCollectorBalance + expectedCollectorReward);
        assertEq(token.balanceOf(verifier1), initialVerifierBalance + expectedVerifierReward);
        
        // Check reputation was updated
        assertEq(ecosystem.userReputation(user1), 1);
        assertEq(ecosystem.userReputation(collector1), 1);
        
        // Verify request status
        SortifyEcosystem.CollectionRequest memory request = ecosystem.getCollectionRequest(1);
        assertEq(uint256(request.status), uint256(SortifyEcosystem.CollectionStatus.VERIFIED));
        assertEq(request.verifier, verifier1);
        
        vm.stopPrank();
    }
    
    function testCreateListing() public {
        // Setup processed waste for recycler
        vm.startPrank(owner);
        ecosystem.addProcessedWaste(recycler1, "plastic", 5000); // 5kg
        vm.stopPrank();
        
        vm.startPrank(recycler1);
        
        vm.expectEmit(true, true, false, true);
        emit SortifyEcosystem.ListingCreated(1, recycler1, "plastic", 2000, 10 ether);
        
        ecosystem.createListing("plastic", 2000, 10 ether); // 2kg at 10 tokens per kg
        
        // Verify listing was created
        SortifyEcosystem.Listing memory listing = ecosystem.listings(1);
        assertEq(listing.id, 1);
        assertEq(listing.seller, recycler1);
        assertEq(listing.wasteType, "plastic");
        assertEq(listing.quantity, 2000);
        assertEq(listing.price, 10 ether);
        assertTrue(listing.active);
        
        vm.stopPrank();
    }
    
    function testPurchaseListing() public {
        // Setup: Create a listing
        vm.startPrank(owner);
        ecosystem.addProcessedWaste(recycler1, "plastic", 5000);
        vm.stopPrank();
        
        vm.startPrank(recycler1);
        ecosystem.createListing("plastic", 2000, 10 ether);
        vm.stopPrank();
        
        // Setup buyer with tokens and recycler membership
        vm.startPrank(owner);
        token.mint(user1, 25 ether, "Test tokens");
        vm.stopPrank();
        
        recyclerLock.setValidKey(user1, true);
        
        // Purchase listing
        vm.startPrank(user1);
        token.approve(address(ecosystem), 20 ether);
        
        uint256 initialSellerBalance = token.balanceOf(recycler1);
        uint256 initialBuyerBalance = token.balanceOf(user1);
        uint256 initialBadgeCount = badge.balanceOf(user1);
        
        ecosystem.purchaseListing(1, 1000); // Buy 1kg
        
        // Verify token transfer
        assertEq(token.balanceOf(recycler1), initialSellerBalance + 10 ether);
        assertEq(token.balanceOf(user1), initialBuyerBalance - 10 ether);
        
        // Verify badge was minted
        assertEq(badge.balanceOf(user1), initialBadgeCount + 1);
        
        // Verify listing quantity updated
        SortifyEcosystem.Listing memory listing = ecosystem.listings(1);
        assertEq(listing.quantity, 1000); // 2000 - 1000
        assertTrue(listing.active);
        
        vm.stopPrank();
    }
    
    function testPurchaseMembership() public {
        vm.startPrank(user1);
        
        uint256 membershipPrice = 0.01 ether;
        
        vm.expectEmit(true, true, false, true);
        emit SortifyEcosystem.MembershipPurchased(
            user1, 
            address(collectorLock), 
            uint256(SortifyEcosystem.MembershipType.COLLECTOR)
        );
        
        ecosystem.purchaseMembership{value: membershipPrice}(
            SortifyEcosystem.MembershipType.COLLECTOR
        );
        
        // Verify membership was purchased
        assertTrue(collectorLock.getHasValidKey(user1));
        
        vm.stopPrank();
    }
    
    function testGetUserProfile() public {
        // Setup user with some activity
        vm.startPrank(owner);
        token.mint(user1, 100 ether, "Test tokens");
        vm.stopPrank();
        
        collectorLock.setValidKey(user1, true);
        recyclerLock.setValidKey(user1, true);
        
        // Create a request to increase total requests
        vm.startPrank(user1);
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000
        });
        ecosystem.requestWasteCollection(wasteItems, "Test", 0, 0, "Test");
        vm.stopPrank();
        
        // Get user profile
        (
            bool isCollector,
            bool isRecycler,
            bool isVerifier,
            uint256 reputation,
            uint256 tokenBalance,
            uint256 totalRequests,
            uint256 badgeCount
        ) = ecosystem.getUserProfile(user1);
        
        assertTrue(isCollector);
        assertTrue(isRecycler);
        assertFalse(isVerifier);
        assertEq(reputation, 0);
        assertEq(tokenBalance, 100 ether);
        assertEq(totalRequests, 1);
        assertEq(badgeCount, 0);
    }
    
    function testGetAvailableRequests() public {
        // Create multiple requests
        vm.startPrank(user1);
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000
        });
        
        for (uint i = 0; i < 5; i++) {
            ecosystem.requestWasteCollection(wasteItems, "Test", 0, 0, "Test");
        }
        vm.stopPrank();
        
        // Get available requests
        uint256[] memory availableRequests = ecosystem.getAvailableRequests(0, 10);
        assertEq(availableRequests.length, 5);
        
        // Accept one request
        vm.startPrank(collector1);
        ecosystem.acceptCollectionRequest(1);
        vm.stopPrank();
        
        // Check available requests decreased
        availableRequests = ecosystem.getAvailableRequests(0, 10);
        assertEq(availableRequests.length, 4);
    }
    
    function testFailNonCollectorAcceptRequest() public {
        _createRequest();
        
        vm.startPrank(user1); // user1 is not a collector
        vm.expectRevert("Must have valid collector membership");
        ecosystem.acceptCollectionRequest(1);
        vm.stopPrank();
    }
    
    function testFailNonRecyclerCreateListing() public {
        vm.startPrank(user1); // user1 is not a recycler
        vm.expectRevert("Must have valid recycler membership");
        ecosystem.createListing("plastic", 1000, 10 ether);
        vm.stopPrank();
    }
    
    function testFailNonVerifierVerifyCollection() public {
        _createAcceptAndCompleteRequest();
        
        vm.startPrank(user1); // user1 is not a verifier
        vm.expectRevert("Must have valid verifier membership or be owner");
        ecosystem.verifyCollection(1, true, "Test");
        vm.stopPrank();
    }
    
    function testPauseUnpause() public {
        vm.startPrank(owner);
        
        ecosystem.pause();
        vm.stopPrank();
        
        // Try to create request while paused
        vm.startPrank(user1);
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000
        });
        
        vm.expectRevert("Pausable: paused");
        ecosystem.requestWasteCollection(wasteItems, "Test", 0, 0, "Test");
        vm.stopPrank();
        
        // Unpause and try again
        vm.startPrank(owner);
        ecosystem.unpause();
        vm.stopPrank();
        
        vm.startPrank(user1);
        ecosystem.requestWasteCollection(wasteItems, "Test", 0, 0, "Test");
        vm.stopPrank();
    }
    
    // Helper functions
    function _createRequest() internal {
        vm.startPrank(user1);
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 1000
        });
        ecosystem.requestWasteCollection(wasteItems, "Test", 0, 0, "Test");
        vm.stopPrank();
    }
    
    function _createAndAcceptRequest() internal {
        _createRequest();
        vm.startPrank(collector1);
        ecosystem.acceptCollectionRequest(1);
        vm.stopPrank();
    }
    
    function _createAcceptAndCompleteRequest() internal {
        _createAndAcceptRequest();
        vm.startPrank(collector1);
        ecosystem.completeCollection(1);
        vm.stopPrank();
    }
}