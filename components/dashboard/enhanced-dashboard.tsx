"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSortifyEcosystem } from "@/lib/hooks/use-sortify-ecosystem"
import { useRecyclingBadges } from "@/lib/hooks/use-recycling-badges"
import { useAccount } from "wagmi"
import { Wallet, Recycle, Award, TrendingUp, Users, Truck } from "lucide-react"

export function EnhancedDashboard() {
  const { isConnected } = useAccount()
  const {
    userProfile,
    userRequests,
    tokenBalance,
    formatTokenAmount,
    // getStatusString,
    // refetchProfile,
    // refetchUserRequests,
    // refetchTokenBalance,
  } = useSortifyEcosystem()

  const { badgeCount } = useRecyclingBadges()

  if (!isConnected) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to access your Sortify dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Please connect your wallet to view your profile, collection requests, and rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your Sortify dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          {userProfile?.isCollector && <Badge variant="default">Collector</Badge>}
          {userProfile?.isRecycler && <Badge variant="secondary">Recycler</Badge>}
          {userProfile?.isVerifier && <Badge variant="outline">Verifier</Badge>}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SORT Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTokenAmount(tokenBalance)} SORT</div>
            <p className="text-xs text-muted-foreground">
              ≈ ${(Number.parseFloat(formatTokenAmount(tokenBalance)) * 0.1).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Requests</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRequests?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total requests made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recycling Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badgeCount?.toString() || "0"}</div>
            <p className="text-xs text-muted-foreground">NFT badges earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.reputation?.toString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Community reputation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="badges">Recycling Badges</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRequests && userRequests.length > 0 ? (
                    userRequests.slice(0, 5).map((requestId) => (
                      <div key={requestId.toString()} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Collection Request #{requestId.toString()}</p>
                          <p className="text-xs text-muted-foreground">Submitted recently</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
                <CardDescription>Your contribution to sustainability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Total Waste Collected</span>
                    </div>
                    <span className="text-sm font-medium">0 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">CO₂ Saved</span>
                    </div>
                    <span className="text-sm font-medium">0 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Community Rank</span>
                    </div>
                    <span className="text-sm font-medium">Beginner</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Collection Requests</CardTitle>
              <CardDescription>Track the status of your waste collection requests</CardDescription>
            </CardHeader>
            <CardContent>
              {userRequests && userRequests.length > 0 ? (
                <div className="space-y-4">
                  {userRequests.map((requestId) => (
                    <CollectionRequestCard key={requestId.toString()} requestId={requestId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No collection requests found</p>
                  <Button className="mt-4" onClick={() => (window.location.href = "/collection")}>
                    Create First Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recycling Badges</CardTitle>
              <CardDescription>Your NFT badges proving environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recycling badges yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Purchase recycled materials from the marketplace to earn badges
                </p>
                <Button className="mt-4" onClick={() => (window.location.href = "/marketplace")}>
                  Visit Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memberships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Memberships</CardTitle>
              <CardDescription>Manage your role-based access to platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <MembershipCard
                  title="Collector"
                  description="Accept and complete waste collection requests"
                  isActive={userProfile?.isCollector || false}
                  price="0.01 ETH"
                />
                <MembershipCard
                  title="Recycler"
                  description="List processed materials on the marketplace"
                  isActive={userProfile?.isRecycler || false}
                  price="0.02 ETH"
                />
                <MembershipCard
                  title="Verifier"
                  description="Verify waste collections and earn rewards"
                  isActive={userProfile?.isVerifier || false}
                  price="0.05 ETH"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CollectionRequestCard({ requestId }: { requestId: bigint }) {
  // const { collectionRequestDetails, formatTokenAmount } = useSortifyEcosystem()
  // We'll need to implement a way to get individual request details
  // For now, let's show a placeholder
  
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">Request #{requestId.toString()}</p>
      <p className="text-xs text-muted-foreground">Loading request details...</p>
    </div>
  )
}

function MembershipCard({
  title,
  description,
  isActive,
  price,
}: {
  title: string
  description: string
  isActive: boolean
  price: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">{price}</div>
          {isActive ? (
            <Badge className="w-full justify-center">Active</Badge>
          ) : (
            <Button className="w-full">Purchase</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}