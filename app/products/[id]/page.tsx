"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FeaturesSection from "@/components/features-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Home } from "lucide-react"

interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image: string | null
  brandLogo: string | null
  brandName: string | null
  categoryId: string
  category: {
    id: string
    name: string
  }
  featured: boolean
}

interface RelatedProduct {
  id: string
  code: string
  name: string
  image: string | null
  brandLogo: string | null
  brandName: string | null
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch product
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/all-products")
          return
        }
        setProduct(data)
        setLoading(false)

        // Fetch related products (same category, limit to 5)
        fetch(`/api/products`)
          .then((res) => res.json())
          .then((products: Product[]) => {
            const related = products
              .filter((p) => p.categoryId === data.categoryId && p.id !== data.id)
              .slice(0, 5)
            setRelatedProducts(related)
          })
          .catch(console.error)
      })
      .catch((error) => {
        console.error("Error fetching product:", error)
        router.push("/all-products")
      })
  }, [id, router])

  const handleDownload = () => {
    if (!product) return
    
    const productInfo = `${product.code}\n${product.name}\nБрэнд: ${product.brandName || "N/A"}\nКатегори: ${product.category.name}\n\n${product.description || ""}`
    
    const blob = new Blob([productInfo], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${product.code}-${product.name.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-lg">Бүтээгдэхүүн ачаалж байна...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              <span>Нүүр</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/all-products" className="hover:text-foreground transition-colors">
              Бүтээгдэхүүн
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/all-products?category=${product.category.id}`} className="hover:text-foreground transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-foreground font-medium">{product.code}</span>
          </nav>
        </div>
      </div>

      {/* Product Information Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Product Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {product.brandLogo && (
                <div className="flex items-center justify-center bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <Image
                    src={product.brandLogo}
                    alt={product.brandName || "Brand"}
                    width={80}
                    height={40}
                    className="object-contain max-h-10"
                  />
                </div>
              )}
              {product.brandName && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Брэнд:</span>
                  <span className="text-sm font-semibold text-foreground">{product.brandName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Категори:</span>
                <span className="text-sm font-medium text-foreground">{product.category.name}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              {product.code}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              {product.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <Card className="overflow-hidden border-2 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white">
                <div className="aspect-square flex items-center justify-center bg-white rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <div className="space-y-6 lg:space-y-8">
              {/* Specifications Card */}
              <Card className="border shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 pb-3 border-b">
                    Дэлгэрэнгүй мэдээлэл
                  </h2>
                  <div className="space-y-4">
                    {product.description ? (
                      <div className="whitespace-pre-line text-sm md:text-base text-muted-foreground leading-relaxed">
                        {product.description}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">Дэлгэрэнгүй мэдээлэл оруулаагүй байна.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Download Button */}
              <div className="pt-4">
                <Button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base md:text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Танилцуулга татах
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50/50 to-white border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Төстэй бараанууд
              </h2>
              <p className="text-muted-foreground">Ижил категорид байгаа бусад бүтээгдэхүүнүүд</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="block group"
                >
                  <Card className="h-full border hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-4 md:p-5">
                      <div className="aspect-square mb-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          width={150}
                          height={150}
                          className="w-full h-full object-contain p-3"
                        />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.code}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                        {relatedProduct.name}
                      </p>
                      {relatedProduct.brandLogo && (
                        <div className="pt-2 border-t border-gray-100">
                          <Image
                            src={relatedProduct.brandLogo}
                            alt={relatedProduct.brandName || "Brand"}
                            width={60}
                            height={30}
                            className="h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturesSection />
      <Footer />
    </div>
  )
}

