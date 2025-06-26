"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, CalendarRange } from "lucide-react"

// Sample data for charts
const monthlyData = [
  { month: "Jan", recyclable: 120, organic: 80, electronic: 30, hazardous: 15 },
  { month: "Feb", recyclable: 140, organic: 90, electronic: 25, hazardous: 20 },
  { month: "Mar", recyclable: 160, organic: 85, electronic: 40, hazardous: 18 },
  { month: "Apr", recyclable: 180, organic: 100, electronic: 35, hazardous: 22 },
  { month: "May", recyclable: 200, organic: 110, electronic: 45, hazardous: 25 },
  { month: "Jun", recyclable: 220, organic: 105, electronic: 50, hazardous: 30 },
  { month: "Jul", recyclable: 240, organic: 120, electronic: 55, hazardous: 28 },
  { month: "Aug", recyclable: 250, organic: 125, electronic: 60, hazardous: 32 },
  { month: "Sep", recyclable: 230, organic: 115, electronic: 50, hazardous: 27 },
  { month: "Oct", recyclable: 210, organic: 105, electronic: 45, hazardous: 25 },
  { month: "Nov", recyclable: 190, organic: 95, electronic: 40, hazardous: 20 },
  { month: "Dec", recyclable: 180, organic: 90, electronic: 35, hazardous: 18 },
]

const wasteTypeData = [
  { name: "Recyclable", value: 2120, color: "#16a34a" },
  { name: "Organic", value: 1220, color: "#84cc16" },
  { name: "Electronic", value: 510, color: "#3b82f6" },
  { name: "Hazardous", value: 280, color: "#ef4444" },
]

const tokenData = [
  { month: "Jan", tokens: 240, transactions: 48 },
  { month: "Feb", tokens: 280, transactions: 56 },
  { month: "Mar", tokens: 320, transactions: 64 },
  { month: "Apr", tokens: 360, transactions: 72 },
  { month: "May", tokens: 400, transactions: 80 },
  { month: "Jun", tokens: 440, transactions: 88 },
  { month: "Jul", tokens: 480, transactions: 96 },
  { month: "Aug", tokens: 500, transactions: 100 },
  { month: "Sep", tokens: 460, transactions: 92 },
  { month: "Oct", tokens: 420, transactions: 84 },
  { month: "Nov", tokens: 380, transactions: 76 },
  { month: "Dec", tokens: 360, transactions: 72 },
]

const userActivityData = [
  { month: "Jan", newUsers: 42, activeUsers: 120 },
  { month: "Feb", newUsers: 38, activeUsers: 150 },
  { month: "Mar", newUsers: 45, activeUsers: 180 },
  { month: "Apr", newUsers: 50, activeUsers: 210 },
  { month: "May", newUsers: 55, activeUsers: 240 },
  { month: "Jun", newUsers: 60, activeUsers: 270 },
  { month: "Jul", newUsers: 65, activeUsers: 300 },
  { month: "Aug", newUsers: 70, activeUsers: 330 },
  { month: "Sep", newUsers: 62, activeUsers: 310 },
  { month: "Oct", newUsers: 58, activeUsers: 290 },
  { month: "Nov", newUsers: 52, activeUsers: 270 },
  { month: "Dec", newUsers: 48, activeUsers: 250 },
]

