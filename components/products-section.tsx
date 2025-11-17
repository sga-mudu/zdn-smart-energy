"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image: string | null
  brandLogo: string | null
  brandName: string | null
}

const productSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional().default(null),
  image: z.string().nullable().optional().default(null),
  brandLogo: z.string().nullable().optional().default(null),
  brandName: z.string().nullable().optional().default(null),
})

const featuredProductsResponseSchema = z.union([
  z.array(productSchema),
  z.object({
    products: z.array(productSchema),
  }),
])

async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products?featured=true")
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null)
      console.error("Failed to fetch featured products:", errorPayload)
      return []
    }

    const payload = await response.json()
    const parsed = featuredProductsResponseSchema.safeParse(payload)

    if (!parsed.success) {
      console.error("Unexpected featured products payload:", parsed.error.flatten())
      return []
    }

    const data = parsed.data
    return Array.isArray(data) ? data : data.products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    void (async () => {
      const featuredProducts = await fetchFeaturedProducts()
      setProducts(featuredProducts)
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!carouselApi || products.length === 0) return

    const timer = setInterval(() => {
      if (!carouselApi) return
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext()
      } else {
        carouselApi.scrollTo(0)
      }
    }, 4000)

    return () => clearInterval(timer)
  }, [carouselApi, products.length])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white" id="products">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 md:mb-16">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                ОНЦЛОХ БҮТЭЭГДЭХҮҮН
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Шинэ, чанартай бүтээгдэхүүнүүд
              </p>
            </div>
          </div>
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-base">Ачаалж байна...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white" id="products">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 md:mb-16">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
              ОНЦЛОХ БҮТЭЭГДЭХҮҮН
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Шинэ, чанартай бүтээгдэхүүнүүд
            </p>
          </div>
          <Link href="/all-products">
            <Button
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
            >
              <span className="hidden sm:inline">БУСАД БҮТЭЭГДЭХҮҮН</span>
              <span className="sm:hidden">БУСАД</span>
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Carousel */}
        <Carousel
          opts={{ align: "start", loop: products.length > 1 }}
          setApi={setCarouselApi}
          className="group relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4 gap-4 md:gap-6">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/products/${product.id}`} className="block h-full group/card">
                  <Card className="h-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-white overflow-hidden group-hover/card:scale-[1.02]">
                    <CardContent className="flex h-full flex-col p-4 sm:p-5 md:p-6">
                      {/* Product Image */}
                      <div className="mb-4 sm:mb-5 flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover/card:from-blue-50 group-hover/card:to-cyan-50 transition-all duration-300 overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-contain p-4 md:p-6 transition-transform duration-300 group-hover/card:scale-110"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex flex-col flex-grow">
                        <h3 className="mb-2 text-base sm:text-lg font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors">
                          {product.code}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
                          {product.description ?? product.name}
                        </p>
                        
                        {/* Brand Logo */}
                        {product.brandLogo ? (
                          <div className="mt-auto flex items-center pt-3 border-t border-gray-100">
                            <Image
                              src={product.brandLogo}
                              alt={product.brandName || "Brand"}
                              width={120}
                              height={40}
                              className="h-6 md:h-8 object-contain opacity-70 group-hover/card:opacity-100 transition-opacity"
                            />
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          {products.length > 1 ? (
            <>
              <CarouselPrevious className="hidden sm:flex !left-0 sm:!left-2 md:!left-4 bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:bg-white shadow-lg transition-all hover:scale-110" />
              <CarouselNext className="hidden sm:flex !right-0 sm:!right-2 md:!right-4 bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:bg-white shadow-lg transition-all hover:scale-110" />
            </>
          ) : null}
        </Carousel>
      </div>
    </section>
  )
}
