"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const collections = [
  {
    id: "COL-001",
    date: "2023-02-28",
    wasteItems: [
      { type: "Recyclable", weight: "8.5", rewardRate: 1.0 },
      { type: "Plastic", weight: "4.0", rewardRate: 2.0 },
    ],
    status: "completed",
    tokens: 25.0,
  },
  {
    id: "COL-002",
    date: "2023-02-15",
    wasteItems: [{ type: "Organic", weight: "8.2", rewardRate: 0.5 }],
    status: "completed",
    tokens: 16.4,
  },
  {
    id: "COL-003",
    date: "2023-02-05",
    wasteItems: [{ type: "Electronic", weight: "15.3", rewardRate: 5.0 }],
    status: "completed",
    tokens: 30.6,
  },
  {
    id: "COL-004",
    date: "2023-03-10",
    wasteItems: [
      { type: "Recyclable", weight: "6.0", rewardRate: 1.0 },
      { type: "Glass", weight: "4.0", rewardRate: 1.5 },
    ],
    status: "scheduled",
    tokens: 0,
  },
  {
    id: "COL-005",
    date: "2023-03-05",
    wasteItems: [{ type: "Hazardous", weight: "5.5", rewardRate: 4.0 }],
    status: "pending",
    tokens: 0,
  },
]

export function WasteCollectionTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Waste Types</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tokens Earned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="font-medium">{collection.id}</TableCell>
              <TableCell>{collection.date}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {collection.wasteItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span>{item.type}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({item.weight} kg × {item.rewardRate} SORT)
                      </span>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {collection.wasteItems.reduce((total, item) => total + Number.parseFloat(item.weight), 0).toFixed(1)} kg
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    collection.status === "completed"
                      ? "default"
                      : collection.status === "scheduled"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {collection.status}
                </Badge>
              </TableCell>
              <TableCell>{collection.tokens}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
