"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RotateCcw, Locate } from "lucide-react"

interface MapContainerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

export function MapContainer({ onLocationSelect }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

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
        delete (L.Icon.Default.prototype as any)._getIconUrl
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

          // Add click handler
          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng
            updateMarker(L, lat, lng)
            onLocationSelect({ lat, lng })
          })

          setLoading(false)

          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLoc = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                }
                setUserLocation(userLoc)
                mapInstanceRef.current.setView([userLoc.lat, userLoc.lng], 15)
                updateMarker(L, userLoc.lat, userLoc.lng)
                onLocationSelect(userLoc)
              },
              (error) => {
                console.log("Geolocation error:", error.message)
                // Use default location
                updateMarker(L, defaultLocation.lat, defaultLocation.lng)
                onLocationSelect(defaultLocation)
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              },
            )
          } else {
            updateMarker(L, defaultLocation.lat, defaultLocation.lng)
            onLocationSelect(defaultLocation)
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
  }, [onLocationSelect])

  const updateMarker = (L: any, lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.remove()
    }

    markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current).bindPopup("Collection Location").openPopup()
  }

  const handleMyLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userLoc)
          mapInstanceRef.current.setView([userLoc.lat, userLoc.lng], 15)

          // Dynamically import Leaflet for marker update
          import("leaflet").then(({ default: L }) => {
            updateMarker(L, userLoc.lat, userLoc.lng)
            onLocationSelect(userLoc)
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15)
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
          <div ref={mapRef} className="w-full h-[500px]" />

          <div className="absolute bottom-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" onClick={handleRecenter}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="default" onClick={handleMyLocation}>
              <Locate className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-4 left-4 right-4 bg-background/90 p-3 rounded-md border shadow-sm">
            <p className="text-sm text-muted-foreground">
              Click anywhere on the map to set your collection location. The blue button will center the map on your
              current location.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
