"use client"

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

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
  ssr: true,
})

/* ------------------------------------------------------------------ */
/*  Internal provider that can safely use wagmi hooks                 */
/* ------------------------------------------------------------------ */

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { address } = useAccount()
  const { data: balanceData } = useBalance({ 
    address: address as `0x${string}` | undefined,
    query: { enabled: !!address }
  })
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const connect = useCallback(async () => {
    if (address) return
    try {
      console.log('Attempting to connect wallet...', { connectors: connectors.length })
      if (connectors.length > 0) {
        await connectAsync({ connector: connectors[0] })
        console.log('Wallet connected successfully')
      } else {
        console.error('No connectors available')
      }
    } catch (err) {
      console.error("Wallet connect error:", err)
      throw err
    }
  }, [address, connectAsync, connectors])

  const disconnect = useCallback(() => {
    disconnectAsync().catch(console.error)
  }, [disconnectAsync])

  const ctxValue = useMemo<WalletContextType>(
    () => {
      console.log('WalletContext value:', { address, balance: balanceData?.formatted, isConnected: !!address })
      return {
        address: address ?? null,
        balance: balanceData ? balanceData.formatted : null,
        connect,
        disconnect,
        isConnected: !!address,
      }
    },
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
      <WalletContextProvider>{children}</WalletContextProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
