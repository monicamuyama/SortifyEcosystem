import { createPublicClient, http } from "viem"
import { base, baseSepolia } from "viem/chains"


// Unlock Protocol addresses on Base
export const UNLOCK_ADDRESSES = {
  [base.id]: {
    unlock: "0xe79B93f8E22676774F2A8dAd469175ebd00029FA",
    unlockUtils: "0x3Bbb7c7b8C0C8F3F8B8B8B8B8B8B8B8B8B8B8B8B",
  },
  [baseSepolia.id]: {
    unlock: "0x627118a4fB747016911e5cDA82e2E77C531e8206",
    unlockUtils: "0x3Bbb7c7b8C0C8F3F8B8B8B8B8B8B8B8B8B8B8B8B",
  },
}

export const MEMBERSHIP_TIERS = {
  BASIC: {
    name: "Basic",
    price: "100",
    duration: 365 * 24 * 60 * 60, // 1 year in seconds
    benefits: ["1.5x reward multiplier", "Marketplace access", "Up to 50 collections/month", "Basic analytics"],
  },
  PREMIUM: {
    name: "Premium",
    price: "500",
    duration: 365 * 24 * 60 * 60,
    benefits: [
      "2x reward multiplier",
      "Full marketplace access",
      "Up to 100 collections/month",
      "Advanced analytics",
      "Priority support",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "2000",
    duration: 365 * 24 * 60 * 60,
    benefits: [
      "3x reward multiplier",
      "Unlimited marketplace access",
      "Up to 1000 collections/month",
      "Full analytics suite",
      "Dedicated support",
      "Custom integrations",
    ],
  },
}

export interface MembershipStatus {
  hasBasic: boolean
  hasPremium: boolean
  hasEnterprise: boolean
  basicExpiry: bigint
  premiumExpiry: bigint
  enterpriseExpiry: bigint
  rewardMultiplier: bigint
  marketplaceAccess: boolean
  analyticsAccess: boolean
  collectionLimit: bigint
}

export class UnlockService {
  private publicClient
  //private walletClient
  private chainId: number

  constructor(chainId: number = baseSepolia.id) {
    this.chainId = chainId
    this.publicClient = createPublicClient({
      chain: chainId === base.id ? base : baseSepolia,
      transport: http(),
    })
  }

  async getMembershipStatus(userAddress: string, contractAddress: string): Promise<MembershipStatus> {
    try {
      const result = await this.publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "getUserMembershipStatus",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "user", type: "address" }],
            outputs: [
              { name: "hasBasic", type: "bool" },
              { name: "hasPremium", type: "bool" },
              { name: "hasEnterprise", type: "bool" },
              { name: "basicExpiry", type: "uint256" },
              { name: "premiumExpiry", type: "uint256" },
              { name: "enterpriseExpiry", type: "uint256" },
              { name: "rewardMultiplier", type: "uint256" },
              { name: "marketplaceAccess", type: "bool" },
              { name: "analyticsAccess", type: "bool" },
              { name: "collectionLimit", type: "uint256" },
            ],
          },
        ],
        functionName: "getUserMembershipStatus",
        args: [userAddress as `0x${string}`],
      })

      return {
        hasBasic: result[0],
        hasPremium: result[1],
        hasEnterprise: result[2],
        basicExpiry: result[3],
        premiumExpiry: result[4],
        enterpriseExpiry: result[5],
        rewardMultiplier: result[6],
        marketplaceAccess: result[7],
        analyticsAccess: result[8],
        collectionLimit: result[9],
      }
    } catch (error) {
      console.error("Error fetching membership status:", error)
      throw error
    }
  }

  async purchaseMembership(
    contractAddress: string,
    lockAddress: string,
    referrer = "0x0000000000000000000000000000000000000000",
  ) {
    try {
      const { request } = await this.publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "purchaseMembership",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "lockAddress", type: "address" },
              { name: "referrer", type: "address" },
            ],
            outputs: [],
          },
        ],
        functionName: "purchaseMembership",
        args: [lockAddress as `0x${string}`, referrer as `0x${string}`],
      })

      return request
    } catch (error) {
      console.error("Error purchasing membership:", error)
      throw error
    }
  }

  async getMembershipStats(contractAddress: string) {
    try {
      const result = await this.publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            name: "getMembershipStats",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [
              { name: "basicMembers", type: "uint256" },
              { name: "premiumMembers", type: "uint256" },
              { name: "enterpriseMembers", type: "uint256" },
            ],
          },
        ],
        functionName: "getMembershipStats",
        args: [],
      })

      return {
        basicMembers: result[0],
        premiumMembers: result[1],
        enterpriseMembers: result[2],
      }
    } catch (error) {
      console.error("Error fetching membership stats:", error)
      throw error
    }
  }
}
