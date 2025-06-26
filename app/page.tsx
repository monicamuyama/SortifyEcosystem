import { HeroSection } from "@/components/landing/hero-section"
import { FeatureSection } from "@/components/landing/feature-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CtaSection } from "@/components/landing/cta-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button asChild className="shadow-lg">
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>

      <HeroSection />
      <FeatureSection />
      <HowItWorks />
      <CtaSection />
    </div>
  )
}