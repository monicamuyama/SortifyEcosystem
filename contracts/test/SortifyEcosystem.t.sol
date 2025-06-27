// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SortifyEcosystem.sol";
import "../src/SortifyToken.sol";
import "../src/RecyclingBadge.sol";

// Mock Unlock Protocol lock contract
contract MockLock {
    mapping(address => bool) public validKey;
    function getHasValidKey(address user) external view returns (bool) {
        return validKey[user];
    }
    function setValidKey(address user, bool val) external {
        validKey[user] = val;
    }
}

contract SortifyEcosystemTest is Test {
    SortifyToken token;
    RecyclingBadge badge;
    SortifyEcosystem eco;
    MockLock collectorLock;
    MockLock recyclerLock;
    MockLock verifierLock;

    address owner = address(0x1);
    address collector = address(0x2);
    address recycler = address(0x3);
    address verifier = address(0x4);
    address requester = address(0x5);

    function setUp() public {
        token = new SortifyToken(owner);
        badge = new RecyclingBadge(owner);
        collectorLock = new MockLock();
        recyclerLock = new MockLock();
        verifierLock = new MockLock();

        eco = new SortifyEcosystem(
            owner,
            address(token),
            address(badge),
            address(collectorLock),
            address(recyclerLock),
            address(verifierLock)
        );

        // Grant memberships
        collectorLock.setValidKey(collector, true);
        recyclerLock.setValidKey(recycler, true);
        verifierLock.setValidKey(verifier, true);

        // Authorize ecosystem as minter
        vm.prank(owner);
        token.addMinter(address(eco));
        vm.prank(owner);
        badge.authorizeMinter(address(eco));
    }

    function testRequestAcceptCompleteVerifyFlow() public {
        // Prepare waste items
        SortifyEcosystem.WasteItem[] memory items = new SortifyEcosystem.WasteItem[](1);
        items[0] = SortifyEcosystem.WasteItem(SortifyEcosystem.WasteType.PLASTIC, 1000);

        // Request waste collection
        vm.prank(requester);
        eco.requestWasteCollection(items, "TestLocation", 0, 0, "notes");

        // Collector accepts
        vm.prank(collector);
        eco.acceptCollectionRequest(1);

        // Collector completes
        vm.prank(collector);
        eco.completeCollection(1);

        // Verifier verifies
        vm.prank(verifier);
        eco.verifyCollection(1, true, "verified");

        // Check balances
        assertGt(token.balanceOf(requester), 0);
        assertGt(token.balanceOf(collector), 0);
        assertGt(token.balanceOf(verifier), 0);
    }
}
