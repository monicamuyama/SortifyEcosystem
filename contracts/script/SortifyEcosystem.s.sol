// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SortifyEcosystem.sol";

contract DeploySortifyEcosystem is Script {
    function run() external {
        // Load from .env using exact keys

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address initialOwner = vm.envAddress("DEPLOYER");
        address sortifyToken = vm.envAddress("NEXT_PUBLIC_SORTIFY_TOKEN_ADDRESS");
        address recyclingBadge = vm.envAddress("NEXT_PUBLIC_RECYCLING_BADGE_ADDRESS");
        address collectorLock = vm.envAddress("NEXT_PUBLIC_COLLECTOR_LOCK_ADDRESS");
        address recyclerLock = vm.envAddress("NEXT_PUBLIC_RECYCLER_LOCK_ADDRESS");
        address verifierLock = vm.envAddress("NEXT_PUBLIC_VERIFIER_LOCK_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        SortifyEcosystem ecosystem = new SortifyEcosystem(
            initialOwner,
            sortifyToken,
            recyclingBadge,
            collectorLock,
            recyclerLock,
            verifierLock
        );

        vm.stopBroadcast();

        console.log(" SortifyEcosystem deployed at:", address(ecosystem));
    }
}
