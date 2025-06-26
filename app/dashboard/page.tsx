"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, CreditCard, Truck, PlusCircle, Recycle, Scan } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WasteCollectionTable } from "@/components/dashboard/waste-collection-table"
import { TokenTransactionsTable } from "@/components/dashboard/token-transactions-table"
import { WasteMetricsChart } from "@/components/dashboard/waste-metrics-chart"
import { RewardsMetricsChart } from "@/components/dashboard/rewards-metrics-chart"

export default function DashboardPage() {
  const router = useRouter()
  const { isConnected, connect } = useWallet()

  // Mock data
  const userStats = {
    totalCollections: 12,
    totalWasteRecycled: 128.5,
    totalTokensEarned: 256.75,
    carbonSaved: 56.2,
  }

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold text-center mb-6">Connect Your Wallet</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          You need to connect your Web3 wallet to access your dashboard and track your waste management activities.
        </p>
        <Button size="lg" onClick={() => connect()}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalCollections}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Recycled</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalWasteRecycled} kg</div>
            <p className="text-xs text-muted-foreground">+22.5 kg from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Earned</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalTokensEarned}</div>
            <p className="text-xs text-muted-foreground">+45.0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Bin Usage</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Waste Collection Metrics</CardTitle>
            <CardDescription>Your recycling impact over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WasteMetricsChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Token Rewards</CardTitle>
            <CardDescription>Tokens earned from your recycling activities</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RewardsMetricsChart />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collections">
        <TabsList>
          <TabsTrigger value="collections">Collection Requests</TabsTrigger>
          <TabsTrigger value="tokens">Token Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="collections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Collections</h3>
            <Button onClick={() => router.push("/collection")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
          <WasteCollectionTable />
        </TabsContent>
        <TabsContent value="tokens" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Token Transactions</h3>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <TokenTransactionsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
