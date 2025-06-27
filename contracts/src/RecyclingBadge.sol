// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./SortifyToken.sol";
import "./SortifyEcosystem.sol";

/**
 * @title RecyclingBadge
 * @dev NFT badges for recyclers as proof of recycling
 */
contract RecyclingBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(address => bool) public authorizedMinters;
    
    struct BadgeMetadata {
        address recycler;
        string wasteType;
        uint256 quantity;
        uint256 timestamp;
        string transactionHash;
    }
    
    mapping(uint256 => BadgeMetadata) public badgeMetadata;
    
    event BadgeMinted(uint256 indexed tokenId, address indexed recycler, string wasteType, uint256 quantity);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor(address initialOwner) ERC721("Sortify Recycling Badge", "SRB") Ownable(initialOwner) {
        _nextTokenId = 1;
    }
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    function mintBadge(
        address to,
        string memory wasteType,
        uint256 quantity,
        string memory tokenURI_,
        string memory transactionHash
    ) external onlyAuthorizedMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        
        badgeMetadata[tokenId] = BadgeMetadata({
            recycler: to,
            wasteType: wasteType,
            quantity: quantity,
            timestamp: block.timestamp,
            transactionHash: transactionHash
        });
        
        emit BadgeMinted(tokenId, to, wasteType, quantity);
        return tokenId;
    }
    
    function getBadgeMetadata(uint256 tokenId) external view returns (BadgeMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badgeMetadata[tokenId];
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}