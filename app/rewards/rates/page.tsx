"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function RewardRatesPage() {
  // Reward rates for different waste types
  const rewardRates = [
    { type: "Plastic", rate: 2.0, description: "Clean plastic containers, bottles, packaging" },
    { type: "Paper", rate: 1.0, description: "Newspapers, magazines, cardboard, office paper" },
    { type: "Glass", rate: 1.5, description: "Bottles, jars, containers (clear or colored)" },
    { type: "Metal", rate: 3.0, description: "Aluminum cans, steel cans, scrap metal" },
    { type: "Organic", rate: 0.5, description: "Food waste, yard trimmings, compostable materials" },
    { type: "Electronic", rate: 5.0, description: "Computers, phones, batteries, small appliances" },
    { type: "Hazardous", rate: 4.0, description: "Paints, chemicals, fluorescent bulbs, medical waste" },
    { type: "Recyclable (Mixed)", rate: 1.0, description: "General mixed recyclable materials" },
  ]

  // Chart data
  const chartData = rewardRates.map((item) => ({
    name: item.type,
    rate: item.rate,
  }))

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reward Rates</h1>
          <p className="text-muted-foreground">Learn how much you can earn for recycling different waste types</p>
        </div>
      </div>

      <Tabs defaultValue="rates" className="space-y-8">
        <TabsList>
          <TabsTrigger value="rates">Reward Rates</TabsTrigger>
          <TabsTrigger value="comparison">Rate Comparison</TabsTrigger>
          <TabsTrigger value="calculator">Reward Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Reward Rates</CardTitle>
              <CardDescription>SORT tokens earned per kilogram of waste</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waste Type</TableHead>
                    <TableHead>Rate (SORT/kg)</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewardRates.map((item) => (
                    <TableRow key={item.type}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">{item.rate}</span> SORT/kg
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reward Policy</CardTitle>
              <CardDescription>How our reward system works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our reward system is designed to incentivize proper waste sorting and recycling. The more valuable or
                difficult to process a material is, the higher the reward rate.
              </p>

              <div className="space-y-2">
                <h3 className="font-medium">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Rewards are calculated based on the weight and type of waste</li>
                  <li>Higher rates are given for materials that are more valuable or require special handling</li>
                  <li>Clean, properly sorted materials receive the full reward rate</li>
                  <li>Contaminated or improperly sorted materials may receive reduced rewards</li>
                  <li>Rates are subject to periodic adjustments based on market conditions</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Example Calculation:</h3>
                <p className="text-sm">
                  If you recycle 2kg of plastic (2.0 SORT/kg) and 3kg of paper (1.0 SORT/kg), you would earn:
                  <br />
                  (2kg × 2.0 SORT/kg) + (3kg × 1.0 SORT/kg) = 4.0 SORT + 3.0 SORT = 7.0 SORT tokens
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Comparison</CardTitle>
              <CardDescription>Visual comparison of reward rates by waste type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ dy: 10 }} />
                  <YAxis label={{ value: "SORT/kg", angle: -90, position: "insideLeft" }} />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        items={[{ name: "Rate", value: props.payload?.[0]?.value, color: "#16a34a" }].filter(
                          (item) => item.value !== undefined,
                        )}
                        formatter={(value) => `${value} SORT/kg`}
                      />
                    )}
                  />
                  <Bar dataKey="rate" fill="#16a34a" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward Calculator</CardTitle>
              <CardDescription>Estimate your rewards based on waste type and weight</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8">
                Use our collection form to calculate potential rewards for your waste.
                <br />
                <a href="/collection" className="text-primary hover:underline mt-4 inline-block">
                  Go to Collection Request Form
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
