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
import { useSortifyEcosystem, WasteType, type WasteItem } from "@/lib/hooks/use-sortify-ecosystem"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, MapPin, X, Plus, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"

const wasteTypeOptions = [
  { value: WasteType.PLASTIC, label: "Plastic", rate: "5.0 SORT/kg" },
  { value: WasteType.PAPER, label: "Paper", rate: "3.0 SORT/kg" },
  { value: WasteType.GLASS, label: "Glass", rate: "4.0 SORT/kg" },
  { value: WasteType.METAL, label: "Metal", rate: "7.0 SORT/kg" },
  { value: WasteType.ORGANIC, label: "Organic", rate: "2.0 SORT/kg" },
  { value: WasteType.ELECTRONIC, label: "Electronic", rate: "10.0 SORT/kg" },
]

export function EnhancedCollectionForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { requestWasteCollection, isSubmitting /*, wasteTypeToString*/ } = useSortifyEcosystem()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    wasteItems: [{ wasteType: WasteType.PLASTIC, amount: "" }] as Array<{ wasteType: WasteType; amount: string }>,
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

  const calculateEstimatedReward = () => {
    const rates: Record<WasteType, number> = {
      [WasteType.PLASTIC]: 5.0,
      [WasteType.PAPER]: 3.0,
      [WasteType.GLASS]: 4.0,
      [WasteType.METAL]: 7.0,
      [WasteType.ORGANIC]: 2.0,
      [WasteType.ELECTRONIC]: 10.0,
    }

    return formData.wasteItems.reduce((total, item) => {
      const weight = Number.parseFloat(item.amount) || 0
      return total + weight * rates[item.wasteType]
    }, 0)
  }

  const getTotalWeight = () => {
    return formData.wasteItems.reduce((total, item) => {
      return total + (Number.parseFloat(item.amount) || 0)
    }, 0)
  }

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to request a collection",
        variant: "destructive",
      })
      return
    }

    // Validate waste items
    const hasEmptyFields = formData.wasteItems.some((item) => !item.amount || Number.parseFloat(item.amount) <= 0)
    if (hasEmptyFields) {
      toast({
        title: "Missing information",
        description: "Please fill in all waste type and weight fields with valid amounts",
        variant: "destructive",
      })
      return
    }

    if (!formData.address) {
      toast({
        title: "Missing location",
        description: "Please provide a collection address",
        variant: "destructive",
      })
      return
    }

    try {
      const wasteItems: WasteItem[] = formData.wasteItems.map((item) => ({
        wasteType: item.wasteType,
        amount: BigInt(Math.round(Number.parseFloat(item.amount) * 1000)), // Convert kg to grams
      }))

      await requestWasteCollection(
        wasteItems,
        formData.address,
        formData.location.lat,
        formData.location.lng,
        formData.description,
      )

      toast({
        title: "Collection request submitted!",
        description: "Your waste collection request has been submitted to the blockchain. Collectors will be notified.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting collection request:", error)
      toast({
        title: "Failed to submit request",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
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
                          value={item.wasteType.toString()}
                          onValueChange={(value) => {
                            const newItems = [...formData.wasteItems]
                            newItems[index].wasteType = Number.parseInt(value) as WasteType
                            setFormData({ ...formData, wasteItems: newItems })
                          }}
                        >
                          <SelectTrigger id={`wasteType-${index}`}>
                            <SelectValue placeholder="Select waste type" />
                          </SelectTrigger>
                          <SelectContent>
                            {wasteTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{option.label}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{option.rate}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`weight-${index}`}
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Enter weight"
                            value={item.amount}
                            onChange={(e) => {
                              const newItems = [...formData.wasteItems]
                              newItems[index].amount = e.target.value
                              setFormData({ ...formData, wasteItems: newItems })
                            }}
                          />
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
                        wasteItems: [...formData.wasteItems, { wasteType: WasteType.PLASTIC, amount: "" }],
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Waste Type
                  </Button>

                  <div className="flex justify-between">
                    <div className="bg-muted px-3 py-2 rounded-md">
                      <span className="text-sm font-medium">Total Weight: </span>
                      <span>{getTotalWeight().toFixed(1)} kg</span>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-2 rounded-md">
                      <span className="text-sm font-medium">Estimated Rewards: </span>
                      <span>{calculateEstimatedReward().toFixed(1)} SORT</span>
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
                  <Label>Preferred Collection Date</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <DatePicker date={formData.date} setDate={(date) => setFormData({ ...formData, date })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                {!isConnected && (
                  <div className="text-sm text-muted-foreground">Please connect your wallet to continue</div>
                )}
                <Button onClick={() => setStep(2)} disabled={!isConnected}>
                  Next: Set Location
                </Button>
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
                <Button onClick={handleSubmit} disabled={isSubmitting || !isConnected}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
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
