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

export function useRecyclingBadges() {
  const { address } = useAccount()

  // Get user's badge count
  const { data: badgeCount, refetch: refetchBadgeCount } = useReadContract({
    address: RECYCLING_BADGE_ADDRESS,
    abi: RECYCLING_BADGE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Get badge metadata by token ID
  const getBadgeMetadata = (tokenId: bigint) => {
    // This function should not call useReadContract directly
    // Instead, it should return a function that calls useReadContract
    return () => {
      return useReadContract({
        address: RECYCLING_BADGE_ADDRESS,
        abi: RECYCLING_BADGE_ABI,
        functionName: "getBadgeMetadata",
        args: [tokenId],
      })
    }
  }

  // Get badge token URI
  const getBadgeTokenURI = (tokenId: bigint) => {
    // This function should not call useReadContract directly
    // Instead, it should return a function that calls useReadContract
    return () => {
      return useReadContract({
        address: RECYCLING_BADGE_ADDRESS,
        abi: RECYCLING_BADGE_ABI,
        functionName: "tokenURI",
        args: [tokenId],
      })
    }
  }

  // Get badge owner
  const getBadgeOwner = (tokenId: bigint) => {
    // This function should not call useReadContract directly
    // Instead, it should return a function that calls useReadContract
    return () => {
      return useReadContract({
        address: RECYCLING_BADGE_ADDRESS,
        abi: RECYCLING_BADGE_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      })
    }
  }

  return {
    badgeCount,
    getBadgeMetadata,
    getBadgeTokenURI,
    getBadgeOwner,
    refetchBadgeCount,
  }
}
