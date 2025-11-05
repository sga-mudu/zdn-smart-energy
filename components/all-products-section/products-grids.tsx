"use client"

import { useMemo, useState, useEffect } from "react"
import { ProductCard } from "./products-cards"
import jsPDF from "jspdf"

interface Product {
    id: string
    code: string
    name: string
    image: string | null
    brandLogo: string | null
    brandName: string | null
}

interface ProductGridProps {
    selectedBrand?: string | null
}

export function ProductGrid({ selectedBrand }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

    useEffect(() => {
        // Fetch products from database
        fetch("/api/products")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                return res.json()
            })
            .then((data) => {
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setProducts(data)
                } else {
                    console.error("Invalid products data:", data)
                    setProducts([])
                }
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching products:", error)
                setProducts([])
                setLoading(false)
            })
    }, [])

    // Filter products based on selected brand
    const filteredProducts = useMemo(() => {
        // Ensure products is always an array
        if (!Array.isArray(products)) {
            return []
        }
        
        if (!selectedBrand) return products
        
        return products.filter(product => product.brandName === selectedBrand)
    }, [selectedBrand, products])
    const toggleProductSelection = (productId: string) => {
        setSelectedProducts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(productId)) {
                newSet.delete(productId)
            } else {
                newSet.add(productId)
            }
            return newSet
        })
    }

    const handleDownload = () => {
        // Get selected products, or all filtered products if none selected
        const productsToExport = selectedProducts.size > 0
            ? filteredProducts.filter((product) => selectedProducts.has(product.id))
            : filteredProducts

        // Ensure we have products to export
        if (!Array.isArray(productsToExport) || productsToExport.length === 0) {
            alert("Татах бүтээгдэхүүн байхгүй байна.")
            return
        }

        // Create PDF document
        const doc = new jsPDF()
        let yPosition = 20
        const pageHeight = doc.internal.pageSize.height
        const margin = 20
        const lineHeight = 7

        // Add title
        doc.setFontSize(16)
        doc.text("Бүтээгдэхүүний танилцуулга", margin, yPosition)
        yPosition += 15

        // Add each product
        productsToExport.forEach((product, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage()
                yPosition = margin
            }

            // Product code
            doc.setFontSize(12)
            doc.setFont("helvetica", "bold")
            doc.text(`Код: ${product.code}`, margin, yPosition)
            yPosition += lineHeight

            // Product name
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            const nameLines = doc.splitTextToSize(`Нэр: ${product.name}`, 170)
            doc.text(nameLines, margin, yPosition)
            yPosition += nameLines.length * lineHeight

            // Brand name
            if (product.brandName) {
                doc.text(`Брэнд: ${product.brandName}`, margin, yPosition)
                yPosition += lineHeight
            }

            // Add separator line between products
            if (index < productsToExport.length - 1) {
                yPosition += 3
                doc.line(margin, yPosition, 190, yPosition)
                yPosition += 10
            }
        })

        // Save the PDF
        const fileName = selectedProducts.size > 0 
            ? `selected-products-${Date.now()}.pdf` 
            : `all-products-${Date.now()}.pdf`
        doc.save(fileName)
    }

    return (
        <div className="border p-4 lg:p-5 rounded-lg border-border bg-card" id="products">
            <div className="text-center mb-4 lg:mb-6 rounded-lg bg-gray-700 py-3 px-4 lg:pl-6 text-sm lg:text-md text-white">
                <h3>Бүтээгдэхүүний баруун доод булан дээр даран бүтээгдэхүүний танилцуулгыг татах боломжтой.</h3>
            </div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg lg:text-2xl font-semibold text-gray-600">
                    Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж
                </h2>
            </div>
            {loading ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground">Бүтээгдэхүүн ачаалж байна...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product}
                                isSelected={selectedProducts.has(product.id)}
                                onSelect={() => toggleProductSelection(product.id)}
                            />
                        ))}
                    </div>

                    <div className="mt-6 lg:mt-8 flex justify-center lg:justify-end">
                        <button
                            onClick={handleDownload}
                            className="w-full lg:w-auto rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Танилцуулга татах
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground">
                        Энэ брэндийн бүтээгдэхүүн байхгүй байна.
                    </p>
                </div>
            )}
        </div>
    )
}