"use client"

import { MembershipCard } from "@/components/membership/membership-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMembership } from "@/hooks/use-membership"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Loader2, Users, TrendingUp, Gift } from "lucide-react"

export default function MembershipPage() {
  const { isConnected, connect } = useWallet()
  const { membershipStatus, loading, getCurrentTier, getRewardMultiplier } = useMembership()

  const currentTier = getCurrentTier()
  const multiplier = getRewardMultiplier()

  if (!isConnected) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your wallet to view and manage your membership</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => connect()}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Sortify Membership</h1>
        <p className="text-xl text-muted-foreground mb-6">Unlock premium features and boost your recycling rewards</p>

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading membership status...</span>
          </div>
        ) : membershipStatus && currentTier !== "none" ? (
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Member
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {multiplier}x Rewards
            </Badge>
          </div>
        ) : (
          <p className="text-muted-foreground">Choose a membership tier to get started</p>
        )}
      </div>

      {/* Current Benefits */}
      {membershipStatus && currentTier !== "none" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Multiplier</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{multiplier}x</div>
              <p className="text-xs text-muted-foreground">Earn {multiplier}x more SORT tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Limit</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membershipStatus.collectionLimit.toString()}</div>
              <p className="text-xs text-muted-foreground">Collections per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Features</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  [
                    membershipStatus.marketplaceAccess && "Marketplace",
                    membershipStatus.analyticsAccess && "Analytics",
                  ].filter(Boolean).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Active premium features</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Membership Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MembershipCard tier="basic" isCurrentTier={currentTier === "basic"} />
        <MembershipCard tier="premium" isCurrentTier={currentTier === "premium"} />
        <MembershipCard tier="enterprise" isCurrentTier={currentTier === "enterprise"} />
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do memberships work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Memberships are powered by Unlock Protocol, providing decentralized access control. Your membership is
                stored as an NFT in your wallet and automatically grants you benefits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade my membership?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can purchase a higher tier membership at any time. The benefits will be applied immediately and
                stack with your existing membership.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What happens when my membership expires?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When your membership expires, you'll lose access to premium features but keep all earned SORT tokens.
                You can renew at any time to regain benefits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Are memberships transferable?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! Since memberships are NFTs, they can be transferred to other wallets. This makes them valuable
                assets that can be traded or gifted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
