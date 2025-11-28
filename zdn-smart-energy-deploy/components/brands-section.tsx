"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import Image from "next/image"

interface Brand {
  id: string
  name: string
  logo: string | null
  description: string | null
  productCount?: number
}

export default function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch brands from backend
  useEffect(() => {
    fetch("/api/brands")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch brands")
        }
        return res.json()
      })
      .then((data) => {
        // Handle both array and object response
        let brandsData: Brand[] = []
        
        if (Array.isArray(data)) {
          brandsData = data
        } else if (data && Array.isArray(data.brands)) {
          brandsData = data.brands
        } else if (data && data.data) {
          if (Array.isArray(data.data)) {
            brandsData = data.data
          } else if (Array.isArray(data.data.brands)) {
            brandsData = data.data.brands
          }
        }
        
        setBrands(brandsData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching brands:", error)
        setBrands([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </section>
    )
  }

  if (brands.length === 0) return null

  const marqueeDurationSeconds = Math.max(20, brands.length * 3)
  const marqueeStyle: CSSProperties = {
    animationDuration: `${marqueeDurationSeconds}s`,
  }
  const marqueeItems = [...brands, ...brands]

  return (
    <section className="pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-4 sm:pb-6 md:pb-8 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            ОНЦЛОХ БРЭНД
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Marquee */}
        <div className="relative py-2 sm:py-3 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" aria-hidden />
          <div
            className="marquee-track flex items-center gap-4 sm:gap-6 md:gap-8"
            style={marqueeStyle}
          >
            {marqueeItems.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 sm:h-20 md:h-24 px-3 sm:px-4 md:px-5 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                {brand.logo && brand.logo.trim() !== "" ? (
                  <div className="relative w-[100px] sm:w-[120px] md:w-[140px] h-12 sm:h-16 md:h-20">
                    <Image
                      src={brand.logo}
                      alt={brand.name || "Brand logo"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
                      unoptimized={true}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">${brand.name || "Brand"}</span>`
                        }
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}