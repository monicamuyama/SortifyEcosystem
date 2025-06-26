import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Register & Connect Wallet",
      description: "Create an account and connect your Web3 wallet to start earning rewards for recycling.",
    },
    {
      number: "02",
      title: "Use Smart Bins",
      description:
        "Dispose of your waste in our AI-powered smart bins that automatically sort and categorize materials.",
    },
    {
      number: "03",
      title: "Computer Vision Analysis",
      description:
        "Our AI technology identifies and classifies waste types with high accuracy, ensuring proper sorting.",
    },
    {
      number: "04",
      title: "Request Additional Collection",
      description: "For larger items, use our app to schedule a pickup at your location.",
    },
    {
      number: "05",
      title: "Earn Token Rewards",
      description: "Receive blockchain-based tokens based on the quantity and quality of your recycled waste.",
    },
    {
      number: "06",
      title: "Use the Marketplace",
      description: "Buy, sell, or trade recycled materials in our marketplace to close the recycling loop.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-[800px]">
            Sortify makes waste management simple, efficient, and rewarding with these easy steps.
          </p>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="text-4xl font-bold text-primary/80">{step.number}</div>
                  <CardTitle className="text-xl mt-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
