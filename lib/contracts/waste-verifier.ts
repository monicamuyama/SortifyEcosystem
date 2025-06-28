//export const WASTE_VERIFIER_ADDRESS = (process.env.NEXT_PUBLIC_WASTE_VERIFIER_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
export const WASTE_VERIFIER_ADDRESS = process.env.NEXT_PUBLIC_WASTE_VERIFIER_ADDRESS as `0x${string}`
export const WASTE_VERIFIER_ABI = [
    {
      inputs: [
        { name: "_binId", type: "string" },
        { name: "_wasteType", type: "string" },
        { name: "_weight", type: "uint256" },
        { name: "_userAddress", type: "address" },
        { name: "_timestamp", type: "uint256" },
      ],
      name: "submitWasteDeposit",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { name: "_depositId", type: "uint256" },
        { name: "_verified", type: "bool" },
        { name: "_actualWeight", type: "uint256" },
      ],
      name: "verifyWasteDeposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ name: "_depositId", type: "uint256" }],
      name: "claimReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ name: "", type: "uint256" }],
      name: "deposits",
      outputs: [
        { name: "binId", type: "string" },
        { name: "wasteType", type: "string" },
        { name: "weight", type: "uint256" },
        { name: "userAddress", type: "address" },
        { name: "timestamp", type: "uint256" },
        { name: "verified", type: "bool" },
        { name: "claimed", type: "bool" },
        { name: "verifier", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "depositId", type: "uint256" },
        { indexed: true, name: "user", type: "address" },
        { indexed: false, name: "binId", type: "string" },
        { indexed: false, name: "wasteType", type: "string" },
        { indexed: false, name: "weight", type: "uint256" },
      ],
      name: "WasteDeposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "depositId", type: "uint256" },
        { indexed: true, name: "verifier", type: "address" },
        { indexed: false, name: "verified", type: "bool" },
        { indexed: false, name: "actualWeight", type: "uint256" },
      ],
      name: "WasteVerified",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "depositId", type: "uint256" },
        { indexed: true, name: "user", type: "address" },
        { indexed: false, name: "rewardAmount", type: "uint256" },
      ],
      name: "RewardClaimed",
      type: "event",
    },
  ] as const
  