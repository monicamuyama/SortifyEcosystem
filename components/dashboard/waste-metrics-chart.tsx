"use client"

import { XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", recyclable: 25, organic: 18, electronic: 5, hazardous: 3 },
  { month: "Feb", recyclable: 30, organic: 20, electronic: 8, hazardous: 4 },
  { month: "Mar", recyclable: 28, organic: 22, electronic: 6, hazardous: 2 },
  { month: "Apr", recyclable: 35, organic: 25, electronic: 7, hazardous: 5 },
  { month: "May", recyclable: 40, organic: 28, electronic: 10, hazardous: 3 },
  { month: "Jun", recyclable: 45, organic: 30, electronic: 12, hazardous: 4 },
]

export function WasteMetricsChart() {
  return (
    <ChartContainer height={350}>
      <BarChart
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
  )
}
