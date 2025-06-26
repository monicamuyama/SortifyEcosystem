"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, RotateCcw } from "lucide-react"
import Image from 'next/image'

export function RouteOptimizationMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-full w-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full rounded-md">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Route Optimization Map"
              className="h-full w-full object-cover rounded-md"
              width={600}
              height={300}
            />
          </div>
          <div className="absolute bottom-2 right-2 flex flex-col gap-2">
            <Button size="sm" variant="secondary">
              <RotateCcw className="h-4 w-4 mr-1" />
              Recalculate
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="outline">
              <MapPin className="h-4 w-4 mr-1" />
              View Live
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
