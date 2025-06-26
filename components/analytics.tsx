"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Path changed
    const url = pathname + searchParams.toString()

    // This is where you would typically send analytics data
    // For example with Google Analytics:
    // window.gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: url,
    // })

    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 Page view: ${url}`)
    }
  }, [pathname, searchParams])

  return null
}
