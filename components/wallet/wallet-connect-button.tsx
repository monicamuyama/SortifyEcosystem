/*"use client"

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet"
import { Address, Avatar, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity"
import { color } from "@coinbase/onchainkit/theme"

export function WalletConnectButton() {
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com" target="_blank" rel="noopener noreferrer">
            Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  )
}

*/

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Wallet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function WalletConnectButton({ variant = "default", size = "default", className }: WalletConnectButtonProps) {
  const { isConnected, connect } = useWallet()
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (isConnected) return

    setIsPending(true)
    try {
      await connect()
    } catch (error: unknown) {
      if (error instanceof Error && error.message && error.message.includes("already pending")) {
        toast({
          title: "Connection Request Pending",
          description: "Please check your wallet to approve the connection request.",
          variant: "default",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsPending(false)
    }
  }

  if (isConnected) {
    return null
  }

  return (
    <Button variant={variant} size={size} onClick={handleConnect} disabled={isPending} className={className}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}

