"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/collection/date-picker"
import { MapContainer } from "@/components/collection/map-container"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, MapPin, X, Plus } from "lucide-react"

const getRewardRate = (wasteType: string): number => {
  const rewardRates: Record<string, number> = {
    plastic: 2.0,
    paper: 1.0,
    glass: 1.5,
    metal: 3.0,
    organic: 0.5,
    electronic: 5.0,
    hazardous: 4.0,
    recyclable: 1.0,
    mixed: 1.0,
  }
  return rewardRates[wasteType.toLowerCase()] || 1.0
}

export default function CollectionRequestPage() {
  const router = useRouter()
  const { isConnected, connect } = useWallet()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    wasteItems: [{ type: "", weight: "" }],
    description: "",
    date: new Date(),
    address: "",
    location: { lat: 0, lng: 0 },
  })

  const [step, setStep] = useState(1)

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData({ ...formData, location })
  }

  const handleAddressChange = (address: string) => {
    setFormData({ ...formData, address })
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to request a collection",
        variant: "destructive",
      })
      return
    }

    // Validate waste items
    const hasEmptyFields = formData.wasteItems.some((item) => !item.type || !item.weight)
    if (hasEmptyFields) {
      toast({
        title: "Missing information",
        description: "Please fill in all waste type and weight fields",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the form data to your backend API
    toast({
      title: "Collection request submitted!",
      description: "Your waste collection request has been received. We'll notify you when a collector accepts it.",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Request Waste Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {step === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle>Collection Details</CardTitle>
                <CardDescription>Provide information about the waste you want to have collected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {formData.wasteItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor={`wasteType-${index}`}>Waste Type</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => {
                            const newItems = [...formData.wasteItems]
                            newItems[index].type = value
                            setFormData({ ...formData, wasteItems: newItems })
                          }}
                        >
                          <SelectTrigger id={`wasteType-${index}`}>
                            <SelectValue placeholder="Select waste type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recyclable">Recyclable</SelectItem>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="electronic">Electronic</SelectItem>
                            <SelectItem value="hazardous">Hazardous</SelectItem>
                            <SelectItem value="plastic">Plastic</SelectItem>
                            <SelectItem value="paper">Paper</SelectItem>
                            <SelectItem value="glass">Glass</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`weight-${index}`}
                            type="number"
                            placeholder="Enter weight"
                            value={item.weight}
                            onChange={(e) => {
                              const newItems = [...formData.wasteItems]
                              newItems[index].weight = e.target.value
                              setFormData({ ...formData, wasteItems: newItems })
                            }}
                          />
                          {item.type && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Reward rate: {getRewardRate(item.type)} SORT/kg
                            </div>
                          )}
                          {formData.wasteItems.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newItems = formData.wasteItems.filter((_, i) => i !== index)
                                setFormData({ ...formData, wasteItems: newItems })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        wasteItems: [...formData.wasteItems, { type: "", weight: "" }],
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Waste Type
                  </Button>

                  <div className="flex justify-between">
                    <div className="bg-muted px-3 py-2 rounded-md">
                      <span className="text-sm font-medium">Total Weight: </span>
                      <span>
                        {formData.wasteItems
                          .reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0)
                          .toFixed(1)}{" "}
                        kg
                      </span>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-2 rounded-md">
                      <span className="text-sm font-medium">Estimated Rewards: </span>
                      <span>
                        {formData.wasteItems
                          .reduce((sum, item) => {
                            const weight = Number.parseFloat(item.weight) || 0
                            const rate = getRewardRate(item.type)
                            return sum + weight * rate
                          }, 0)
                          .toFixed(1)}{" "}
                        SORT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about the waste"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Collection Date</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <DatePicker date={formData.date} setDate={(date) => setFormData({ ...formData, date })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                {!isConnected && (
                  <Button variant="outline" onClick={() => connect()}>
                    Connect Wallet
                  </Button>
                )}
                <Button onClick={() => setStep(2)}>Next: Set Location</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Collection Location</CardTitle>
                <CardDescription>Set the pickup location on the map or enter an address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      placeholder="Enter collection address"
                      value={formData.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Or select a location on the map below:</p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Submit Request</Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="h-[500px] rounded-lg overflow-hidden border">
          <MapContainer onLocationSelect={handleLocationSelect} />
        </div>
      </div>
    </div>
  )
}
