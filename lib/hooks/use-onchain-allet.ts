"use client"

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { useCallback } from "react"

export function useOnchainWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
  })

  const connectWallet = useCallback(async () => {
    const connector = connectors[0] // Use first available connector
    if (connector) {
      connect({ connector })
    }
  }, [connect, connectors])

  return {
    address,
    isConnected,
    isConnecting,
    balance: balance?.formatted,
    connect: connectWallet,
    disconnect,
  }
}
