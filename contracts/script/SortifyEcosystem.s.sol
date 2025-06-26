// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SortifyEcosystem.sol";
import "../src/SortifyToken.sol";
import "../src/RecyclingBadge.sol";

// Mock Unlock Protocol lock for deployment (replace with actual addresses in production)
contract PublicLock {
    mapping(address => bool) private _hasValidKey;
    mapping(address => uint256) private _keyExpiration;
    uint256 public keyPrice = 0.01 ether;
    uint256 public expirationDuration = 365 days;
    address public lockManager;
    
    constructor(address _lockManager) {
        lockManager = _lockManager;
    }
    
    modifier onlyLockManager() {
        require(msg.sender == lockManager, "Only lock manager");
        _;
    }
    
    function getHasValidKey(address user) external view returns (bool) {
        return _hasValidKey[user] && _keyExpiration[user] > block.timestamp;
    }
    
    function balanceOf(address user) external view returns (uint256) {
        return getHasValidKey(user) ? 1 : 0;
    }
    
    function keyExpirationTimestampFor(address user) external view returns (uint256) {
        return _keyExpiration[user];
    }
    
    function purchaseFor(
        address recipient,
        uint256,
        bytes calldata,
        bytes calldata
    ) external payable {
        require(msg.value >= keyPrice, "Insufficient payment");
        _hasValidKey[recipient] = true;
        _keyExpiration[recipient] = block.timestamp + expirationDuration;
        
        // Send payment to lock manager
        payable(lockManager).transfer(msg.value);
    }
    
    function grantKey(address user) external onlyLockManager {
        _hasValidKey[user] = true;
        _keyExpiration[user] = block.timestamp + expirationDuration;
    }
    
    function revokeKey(address user) external onlyLockManager {
        _hasValidKey[user] = false;
        _keyExpiration[user] = 0;
    }
    
    function setKeyPrice(uint256 _keyPrice) external onlyLockManager {
        keyPrice = _keyPrice;
    }
    
    function setExpirationDuration(uint256 _duration) external onlyLockManager {
        expirationDuration = _duration;
    }
}

contract DeploySortifyEcosystem is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy membership locks (or use existing Unlock Protocol addresses)
        PublicLock collectorLock = new PublicLock(deployer);
        PublicLock recyclerLock = new PublicLock(deployer);
        PublicLock verifierLock = new PublicLock(deployer);
        
        console.log("Collector Lock deployed to:", address(collectorLock));
        console.log("Recycler Lock deployed to:", address(recyclerLock));
        console.log("Verifier Lock deployed to:", address(verifierLock));
        
        // Set different prices for different membership types
        collectorLock.setKeyPrice(0.01 ether); // 0.01 ETH for collector membership
        recyclerLock.setKeyPrice(0.05 ether);  // 0.05 ETH for recycler membership
        verifierLock.setKeyPrice(0.1 ether);   // 0.1 ETH for verifier membership
        
        // Deploy token contract
        SortifyToken token = new SortifyToken(deployer);
        console.log("SortifyToken deployed to:", address(token));
        
        // Deploy badge contract
        RecyclingBadge badge = new RecyclingBadge(deployer);
        console.log("RecyclingBadge deployed to:", address(badge));
        
        // Deploy ecosystem contract
        SortifyEcosystem ecosystem = new SortifyEcosystem(
            deployer,
            address(token),
            address(badge),
            address(collectorLock),
            address(recyclerLock),
            address(verifierLock)
        );
        console.log("SortifyEcosystem deployed to:", address(ecosystem));
        
        // Set ecosystem as minter for token and badge
        token.setMinter(address(ecosystem), true);
        badge.setMinter(address(ecosystem));
        
        console.log("Minter permissions granted to ecosystem contract");
        
        // Optional: Setup initial processed waste for testing
        if (block.chainid == 31337 || block.chainid == 11155111) { // localhost or sepolia
            setupTestData(ecosystem, collectorLock, recyclerLock, verifierLock, deployer);
        }
        
        vm.stopBroadcast();
        
        // Log deployment summary
        logDeploymentSummary(
            address(ecosystem),
            address(token),
            address(badge),
            address(collectorLock),
            address(recyclerLock),
            address(verifierLock)
        );
    }
    
    function setupTestData(
        SortifyEcosystem ecosystem,
        PublicLock collectorLock,
        PublicLock recyclerLock,
        PublicLock verifierLock,
        address deployer
    ) internal {
        console.log("Setting up test data...");
        
        // Create test accounts
        address testCollector = makeAddr("testCollector");
        address testRecycler = makeAddr("testRecycler");
        address testVerifier = makeAddr("testVerifier");
        
        // Grant test memberships
        collectorLock.grantKey(testCollector);
        recyclerLock.grantKey(testRecycler);
        verifierLock.grantKey(testVerifier);
        verifierLock.grantKey(deployer); // Grant deployer verifier access
        
        // Add some processed waste for the test recycler
        ecosystem.addProcessedWaste(testRecycler, "plastic", 10000); // 10kg
        ecosystem.addProcessedWaste(testRecycler, "paper", 5000);    // 5kg
        ecosystem.addProcessedWaste(testRecycler, "glass", 3000);    // 3kg
        
        console.log("Test collector:", testCollector);
        console.log("Test recycler:", testRecycler);
        console.log("Test verifier:", testVerifier);
        console.log("Test data setup complete");
    }
    
    function logDeploymentSummary(
        address ecosystem,
        address token,
        address badge,
        address collectorLock,
        address recyclerLock,
        address verifierLock
    ) internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network:", getNetworkName());
        console.log("SortifyEcosystem:", ecosystem);
        console.log("SortifyToken:", token);
        console.log("RecyclingBadge:", badge);
        console.log("CollectorLock:", collectorLock);
        console.log("RecyclerLock:", recyclerLock);
        console.log("VerifierLock:", verifierLock);
        console.log("\n=== MEMBERSHIP PRICES ===");
        console.log("Collector: 0.01 ETH");
        console.log("Recycler: 0.05 ETH");
        console.log("Verifier: 0.1 ETH");
        console.log("\n=== WASTE REWARD RATES (tokens per kg) ===");
        console.log("Plastic: 5 tokens");
        console.log("Paper: 3 tokens");
        console.log("Glass: 4 tokens");
        console.log("Metal: 7 tokens");
        console.log("Organic: 2 tokens");
        console.log("Electronic: 10 tokens");
        console.log("==========================\n");
    }
    
    function getNetworkName() internal view returns (string memory) {
        if (block.chainid == 1) return "Ethereum Mainnet";
        if (block.chainid == 11155111) return "Sepolia Testnet";
        if (block.chainid == 137) return "Polygon Mainnet";
        if (block.chainid == 80001) return "Mumbai Testnet";
        if (block.chainid == 31337) return "Localhost";
        return "Unknown Network";
    }
}

