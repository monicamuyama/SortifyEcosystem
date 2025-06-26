// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./RecyclingBadge.sol";
import "./SortifyToken.sol";

// Unlock Protocol interfaces
interface IPublicLock {
    function balanceOf(address _owner) external view returns (uint256);
    function getHasValidKey(address _user) external view returns (bool);
    function keyExpirationTimestampFor(address _keyOwner) external view returns (uint256);
    function purchaseFor(
        address _recipient,
        uint256 _referrer,
        bytes calldata _keyManager,
        bytes calldata _data
    ) external payable;
}


contract SortifyEcosystem is Ownable, ReentrancyGuard, Pausable {
    SortifyToken public sortifyToken;
    RecyclingBadge public recyclingBadge;
    
    // Unlock Protocol locks for different roles
    IPublicLock public collectorLock;
    IPublicLock public recyclerLock;
    IPublicLock public verifierLock;
    
    enum CollectionStatus { REQUESTED, ACCEPTED, COMPLETED, VERIFIED, CANCELLED }
    enum WasteType { PLASTIC, PAPER, GLASS, METAL, ORGANIC, ELECTRONIC }
    
    struct WasteItem {
        WasteType wasteType;
        uint256 amount; // in grams
    }
    
    struct CollectionRequest {
        uint256 id;
        address requester;
        WasteItem[] wasteItems;
        string location;
        int256 latitude;
        int256 longitude;
        uint256 pendingReward;
        CollectionStatus status;
        address assignedCollector;
        address verifier;
        uint256 requestedAt;
        uint256 acceptedAt;
        uint256 completedAt;
        uint256 verifiedAt;
        string notes;
    }
    
    struct Listing {
        uint256 id;
        address seller;
        string wasteType;
        uint256 quantity;
        uint256 price; // price per kg in tokens
        bool active;
        uint256 createdAt;
    }
    
    // Mappings
    mapping(string => uint256) public wasteRewardRates; // tokens per kg
    mapping(uint256 => CollectionRequest) public collectionRequests;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public userRequests;
    mapping(address => uint256[]) public collectorAssignments;
    mapping(address => uint256) public userReputation;
    mapping(address => mapping(string => uint256)) public collectedWaste;
    mapping(address => mapping(string => uint256)) public processedWaste;
    
    // Counters
    uint256 public nextRequestId = 1;
    uint256 public nextListingId = 1;
    
    // Platform settings
    uint256 public constant USER_REWARD_PERCENTAGE = 80;
    uint256 public constant COLLECTOR_REWARD_PERCENTAGE = 10;
    uint256 public constant VERIFIER_REWARD_PERCENTAGE = 10;
    
    // Events
    event CollectionRequested(uint256 indexed requestId, address indexed requester, uint256 pendingReward);
    event CollectionAccepted(uint256 indexed requestId, address indexed collector);
    event CollectionCompleted(uint256 indexed requestId, address indexed collector);
    event CollectionVerified(uint256 indexed requestId, address indexed verifier, uint256 userReward, uint256 collectorReward, uint256 verifierReward);
    event CollectionCancelled(uint256 indexed requestId, string reason);
    event ListingCreated(uint256 indexed listingId, address indexed seller, string wasteType, uint256 quantity, uint256 price);
    event ListingPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 quantity, uint256 totalPrice);
    event RecyclingBadgeMinted(address indexed recycler, uint256 indexed badgeId, uint256 indexed listingId);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    event MembershipPurchased(address indexed user, address indexed lock, uint256 membershipType);
    
    enum MembershipType { COLLECTOR, RECYCLER, VERIFIER }
    
    constructor(
        address initialOwner,
        address _sortifyToken,
        address _recyclingBadge,
        address _collectorLock,
        address _recyclerLock,
        address _verifierLock
    ) Ownable(initialOwner) {
        sortifyToken = SortifyToken(_sortifyToken);
        recyclingBadge = RecyclingBadge(_recyclingBadge);
        
        collectorLock = IPublicLock(_collectorLock);
        recyclerLock = IPublicLock(_recyclerLock);
        verifierLock = IPublicLock(_verifierLock);
        
        // Initialize default waste types and their reward rates (tokens per kg)
        wasteRewardRates["plastic"] = 5 * 10**18;
        wasteRewardRates["paper"] = 3 * 10**18;
        wasteRewardRates["glass"] = 4 * 10**18;
        wasteRewardRates["metal"] = 7 * 10**18;
        wasteRewardRates["organic"] = 2 * 10**18;
        wasteRewardRates["electronic"] = 10 * 10**18;
    }
    
    // Modifiers
    modifier onlyCollector() {
        require(collectorLock.getHasValidKey(msg.sender), "Must have valid collector membership");
        _;
    }
    
    modifier onlyRecycler() {
        require(recyclerLock.getHasValidKey(msg.sender), "Must have valid recycler membership");
        _;
    }
    
    modifier onlyVerifier() {
        require(
            verifierLock.getHasValidKey(msg.sender) || msg.sender == owner(),
            "Must have valid verifier membership or be owner"
        );
        _;
    }
    
    /**
     * @dev Request waste collection (open to any user)
     */
    function requestWasteCollection(
        WasteItem[] memory wasteItems,
        string memory location,
        int256 latitude,
        int256 longitude,
        string memory notes
    ) external whenNotPaused {
        require(wasteItems.length > 0, "Must include at least one waste item");
        
        uint256 requestId = nextRequestId++;
        CollectionRequest storage request = collectionRequests[requestId];
        
        request.id = requestId;
        request.requester = msg.sender;
        request.location = location;
        request.latitude = latitude;
        request.longitude = longitude;
        request.status = CollectionStatus.REQUESTED;
        request.requestedAt = block.timestamp;
        request.notes = notes;
        
        // Calculate pending reward
        uint256 totalReward = 0;
        for (uint i = 0; i < wasteItems.length; i++) {
            request.wasteItems.push(wasteItems[i]);
            string memory wasteTypeStr = _wasteTypeToString(wasteItems[i].wasteType);
            uint256 itemReward = (wasteItems[i].amount * wasteRewardRates[wasteTypeStr]) / 1000; // Convert grams to kg
            totalReward += itemReward;
        }
        
        request.pendingReward = totalReward;
        userRequests[msg.sender].push(requestId);
        
        emit CollectionRequested(requestId, msg.sender, totalReward);
    }
    
    /**
     * @dev Accept a collection request (collectors only)
     */
    function acceptCollectionRequest(uint256 requestId) external onlyCollector whenNotPaused {
        CollectionRequest storage request = collectionRequests[requestId];
        require(request.status == CollectionStatus.REQUESTED, "Request not available");
        require(request.assignedCollector == address(0), "Already assigned");
        
        request.status = CollectionStatus.ACCEPTED;
        request.assignedCollector = msg.sender;
        request.acceptedAt = block.timestamp;
        
        collectorAssignments[msg.sender].push(requestId);
        
        emit CollectionAccepted(requestId, msg.sender);
    }
    
    /**
     * @dev Complete a collection (assigned collector only)
     */
    function completeCollection(uint256 requestId) external whenNotPaused {
        CollectionRequest storage request = collectionRequests[requestId];
        require(request.assignedCollector == msg.sender, "Not assigned collector");
        require(request.status == CollectionStatus.ACCEPTED, "Request not accepted");
        
        request.status = CollectionStatus.COMPLETED;
        request.completedAt = block.timestamp;
        
        emit CollectionCompleted(requestId, msg.sender);
    }
    
    /**
     * @dev Verify completed collection and distribute rewards (verifiers only)
     */
    function verifyCollection(uint256 requestId, bool approved, string memory verificationNotes) external onlyVerifier nonReentrant {
        CollectionRequest storage request = collectionRequests[requestId];
        require(request.status == CollectionStatus.COMPLETED, "Collection not completed");
        
        if (!approved) {
            request.status = CollectionStatus.CANCELLED;
            emit CollectionCancelled(requestId, verificationNotes);
            return;
        }
        
        request.status = CollectionStatus.VERIFIED;
        request.verifier = msg.sender;
        request.verifiedAt = block.timestamp;
        
        // Calculate reward distribution
        uint256 totalReward = request.pendingReward;
        uint256 userReward = (totalReward * USER_REWARD_PERCENTAGE) / 100;
        uint256 collectorReward = (totalReward * COLLECTOR_REWARD_PERCENTAGE) / 100;
        uint256 verifierReward = (totalReward * VERIFIER_REWARD_PERCENTAGE) / 100;
        
        // Distribute rewards
        sortifyToken.mint(request.requester, userReward, "Waste collection reward - user");
        sortifyToken.mint(request.assignedCollector, collectorReward, "Waste collection reward - collector");
        sortifyToken.mint(msg.sender, verifierReward, "Waste collection reward - verifier");
        
        // Update reputation and tracking
        userReputation[request.requester] += 1;
        userReputation[request.assignedCollector] += 1;
        
        // Update waste tracking
        for (uint i = 0; i < request.wasteItems.length; i++) {
            string memory wasteTypeStr = _wasteTypeToString(request.wasteItems[i].wasteType);
            collectedWaste[request.requester][wasteTypeStr] += request.wasteItems[i].amount;
        }
        
        emit CollectionVerified(requestId, msg.sender, userReward, collectorReward, verifierReward);
        emit ReputationUpdated(request.requester, userReputation[request.requester]);
        emit ReputationUpdated(request.assignedCollector, userReputation[request.assignedCollector]);
    }
    
    /**
     * @dev Create marketplace listing (recyclers only)
     */
    function createListing(
        string calldata wasteType,
        uint256 quantity,
        uint256 price
    ) external onlyRecycler whenNotPaused {
        require(processedWaste[msg.sender][wasteType] >= quantity, "Insufficient processed waste");
        
        processedWaste[msg.sender][wasteType] -= quantity;
        
        Listing memory newListing = Listing({
            id: nextListingId,
            seller: msg.sender,
            wasteType: wasteType,
            quantity: quantity,
            price: price,
            active: true,
            createdAt: block.timestamp
        });
        
        listings[nextListingId] = newListing;
        emit ListingCreated(nextListingId, msg.sender, wasteType, quantity, price);
        nextListingId++;
    }
    
    /**
     * @dev Purchase from marketplace and mint recycling badge
     */
    function purchaseListing(uint256 listingId, uint256 quantityToBuy) external nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.quantity >= quantityToBuy, "Insufficient quantity");
        require(recyclerLock.getHasValidKey(msg.sender), "Must be a recycler to purchase");
        
        uint256 totalPrice = (listing.price * quantityToBuy) / 1000; // Convert grams to kg
        
        require(sortifyToken.balanceOf(msg.sender) >= totalPrice, "Insufficient token balance");
        require(sortifyToken.transferFrom(msg.sender, listing.seller, totalPrice), "Token transfer failed");
        
        listing.quantity -= quantityToBuy;
        if (listing.quantity == 0) {
            listing.active = false;
        }
        
        // Mint recycling badge as proof of recycling
        string memory badgeURI = string(abi.encodePacked(
            "https://api.sortify.com/badge/",
            _toString(listingId),
            "/",
            _toString(quantityToBuy)
        ));
        
        uint256 badgeId = recyclingBadge.mintBadge(
            msg.sender,
            listing.wasteType,
            quantityToBuy,
            badgeURI,
            "marketplace_purchase"
        );
        
        emit ListingPurchased(listingId, msg.sender, listing.seller, quantityToBuy, totalPrice);
        emit RecyclingBadgeMinted(msg.sender, badgeId, listingId);
    }
    
    /**
     * @dev Purchase membership NFT
     */
    function purchaseMembership(MembershipType membershipType) external payable {
        IPublicLock targetLock;
        
        if (membershipType == MembershipType.COLLECTOR) {
            targetLock = collectorLock;
        } else if (membershipType == MembershipType.RECYCLER) {
            targetLock = recyclerLock;
        } else if (membershipType == MembershipType.VERIFIER) {
            targetLock = verifierLock;
        } else {
            revert("Invalid membership type");
        }
        
        targetLock.purchaseFor{value: msg.value}(msg.sender, 0, "", "");
        emit MembershipPurchased(msg.sender, address(targetLock), uint256(membershipType));
    }
    
    /**
     * @dev Get collection request details
     */
    function getCollectionRequest(uint256 requestId) external view returns (CollectionRequest memory) {
        return collectionRequests[requestId];
    }
    
    /**
     * @dev Get user's collection requests
     */
    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }
    
    /**
     * @dev Get collector's assignments
     */
    function getCollectorAssignments(address collector) external view returns (uint256[] memory) {
        return collectorAssignments[collector];
    }
    
    /**
     * @dev Get available collection requests
     */
    function getAvailableRequests(uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        uint256 availableCount = 0;
        
        // Count available requests
        for (uint256 i = 1; i < nextRequestId; i++) {
            if (collectionRequests[i].status == CollectionStatus.REQUESTED) {
                availableCount++;
            }
        }
        
        if (offset >= availableCount) {
            return new uint256[](0);
        }
        
        uint256 resultLength = limit;
        if (offset + limit > availableCount) {
            resultLength = availableCount - offset;
        }
        
        uint256[] memory result = new uint256[](resultLength);
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;
        
        for (uint256 i = 1; i < nextRequestId && resultIndex < resultLength; i++) {
            if (collectionRequests[i].status == CollectionStatus.REQUESTED) {
                if (currentIndex >= offset) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
                currentIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get user profile
     */
    function getUserProfile(address user) external view returns (
        bool isCollector,
        bool isRecycler,
        bool isVerifier,
        uint256 reputation,
        uint256 tokenBalance,
        uint256 totalRequests,
        uint256 badgeCount
    ) {
        isCollector = collectorLock.getHasValidKey(user);
        isRecycler = recyclerLock.getHasValidKey(user);
        isVerifier = verifierLock.getHasValidKey(user);
        reputation = userReputation[user];
        tokenBalance = sortifyToken.balanceOf(user);
        totalRequests = userRequests[user].length;
        badgeCount = recyclingBadge.balanceOf(user);
    }
    
    // Admin functions
    function updateWasteRewardRate(string calldata wasteType, uint256 newRate) external onlyOwner {
        wasteRewardRates[wasteType] = newRate;
    }
    
    function addProcessedWaste(address recycler, string calldata wasteType, uint256 amount) external onlyOwner {
        processedWaste[recycler][wasteType] += amount;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Helper functions
    function _wasteTypeToString(WasteType wasteType) internal pure returns (string memory) {
        if (wasteType == WasteType.PLASTIC) return "plastic";
        if (wasteType == WasteType.PAPER) return "paper";
        if (wasteType == WasteType.GLASS) return "glass";
        if (wasteType == WasteType.METAL) return "metal";
        if (wasteType == WasteType.ORGANIC) return "organic";
        if (wasteType == WasteType.ELECTRONIC) return "electronic";
        return "unknown";
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}