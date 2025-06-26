"use client"

import { useState } from "react"
import { QRCodeScanner } from "@/components/rewards/qr-code-scanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, History, QrCode } from "lucide-react"

export default function ClaimRewardsPage() {
  const { isConnected, connect } = useWallet()
  const [activeTab, setActiveTab] = useState("scan")

  // Mock transaction history
  const transactions = [
    { id: "1", date: "2023-03-15", binId: "SB-1042", wasteType: "Plastic", amount: "2.5 SORT" },
    { id: "2", date: "2023-03-10", binId: "SB-1036", wasteType: "Paper", amount: "1.2 SORT" },
    { id: "3", date: "2023-03-05", binId: "SB-1028", wasteType: "Glass", amount: "1.8 SORT" },
  ]

  if (!isConnected) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>You need to connect your wallet to claim recycling rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Connect your wallet to scan QR codes and claim your SORT tokens for recycling activities.
              </p>
              <Button onClick={() => connect()}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Claim Rewards</h1>
          <p className="text-muted-foreground">Scan QR codes to claim your recycling rewards</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Claim History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          <QRCodeScanner />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Follow these steps to claim your rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">1</div>
                  <div>
                    <h3 className="font-medium">Deposit Your Waste</h3>
                    <p className="text-sm text-muted-foreground">
                      Use one of our smart bins to deposit your recyclable waste
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">2</div>
                  <div>
                    <h3 className="font-medium">Scan the QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      After depositing, scan the QR code displayed on the smart bin
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">3</div>
                  <div>
                    <h3 className="font-medium">Claim Your Tokens</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify the details and claim your SORT tokens as rewards
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">4</div>
                  <div>
                    <h3 className="font-medium">Use Your Tokens</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your earned tokens in the marketplace or for special services
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>Your recent reward claims</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Bin ID</th>
                        <th className="py-3 px-4 text-left font-medium">Waste Type</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b">
                          <td className="py-3 px-4">{tx.date}</td>
                          <td className="py-3 px-4">{tx.binId}</td>
                          <td className="py-3 px-4">{tx.wasteType}</td>
                          <td className="py-3 px-4 font-medium text-primary">{tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No claim history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
