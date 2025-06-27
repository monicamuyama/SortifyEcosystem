"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWasteVerifier } from "@/lib/hooks/use-waste-verifier"
import { useUnlockAccess } from "@/lib/hooks/use-unlock-access"
import { CheckCircle, XCircle, Clock, Award } from "lucide-react"

interface PendingDeposit {
  id: number
  binId: string
  wasteType: string
  reportedWeight: number
  userAddress: string
  timestamp: number
  imageUrl?: string
  location: { lat: number; lng: number }
}

export function VerifierDashboard() {
  const { verifierCredentials, isVerifier, purchaseVerifierAccess } = useUnlockAccess()
  const { verifyWasteDeposit, isVerifying } = useWasteVerifier()
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([])
  const [selectedDeposit, setSelectedDeposit] = useState<PendingDeposit | null>(null)

  useEffect(() => {
    if (isVerifier) {
      fetchPendingDeposits()
    }
  }, [isVerifier])

  const fetchPendingDeposits = async () => {
    try {
      const response = await fetch("/api/verifier/pending-deposits")
      if (response.ok) {
        const deposits = await response.json()
        setPendingDeposits(deposits)
      }
    } catch (error) {
      console.error("Error fetching pending deposits:", error)
    }
  }

  const handleVerification = async (depositId: number, verified: boolean, actualWeight: number) => {
    try {
      await verifyWasteDeposit(depositId, verified, actualWeight)

      // Update local state
      setPendingDeposits((prev) => prev.filter((deposit) => deposit.id !== depositId))
      setSelectedDeposit(null)

      // Record verification in backend
      await fetch("/api/verifier/record-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositId,
          verified,
          actualWeight,
          verifierAddress: verifierCredentials?.address,
        }),
      })
    } catch (error) {
      console.error("Error verifying deposit:", error)
    }
  }

  if (!isVerifier) {
    return (
      <div className="container py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Become a Waste Verifier</CardTitle>
            <CardDescription>
              Join our network of verified waste inspectors and earn rewards for validating waste deposits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Verifier Benefits:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Earn SORT tokens for each verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Flexible schedule - verify when convenient</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Build reputation and unlock higher-paying verifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Contribute to environmental sustainability</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Requirements:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Complete verifier training course</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Pass verification accuracy test</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Purchase verifier access NFT</span>
                </li>
              </ul>
            </div>

            <Button onClick={purchaseVerifierAccess} className="w-full">
              Purchase Verifier Access (0.1 ETH)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verifier Dashboard</h1>
          <p className="text-muted-foreground">Review and verify waste deposits</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="default">
            <Award className="h-4 w-4 mr-1" />
            Level: {verifierCredentials?.verificationLevel}
          </Badge>
          <Badge variant="outline">Accuracy: {verifierCredentials?.accuracyScore}%</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeposits.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifierCredentials?.totalVerifications || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifierCredentials?.accuracyScore || 0}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Earnings This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125.5</div>
            <p className="text-xs text-muted-foreground">SORT tokens</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Verifications</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pending Deposits</h3>
              {pendingDeposits.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No pending verifications</p>
                  </CardContent>
                </Card>
              ) : (
                pendingDeposits.map((deposit) => (
                  <Card
                    key={deposit.id}
                    className={`cursor-pointer transition-colors ${
                      selectedDeposit?.id === deposit.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedDeposit(deposit)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">Deposit #{deposit.id}</CardTitle>
                        <Badge variant="outline">{deposit.wasteType}</Badge>
                      </div>
                      <CardDescription>
                        Bin: {deposit.binId} • {new Date(deposit.timestamp).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Reported Weight:</span>
                          <span className="text-sm font-medium">{deposit.reportedWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User:</span>
                          <span className="text-sm font-mono">
                            {deposit.userAddress.substring(0, 6)}...{deposit.userAddress.substring(-4)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div>
              {selectedDeposit ? (
                <VerificationPanel deposit={selectedDeposit} onVerify={handleVerification} isVerifying={isVerifying} />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Select a deposit to verify</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>Your recent verification activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Verification history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface VerificationPanelProps {
  deposit: PendingDeposit
  onVerify: (depositId: number, verified: boolean, actualWeight: number) => void
  isVerifying: boolean
}

function VerificationPanel({ deposit, onVerify, isVerifying }: VerificationPanelProps) {
  const [actualWeight, setActualWeight] = useState(deposit.reportedWeight)
  const [notes, setNotes] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Deposit #{deposit.id}</CardTitle>
        <CardDescription>Review and verify this waste deposit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Deposit Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Bin ID: {deposit.binId}</div>
            <div>Waste Type: {deposit.wasteType}</div>
            <div>Reported Weight: {deposit.reportedWeight} kg</div>
            <div>Timestamp: {new Date(deposit.timestamp).toLocaleString()}</div>
          </div>
        </div>

        {deposit.imageUrl && (
          <div className="space-y-2">
            <h4 className="font-medium">Deposit Image</h4>
            <img
              src={deposit.imageUrl || "/placeholder.svg"}
              alt="Waste deposit"
              className="w-full h-48 object-cover rounded-md border"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Actual Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={actualWeight}
            onChange={(e) => setActualWeight(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Verification Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the verification..."
            className="w-full px-3 py-2 border rounded-md h-20"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onVerify(deposit.id, true, actualWeight)} disabled={isVerifying} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => onVerify(deposit.id, false, 0)}
            disabled={isVerifying}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
