"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function SmartBinStatus() {
  const data = [
    { name: "Available", value: 32, color: "#16a34a" },
    { name: "Almost Full", value: 8, color: "#f59e0b" },
    { name: "Full", value: 5, color: "#ef4444" },
    { name: "Maintenance", value: 3, color: "#3b82f6" },
  ]

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} bins`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
