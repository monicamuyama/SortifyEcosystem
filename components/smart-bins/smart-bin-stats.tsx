"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SmartBinStats() {
  // Sample data for waste collection by type
  const wasteTypeData = [
    { name: "Paper", value: 35, color: "#3b82f6" },
    { name: "Plastic", value: 25, color: "#f59e0b" },
    { name: "Glass", value: 15, color: "#10b981" },
    { name: "Metal", value: 10, color: "#6366f1" },
    { name: "Organic", value: 12, color: "#84cc16" },
    { name: "Other", value: 3, color: "#94a3b8" },
  ]

  // Sample data for monthly collection
  const monthlyData = [
    { month: "Jan", paper: 28, plastic: 20, glass: 12, metal: 8, organic: 10 },
    { month: "Feb", paper: 30, plastic: 22, glass: 13, metal: 9, organic: 11 },
    { month: "Mar", paper: 32, plastic: 24, glass: 14, metal: 10, organic: 12 },
    { month: "Apr", paper: 35, plastic: 25, glass: 15, metal: 10, organic: 12 },
    { month: "May", paper: 33, plastic: 23, glass: 14, metal: 9, organic: 11 },
    { month: "Jun", paper: 36, plastic: 26, glass: 16, metal: 11, organic: 13 },
  ]

  // Sample data for bin usage
  const binUsageData = [
    { day: "Mon", usage: 85 },
    { day: "Tue", usage: 78 },
    { day: "Wed", usage: 92 },
    { day: "Thu", usage: 88 },
    { day: "Fri", usage: 95 },
    { day: "Sat", usage: 65 },
    { day: "Sun", usage: 50 },
  ]

  // Sample data for accuracy
  const accuracyData = [
    { month: "Jan", accuracy: 92 },
    { month: "Feb", accuracy: 93 },
    { month: "Mar", accuracy: 94 },
    { month: "Apr", accuracy: 95 },
    { month: "May", accuracy: 96 },
    { month: "Jun", accuracy: 97 },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Smart Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+8 from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waste Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245 kg</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sorting Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97%</div>
            <p className="text-xs text-muted-foreground">+2% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Fill Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collection">
        <TabsList>
          <TabsTrigger value="collection">Waste Collection</TabsTrigger>
          <TabsTrigger value="usage">Bin Usage</TabsTrigger>
          <TabsTrigger value="accuracy">AI Accuracy</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste Collection by Type</CardTitle>
                <CardDescription>Distribution of collected waste by material type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, null]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Collection by Type</CardTitle>
                <CardDescription>Waste collection trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip
                      content={(props) => (
                        <ChartTooltipContent
                          items={[
                            { name: "Paper", value: props.payload?.[0]?.value, color: "#3b82f6" },
                            { name: "Plastic", value: props.payload?.[1]?.value, color: "#f59e0b" },
                            { name: "Glass", value: props.payload?.[2]?.value, color: "#10b981" },
                            { name: "Metal", value: props.payload?.[3]?.value, color: "#6366f1" },
                            { name: "Organic", value: props.payload?.[4]?.value, color: "#84cc16" },
                          ].filter((item) => item.value !== undefined)}
                          formatter={(value) => `${value} kg`}
                        />
                      )}
                    />
                    <Legend />
                    <Bar dataKey="paper" fill="#3b82f6" />
                    <Bar dataKey="plastic" fill="#f59e0b" />
                    <Bar dataKey="glass" fill="#10b981" />
                    <Bar dataKey="metal" fill="#6366f1" />
                    <Bar dataKey="organic" fill="#84cc16" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Bin Usage</CardTitle>
              <CardDescription>Average daily usage of smart bins</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={300}>
                <BarChart data={binUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        items={[{ name: "Usage", value: props.payload?.[0]?.value, color: "#16a34a" }].filter(
                          (item) => item.value !== undefined,
                        )}
                        formatter={(value) => `${value}%`}
                      />
                    )}
                  />
                  <Legend />
                  <Bar dataKey="usage" fill="#16a34a" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Sorting Accuracy</CardTitle>
              <CardDescription>Computer vision accuracy over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={300}>
                <LineChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[90, 100]} />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        items={[{ name: "Accuracy", value: props.payload?.[0]?.value, color: "#3b82f6" }].filter(
                          (item) => item.value !== undefined,
                        )}
                        formatter={(value) => `${value}%`}
                      />
                    )}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
