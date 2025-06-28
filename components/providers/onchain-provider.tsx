"use client"

import type { ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@/lib/onchain-config"

const queryClient = new QueryClient()

interface OnchainProviderProps {
  children: ReactNode
}

export function OnchainProvider({ children }: OnchainProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
