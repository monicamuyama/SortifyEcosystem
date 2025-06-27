// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/RecyclingBadge.sol";

contract RecyclingBadgeTest is Test {
    RecyclingBadge badge;
    address owner = address(0x1);
    address minter = address(0x2);
    address user = address(0x3);

    function setUp() public {
        badge = new RecyclingBadge(owner);
        vm.prank(owner);
        badge.authorizeMinter(minter);
    }

    function testMintBadge() public {
        vm.prank(minter);
        uint256 tokenId = badge.mintBadge(
            user,
            "plastic",
            1000,
            "ipfs://badge/1",
            "txhash123"
        );
        assertEq(badge.ownerOf(tokenId), user);
        RecyclingBadge.BadgeMetadata memory meta = badge.getBadgeMetadata(tokenId);
        assertEq(meta.recycler, user);
        assertEq(meta.quantity, 1000);
    }

    function testUnauthorizedMintFails() public {
        vm.expectRevert("Not authorized to mint");
        badge.mintBadge(user, "glass", 500, "uri", "txhash");
    }
}
