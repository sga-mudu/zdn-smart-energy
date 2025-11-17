"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Marquee from "react-fast-marquee"

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
        
        // Filter out brands without logos for debugging
        console.log("Fetched brands:", brandsData)
        console.log("Brands with logos:", brandsData.filter(b => b.logo))
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

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            ОНЦЛОХ БРЭНД
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Marquee */}
        <Marquee
          gradient={true}
          gradientColor="white"
          gradientWidth={80}
          speed={40}
          pauseOnHover={true}
          className="py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 flex items-center justify-center h-16 sm:h-20 md:h-24 px-2 sm:px-3 md:px-4 mx-2 sm:mx-3 md:mx-4 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
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
                      console.error("Image load error for brand:", brand.name, brand.logo)
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
        </Marquee>
      </div>
    </section>
  )
}