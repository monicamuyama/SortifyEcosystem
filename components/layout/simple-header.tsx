"use client"

import Link from "next/link"
import { Recycle } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"

export function SimpleHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-red-500 text-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Recycle className="h-6 w-6 text-white" />
            <span className="text-xl font-bold">Sortify - Simple Header</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span>Header is visible!</span>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}
