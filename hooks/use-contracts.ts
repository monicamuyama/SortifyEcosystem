"use client"

import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { getContract } from "viem"
import { CONTRACTS } from "@/lib/contracts"

// Contract ABIs (simplified for key functions)
const SORTIFY_TOKEN_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

const WASTE_COLLECTION_ABI = [
  {
    inputs: [
      {
        name: "items",
        type: "tuple[]",
        components: [
          { name: "wasteType", type: "uint8" },
          { name: "weight", type: "uint256" },
          { name: "rewardRate", type: "uint256" },
        ],
      },
      { name: "location", type: "string" },
      { name: "latitude", type: "int256" },
      { name: "longitude", type: "int256" },
      { name: "scheduledDate", type: "uint256" },
    ],
    name: "requestCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "binId", type: "uint256" },
      { name: "wasteType", type: "uint8" },
      { name: "weight", type: "uint256" },
    ],
    name: "useSmartBin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

const MARKETPLACE_ABI = [
  {
    inputs: [
      { name: "materialType", type: "uint8" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "quantity", type: "uint256" },
      { name: "pricePerKg", type: "uint256" },
      { name: "location", type: "string" },
      { name: "imageHashes", type: "string[]" },
    ],
    name: "createListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "listingId", type: "uint256" },
      { name: "quantity", type: "uint256" },
    ],
    name: "purchaseMaterial",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export function useContracts() {
  const { chain } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const isBaseSepolia = chain?.id === 84532
  const contractAddresses = isBaseSepolia ? CONTRACTS.BASE_SEPOLIA : CONTRACTS.BASE_MAINNET

  const sortifyToken = publicClient ? getContract({
    address: contractAddresses.SORTIFY_TOKEN as `0x${string}`,
    abi: SORTIFY_TOKEN_ABI,
    client: { public: publicClient, wallet: walletClient },
  }) : null

  const wasteCollection = publicClient ? getContract({
    address: contractAddresses.WASTE_COLLECTION as `0x${string}`,
    abi: WASTE_COLLECTION_ABI,
    client: { public: publicClient, wallet: walletClient },
  }) : null

  const marketplace = publicClient ? getContract({
    address: contractAddresses.MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    client: { public: publicClient, wallet: walletClient },
  }) : null

  return {
    sortifyToken,
    wasteCollection,
    marketplace,
    contractAddresses,
    isBaseSepolia,
  }
}
