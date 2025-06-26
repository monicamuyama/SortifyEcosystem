"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QRCodeGenerator } from "@/components/smart-bins/qr-code-generator"
import { Info, MapPin, Recycle, BarChart, QrCode } from "lucide-react"
import Image from 'next/image'

export default function SmartBinDetailsPage() {
  const params = useParams()
  const binId = params.id as string
  const [activeTab, setActiveTab] = useState("details")

  // Mock data for a smart bin
  const binData = {
    id: binId,
    name: `Smart Bin #${binId}`,
    location: "123 Main Street, New York",
    status: "available",
    fillLevel: 35,
    lastEmptied: "2023-03-10",
    wasteTypes: ["Plastic", "Paper", "Glass", "Metal"],
    totalCollected: 1250,
    coordinates: { lat: 40.7128, lng: -74.006 },
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{binData.name}</h1>
            <Badge variant={binData.status === "available" ? "default" : "outline"}>
              {binData.status === "available" ? "Available" : binData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {binData.location}
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="outline" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
          <Button size="sm">
            <Recycle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="details">
            <Info className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="claim">
            <QrCode className="mr-2 h-4 w-4" />
            Claim Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bin Status</CardTitle>
                <CardDescription>Current status and fill level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fill Level</span>
                    <span className="text-sm font-medium">{binData.fillLevel}%</span>
                  </div>
                  <Progress value={binData.fillLevel} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <span className="text-sm font-medium">
                      <Badge variant={binData.status === "available" ? "default" : "outline"}>
                        {binData.status === "available" ? "Available" : binData.status}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Emptied</span>
                    <span className="text-sm font-medium">{binData.lastEmptied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Waste Collected</span>
                    <span className="text-sm font-medium">{binData.totalCollected} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accepted Waste Types</CardTitle>
                <CardDescription>Types of waste this bin can process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {binData.wasteTypes.map((type) => (
                    <div key={type} className="flex items-center p-2 border rounded-md">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <h4 className="font-medium text-sm mb-1">How to use this bin</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Separate your waste by type</li>
                    <li>Use the appropriate compartment for each waste type</li>
                    <li>Scan the QR code after depositing to claim rewards</li>
                    <li>Ensure all containers are empty and clean</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Map and directions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=300&width=800"
                  alt="Map showing bin location"
                  className="w-full h-full object-cover"
                  width={800}
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weekly Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42 deposits</div>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Waste Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128 kg</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sorting Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Collection History</CardTitle>
              <CardDescription>Recent waste collections from this bin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Waste Type</th>
                      <th className="py-3 px-4 text-left font-medium">Weight</th>
                      <th className="py-3 px-4 text-left font-medium">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-03-15</td>
                      <td className="py-3 px-4">Plastic</td>
                      <td className="py-3 px-4">2.5 kg</td>
                      <td className="py-3 px-4">0x1234...5678</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-03-14</td>
                      <td className="py-3 px-4">Paper</td>
                      <td className="py-3 px-4">1.8 kg</td>
                      <td className="py-3 px-4">0x8765...4321</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-03-14</td>
                      <td className="py-3 px-4">Glass</td>
                      <td className="py-3 px-4">3.2 kg</td>
                      <td className="py-3 px-4">0x2468...1357</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-03-13</td>
                      <td className="py-3 px-4">Metal</td>
                      <td className="py-3 px-4">1.5 kg</td>
                      <td className="py-3 px-4">0x1357...2468</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claim" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <QRCodeGenerator binId={binId} wasteType="mixed" estimatedWeight={1.5} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How to Claim Rewards</CardTitle>
                <CardDescription>Follow these steps to earn SORT tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">1</div>
                    <div>
                      <h3 className="font-medium">Deposit Your Waste</h3>
                      <p className="text-sm text-muted-foreground">
                        Use the appropriate compartment for each type of waste
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">2</div>
                    <div>
                      <h3 className="font-medium">Scan the QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Open the Sortify app and scan this QR code after depositing
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">3</div>
                    <div>
                      <h3 className="font-medium">Verify and Confirm</h3>
                      <p className="text-sm text-muted-foreground">Verify the waste details and confirm your deposit</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">4</div>
                    <div>
                      <h3 className="font-medium">Receive Tokens</h3>
                      <p className="text-sm text-muted-foreground">
                        SORT tokens will be transferred to your connected wallet
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Reward Rates</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Plastic: 2.0 SORT/kg</div>
                    <div>Paper: 1.0 SORT/kg</div>
                    <div>Glass: 1.5 SORT/kg</div>
                    <div>Metal: 3.0 SORT/kg</div>
                    <div>Organic: 0.5 SORT/kg</div>
                    <div>Electronic: 5.0 SORT/kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
