"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Html5QrcodeScanner } from "html5-qrcode"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useWasteVerifier } from "@/lib/hooks/use-waste-verifier"
import { useOnchainWallet } from "@/lib/hooks/use-onchain-wallet"
import { Loader2, Check, X, Camera } from "lucide-react"

interface ScanResult {
  type: string
  binId: string
  wasteType: string
  estimatedWeight: number
  transactionId: string
  timestamp: number
}

export function EnhancedQRScanner() {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [depositImage, setDepositImage] = useState<File | null>(null)
  const { toast } = useToast()
  const { address, isConnected } = useOnchainWallet()
  const { submitWasteDeposit, isSubmitting } = useWasteVerifier()
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText) as ScanResult

      if (data.type !== "sortify-reward") {
        throw new Error("Invalid QR code. Not a Sortify reward.")
      }

      const now = Date.now()
      if (now - data.timestamp > 24 * 60 * 60 * 1000) {
        throw new Error("QR code has expired. Please generate a new one.")
      }

      setScanResult(data)
      setScanning(false)

      // Clear the scanner
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }

      toast({
        title: "QR Code Scanned Successfully!",
        description: "Review the details and submit your deposit.",
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

  const stopScanning = () => {
    setScanning(false)
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
    }
  }

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDepositImage(file)
    }
  }

  const submitDeposit = async () => {
    if (!scanResult || !address) return

    try {
      // Upload image if provided
      let imageUrl = ""
      if (depositImage) {
        const formData = new FormData()
        formData.append("image", depositImage)
        formData.append("depositId", scanResult.transactionId)

        const uploadResponse = await fetch("/api/upload-deposit-image", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          imageUrl = url
        }
      }

      // Submit to blockchain
      await submitWasteDeposit(
        scanResult.binId,
        scanResult.wasteType,
        scanResult.estimatedWeight,
        address,
        scanResult.timestamp,
      )

      // Submit to backend for verification queue
      await fetch("/api/waste-deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scanResult,
          userAddress: address,
          imageUrl,
          status: "pending_verification",
        }),
      })

      toast({
        title: "Deposit Submitted Successfully!",
        description:
          "Your waste deposit has been recorded and is pending verification. You'll receive rewards once verified.",
        variant: "default",
      })

      setScanResult(null)
      setDepositImage(null)
    } catch (error) {
      toast({
        title: "Failed to Submit Deposit",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Connect your wallet to scan QR codes and claim rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">Please connect your wallet to continue</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
        <CardDescription>Scan the QR code on the smart bin after depositing your waste</CardDescription>
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
              <h3 className="font-medium mb-2">Deposit Details:</h3>
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
                  <span className="font-medium">Estimated Reward:</span>{" "}
                  {calculateReward(scanResult.wasteType, scanResult.estimatedWeight)} SORT
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Deposit Photo (Optional)</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                  id="deposit-image"
                />
                <label
                  htmlFor="deposit-image"
                  className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-muted"
                >
                  <Camera className="h-4 w-4" />
                  {depositImage ? "Change Photo" : "Take Photo"}
                </label>
                {depositImage && <span className="text-sm text-muted-foreground">{depositImage.name}</span>}
              </div>
            </div>

            <Button onClick={submitDeposit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Deposit
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <div className="text-center text-muted-foreground">
              <p>Press the button below to start scanning</p>
            </div>
            <Button onClick={() => setScanning(true)}>
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

function calculateReward(wasteType: string, weight: number): number {
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
  return Math.round(rate * weight * 10) / 10
}
