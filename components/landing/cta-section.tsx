"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"

export function CtaSection() {
  const { isConnected } = useWallet()

  return (
    <section className="py-16 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join the Sustainable Revolution Today</h2>
          <p className="text-muted-foreground text-lg">
            Start earning rewards for responsible waste management while making a positive impact on the environment.
            Connect your wallet and begin your journey with Sortify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isConnected ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <WalletConnectButton size="lg" />
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/collection">Request Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