export default function AnalyticsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights about waste management and recycling metrics</p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Select defaultValue="year">
            <SelectTrigger className="w-[180px]">
              <CalendarRange className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="waste">
        <TabsList className="mb-8">
          <TabsTrigger value="waste">Waste Collection</TabsTrigger>
          <TabsTrigger value="token">Token Economy</TabsTrigger>
          <TabsTrigger value="user">User Activity</TabsTrigger>
          <TabsTrigger value="carbon">Carbon Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="waste" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Waste Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,130 kg</div>
                <p className="text-xs text-muted-foreground">+12.5% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recyclable Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,120 kg</div>
                <p className="text-xs text-muted-foreground">51.3% of total waste</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Collection Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">865</div>
                <p className="text-xs text-muted-foreground">+8.2% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Collection Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8 kg</div>
                <p className="text-xs text-muted-foreground">+0.3 kg from last year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Waste Collection</CardTitle>
                <CardDescription>Breakdown by waste type over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={350}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip
                      content={(props) => (
                        <ChartTooltipContent
                          items={[
                            { name: "Recyclable", value: props.payload?.[0]?.value, color: "#16a34a" },
                            { name: "Organic", value: props.payload?.[1]?.value, color: "#84cc16" },
                            { name: "Electronic", value: props.payload?.[2]?.value, color: "#3b82f6" },
                            { name: "Hazardous", value: props.payload?.[3]?.value, color: "#ef4444" },
                          ].filter((item) => item.value !== undefined)}
                          formatter={(value) => `${value} kg`}
                        />
                      )}
                    />
                    <Legend />
                    <Bar dataKey="recyclable" stackId="a" fill="#16a34a" />
                    <Bar dataKey="organic" stackId="a" fill="#84cc16" />
                    <Bar dataKey="electronic" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="hazardous" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Type Distribution</CardTitle>
                <CardDescription>Breakdown of waste by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={350}>
                  <PieChart>
                    <Pie
                      data={wasteTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {wasteTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="token" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tokens Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,240</div>
                <p className="text-xs text-muted-foreground">+15.2% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Token Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">458</div>
                <p className="text-xs text-muted-foreground">+12.8% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Token Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">928</div>
                <p className="text-xs text-muted-foreground">+18.5% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Token Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.24</div>
                <p className="text-xs text-muted-foreground">+0.03 from last year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Token Economy</CardTitle>
              <CardDescription>Monthly token issuance and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={350}>
                <LineChart data={tokenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        items={[
                          { name: "Tokens Issued", value: props.payload?.[0]?.value, color: "#16a34a" },
                          { name: "Transactions", value: props.payload?.[1]?.value, color: "#3b82f6" },
                        ].filter((item) => item.value !== undefined)}
                      />
                    )}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tokens"
                    stroke="#16a34a"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Tokens Issued"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Transactions"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+242 from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">685</div>
                <p className="text-xs text-muted-foreground">54.9% of total users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Collections per User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2</div>
                <p className="text-xs text-muted-foreground">+0.5 from last year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth & Activity</CardTitle>
              <CardDescription>Monthly new users and active user count</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={350}>
                <LineChart data={userActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        items={[
                          { name: "New Users", value: props.payload?.[0]?.value, color: "#3b82f6" },
                          { name: "Active Users", value: props.payload?.[1]?.value, color: "#16a34a" },
                        ].filter((item) => item.value !== undefined)}
                      />
                    )}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={2} name="New Users" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#16a34a" strokeWidth={2} name="Active Users" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbon" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CO2 Emissions Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,235 kg</div>
                <p className="text-xs text-muted-foreground">Equivalent to 123 trees planted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Route Optimization Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">328 kg CO2</div>
                <p className="text-xs text-muted-foreground">26.6% of total CO2 saved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Landfill Diversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,450 kg</div>
                <p className="text-xs text-muted-foreground">83.5% of collected waste</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Carbon Impact</CardTitle>
              <CardDescription>Environmental benefits from waste management</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <div className="mx-auto max-w-md">
                <div className="text-6xl font-bold text-primary mb-4">1,235 kg</div>
                <p className="text-xl mb-6">CO2 Emissions Saved</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">123</div>
                    <p className="text-sm text-muted-foreground">Trees Planted Equivalent</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4,820</div>
                    <p className="text-sm text-muted-foreground">km Not Driven</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">215</div>
                    <p className="text-sm text-muted-foreground">Hours of Energy Saved</p>
                  </div>
                </div>
                <p className="mt-8 text-muted-foreground">
                  Your waste management efforts through Sortify have made a significant positive impact on the
                  environment. Continue recycling to increase your contribution to sustainability!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
