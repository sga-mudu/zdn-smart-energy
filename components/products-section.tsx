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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ачаалж байна...</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

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

        <Carousel
          opts={{ align: "start", loop: products.length > 1 }}
          setApi={setCarouselApi}
          className="group relative rounded-lg border border-border bg-secondary p-2 shadow-md"
        >
          <CarouselContent className="gap-2 sm:gap-3 md:gap-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/products/${product.id}`} className="block h-full">
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                    <CardContent className="flex h-full flex-col p-3 sm:p-4 md:p-6">
                      <div className="mb-3 flex aspect-square items-center justify-center rounded bg-muted/30 sm:mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="h-full w-full object-contain p-3 md:p-4"
                        />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground md:text-base">
                        {product.code}
                      </h3>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-2 md:mb-3">
                        {product.description ?? product.name}
                      </p>
                      {product.brandLogo ? (
                        <div className="mt-auto flex items-center pt-2">
                          <Image
                            src={product.brandLogo}
                            alt={product.brandName || "Brand"}
                            width={96}
                            height={32}
                            className="h-6 md:h-8 object-contain"
                          />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {products.length > 1 ? (
            <>
              <CarouselPrevious className="hidden sm:flex !left-3 sm:!left-4 md:!left-5 bg-white text-foreground shadow-lg transition-colors hover:bg-white/90" />
              <CarouselNext className="hidden sm:flex !right-3 sm:!right-4 md:!right-5 bg-white text-foreground shadow-lg transition-colors hover:bg-white/90" />
            </>
          ) : null}
        </Carousel>
      </div>
    </section>
  )
}
