"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useWallet } from "@/hooks/use-wallet"
import { SearchIcon, Filter, ShoppingCart } from "lucide-react"

// Sample marketplace items
const items = [
  {
    id: "1",
    title: "Recycled Paper",
    description: "100% recycled paper, perfect for printing and crafts",
    price: 0.5,
    unit: "kg",
    type: "paper",
    seller: "0x1234...5678",
    location: "Kalwere",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    title: "PET Plastic Flakes",
    description: "Clean PET plastic flakes for manufacturing",
    price: 0.8,
    unit: "kg",
    type: "plastic",
    seller: "0x8765...4321",
    location: "Wandegeya",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    title: "Aluminum Scrap",
    description: "Clean aluminum scrap for recycling",
    price: 1.2,
    unit: "kg",
    type: "metal",
    seller: "0x2468...1357",
    location: "Nakaawa",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    title: "Glass Cullet",
    description: "Sorted glass cullet ready for recycling",
    price: 0.3,
    unit: "kg",
    type: "glass",
    seller: "0x1357...2468",
    location: "Wandegeya",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function MarketplacePage() {
  const { isConnected, connect } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 2])
  const [activeTab, setActiveTab] = useState("buy")

  // Filter items based on search, type and price
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]

    return matchesSearch && matchesType && matchesPrice
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Recycling Marketplace</h1>
      <p className="text-muted-foreground mb-8">Buy and sell recycled materials to promote a circular economy</p>

      <Tabs defaultValue="buy" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="buy">Buy Materials</TabsTrigger>
          <TabsTrigger value="sell">Sell Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for recycled materials..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Material Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Price:</span>
              <Slider
                defaultValue={[0, 2]}
                max={2}
                step={0.1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-[200px]"
              />
              <span className="text-sm">
                ${priceRange[0].toFixed(1)} - ${priceRange[1].toFixed(1)} per kg
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {item.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold">
                          ${item.price}{" "}
                          <span className="text-sm font-normal text-muted-foreground">per {item.unit}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.location}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="w-full mr-2">
                        Details
                      </Button>
                      <Button size="sm" className="w-full" disabled={!isConnected}>
                        <ShoppingCart className="h-4 w-4 mr-2" /> Buy
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sell">
          {isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>List Your Recycled Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material Title</label>
                  <Input placeholder="Enter a descriptive title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Material Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">Paper</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price per kg ($)</label>
                    <Input type="number" min="0" step="0.1" placeholder="0.00" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity Available (kg)</label>
                    <Input type="number" min="1" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your material, condition, etc."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Images</label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 text-center">
                    <p className="text-sm text-muted-foreground">Drag and drop images here or click to browse</p>
                    <Button variant="outline" className="mt-4">
                      Upload Images
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">List Material for Sale</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Connect Your Wallet to Sell</h3>
              <p className="text-muted-foreground mb-6">
                You need to connect your Web3 wallet to list items for sale on the marketplace.
              </p>
              <Button onClick={() => connect()}>Connect Wallet</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
