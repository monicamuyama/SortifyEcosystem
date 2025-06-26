"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface ClientSearchParamsProps {
  render: (params: URLSearchParams) => React.ReactNode
}

function ClientSearchParamsContent({ render }: ClientSearchParamsProps) {
  const searchParams = useSearchParams()
  return <>{render(searchParams)}</>
}

export function ClientSearchParams({ render }: ClientSearchParamsProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientSearchParamsContent render={render} />
    </Suspense>
  )
}
