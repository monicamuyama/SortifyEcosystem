"use client"

import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"

interface QRCodeGeneratorProps {
  binId: string
  wasteType?: string
  estimatedWeight?: number
}

export function QRCodeGenerator({ binId, wasteType = "mixed", estimatedWeight = 0 }: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState("")
  const [timestamp, setTimestamp] = useState(Date.now())

  // Generate a new QR code value when the component mounts or when regenerated
  useEffect(() => {
    generateQRValue()
  }, [timestamp, generateQRValue])

  const generateQRValue = () => {
    // Create a unique transaction ID
    const transactionId = uuidv4()

    // Create a data object with all necessary information
    const qrData = {
      type: "sortify-reward",
      binId,
      wasteType,
      estimatedWeight,
      transactionId,
      timestamp: Date.now(),
    }

    // Convert to JSON string and encode for QR code
    setQrValue(JSON.stringify(qrData))
  }

  const regenerateQR = () => {
    setTimestamp(Date.now())
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan to Claim Rewards</CardTitle>
        <CardDescription>
          Scan this QR code with the Sortify app after depositing your waste to claim your tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode size={200} value={qrValue} viewBox={`0 0 256 256`} />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Smart Bin ID: {binId}</p>
          <p>Waste Type: {wasteType}</p>
          {estimatedWeight > 0 && <p>Estimated Weight: {estimatedWeight} kg</p>}
        </div>
        <Button variant="outline" onClick={regenerateQR}>
          Generate New Code
        </Button>
      </CardContent>
    </Card>
  )
}
