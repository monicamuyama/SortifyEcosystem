// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/RecyclingBadge.sol";

contract DeployRecyclingBadge is Script {
    function run() external {
        
        // Load initial owner from .env or use msg.sender
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address initialOwner = vm.envAddress("DEPLOYER");

        vm.startBroadcast(deployerPrivateKey);

        RecyclingBadge badge = new RecyclingBadge(initialOwner);

        vm.stopBroadcast();

        console.log(" RecyclingBadge deployed to:", address(badge));
    }
}
