"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AllTogether } from "./all-products-section/allTogether"

const products = [
  {
    id: 1,
    name: "ZE 114",
    description: "Тэр ёсны онол гарын үйлдвэрийн төхөөрөмж",
    image: "/digital-timer-control-panel-laboratory.jpg",
    brand: "../brands/brand1.png",
  },
  {
    id: 2,
    name: "T213",
    description: "Усанд уусдаггүй үүсгүүр хэмжих төхөөрөмж хүнсний бүтээгдэхүүн",
    image: "/black-laboratory-testing-device-food-analysis.jpg",
    brand: "../brands/brand1.png",
  },
  {
    id: 3,
    name: "CIB 36-6",
    description: "Тоолуур жин",
    image: "/counting-scale-digital-display-industrial.jpg",
    brand: "../brands/brand1.png",
  },
  {
    id: 4,
    name: "DRT-8",
    description: "Дижитал рефрактометр",
    image: "/digital-refractometer-blue-handheld-device.jpg",
    brand: "../brands/brand1.png",
  },
  {
    id: 5,
    name: "OBS 106",
    description: "OBS-1 Микроскоп",
    image: "/laboratory-microscope-professional-equipment.jpg",
    brand: "../brands/brand1.png",
  },
]

export default function ProductsSection() {
  const [startIndex, setStartIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProducts(1)
      } else if (window.innerWidth < 1024) {
        setVisibleProducts(2)
      } else {
        setVisibleProducts(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => {
        const nextIndex = prev + 1
        if (nextIndex >= products.length - visibleProducts + 1) {
          return 0
        }
        return nextIndex
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [visibleProducts])

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(products.length - visibleProducts, prev + 1))
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background" id="products">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">ОНЦЛОХ БҮТЭЭГДЭХҮҮН</h2>
          <Link href="/all-products">
            <Button
              variant="link"
              className="text-xs md:text-sm text-muted-foreground hover:text-primary flex items-center gap-1 whitespace-nowrap"
            >
              <span className="hidden sm:inline">БУСАД БҮТЭЭГДЭХҮҮН</span>
              <span className="sm:hidden">БУСАД</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </Link>
        </div>

        <div className="relative bg-secondary rounded-lg border border-border p-2 shadow-md">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 md:-translate-x-4 z-10 rounded-full bg-white shadow-lg w-9 h-9 md:w-10 md:h-10"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 md:w-5 md:h-5" />
          </Button>

          <div className="overflow-hidden">
            <div
              className="flex gap-2 sm:gap-3 md:gap-4 transition-transform duration-300"
              style={{ transform: `translateX(-${startIndex * (100 / visibleProducts)}%)` }}
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)] min-w-[180px] sm:min-w-[200px]"
                >
                  <CardContent className="p-3 flex flex-col h-full sm:p-4 md:p-6">
                    <div className="aspect-square mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 sm:p-3 md:p-4"
                      />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center mt-auto pt-2">
                      <img
                        src={product.brand || "/placeholder.svg"}
                        alt={product.name}
                        className="h-6 md:h-8 object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 md:translate-x-4 z-10 rounded-full bg-white shadow-lg w-9 h-9 md:w-10 md:h-10"
            onClick={handleNext}
            disabled={startIndex >= products.length - visibleProducts}
          >
            <ChevronRight className="w-5 h-5 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