// Utility script for post-deployment operations
contract PostDeploymentOps is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Load deployed contract addresses from environment or config
        address ecosystemAddress = vm.envAddress("ECOSYSTEM_ADDRESS");
        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SortifyEcosystem ecosystem = SortifyEcosystem(ecosystemAddress);
        SortifyToken token = SortifyToken(tokenAddress);
        
        // Example: Update waste reward rates
        ecosystem.updateWasteRewardRate("plastic", 6 * 10**18); // Increase plastic reward
        
        // Example: Mint tokens for initial liquidity or rewards pool
        token.mint(ecosystemAddress, 1000000 * 10**18, "Initial ecosystem reserves");
        
        console.log("Post-deployment operations completed");
        
        vm.stopBroadcast();
    }
}

// Script for interacting with deployed contracts
contract InteractWithSortify is Script {
    function run() external {
        uint256 userPrivateKey = vm.envUint("USER_PRIVATE_KEY");
        address ecosystemAddress = vm.envAddress("ECOSYSTEM_ADDRESS");
        address collectorLockAddress = vm.envAddress("COLLECTOR_LOCK_ADDRESS");
        
        vm.startBroadcast(userPrivateKey);
        
        SortifyEcosystem ecosystem = SortifyEcosystem(ecosystemAddress);
        PublicLock collectorLock = PublicLock(collectorLockAddress);
        
        // Example: Purchase collector membership
        uint256 membershipPrice = collectorLock.keyPrice();
        ecosystem.purchaseMembership{value: membershipPrice}(
            SortifyEcosystem.MembershipType.COLLECTOR
        );
        
        // Example: Create a waste collection request
        SortifyEcosystem.WasteItem[] memory wasteItems = new SortifyEcosystem.WasteItem[](1);
        wasteItems[0] = SortifyEcosystem.WasteItem({
            wasteType: SortifyEcosystem.WasteType.PLASTIC,
            amount: 2000 // 2kg
        });
        
        ecosystem.requestWasteCollection(
            wasteItems,
            "123 Main Street, City",
            40748817, // Latitude * 1e6 (example: 40.748817)
            -73985428, // Longitude * 1e6 (example: -73.985428)
            "Available weekdays 9-5 PM"
        );
        
        console.log("Interaction completed");
        
        vm.stopBroadcast();
    }
}