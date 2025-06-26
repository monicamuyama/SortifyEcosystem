// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {SortifyToken} from "../src/SortifyToken.sol";



contract DeploySortifyToken is Script {
    function run() external {
        // Load deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        // Token configuration parameters
        string memory name = "Sortify Token";
        string memory symbol = "MTK";
        uint256 initialSupply = 100_000_000 * 10**18; // 100 million tokens
        //Start broadcasting

        vm.startBroadcast(deployerPrivateKey);
           
        // Deploy the token contract
        SortifyToken token = new SortifyToken(deployerAddress);
        
        // Stop broadcasting transactions
        vm.stopBroadcast();
        
        // Log deployment information
        console.log("Token deployed to:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Initial supply:", token.totalSupply());
        console.log("Deployer balance:", token.balanceOf(deployerAddress));
    }
}