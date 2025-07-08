"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'
import { SmartBinStatus } from "@/components/smart-bins/smart-bin-status"
import { SmartBinStats } from "@/components/smart-bins/smart-bin-stats"
import { SmartBinTechnology } from "@/components/smart-bins/smart-bin-technology"
import { MapPin, Search, Filter, Info } from "lucide-react"

const SmartBinMap = dynamic(
  () => import('@/components/smart-bins/smart-bin-map').then(mod => ({ default: mod.SmartBinMap })),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
  }
)

export default function SmartBinsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Bins</h1>
          <p className="text-muted-foreground">Locate and monitor our AI-powered smart bins in your area</p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="outline" size="sm" asChild>
            <a href="#technology">
              <Info className="mr-2 h-4 w-4" />
              How It Works
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href="/collection">Request Collection</a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="map" className="space-y-8">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for smart bins near you..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="north">North District</SelectItem>
                  <SelectItem value="east">East District</SelectItem>
                  <SelectItem value="south">South District</SelectItem>
                  <SelectItem value="west">West District</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bin Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="almostFull">Almost Full</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-[600px] rounded-lg overflow-hidden border">
              <SmartBinMap searchQuery={searchQuery} selectedArea={selectedArea} selectedStatus={selectedStatus} />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Smart Bin Status</CardTitle>
                  <CardDescription>Overview of bin network status</CardDescription>
                </CardHeader>
                <CardContent>
                  <SmartBinStatus />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Nearest Smart Bins</CardTitle>
                  <CardDescription>Bins closest to your location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((bin) => (
                    <div key={bin} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${bin === 3 ? "bg-amber-500" : "bg-green-500"}`}></div>
                        <div>
                          <p className="font-medium">Smart Bin #{bin === 1 ? "1042" : bin === 2 ? "1036" : "1028"}</p>
                          <p className="text-xs text-muted-foreground">
                            {bin === 1 ? "123 Main St" : bin === 2 ? "Central Park" : "Market Square"} •{" "}
                            {bin === 3 ? "75%" : bin === 2 ? "45%" : "30%"} full
                          </p>
                        </div>
                      </div>
                      <Badge variant={bin === 3 ? "outline" : "secondary"}>
                        {bin === 3 ? "Almost Full" : "Available"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    View All Nearby
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for smart bins..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="north">North District</SelectItem>
                  <SelectItem value="east">East District</SelectItem>
                  <SelectItem value="south">South District</SelectItem>
                  <SelectItem value="west">West District</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bin Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="almostFull">Almost Full</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">ID</th>
                  <th className="py-3 px-4 text-left font-medium">Location</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Fill Level</th>
                  <th className="py-3 px-4 text-left font-medium">Last Updated</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => {
                  const id = 1000 + i + 20
                  const fillLevel = Math.floor(Math.random() * 100)
                  let status = "Available"
                  let statusColor = "bg-green-500"

                  if (fillLevel > 90) {
                    status = "Full"
                    statusColor = "bg-red-500"
                  } else if (fillLevel > 70) {
                    status = "Almost Full"
                    statusColor = "bg-amber-500"
                  } else if (i === 3) {
                    status = "Maintenance"
                    statusColor = "bg-blue-500"
                  }

                  return (
                    <tr key={i} className="border-b">
                      <td className="py-3 px-4 font-medium">SB-{id}</td>
                      <td className="py-3 px-4">
                        {i % 5 === 0
                          ? "Central Park"
                          : i % 5 === 1
                            ? "Main Street"
                            : i % 5 === 2
                              ? "City Hall"
                              : i % 5 === 3
                                ? "Market Square"
                                : "Tech Campus"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
                          <span>{status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              fillLevel > 90 ? "bg-red-500" : fillLevel > 70 ? "bg-amber-500" : "bg-green-500"
                            }`}
                            style={{ width: `${fillLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{fillLevel}%</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {i % 3 === 0 ? "10 minutes ago" : i % 3 === 1 ? "1 hour ago" : "3 hours ago"}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Showing 10 of 48 smart bins</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <SmartBinStats />
        </TabsContent>
      </Tabs>

      <div id="technology" className="mt-16 pt-8 border-t">
        <SmartBinTechnology />
      </div>
    </div>
  )
}
