"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"
import { MEMBERSHIP_TIERS } from "@/lib/unlock"
import { useMembership } from "@/hooks/use-membership"

interface MembershipCardProps {
  tier: "basic" | "premium" | "enterprise"
  isCurrentTier?: boolean
}

export function MembershipCard({ tier, isCurrentTier = false }: MembershipCardProps) {
  const { purchaseMembership, loading } = useMembership()
  const tierData = MEMBERSHIP_TIERS[tier.toUpperCase() as keyof typeof MEMBERSHIP_TIERS]

  const getIcon = () => {
    switch (tier) {
      case "basic":
        return <Star className="h-6 w-6" />
      case "premium":
        return <Zap className="h-6 w-6" />
      case "enterprise":
        return <Crown className="h-6 w-6" />
    }
  }

  const getGradient = () => {
    switch (tier) {
      case "basic":
        return "from-blue-500 to-blue-600"
      case "premium":
        return "from-purple-500 to-purple-600"
      case "enterprise":
        return "from-yellow-500 to-yellow-600"
    }
  }

  return (
    <Card className={`relative overflow-hidden ${isCurrentTier ? "ring-2 ring-primary" : ""}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5`} />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="capitalize">{tierData.name}</CardTitle>
          </div>
          {isCurrentTier && <Badge variant="secondary">Current</Badge>}
        </div>
        <CardDescription>
          <span className="text-2xl font-bold">{tierData.price} SORT</span>
          <span className="text-muted-foreground"> / year</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <ul className="space-y-2">
          {tierData.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="relative">
        <Button
          className="w-full"
          onClick={() => purchaseMembership(tier)}
          disabled={loading || isCurrentTier}
          variant={isCurrentTier ? "secondary" : "default"}
        >
          {loading ? "Processing..." : isCurrentTier ? "Active" : `Get ${tierData.name}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
