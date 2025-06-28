"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Locate, RotateCcw } from "lucide-react"

interface SmartBinMapProps {
  searchQuery?: string
  selectedArea?: string
  selectedStatus?: string
}

export function SmartBinMap({ searchQuery, selectedArea, selectedStatus }: SmartBinMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRefs = useRef<L.Marker[]>([])
  const [loading, setLoading] = useState(true)

  // Sample smart bin data
  const smartBins = [
    { id: "SB-1001", lat: 40.7829, lng: -73.9654, status: "available", fillLevel: 35, location: "Central Park" },
    { id: "SB-1002", lat: 40.758, lng: -73.9855, status: "almost-full", fillLevel: 78, location: "Times Square" },
    { id: "SB-1003", lat: 40.7505, lng: -73.9934, status: "available", fillLevel: 45, location: "Herald Square" },
    { id: "SB-1004", lat: 40.7614, lng: -73.9776, status: "maintenance", fillLevel: 0, location: "Penn Station" },
    {
      id: "SB-1005",
      lat: 40.7484,
      lng: -73.9857,
      status: "available",
      fillLevel: 62,
      location: "Empire State Building",
    },
    {
      id: "SB-1006",
      lat: 40.7589,
      lng: -73.9851,
      status: "full",
      fillLevel: 95,
      location: "Broadway Theater District",
    },
    { id: "SB-1007", lat: 40.7831, lng: -73.9712, status: "available", fillLevel: 28, location: "Metropolitan Museum" },
    { id: "SB-1008", lat: 40.7549, lng: -73.984, status: "almost-full", fillLevel: 82, location: "Rockefeller Center" },
  ]

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default

        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Fix for default markers
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        if (mapRef.current && !mapInstanceRef.current) {
          // Default location (New York)
          const defaultLocation = { lat: 40.7128, lng: -74.006 }

          // Initialize map
          mapInstanceRef.current = L.map(mapRef.current).setView([defaultLocation.lat, defaultLocation.lng], 13)

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current)

          // Add smart bin markers
          addSmartBinMarkers(L)

          setLoading(false)

          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLoc = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                }

                // Add user location marker
                const userIcon = L.divIcon({
                  className: "user-location-marker",
                  html: '<div style="background: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })

                L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
                  .addTo(mapInstanceRef.current)
                  .bindPopup("Your Location")
              },
              (error) => {
                console.log("Geolocation error:", error.message)
              },
            )
          }
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error)
        setLoading(false)
      }
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [addSmartBinMarkers])

  const addSmartBinMarkers = (L: typeof import('leaflet')) => {
    // Clear existing markers
    markerRefs.current.forEach((marker) => marker.remove())
    markerRefs.current = []

    // Filter bins based on search criteria
    const filteredBins = smartBins.filter((bin) => {
      const matchesSearch =
        !searchQuery ||
        bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !selectedStatus || selectedStatus === "all" || bin.status === selectedStatus

      return matchesSearch && matchesStatus
    })

    filteredBins.forEach((bin) => {
      const getMarkerColor = (status: string, fillLevel: number) => {
        if (status === "maintenance") return "#3b82f6"
        if (status === "full" || fillLevel > 90) return "#ef4444"
        if (status === "almost-full" || fillLevel > 70) return "#f59e0b"
        return "#16a34a"
      }

      const color = getMarkerColor(bin.status, bin.fillLevel)

      const binIcon = L.divIcon({
        className: "smart-bin-marker",
        html: `<div style="background: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <div style="background: white; width: 6px; height: 6px; border-radius: 50%;"></div>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([bin.lat, bin.lng], { icon: binIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${bin.id}</h3>
            <p style="margin: 0 0 4px 0;"><strong>Location:</strong> ${bin.location}</p>
            <p style="margin: 0 0 4px 0;"><strong>Status:</strong> ${bin.status}</p>
            <p style="margin: 0 0 8px 0;"><strong>Fill Level:</strong> ${bin.fillLevel}%</p>
            <div style="background: #f3f4f6; border-radius: 4px; height: 8px; overflow: hidden;">
              <div style="background: ${color}; height: 100%; width: ${bin.fillLevel}%;"></div>
            </div>
          </div>
        `)

      markerRefs.current.push(marker)
    })
  }

  // Update markers when filters change
  useEffect(() => {
    if (mapInstanceRef.current) {
      import("leaflet").then(({ default: L }) => {
        addSmartBinMarkers(L)
      })
    }
  }, [searchQuery, selectedArea, selectedStatus, addSmartBinMarkers])

  const handleMyLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          mapInstanceRef.current.setView([userLoc.lat, userLoc.lng], 15)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const defaultLocation = { lat: 40.7128, lng: -74.006 }
      mapInstanceRef.current.setView([defaultLocation.lat, defaultLocation.lng], 13)
    }
  }

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading map...</span>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute bottom-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" onClick={handleRecenter}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="default" onClick={handleMyLocation}>
              <Locate className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-4 left-4 bg-background/90 p-3 rounded-md border shadow-sm max-w-xs">
            <h4 className="font-medium mb-2">Smart Bin Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Almost Full</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Full</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
