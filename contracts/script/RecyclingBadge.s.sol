// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/RecyclingBadge.sol";

contract DeployRecyclingBadge is Script {
    function run() external {
        // Get deployment parameters from environment variables
        address initialOwner = vm.envOr("INITIAL_OWNER", msg.sender);
        
        // Read private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Deploying RecyclingBadge contract...");
        console.log("Initial Owner:", initialOwner);
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the RecyclingBadge contract
        RecyclingBadge recyclingBadge = new RecyclingBadge(initialOwner);
        
        vm.stopBroadcast();
        
        console.log("RecyclingBadge deployed at:", address(recyclingBadge));
        console.log("Contract Name:", recyclingBadge.name());
        console.log("Contract Symbol:", recyclingBadge.symbol());
        console.log("Contract Owner:", recyclingBadge.owner());
        
        // Log deployment details for verification
        console.log("\n=== Deployment Summary ===");
        console.log("Network Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Block Timestamp:", block.timestamp);
        console.log("Gas Price:", tx.gasprice);
        
        // Log contract verification command
        console.log("\n=== Verification Command ===");
        console.log("To verify on Etherscan, run:");
        console.log(string.concat(
            "forge verify-contract ",
            vm.toString(address(recyclingBadge)),
            " RecyclingBadge --constructor-args $(cast abi-encode \"constructor(address)\" ",
            vm.toString(initialOwner),
            ")"
        ));
        
        // Optional: Authorize initial minters if specified
        address[] memory initialMinters = getInitialMinters();
        if (initialMinters.length > 0 && initialOwner == vm.addr(deployerPrivateKey)) {
            console.log("\n=== Authorizing Initial Minters ===");
            vm.startBroadcast(deployerPrivateKey);
            
            for (uint256 i = 0; i < initialMinters.length; i++) {
                if (initialMinters[i] != address(0)) {
                    recyclingBadge.authorizeMinter(initialMinters[i]);
                    console.log("Authorized minter:", initialMinters[i]);
                }
            }
            
            vm.stopBroadcast();
        }
        
        // Save deployment info to file
        saveDeploymentInfo(address(recyclingBadge), initialOwner);
    }
    
    function getInitialMinters() internal view returns (address[] memory) {
        // Try to read initial minters from environment variable
        // Format: comma-separated addresses
        try vm.envString("INITIAL_MINTERS") returns (string memory mintersString) {
            if (bytes(mintersString).length == 0) {
                return new address[](0);
            }
            
            // Simple parsing for comma-separated addresses
            // Note: This is a basic implementation. For production, consider more robust parsing
            string[] memory minterStrings = vm.split(mintersString, ",");
            address[] memory minters = new address[](minterStrings.length);
            
            for (uint256 i = 0; i < minterStrings.length; i++) {
                string memory trimmed = vm.trim(minterStrings[i]);
                if (bytes(trimmed).length == 42) { // Valid address length with 0x prefix
                    minters[i] = vm.parseAddress(trimmed);
                }
            }
            
            return minters;
        } catch {
            return new address[](0);
        }
    }
    
    function saveDeploymentInfo(address contractAddress, address owner) internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "contractAddress": "', vm.toString(contractAddress), '",\n',
            '  "owner": "', vm.toString(owner), '",\n',
            '  "chainId": ', vm.toString(block.chainid), ',\n',
            '  "blockNumber": ', vm.toString(block.number), ',\n',
            '  "timestamp": ', vm.toString(block.timestamp), ',\n',
            '  "deployer": "', vm.toString(msg.sender), '"\n',
            "}"
        );
        
        string memory filename = string.concat(
            "deployments/recycling-badge-",
            vm.toString(block.chainid),
            ".json"
        );
        
        vm.writeFile(filename, deploymentInfo);
        console.log("Deployment info saved to:", filename);
    }
}

// Alternative deploy script for testing/development
contract DeployRecyclingBadgeLocal is Script {
    function run() external {
        console.log("Deploying RecyclingBadge for local testing...");
        
        vm.startBroadcast();
        
        // Use the deployer as the initial owner for local testing
        RecyclingBadge recyclingBadge = new RecyclingBadge(msg.sender);
        
        // Create some test accounts
        address testMinter1 = makeAddr("testMinter1");
        address testMinter2 = makeAddr("testMinter2");
        address testUser1 = makeAddr("testUser1");
        address testUser2 = makeAddr("testUser2");
        
        // Authorize test minters
        recyclingBadge.authorizeMinter(testMinter1);
        recyclingBadge.authorizeMinter(testMinter2);
        
        console.log("RecyclingBadge deployed at:", address(recyclingBadge));
        console.log("Owner:", recyclingBadge.owner());
        console.log("Test Minter 1:", testMinter1);
        console.log("Test Minter 2:", testMinter2);
        console.log("Test User 1:", testUser1);
        console.log("Test User 2:", testUser2);
        
        vm.stopBroadcast();
        
        // Optionally mint some test badges
        console.log("\n=== Minting Test Badges ===");
        vm.startBroadcast();
        
        uint256 tokenId1 = recyclingBadge.mintBadge(
            testUser1,
            "Plastic",
            100,
            "https://sortify.com/badges/plastic/1",
            "0x1234567890abcdef"
        );
        
        uint256 tokenId2 = recyclingBadge.mintBadge(
            testUser2,
            "Glass",
            50,
            "https://sortify.com/badges/glass/1",
            "0xabcdef1234567890"
        );
        
        console.log("Minted badge", tokenId1, "for", testUser1);
        console.log("Minted badge", tokenId2, "for", testUser2);
        
        vm.stopBroadcast();
    }
    
    function makeAddr(string memory name) internal returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(name)))));
    }
}