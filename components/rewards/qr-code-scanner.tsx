"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check, X, Camera } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import type { Html5QrcodeScanner } from "html5-qrcode"

interface ScanResult {
  type: string
  binId: string
  wasteType: string
  estimatedWeight: number
  transactionId: string
  timestamp: number
}

export function QRCodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const { toast } = useToast()
  const { isConnected } = useWallet()
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    try {
      // Parse the QR code data
      const data = JSON.parse(decodedText) as ScanResult

      // Validate that this is a Sortify reward QR code
      if (data.type !== "sortify-reward") {
        throw new Error("Invalid QR code. Not a Sortify reward.")
      }

      // Check if the QR code is expired (24 hours)
      const now = Date.now()
      if (now - data.timestamp > 24 * 60 * 60 * 1000) {
        throw new Error("QR code has expired. Please generate a new one.")
      }

      // Store the scan result and stop scanning
      setScanResult(data)
      setScanning(false)

      // Clear the scanner
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }

      toast({
        title: "QR Code Scanned Successfully!",
        description: "Review the details and claim your reward.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: error instanceof Error ? error.message : "Could not process QR code",
        variant: "destructive",
      })

      // Don't stop scanning on error, let user try again
    }
  }, [toast])

  useEffect(() => {
    if (scanning) {
      // Dynamically import the QR code scanner only when needed on the client side
      const initializeScanner = async () => {
        try {
          const { Html5QrcodeScanner } = await import("html5-qrcode")
          
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
          }

          scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false)

          scannerRef.current.render(
            (decodedText: string) => {
              handleScanSuccess(decodedText)
            },
            (error: unknown) => {
              // Handle scan failure - we can ignore most errors as they're just failed attempts
              console.log("Scan error:", error)
            },
          )
        } catch (error) {
          console.error("Failed to initialize QR scanner:", error)
          toast({
            title: "Scanner Error",
            description: "Failed to initialize camera scanner",
            variant: "destructive",
          })
          setScanning(false)
        }
      }

      initializeScanner()
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [scanning, handleScanSuccess, toast])

  const startScanning = () => {
    setScanning(true)
    setScanResult(null)
  }

  const stopScanning = () => {
    setScanning(false)
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
    }
  }

  const claimReward = async () => {
    if (!scanResult) return

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // In a real app, this would call your backend API to process the reward
      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate token reward based on waste type and weight
      const rewardAmount = calculateReward(scanResult.wasteType, scanResult.estimatedWeight)

      toast({
        title: "Reward Claimed Successfully!",
        description: `You've earned ${rewardAmount} SORT tokens for your recycling activity.`,
        variant: "default",
      })

      // Reset the state
      setScanResult(null)
    } catch (error) {
      toast({
        title: "Failed to Claim Reward",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const calculateReward = (wasteType: string, weight: number): number => {
    // Simple reward calculation based on waste type and weight
    const baseRates: Record<string, number> = {
      plastic: 2.0,
      paper: 1.0,
      glass: 1.5,
      metal: 3.0,
      organic: 0.5,
      electronic: 5.0,
      hazardous: 4.0,
      mixed: 1.0,
    }

    const rate = baseRates[wasteType.toLowerCase()] || baseRates.mixed
    return Math.round(rate * weight * 10) / 10 // Round to 1 decimal place
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>
          Scan the QR code on the smart bin after depositing your waste to claim your tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Position the QR code within the frame to scan</p>
            </div>
          </div>
        ) : scanResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Scan Details:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Bin ID:</span> {scanResult.binId}
                </li>
                <li>
                  <span className="font-medium">Waste Type:</span> {scanResult.wasteType}
                </li>
                <li>
                  <span className="font-medium">Estimated Weight:</span> {scanResult.estimatedWeight} kg
                </li>
                <li>
                  <span className="font-medium">Reward Amount:</span>{" "}
                  {calculateReward(scanResult.wasteType, scanResult.estimatedWeight)} SORT tokens
                </li>
                <li>
                  <span className="font-medium">Scanned:</span> {new Date(scanResult.timestamp).toLocaleString()}
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              {processing ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </Button>
              ) : (
                <Button onClick={claimReward}>
                  <Check className="mr-2 h-4 w-4" />
                  Claim Reward
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <div className="text-center text-muted-foreground">
              <p>Press the button below to start scanning</p>
            </div>
            <Button onClick={startScanning}>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          </div>
        )}
      </CardContent>
      {scanning && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={stopScanning}>
            <X className="mr-2 h-4 w-4" />
            Stop Scanning
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}