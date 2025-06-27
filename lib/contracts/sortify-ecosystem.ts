export const SORTIFY_ECOSYSTEM_ABI = [
    // Collection Request Functions
    {
      inputs: [
        {
          components: [
            { name: "wasteType", type: "uint8" },
            { name: "amount", type: "uint256" },
          ],
          name: "wasteItems",
          type: "tuple[]",
        },
        { name: "location", type: "string" },
        { name: "latitude", type: "int256" },
        { name: "longitude", type: "int256" },
        { name: "notes", type: "string" },
      ],
      name: "requestWasteCollection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ name: "requestId", type: "uint256" }],
      name: "acceptCollectionRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ name: "requestId", type: "uint256" }],
      name: "completeCollection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { name: "requestId", type: "uint256" },
        { name: "approved", type: "bool" },
        { name: "verificationNotes", type: "string" },
      ],
      name: "verifyCollection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    // Marketplace Functions
    {
      inputs: [
        { name: "wasteType", type: "string" },
        { name: "quantity", type: "uint256" },
        { name: "price", type: "uint256" },
      ],
      name: "createListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { name: "listingId", type: "uint256" },
        { name: "quantityToBuy", type: "uint256" },
      ],
      name: "purchaseListing",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    // Membership Functions
    {
      inputs: [{ name: "membershipType", type: "uint8" }],
      name: "purchaseMembership",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    // View Functions
    {
      inputs: [{ name: "requestId", type: "uint256" }],
      name: "getCollectionRequest",
      outputs: [
        {
          components: [
            { name: "id", type: "uint256" },
            { name: "requester", type: "address" },
            {
              components: [
                { name: "wasteType", type: "uint8" },
                { name: "amount", type: "uint256" },
              ],
              name: "wasteItems",
              type: "tuple[]",
            },
            { name: "location", type: "string" },
            { name: "latitude", type: "int256" },
            { name: "longitude", type: "int256" },
            { name: "pendingReward", type: "uint256" },
            { name: "status", type: "uint8" },
            { name: "assignedCollector", type: "address" },
            { name: "verifier", type: "address" },
            { name: "requestedAt", type: "uint256" },
            { name: "acceptedAt", type: "uint256" },
            { name: "completedAt", type: "uint256" },
            { name: "verifiedAt", type: "uint256" },
            { name: "notes", type: "string" },
          ],
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { name: "offset", type: "uint256" },
        { name: "limit", type: "uint256" },
      ],
      name: "getAvailableRequests",
      outputs: [{ name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "user", type: "address" }],
      name: "getUserProfile",
      outputs: [
        { name: "isCollector", type: "bool" },
        { name: "isRecycler", type: "bool" },
        { name: "isVerifier", type: "bool" },
        { name: "reputation", type: "uint256" },
        { name: "tokenBalance", type: "uint256" },
        { name: "totalRequests", type: "uint256" },
        { name: "badgeCount", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "user", type: "address" }],
      name: "getUserRequests",
      outputs: [{ name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "collector", type: "address" }],
      name: "getCollectorAssignments",
      outputs: [{ name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    // Events
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "requestId", type: "uint256" },
        { indexed: true, name: "requester", type: "address" },
        { indexed: false, name: "pendingReward", type: "uint256" },
      ],
      name: "CollectionRequested",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "requestId", type: "uint256" },
        { indexed: true, name: "collector", type: "address" },
      ],
      name: "CollectionAccepted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "requestId", type: "uint256" },
        { indexed: true, name: "verifier", type: "address" },
        { indexed: false, name: "userReward", type: "uint256" },
        { indexed: false, name: "collectorReward", type: "uint256" },
        { indexed: false, name: "verifierReward", type: "uint256" },
      ],
      name: "CollectionVerified",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "listingId", type: "uint256" },
        { indexed: true, name: "seller", type: "address" },
        { indexed: false, name: "wasteType", type: "string" },
        { indexed: false, name: "quantity", type: "uint256" },
        { indexed: false, name: "price", type: "uint256" },
      ],
      name: "ListingCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "user", type: "address" },
        { indexed: true, name: "lock", type: "address" },
        { indexed: false, name: "membershipType", type: "uint256" },
      ],
      name: "MembershipPurchased",
      type: "event",
    },
  ] as const
  
  export const SORTIFY_ECOSYSTEM_ADDRESS = process.env.NEXT_PUBLIC_SORTIFY_ECOSYSTEM_ADDRESS as `0x${string}`
  