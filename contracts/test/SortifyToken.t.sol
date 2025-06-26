// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SortifyToken.sol";

error EnforcedPause();

contract SortifyTokenTest is Test {
    SortifyToken token;
    address owner = address(0xABCD);
    address minter = address(0xBEEF);
    address user = address(0xCAFE);

    function setUp() public {
        vm.prank(owner);
        token = new SortifyToken(owner);
    }

    function testInitialSupply() public {
        assertEq(token.balanceOf(owner), 100_000_000 ether);
        assertEq(token.totalSupply(), 100_000_000 ether);
    }

    function testAddAndRemoveMinter() public {
        vm.prank(owner);
        token.addMinter(minter);
        assertTrue(token.minters(minter));

        vm.prank(owner);
        token.removeMinter(minter);
        assertFalse(token.minters(minter));
    }

    function testMintByMinter() public {
        vm.prank(owner);
        token.addMinter(minter);

        vm.prank(minter);
        token.mint(user, 1_000 ether, "test mint");
        assertEq(token.balanceOf(user), 1_000 ether);
    }

    function testMintExceedsMaxSupply() public {
        vm.prank(owner);
        token.addMinter(minter);

        vm.prank(minter);
        vm.expectRevert("Exceeds maximum supply");
        token.mint(user, 1_000_000_001 ether, "overflow");
    }

    function testPauseAndUnpause() public {
        vm.prank(owner);
        token.pause();
        // Use custom error instead of string
        vm.expectRevert(EnforcedPause.selector);
        vm.prank(owner);
        token.mint(user, 1 ether, "paused");

        vm.prank(owner);
        token.unpause();
        vm.prank(owner);
        token.mint(user, 1 ether, "unpaused");
        assertEq(token.balanceOf(user), 1 ether);
    }
}
