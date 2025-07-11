export const CONTRACTS = {
  BASE_SEPOLIA: {
    SORTIFY_TOKEN: (process.env.NEXT_PUBLIC_SORTIFY_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    WASTE_COLLECTION: (process.env.NEXT_PUBLIC_WASTE_COLLECTION_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    MARKETPLACE: (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    SORTIFY_ECOSYSTEM: (process.env.NEXT_PUBLIC_SORTIFY_ECOSYSTEM_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    COLLECTOR_LOCK: (process.env.NEXT_PUBLIC_COLLECTOR_LOCK_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    RECYCLER_LOCK: (process.env.NEXT_PUBLIC_RECYCLER_LOCK_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    VERIFIER_LOCK: (process.env.NEXT_PUBLIC_VERIFIER_LOCK_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  },
  BASE_MAINNET: {
    SORTIFY_TOKEN: (process.env.NEXT_PUBLIC_SORTIFY_TOKEN_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    WASTE_COLLECTION: (process.env.NEXT_PUBLIC_WASTE_COLLECTION_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    MARKETPLACE: (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    SORTIFY_ECOSYSTEM: (process.env.NEXT_PUBLIC_SORTIFY_ECOSYSTEM_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    COLLECTOR_LOCK: (process.env.NEXT_PUBLIC_COLLECTOR_LOCK_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    RECYCLER_LOCK: (process.env.NEXT_PUBLIC_RECYCLER_LOCK_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    VERIFIER_LOCK: (process.env.NEXT_PUBLIC_VERIFIER_LOCK_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000") as `0x${string}`,
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
