// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockPublicLock
 * @dev Mock implementation of Unlock Protocol's PublicLock for testing
 */
contract MockPublicLock {
    mapping(address => bool) private validKeys;
    mapping(address => uint256) private balances;
    mapping(address => uint256) private keyExpirations;
    
    uint256 public keyPrice = 0.01 ether;
    string public name = "Mock Lock";
    
    event KeyPurchased(address indexed buyer, address indexed recipient);
    event KeySet(address indexed user, bool valid);
    
    function setValidKey(address user, bool valid) external {
        validKeys[user] = valid;
        if (valid) {
            balances[user] = 1;
            keyExpirations[user] = block.timestamp + 365 days;
        } else {
            balances[user] = 0;
            keyExpirations[user] = 0;
        }
        emit KeySet(user, valid);
    }
    
    function getHasValidKey(address user) external view returns (bool) {
        return validKeys[user] && keyExpirations[user] > block.timestamp;
    }
    
    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }
    
    function keyExpirationTimestampFor(address user) external view returns (uint256) {
        return keyExpirations[user];
    }
    
    function purchaseFor(
        address recipient, 
        uint256, // referrer
        bytes calldata, // keyManager
        bytes calldata  // data
    ) external payable {
        require(msg.value >= keyPrice, "Insufficient payment");
        
        validKeys[recipient] = true;
        balances[recipient] = 1;
        keyExpirations[recipient] = block.timestamp + 365 days;
        
        emit KeyPurchased(msg.sender, recipient);
    }
    
    function setKeyPrice(uint256 _keyPrice) external {
        keyPrice = _keyPrice;
    }
    
    // Helper function to simulate key expiration for testing
    function expireKey(address user) external {
        keyExpirations[user] = block.timestamp - 1;
        validKeys[user] = false;
        balances[user] = 0;
    }
    
    // Helper function to extend key expiration for testing
    function extendKey(address user, uint256 additionalTime) external {
        if (validKeys[user]) {
            keyExpirations[user] += additionalTime;
        }
    }
}