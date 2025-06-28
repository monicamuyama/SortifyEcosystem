import { createConfig, http } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Sortify",
      appLogoUrl: "https://sortify.app/logo.png",
    }),
    metaMask(),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
