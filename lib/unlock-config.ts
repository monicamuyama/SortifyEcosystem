export interface VerifierCredentials {
  address: string
  lockAddress: string
  tier: 'basic' | 'premium' | 'enterprise'
  verificationLevel?: number
  accuracyScore?: number
  totalVerifications?: number
  hasValidKey?: boolean
}

export const UNLOCK_CONFIG = {
  // Base Sepolia testnet
  lockAddress: (process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  
  // Verifier credentials - in production these would come from a secure API
  verifiers: [
    {
      address: '0x742d35cc66a3c4c9bb97a5c5e5e5b7e0d0e0e0e0',
      lockAddress: '0x0000000000000000000000000000000000000000',
      tier: 'basic',
      verificationLevel: 3,
      accuracyScore: 95,
      totalVerifications: 248,
      hasValidKey: true
    }
  ] as VerifierCredentials[]
}
