export const CONTRACTS = {
  BASE_SEPOLIA: {
    SORTIFY_TOKEN: process.env.NEXT_PUBLIC_SORTIFY_TOKEN_ADDRESS || "",
    WASTE_COLLECTION: process.env.NEXT_PUBLIC_WASTE_COLLECTION_ADDRESS || "",
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
  },
  BASE_MAINNET: {
    SORTIFY_TOKEN: process.env.NEXT_PUBLIC_SORTIFY_TOKEN_ADDRESS_MAINNET || "",
    WASTE_COLLECTION: process.env.NEXT_PUBLIC_WASTE_COLLECTION_ADDRESS_MAINNET || "",
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS_MAINNET || "",
  },
} as const

export const CHAIN_CONFIG = {
  BASE_SEPOLIA: {
    id: 84532,
    name: "Base Sepolia",
    network: "base-sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://sepolia.base.org"] },
      public: { http: ["https://sepolia.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
    },
  },
  BASE_MAINNET: {
    id: 8453,
    name: "Base",
    network: "base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://mainnet.base.org"] },
      public: { http: ["https://mainnet.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://basescan.org" },
    },
  },
} as const
