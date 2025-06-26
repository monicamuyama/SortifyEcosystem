import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Recycle, Truck, CreditCard, BarChart4, Scan } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Scan className="h-10 w-10 text-primary" />,
      title: "Smart Bins with Computer Vision",
      description:
        "Our AI-powered smart bins automatically categorize waste using computer vision technology, ensuring accurate sorting and maximum recycling efficiency.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Location-Based Collection",
      description:
        "Request waste collection at your location with just a few clicks using our interactive map interface.",
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Smart Route Optimization",
      description:
        "Our algorithms find the most efficient collection routes, reducing emissions and speeding up service.",
    },
    {
      icon: <Recycle className="h-10 w-10 text-primary" />,
      title: "Recycling Marketplace",
      description: "Buy and sell sorted recyclable materials directly on our platform to promote circular economy.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Token Rewards",
      description:
        "Earn blockchain-based tokens for proper waste disposal that can be redeemed for services or exchanged.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: "Data Analytics",
      description: "Access detailed insights about your waste management patterns and environmental impact.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
          <p className="text-muted-foreground text-lg max-w-[800px]">
            Sortify offers a comprehensive suite of tools to make waste management efficient, rewarding, and
            environmentally friendly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
