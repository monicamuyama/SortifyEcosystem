"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CircleArrowUp, CircleArrowDown } from "lucide-react"

const transactions = [
  {
    id: "TRX-001",
    date: "2023-02-28",
    type: "earning",
    amount: 25.0,
    description: "Waste Collection Reward",
  },
  {
    id: "TRX-002",
    date: "2023-02-20",
    type: "spending",
    amount: 50.0,
    description: "Marketplace Purchase - Recycled Paper",
  },
  {
    id: "TRX-003",
    date: "2023-02-15",
    type: "earning",
    amount: 16.4,
    description: "Waste Collection Reward",
  },
  {
    id: "TRX-004",
    date: "2023-02-05",
    type: "earning",
    amount: 30.6,
    description: "Waste Collection Reward",
  },
  {
    id: "TRX-005",
    date: "2023-01-28",
    type: "spending",
    amount: 25.0,
    description: "Marketplace Purchase - PET Plastic Flakes",
  },
]

export function TokenTransactionsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {transaction.type === "earning" ? (
                    <CircleArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <CircleArrowDown className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  {transaction.type === "earning" ? "Earning" : "Spending"}
                </div>
              </TableCell>
              <TableCell className={transaction.type === "earning" ? "text-green-600" : "text-red-600"}>
                {transaction.type === "earning" ? "+" : "-"}
                {transaction.amount} tokens
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
