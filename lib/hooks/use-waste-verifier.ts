"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { WASTE_VERIFIER_ABI, WASTE_VERIFIER_ADDRESS } from "@/lib/contracts/waste-verifier"
import { useState } from "react"

export function useWasteVerifier() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const getDeposit = (depositId: number) => {
    return useReadContract({
      address: WASTE_VERIFIER_ADDRESS,
      abi: WASTE_VERIFIER_ABI,
      functionName: "deposits",
      args: [BigInt(depositId)],
    })
  }

  const submitWasteDeposit = async (
    binId: string,
    wasteType: string,
    weight: number,
    userAddress: `0x${string}`,
    timestamp: number,
  ) => {
    setIsSubmitting(true)
    try {
      await writeContract({
        address: WASTE_VERIFIER_ADDRESS,
        abi: WASTE_VERIFIER_ABI,
        functionName: "submitWasteDeposit",
        args: [binId, wasteType, BigInt(weight * 1000), userAddress, BigInt(timestamp)], // Weight in grams
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyWasteDeposit = async (depositId: number, verified: boolean, actualWeight: number) => {
    setIsVerifying(true)
    try {
      await writeContract({
        address: WASTE_VERIFIER_ADDRESS,
        abi: WASTE_VERIFIER_ABI,
        functionName: "verifyWasteDeposit",
        args: [BigInt(depositId), verified, BigInt(actualWeight * 1000)],
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const claimReward = async (depositId: number) => {
    setIsClaiming(true)
    try {
      await writeContract({
        address: WASTE_VERIFIER_ADDRESS,
        abi: WASTE_VERIFIER_ABI,
        functionName: "claimReward",
        args: [BigInt(depositId)],
      })
    } finally {
      setIsClaiming(false)
    }
  }

  return {
    submitWasteDeposit,
    verifyWasteDeposit,
    claimReward,
    getDeposit,
    isSubmitting,
    isVerifying,
    isClaiming,
    isConfirming,
  }
}
