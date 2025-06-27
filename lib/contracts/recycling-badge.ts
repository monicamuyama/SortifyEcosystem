export const RECYCLING_BADGE_ABI = [
    {
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "getBadgeMetadata",
      outputs: [
        {
          components: [
            { name: "recycler", type: "address" },
            { name: "wasteType", type: "string" },
            { name: "quantity", type: "uint256" },
            { name: "timestamp", type: "uint256" },
            { name: "transactionHash", type: "string" },
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
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "tokenId", type: "uint256" },
        { indexed: true, name: "recycler", type: "address" },
        { indexed: false, name: "wasteType", type: "string" },
        { indexed: false, name: "quantity", type: "uint256" },
      ],
      name: "BadgeMinted",
      type: "event",
    },
  ] as const
  
  export const RECYCLING_BADGE_ADDRESS = process.env.NEXT_PUBLIC_RECYCLING_BADGE_ADDRESS as `0x${string}`
  