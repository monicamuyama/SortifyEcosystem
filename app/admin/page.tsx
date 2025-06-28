"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Users, Truck, BarChart3, AreaChart, Clock } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { RouteOptimizationMap } from "@/components/admin/route-optimization-map"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {/* Add more tabs here as needed */}
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Last 7 days
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button size="sm">
                  <AreaChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+42 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Collections</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">+8 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Collected</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,586 kg</div>
                  <p className="text-xs text-muted-foreground">+256 kg from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tokens Distributed</CardTitle>
                  <AreaChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,172</div>
                  <p className="text-xs text-muted-foreground">+512 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Collections</CardTitle>
                  <CardDescription>Latest 5 collection requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">COL-1024</TableCell>
                        <TableCell>0x1234...5678</TableCell>
                        <TableCell>Recyclable</TableCell>
                        <TableCell>
                          <Badge>Scheduled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">COL-1023</TableCell>
                        <TableCell>0x8765...4321</TableCell>
                        <TableCell>Organic</TableCell>
                        <TableCell>
                          <Badge variant="outline">Pending</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">COL-1022</TableCell>
                        <TableCell>0x2468...1357</TableCell>
                        <TableCell>Electronic</TableCell>
                        <TableCell>
                          <Badge>Scheduled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">COL-1021</TableCell>
                        <TableCell>0x1357...2468</TableCell>
                        <TableCell>Hazardous</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Completed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">COL-1020</TableCell>
                        <TableCell>0x9876...5432</TableCell>
                        <TableCell>Recyclable</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Route Optimization</CardTitle>
                  <CardDescription>Today&apos;s optimized collection routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] rounded-md border">
                    <RouteOptimizationMap />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
