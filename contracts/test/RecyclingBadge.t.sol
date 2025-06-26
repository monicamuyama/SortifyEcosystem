// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/RecyclingBadge.sol";

contract RecyclingBadgeTest is Test {
    RecyclingBadge public recyclingBadge;
    address public owner;
    address public user1;
    address public user2;
    address public minter1;
    address public minter2;
    
    // Events to test
    event BadgeMinted(uint256 indexed tokenId, address indexed recycler, string wasteType, uint256 quantity);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        minter1 = makeAddr("minter1");
        minter2 = makeAddr("minter2");
        
        recyclingBadge = new RecyclingBadge(owner);
    }
    
    function testInitialState() public {
        assertEq(recyclingBadge.name(), "Sortify Recycling Badge");
        assertEq(recyclingBadge.symbol(), "SRB");
        assertEq(recyclingBadge.owner(), owner);
        assertFalse(recyclingBadge.authorizedMinters(minter1));
        assertFalse(recyclingBadge.authorizedMinters(minter2));
    }
    
    function testAuthorizeMinter() public {
        // Test authorizing a minter
        vm.expectEmit(true, false, false, false);
        emit MinterAuthorized(minter1);
        
        recyclingBadge.authorizeMinter(minter1);
        assertTrue(recyclingBadge.authorizedMinters(minter1));
    }
    
    function testAuthorizeMinterOnlyOwner() public {
        // Test that only owner can authorize minters
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        recyclingBadge.authorizeMinter(minter1);
    }
    
    function testRevokeMinter() public {
        // First authorize the minter
        recyclingBadge.authorizeMinter(minter1);
        assertTrue(recyclingBadge.authorizedMinters(minter1));
        
        // Then revoke the minter
        vm.expectEmit(true, false, false, false);
        emit MinterRevoked(minter1);
        
        recyclingBadge.revokeMinter(minter1);
        assertFalse(recyclingBadge.authorizedMinters(minter1));
    }
    
    function testRevokeMinterOnlyOwner() public {
        recyclingBadge.authorizeMinter(minter1);
        
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        recyclingBadge.revokeMinter(minter1);
    }
    
    function testMintBadgeByOwner() public {
        string memory wasteType = "Plastic";
        uint256 quantity = 100;
        string memory tokenURI = "https://example.com/token/1";
        string memory transactionHash = "0x123456789abcdef";
        
        vm.expectEmit(true, true, false, true);
        emit BadgeMinted(1, user1, wasteType, quantity);
        
        uint256 tokenId = recyclingBadge.mintBadge(
            user1,
            wasteType,
            quantity,
            tokenURI,
            transactionHash
        );
        
        assertEq(tokenId, 1);
        assertEq(recyclingBadge.ownerOf(tokenId), user1);
        assertEq(recyclingBadge.tokenURI(tokenId), tokenURI);
        
        // Check metadata
        RecyclingBadge.BadgeMetadata memory metadata = recyclingBadge.getBadgeMetadata(tokenId);
        assertEq(metadata.recycler, user1);
        assertEq(metadata.wasteType, wasteType);
        assertEq(metadata.quantity, quantity);
        assertEq(metadata.transactionHash, transactionHash);
        assertEq(metadata.timestamp, block.timestamp);
    }
    
    function testMintBadgeByAuthorizedMinter() public {
        // Authorize minter
        recyclingBadge.authorizeMinter(minter1);
        
        string memory wasteType = "Glass";
        uint256 quantity = 50;
        string memory tokenURI = "https://example.com/token/2";
        string memory transactionHash = "0xabcdef123456789";
        
        vm.prank(minter1);
        vm.expectEmit(true, true, false, true);
        emit BadgeMinted(1, user2, wasteType, quantity);
        
        uint256 tokenId = recyclingBadge.mintBadge(
            user2,
            wasteType,
            quantity,
            tokenURI,
            transactionHash
        );
        
        assertEq(tokenId, 1);
        assertEq(recyclingBadge.ownerOf(tokenId), user2);
        assertEq(recyclingBadge.tokenURI(tokenId), tokenURI);
    }
    
    function testMintBadgeUnauthorized() public {
        vm.prank(user1);
        vm.expectRevert("Not authorized to mint");
        recyclingBadge.mintBadge(
            user2,
            "Metal",
            25,
            "https://example.com/token/3",
            "0x987654321fedcba"
        );
    }
    
    function testMintMultipleBadges() public {
        recyclingBadge.authorizeMinter(minter1);
        
        // Mint first badge
        vm.prank(minter1);
        uint256 tokenId1 = recyclingBadge.mintBadge(
            user1,
            "Plastic",
            100,
            "https://example.com/token/1",
            "0x111"
        );
        
        // Mint second badge
        uint256 tokenId2 = recyclingBadge.mintBadge(
            user1,
            "Glass",
            50,
            "https://example.com/token/2",
            "0x222"
        );
        
        // Mint third badge to different user
        vm.prank(minter1);
        uint256 tokenId3 = recyclingBadge.mintBadge(
            user2,
            "Metal",
            75,
            "https://example.com/token/3",
            "0x333"
        );
        
        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(tokenId3, 3);
        
        assertEq(recyclingBadge.ownerOf(tokenId1), user1);
        assertEq(recyclingBadge.ownerOf(tokenId2), user1);
        assertEq(recyclingBadge.ownerOf(tokenId3), user2);
        
        assertEq(recyclingBadge.balanceOf(user1), 2);
        assertEq(recyclingBadge.balanceOf(user2), 1);
    }
    
    function testGetBadgeMetadata() public {
        string memory wasteType = "Organic";
        uint256 quantity = 200;
        string memory transactionHash = "0xfedcba987654321";
        
        uint256 tokenId = recyclingBadge.mintBadge(
            user1,
            wasteType,
            quantity,
            "https://example.com/token/1",
            transactionHash
        );
        
        RecyclingBadge.BadgeMetadata memory metadata = recyclingBadge.getBadgeMetadata(tokenId);
        
        assertEq(metadata.recycler, user1);
        assertEq(metadata.wasteType, wasteType);
        assertEq(metadata.quantity, quantity);
        assertEq(metadata.transactionHash, transactionHash);
        assertEq(metadata.timestamp, block.timestamp);
    }
    
    function testGetBadgeMetadataInvalidToken() public {
        vm.expectRevert("Badge does not exist");
        recyclingBadge.getBadgeMetadata(999);
    }
    
    function testSupportsInterface() public {
        // Test ERC721 interface
        assertTrue(recyclingBadge.supportsInterface(0x80ac58cd));
        // Test ERC721Metadata interface
        assertTrue(recyclingBadge.supportsInterface(0x5b5e139f));
        // Test ERC165 interface
        assertTrue(recyclingBadge.supportsInterface(0x01ffc9a7));
    }
    
    function testTokenTransfer() public {
        // Mint a badge
        uint256 tokenId = recyclingBadge.mintBadge(
            user1,
            "Plastic",
            100,
            "https://example.com/token/1",
            "0x123"
        );
        
        // Transfer from user1 to user2
        vm.prank(user1);
        recyclingBadge.transferFrom(user1, user2, tokenId);
        
        assertEq(recyclingBadge.ownerOf(tokenId), user2);
        assertEq(recyclingBadge.balanceOf(user1), 0);
        assertEq(recyclingBadge.balanceOf(user2), 1);
        
        // Metadata should remain unchanged
        RecyclingBadge.BadgeMetadata memory metadata = recyclingBadge.getBadgeMetadata(tokenId);
        assertEq(metadata.recycler, user1); // Original recycler info preserved
    }
    
    function testFuzzMintBadge(
        address to,
        string memory wasteType,
        uint256 quantity,
        string memory tokenURI,
        string memory transactionHash
    ) public {
        vm.assume(to != address(0));
        vm.assume(bytes(wasteType).length > 0);
        vm.assume(bytes(tokenURI).length > 0);
        vm.assume(bytes(transactionHash).length > 0);
        
        uint256 tokenId = recyclingBadge.mintBadge(
            to,
            wasteType,
            quantity,
            tokenURI,
            transactionHash
        );
        
        assertEq(recyclingBadge.ownerOf(tokenId), to);
        assertEq(recyclingBadge.tokenURI(tokenId), tokenURI);
        
        RecyclingBadge.BadgeMetadata memory metadata = recyclingBadge.getBadgeMetadata(tokenId);
        assertEq(metadata.recycler, to);
        assertEq(metadata.wasteType, wasteType);
        assertEq(metadata.quantity, quantity);
        assertEq(metadata.transactionHash, transactionHash);
    }
}