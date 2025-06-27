"use client"

import { useReadContract, useAccount } from "wagmi"
import { RECYCLING_BADGE_ABI, RECYCLING_BADGE_ADDRESS } from "@/lib/contracts/recycling-badge"

export interface BadgeMetadata {
  recycler: `0x${string}`
  wasteType: string
  quantity: bigint
  timestamp: bigint
  transactionHash: string
}

// 1. Hook for user's badge count
export function useBadgeCount() {
  const { address } = useAccount()

  return useReadContract({
    address: RECYCLING_BADGE_ADDRESS,
    abi: RECYCLING_BADGE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
}

// 2. Hook for badge metadata
export function useBadgeMetadata(tokenId: bigint) {
  return useReadContract({
    address: RECYCLING_BADGE_ADDRESS,
    abi: RECYCLING_BADGE_ABI,
    functionName: "getBadgeMetadata",
    args: [tokenId],
    query: { enabled: tokenId !== undefined },
  })
}

//  3. Hook for badge token URI
export function useBadgeTokenURI(tokenId: bigint) {
  return useReadContract({
    address: RECYCLING_BADGE_ADDRESS,
    abi: RECYCLING_BADGE_ABI,
    functionName: "tokenURI",
    args: [tokenId],
    query: { enabled: tokenId !== undefined },
  })
}

// 4. Hook for badge owner
export function useBadgeOwner(tokenId: bigint) {
  return useReadContract({
    address: RECYCLING_BADGE_ADDRESS,
    abi: RECYCLING_BADGE_ABI,
    functionName: "ownerOf",
    args: [tokenId],
    query: { enabled: tokenId !== undefined },
  })
}
