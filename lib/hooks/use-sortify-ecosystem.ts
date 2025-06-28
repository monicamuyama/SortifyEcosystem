"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"
import { SORTIFY_ECOSYSTEM_ABI, SORTIFY_ECOSYSTEM_ADDRESS } from "@/lib/contracts/sortify-ecosystem"
import { SORTIFY_TOKEN_ABI, SORTIFY_TOKEN_ADDRESS } from "@/lib/contracts/sortify-token"
import { useState } from "react"
import { parseEther, formatEther } from "viem"

export enum WasteType {
  PLASTIC = 0,
  PAPER = 1,
  GLASS = 2,
  METAL = 3,
  ORGANIC = 4,
  ELECTRONIC = 5,
}

export enum CollectionStatus {
  REQUESTED = 0,
  ACCEPTED = 1,
  COMPLETED = 2,
  VERIFIED = 3,
  CANCELLED = 4,
}

export enum MembershipType {
  COLLECTOR = 0,
  RECYCLER = 1,
  VERIFIER = 2,
}

export interface WasteItem {
  wasteType: WasteType
  amount: bigint // in grams
}

export interface CollectionRequest {
  id: bigint
  requester: `0x${string}`
  wasteItems: WasteItem[]
  location: string
  latitude: bigint
  longitude: bigint
  pendingReward: bigint
  status: CollectionStatus
  assignedCollector: `0x${string}`
  verifier: `0x${string}`
  requestedAt: bigint
  acceptedAt: bigint
  completedAt: bigint
  verifiedAt: bigint
  notes: string
}

export interface UserProfile {
  isCollector: boolean
  isRecycler: boolean
  isVerifier: boolean
  reputation: bigint
  tokenBalance: bigint
  totalRequests: bigint
  badgeCount: bigint
}

export function useSortifyEcosystem() {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read user profile
  const { data: userProfile, refetch: refetchProfile } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "getUserProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Read user's collection requests
  const { data: userRequests, refetch: refetchUserRequests } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "getUserRequests",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Read available collection requests
  const { data: availableRequests, refetch: refetchAvailableRequests } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "getAvailableRequests",
    args: [BigInt(0), BigInt(50)], // offset: 0, limit: 50
  })

  // Read SORT token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: SORTIFY_TOKEN_ADDRESS,
    abi: SORTIFY_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Request waste collection
  const requestWasteCollection = async (
    wasteItems: WasteItem[],
    location: string,
    latitude: number,
    longitude: number,
    notes: string,
  ) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "requestWasteCollection",
        args: [
          wasteItems.map(item => ({
            wasteType: Number(item.wasteType),
            amount: item.amount
          })),
          location,
          BigInt(Math.round(latitude * 1000000)), // Convert to fixed point
          BigInt(Math.round(longitude * 1000000)),
          notes,
        ],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Accept collection request
  const acceptCollectionRequest = async (requestId: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "acceptCollectionRequest",
        args: [requestId],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Complete collection
  const completeCollection = async (requestId: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "completeCollection",
        args: [requestId],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify collection
  const verifyCollection = async (requestId: bigint, approved: boolean, notes: string) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "verifyCollection",
        args: [requestId, approved, notes],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create marketplace listing
  const createListing = async (wasteType: string, quantity: bigint, price: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "createListing",
        args: [wasteType, quantity, price],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Purchase from marketplace
  const purchaseListing = async (listingId: bigint, quantity: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "purchaseListing",
        args: [listingId, quantity],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Purchase membership
  const purchaseMembership = async (membershipType: MembershipType, value: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "purchaseMembership",
        args: [membershipType],
        value,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Approve SORT tokens for marketplace
  const approveTokens = async (amount: bigint) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: SORTIFY_TOKEN_ADDRESS,
        abi: SORTIFY_TOKEN_ABI,
        functionName: "approve",
        args: [SORTIFY_ECOSYSTEM_ADDRESS, amount],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get collection request details
  const collectionRequestDetails = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "getCollectionRequest",
    args: address ? [BigInt(0)] : undefined, // Placeholder for requestId
    query: { enabled: !!address },
  })

  // Helper functions
  const formatTokenAmount = (amount: bigint | undefined) => {
    if (!amount) return "0"
    return formatEther(amount)
  }

  const parseTokenAmount = (amount: string) => {
    return parseEther(amount)
  }

  const wasteTypeToString = (wasteType: WasteType): string => {
    const types = ["plastic", "paper", "glass", "metal", "organic", "electronic"]
    return types[wasteType] || "unknown"
  }

  const stringToWasteType = (wasteType: string): WasteType => {
    const types: Record<string, WasteType> = {
      plastic: WasteType.PLASTIC,
      paper: WasteType.PAPER,
      glass: WasteType.GLASS,
      metal: WasteType.METAL,
      organic: WasteType.ORGANIC,
      electronic: WasteType.ELECTRONIC,
    }
    return types[wasteType.toLowerCase()] ?? WasteType.PLASTIC
  }

  const getStatusString = (status: CollectionStatus): string => {
    const statuses = ["Requested", "Accepted", "Completed", "Verified", "Cancelled"]
    return statuses[status] || "Unknown"
  }

  return {
    // Data
    userProfile: userProfile as UserProfile | undefined,
    userRequests,
    availableRequests,
    tokenBalance,
    collectionRequestDetails,

    // Actions
    requestWasteCollection,
    acceptCollectionRequest,
    completeCollection,
    verifyCollection,
    createListing,
    purchaseListing,
    purchaseMembership,
    approveTokens,

    // Refetch functions
    refetchProfile,
    refetchUserRequests,
    refetchAvailableRequests,
    refetchTokenBalance,

    // State
    isSubmitting,
    isConfirming,

    // Helpers
    formatTokenAmount,
    parseTokenAmount,
    wasteTypeToString,
    stringToWasteType,
    getStatusString,
  }
}
