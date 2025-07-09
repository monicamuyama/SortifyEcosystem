"use client"

import { useState } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { SORTIFY_ECOSYSTEM_ADDRESS, SORTIFY_ECOSYSTEM_ABI } from "@/lib/contracts/sortify-ecosystem"
import { parseEther } from "viem"

// Unlock Protocol IPublicLock ABI (simplified)
const UNLOCK_ABI = [
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getHasValidKey",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_keyOwner", type: "address" }],
    name: "keyExpirationTimestampFor",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_recipient", type: "address" },
      { name: "_referrer", type: "uint256" },
      { name: "_keyManager", type: "bytes" },
      { name: "_data", type: "bytes" },
    ],
    name: "purchaseFor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const

export enum MembershipType {
  COLLECTOR = 0,
  RECYCLER = 1,
  VERIFIER = 2,
}

export interface UnlockMembershipStatus {
  hasValidKey: boolean
  keyBalance: number
  expirationTimestamp: number
}

export function useUnlockMembership() {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { writeContract, data: hash, error } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Get lock addresses from the SortifyEcosystem contract
  const { data: collectorLockAddress } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "collectorLock",
  })

  const { data: recyclerLockAddress } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "recyclerLock",
  })

  const { data: verifierLockAddress } = useReadContract({
    address: SORTIFY_ECOSYSTEM_ADDRESS,
    abi: SORTIFY_ECOSYSTEM_ABI,
    functionName: "verifierLock",
  })

  // Get membership status for each role
  const { data: collectorStatus } = useReadContract({
    address: collectorLockAddress,
    abi: UNLOCK_ABI,
    functionName: "getHasValidKey",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!collectorLockAddress },
  })

  const { data: recyclerStatus } = useReadContract({
    address: recyclerLockAddress,
    abi: UNLOCK_ABI,
    functionName: "getHasValidKey",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!recyclerLockAddress },
  })

  const { data: verifierStatus } = useReadContract({
    address: verifierLockAddress,
    abi: UNLOCK_ABI,
    functionName: "getHasValidKey",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!verifierLockAddress },
  })

  // Purchase membership using the SortifyEcosystem contract
  const purchaseMembership = async (membershipType: MembershipType, value: bigint) => {
    if (!address) {
      throw new Error("Wallet not connected")
    }

    try {
      setIsSubmitting(true)
      
      writeContract({
        address: SORTIFY_ECOSYSTEM_ADDRESS,
        abi: SORTIFY_ECOSYSTEM_ABI,
        functionName: "purchaseMembership",
        args: [membershipType],
        value,
      })
    } catch (error) {
      console.error("Error purchasing membership:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Purchase membership directly through Unlock (alternative approach)
  const purchaseMembershipDirect = async (membershipType: MembershipType, value: bigint) => {
    if (!address) {
      throw new Error("Wallet not connected")
    }

    let lockAddress: `0x${string}` | undefined
    
    switch (membershipType) {
      case MembershipType.COLLECTOR:
        lockAddress = collectorLockAddress
        break
      case MembershipType.RECYCLER:
        lockAddress = recyclerLockAddress
        break
      case MembershipType.VERIFIER:
        lockAddress = verifierLockAddress
        break
    }

    if (!lockAddress) {
      throw new Error("Lock address not found")
    }

    try {
      setIsSubmitting(true)
      
      writeContract({
        address: lockAddress,
        abi: UNLOCK_ABI,
        functionName: "purchaseFor",
        args: [address, BigInt(0), "0x", "0x"],
        value,
      })
    } catch (error) {
      console.error("Error purchasing membership directly:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMembershipPrice = (membershipType: MembershipType) => {
    switch (membershipType) {
      case MembershipType.COLLECTOR:
        return parseEther("0.01")
      case MembershipType.RECYCLER:
        return parseEther("0.02")
      case MembershipType.VERIFIER:
        return parseEther("0.05")
      default:
        return parseEther("0.01")
    }
  }

  const getMembershipTitle = (membershipType: MembershipType) => {
    switch (membershipType) {
      case MembershipType.COLLECTOR:
        return "Collector"
      case MembershipType.RECYCLER:
        return "Recycler"
      case MembershipType.VERIFIER:
        return "Verifier"
      default:
        return "Unknown"
    }
  }

  return {
    // Lock addresses
    collectorLockAddress,
    recyclerLockAddress,
    verifierLockAddress,
    
    // Membership status
    isCollector: collectorStatus || false,
    isRecycler: recyclerStatus || false,
    isVerifier: verifierStatus || false,
    
    // Actions
    purchaseMembership,
    purchaseMembershipDirect,
    
    // Helpers
    getMembershipPrice,
    getMembershipTitle,
    
    // State
    isSubmitting,
    isConfirming,
    error,
  }
}
