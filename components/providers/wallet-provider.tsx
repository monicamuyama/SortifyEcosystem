"use client"

import { OnchainKitProvider } from "@coinbase/onchainkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, http, createConfig, useAccount, useBalance, useConnect, useDisconnect } from "wagmi"
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors"
import { base, baseSepolia } from "wagmi/chains"
import { createContext, useMemo, type ReactNode, type FC, useCallback } from "react"

/* ------------------------------------------------------------------ */
/*  Wallet context                                                    */
/* ------------------------------------------------------------------ */

interface WalletContextType {
  address: string | null
  balance: string | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
})

/* ------------------------------------------------------------------ */
/*  wagmi / onchainkit base config                                    */
/* ------------------------------------------------------------------ */

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Sortify",
      preference: "smartWalletOnly",
    }),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

/* ------------------------------------------------------------------ */
/*  Internal provider that can safely use wagmi hooks                 */
/* ------------------------------------------------------------------ */

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { address } = useAccount()
  const { data: balanceData } = useBalance({ address, watch: true })
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const connect = useCallback(async () => {
    if (address) return
    try {
      await connectAsync({ connector: connectors[0] })
    } catch (err) {
      console.error("Wallet connect error:", err)
    }
  }, [address, connectAsync, connectors])

  const disconnect = useCallback(() => {
    disconnectAsync().catch(console.error)
  }, [disconnectAsync])

  const ctxValue = useMemo<WalletContextType>(
    () => ({
      address: address ?? null,
      balance: balanceData ? balanceData.formatted : null,
      connect,
      disconnect,
      isConnected: !!address,
    }),
    [address, balanceData, connect, disconnect],
  )

  return <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  Public provider used by the rest of the app                       */
/* ------------------------------------------------------------------ */

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia} // dev default
      >
        <WalletContextProvider>{children}</WalletContextProvider>
      </OnchainKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
