"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const data = [
  { month: "Jan", tokens: 50 },
  { month: "Feb", tokens: 72 },
  { month: "Mar", tokens: 65 },
  { month: "Apr", tokens: 80 },
  { month: "May", tokens: 95 },
  { month: "Jun", tokens: 110 },
]

export function RewardsMetricsChart() {
  return (
    <ChartContainer config={{}} style={{ height: 350 }}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip />
        <Line type="monotone" dataKey="tokens" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
      </LineChart>
    </ChartContainer>
  )
}
