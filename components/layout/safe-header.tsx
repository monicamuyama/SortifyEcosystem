"use client"

import { Header } from "@/components/layout/header"
import { SimpleHeader } from "@/components/layout/simple-header"
import { Component } from "react"

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Header error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <SimpleHeader />
    }

    return this.props.children
  }
}

export function SafeHeader() {
  return (
    <ErrorBoundary>
      <Header />
    </ErrorBoundary>
  )
}
