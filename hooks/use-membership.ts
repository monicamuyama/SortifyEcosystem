"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { UnlockService, type MembershipStatus } from "@/lib/unlock"

export function useMembership() {
  const { address } = useAccount()
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unlockService = new UnlockService()
  const membershipContractAddress = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS

  useEffect(() => {
    if (address && membershipContractAddress) {
      fetchMembershipStatus()
    }
  }, [address, membershipContractAddress])

  const fetchMembershipStatus = async () => {
    if (!address || !membershipContractAddress) return

    setLoading(true)
    setError(null)

    try {
      const status = await unlockService.getMembershipStatus(address, membershipContractAddress)
      setMembershipStatus(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch membership status")
    } finally {
      setLoading(false)
    }
  }

  const purchaseMembership = async (tier: "basic" | "premium" | "enterprise") => {
    if (!address || !membershipContractAddress) return

    setLoading(true)
    setError(null)

    try {
      // Get lock addresses from environment or contract
      const lockAddresses = {
        basic: process.env.NEXT_PUBLIC_BASIC_LOCK_ADDRESS,
        premium: process.env.NEXT_PUBLIC_PREMIUM_LOCK_ADDRESS,
        enterprise: process.env.NEXT_PUBLIC_ENTERPRISE_LOCK_ADDRESS,
      }

      const lockAddress = lockAddresses[tier]
      if (!lockAddress) {
        throw new Error(`Lock address not found for ${tier} tier`)
      }

      await unlockService.purchaseMembership(membershipContractAddress, lockAddress)

      // Refresh membership status after purchase
      await fetchMembershipStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to purchase membership")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTier = (): "none" | "basic" | "premium" | "enterprise" => {
    if (!membershipStatus) return "none"

    if (membershipStatus.hasEnterprise) return "enterprise"
    if (membershipStatus.hasPremium) return "premium"
    if (membershipStatus.hasBasic) return "basic"
    return "none"
  }

  const getRewardMultiplier = (): number => {
    if (!membershipStatus) return 1
    return Number(membershipStatus.rewardMultiplier) / 100
  }

  const hasMarketplaceAccess = (): boolean => {
    return membershipStatus?.marketplaceAccess ?? false
  }

  const hasAnalyticsAccess = (): boolean => {
    return membershipStatus?.analyticsAccess ?? false
  }

  const getCollectionLimit = (): number => {
    if (!membershipStatus) return 10
    return Number(membershipStatus.collectionLimit)
  }

  return {
    membershipStatus,
    loading,
    error,
    fetchMembershipStatus,
    purchaseMembership,
    getCurrentTier,
    getRewardMultiplier,
    hasMarketplaceAccess,
    hasAnalyticsAccess,
    getCollectionLimit,
  }
}
