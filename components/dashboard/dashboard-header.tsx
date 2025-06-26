import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your waste collection, recycling impact, and token rewards</p>
      </div>
      <div className="mt-4 flex space-x-2 md:mt-0">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button size="sm" asChild>
          <Link href="/collection">Request Collection</Link>
        </Button>
      </div>
    </div>
  )
}
