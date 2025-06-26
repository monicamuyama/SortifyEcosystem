"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
    <ChartContainer height={350}>
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
        <ChartTooltip
          content={(props) => (
            <ChartTooltipContent
              items={[{ name: "Tokens Earned", value: props.payload?.[0]?.value, color: "#16a34a" }].filter(
                (item) => item.value !== undefined,
              )}
            />
          )}
        />
        <Line type="monotone" dataKey="tokens" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
      </LineChart>
    </ChartContainer>
  )
}
