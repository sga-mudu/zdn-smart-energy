"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image: string | null
  brandLogo: string | null
  brandName: string | null
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState(4)

  useEffect(() => {
    // Fetch featured products from API
    fetch("/api/products?featured=true")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error("Failed to fetch featured products:", errorData)
          return []
        }
        return res.json()
      })
      .then((data) => {
        // Handle both array and paginated response
        const productsList = Array.isArray(data) ? data : (data.products || [])
        setProducts(productsList)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching featured products:", error)
        setProducts([])
        setLoading(false)
      })
  }, [])

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
    if (products.length === 0) return
    
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
  }, [visibleProducts, products.length])

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(products.length - visibleProducts, prev + 1))
  }

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

  if (products.length === 0) {
    // Don't show the section if there are no featured products
    return null
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
            disabled={startIndex === 0 || products.length <= visibleProducts}
          >
            <ChevronLeft className="w-5 h-5 md:w-5 md:h-5" />
          </Button>

          <div className="overflow-hidden">
            <div
              className="flex gap-2 sm:gap-3 md:gap-4 transition-transform duration-300"
              style={{ transform: `translateX(-${startIndex * (100 / visibleProducts)}%)` }}
            >
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="flex-shrink-0 w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)] min-w-[180px] sm:min-w-[200px] cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 flex flex-col h-full sm:p-4 md:p-6">
                      <div className="aspect-square mb-2 sm:mb-3 md:mb-4 flex items-center justify-center bg-muted/30 rounded">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain p-2 sm:p-3 md:p-4"
                        />
                      </div>
                      <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">{product.code}</h3>
                      <p className="text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2">{product.description || product.name}</p>
                      {product.brandLogo && (
                        <div className="flex items-center mt-auto pt-2">
                          <Image
                            src={product.brandLogo}
                            alt={product.brandName || "Brand"}
                            width={80}
                            height={32}
                            className="h-6 md:h-8 object-contain"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 md:translate-x-4 z-10 rounded-full bg-white shadow-lg w-9 h-9 md:w-10 md:h-10"
            onClick={handleNext}
            disabled={startIndex >= products.length - visibleProducts || products.length <= visibleProducts}
          >
            <ChevronRight className="w-5 h-5 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
