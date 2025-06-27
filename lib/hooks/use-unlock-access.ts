"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { UNLOCK_CONFIG, type VerifierCredentials } from "@/lib/unlock-config"

export function useUnlockAccess() {
  const { address } = useAccount()
  const [verifierCredentials, setVerifierCredentials] = useState<VerifierCredentials | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (address) {
      checkVerifierAccess(address)
    }
  }, [address])

  const checkVerifierAccess = async (userAddress: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would call the Unlock Protocol API
      // to check if the user has a valid key for the verifier lock
      const response = await fetch(`/api/unlock/check-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: userAddress,
          lockAddress: UNLOCK_CONFIG.locks.verifierAccess,
        }),
      })

      if (response.ok) {
        const credentials = await response.json()
        setVerifierCredentials(credentials)
      }
    } catch (error) {
      console.error("Error checking verifier access:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const purchaseVerifierAccess = async () => {
    if (!address) return

    try {
      // Redirect to Unlock Protocol checkout
      const checkoutUrl = `https://app.unlock-protocol.com/checkout?paywallConfig=${encodeURIComponent(
        JSON.stringify({
          locks: {
            [UNLOCK_CONFIG.locks.verifierAccess]: {
              name: "Sortify Verifier Access",
              network: 8453, // Base mainnet
            },
          },
          title: "Become a Sortify Verifier",
          icon: "/icons/icon-192x192.png",
        }),
      )}`

      window.open(checkoutUrl, "_blank")
    } catch (error) {
      console.error("Error purchasing verifier access:", error)
    }
  }

  return {
    verifierCredentials,
    isLoading,
    isVerifier: !!verifierCredentials?.hasValidKey,
    purchaseVerifierAccess,
    checkVerifierAccess,
  }
}
