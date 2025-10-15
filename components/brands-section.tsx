"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const brands = [
  { name: "2PA Smart Energy", logo: "/brands/brand1.png" },
  { name: "CALMET", logo: "/brands/brand2.png" },
  { name: "KERN", logo: "/brands/brand3.png" },
  { name: "SAUTER", logo: "/brands/brand4.png" },
  { name: "Digital Group", logo: "/brands/brand5.png" },
  { name: "Precisa", logo: "/brands/brand2.png" },
]

export default function BrandsSection() {
  const [startIndex, setStartIndex] = useState(0)
  const [visibleBrands, setVisibleBrands] = useState(4)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleResize = () => {
      if (window.innerWidth < 480) {
        setVisibleBrands(1)
      } else if (window.innerWidth < 640) {
        setVisibleBrands(2)
      } else if (window.innerWidth < 768) {
        setVisibleBrands(3)
      } else if (window.innerWidth < 1024) {
        setVisibleBrands(4)
      } else {
        setVisibleBrands(5)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Improved auto-rotation with pause on hover
  useEffect(() => {
    if (!isMounted) return

    const container = document.getElementById('brands-container')
    let isHovered = false

    const handleMouseEnter = () => isHovered = true
    const handleMouseLeave = () => isHovered = false

    container?.addEventListener('mouseenter', handleMouseEnter)
    container?.addEventListener('mouseleave', handleMouseLeave)

    const timer = setInterval(() => {
      if (!isHovered) {
        setStartIndex((prev) => {
          const nextIndex = prev + 1
          const maxIndex = brands.length - visibleBrands
          return nextIndex > maxIndex ? 0 : nextIndex
        })
      }
    }, 3000)

    return () => {
      clearInterval(timer)
      container?.removeEventListener('mouseenter', handleMouseEnter)
      container?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [visibleBrands, isMounted])

  const handlePrev = () => {
    setStartIndex((prev) => {
      if (prev <= 0) {
        return brands.length - visibleBrands
      }
      return prev - 1
    })
  }

  const handleNext = () => {
    setStartIndex((prev) => {
      const nextIndex = prev + 1
      const maxIndex = brands.length - visibleBrands
      return nextIndex > maxIndex ? 0 : nextIndex
    })
  }

  // Calculate visible brands with loop support
  const getVisibleBrandsList = () => {
    const list = []
    for (let i = 0; i < visibleBrands; i++) {
      const index = (startIndex + i) % brands.length
      list.push(brands[index])
    }
    return list
  }

  const visibleBrandsList = getVisibleBrandsList()

  if (!isMounted) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container m-auto px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-4 sm:mb-6 md:mb-8">
            ОНЦЛОХ БРЭНД
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 md:p-6 animate-pulse h-32"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-6 sm:mb-8 md:mb-12 text-center sm:text-left">
          ОНЦЛОХ БРЭНД
        </h2>

        <div
          id="brands-container"
          className="bg-gray-100 rounded-lg p-4 sm:p-6 md:p-8 max-w-7xl mx-auto"
        >
          <div className="relative">
            {/* Previous Button - Hide on smallest screens if only 1 brand visible */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 md:-translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Previous brands"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

            {/* Responsive Grid */}
            <div className={`grid ${visibleBrands === 1 ? 'grid-cols-1' :
              visibleBrands === 2 ? 'grid-cols-2' :
                visibleBrands === 3 ? 'grid-cols-3' :
                  visibleBrands === 4 ? 'grid-cols-2 md:grid-cols-4' :
                    'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              } gap-3 sm:gap-4 md:gap-6`}>
              {visibleBrandsList.map((brand, index) => (
                <div
                  key={`${brand.name}-${startIndex + index}`}
                  className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-20 sm:h-24 md:h-25 lg:h-25"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 480px) 100px, (max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 md:translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Next brands"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

          </div>

          {/* Dots Indicator for Mobile */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:hidden">
            {Array.from({ length: Math.ceil(brands.length / visibleBrands) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index * visibleBrands)}
                className={`w-2 h-2 rounded-full transition-colors ${Math.floor(startIndex / visibleBrands) === index ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}