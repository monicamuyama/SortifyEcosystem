"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import { motion, AnimatePresence } from "framer-motion"
import { Recycle, Scan, MapPin, Wallet, Award, ArrowRight, ArrowLeft } from "lucide-react"
import Image from 'next/image'

export default function OnboardingPage() {
  const router = useRouter()
  const { connect, isConnected } = useWallet()
  const [step, setStep] = useState(1)
  const totalSteps = 5

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const steps = [
    {
      title: "Welcome to Sortify",
      description: "Learn how our smart waste management platform works and start your recycling journey.",
      icon: <Recycle className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Sortify combines AI-powered smart bins, blockchain rewards, and route optimization to revolutionize waste
            management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <Scan className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Smart Bins</h3>
              <p className="text-sm text-muted-foreground">AI-powered bins that automatically sort waste</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <Wallet className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Token Rewards</h3>
              <p className="text-sm text-muted-foreground">Earn tokens for recycling properly</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Smart Collection</h3>
              <p className="text-sm text-muted-foreground">Optimized routes for waste collection</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Smart Bins with Computer Vision",
      description: "Learn how our AI-powered smart bins work to automatically categorize waste.",
      icon: <Scan className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>Our smart bins use advanced computer vision technology to identify and sort waste automatically.</p>
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden border mt-4">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Smart Bin Demonstration"
              className="w-full h-full object-cover"
              width={600}
              height={300}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h4 className="font-medium">How it works:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Deposit waste in the smart bin</li>
                  <li>Computer vision identifies the material</li>
                  <li>AI sorts it into the correct category</li>
                  <li>You earn tokens for proper recycling</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Connect Your Wallet",
      description: "Connect your Web3 wallet to start earning tokens for recycling.",
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>To earn and manage your recycling rewards, you&apos;ll need to connect a Web3 wallet.</p>
          <div className="flex flex-col items-center justify-center py-6">
            {isConnected ? (
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg">Wallet Connected!</h3>
                <p className="text-sm text-muted-foreground">You're all set to earn recycling rewards</p>
              </div>
            ) : (
              <Button size="lg" onClick={() => connect()}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Why connect a wallet?</h4>
            <ul className="space-y-1">
              <li>• Earn tokens for your recycling activities</li>
              <li>• Trade recycled materials on the marketplace</li>
              <li>• Track your environmental impact</li>
              <li>• Participate in community challenges</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Find Smart Bins & Request Collections",
      description: "Learn how to locate smart bins and request waste collections.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>Use our interactive map to find smart bins near you or request special collections for larger items.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium flex items-center">
                <Scan className="h-5 w-5 mr-2 text-primary" />
                Find Smart Bins
              </h3>
              <p className="text-sm text-muted-foreground">
                Locate smart bins near you using our interactive map. Check bin status and capacity before visiting.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/smart-bins")}>
                View Smart Bin Map
              </Button>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Request Collections
              </h3>
              <p className="text-sm text-muted-foreground">
                For larger items or bulk waste, schedule a pickup at your location with our optimized collection
                service.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/collection")}>
                Request Collection
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Earn Rewards & Track Progress",
      description: "Learn how to earn tokens, complete achievements, and track your environmental impact.",
      icon: <Award className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Earn tokens for recycling, complete achievements, and compete on leaderboards while tracking your
            environmental impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Achievements & Challenges</h3>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">First Recycler</p>
                  <p className="text-xs text-muted-foreground">Use a smart bin for the first time</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Waste Warrior</p>
                  <p className="text-xs text-muted-foreground">Recycle 10kg of waste</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Environmental Impact</h3>
              <div className="space-y-2 mt-2">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>CO2 Saved</span>
                    <span className="font-medium">0 kg</span>
                  </div>
                  <Progress value={0} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Trees Saved</span>
                    <span className="font-medium">0</span>
                  </div>
                  <Progress value={0} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Water Saved</span>
                    <span className="font-medium">0 liters</span>
                  </div>
                  <Progress value={0} className="h-2 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const currentStep = steps[step - 1]

  return (
    <div className="container max-w-4xl py-10">
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">{currentStep.icon}</div>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.content}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={nextStep}>
              {step === totalSteps ? "Finish" : "Next"}
              {step === totalSteps ? null : <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
