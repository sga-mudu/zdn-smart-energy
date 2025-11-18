"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "./products-cards"
import jsPDF from "jspdf"
import { toast } from "sonner"

interface Product {
    id: string
    code: string
    name: string
    description: string | null
    image: string | null
    brandLogo: string | null
    brandName: string | null
    categoryId: string
    category?: {
        id: string
        name: string
    }
}

interface ProductGridProps {
    selectedBrand?: string | null
}

export function ProductGrid({ selectedBrand }: ProductGridProps) {
    const searchParams = useSearchParams()
    const selectedCategoryId = searchParams.get('category')
    
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

    useEffect(() => {
        // Build API URL with category filter if provided
        let apiUrl = "/api/products"
        if (selectedCategoryId) {
            apiUrl += `?categoryId=${selectedCategoryId}`
        }
        
        // Fetch products from database
        fetch(apiUrl)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}))
                    const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${res.status}`
                    throw new Error(errorMessage)
                }
                return res.json()
            })
            .then((data) => {
                // Handle paginated response structure
                if (data && data.products && Array.isArray(data.products)) {
                    // Paginated response: { products: [], pagination: {} }
                    setProducts(data.products)
                } else if (Array.isArray(data)) {
                    // Direct array response
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
    }, [selectedCategoryId])

    // Filter products based on selected brand
    const filteredProducts = useMemo(() => {
        // Ensure products is always an array
        if (!Array.isArray(products)) {
            return []
        }
        
        let filtered = products
        
        // Filter by brand if selected
        if (selectedBrand) {
            // Debug in development
            if (process.env.NODE_ENV === 'development') {
                console.log('Filtering products by brand:', {
                    selectedBrand,
                    totalProducts: products.length,
                    productsWithBrand: products.filter(p => p.brandName).length,
                    uniqueBrands: [...new Set(products.map(p => p.brandName).filter(Boolean))]
                })
            }
            
            filtered = filtered.filter(product => {
                // Match brand name exactly (case-sensitive)
                const matches = product.brandName === selectedBrand
                return matches
            })
            
            if (process.env.NODE_ENV === 'development') {
                console.log('Filtered products count:', filtered.length)
            }
        }
        
        return filtered
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

    // Helper function to load image as base64
    const loadImageAsBase64 = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Handle relative paths
            const imageUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
            
            const img = document.createElement('img')
            img.crossOrigin = 'anonymous'
            
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Could not get canvas context'))
                    return
                }
                
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                
                try {
                    const base64 = canvas.toDataURL('image/png')
                    resolve(base64)
                } catch (error) {
                    reject(error)
                }
            }
            
            img.onerror = () => {
                // If image fails to load, return empty string
                resolve('')
            }
            
            img.src = imageUrl
        })
    }

    // Helper to render text with Unicode support using canvas
    const renderUnicodeText = (text: string, fontSize: number, color: string = '#000000', fontWeight: string = 'normal', maxWidth?: number): Promise<{ image: string; width: number; height: number }> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                resolve({ image: '', width: 0, height: 0 })
                return
            }
            
            // Use a font that supports Cyrillic/Mongolian
            const fontFamily = 'Arial, "DejaVu Sans", sans-serif'
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
            
            // Measure text
            const metrics = ctx.measureText(text)
            const lineHeight = fontSize * 1.3
            let textWidth = metrics.width
            let textHeight = lineHeight
            
            // Handle text wrapping if maxWidth is provided
            let lines: string[] = []
            if (maxWidth && metrics.width > maxWidth) {
                const words = text.split(' ')
                let currentLine = ''
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i]
                    const testMetrics = ctx.measureText(testLine)
                    
                    if (testMetrics.width > maxWidth && currentLine) {
                        lines.push(currentLine)
                        currentLine = words[i]
                    } else {
                        currentLine = testLine
                    }
                }
                if (currentLine) {
                    lines.push(currentLine)
                }
                
                // Calculate dimensions for wrapped text
                textWidth = maxWidth
                textHeight = lines.length * lineHeight
            } else {
                lines = [text]
                textWidth = Math.ceil(metrics.width)
            }
            
            // Set canvas size with padding
            const padding = 10
            canvas.width = Math.ceil(textWidth) + (padding * 2)
            canvas.height = Math.ceil(textHeight) + (padding * 2)
            
            // Redraw with proper settings
            ctx.fillStyle = color
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
            ctx.textBaseline = 'top'
            ctx.textAlign = 'left'
            
            // Draw each line
            lines.forEach((line, index) => {
                ctx.fillText(line, padding, padding + (index * lineHeight))
            })
            
            try {
                const dataUrl = canvas.toDataURL('image/png')
                resolve({ 
                    image: dataUrl, 
                    width: canvas.width, 
                    height: canvas.height 
                })
            } catch (error) {
                resolve({ image: '', width: 0, height: 0 })
            }
        })
    }

    const handleDownload = async () => {
        // Get selected products, or all filtered products if none selected
        const productsToExport = selectedProducts.size > 0
            ? filteredProducts.filter((product) => selectedProducts.has(product.id))
            : filteredProducts

        // Ensure we have products to export
        if (!Array.isArray(productsToExport) || productsToExport.length === 0) {
            toast.error("Татах бүтээгдэхүүн байхгүй байна.")
            return
        }

        toast.loading("PDF бэлдэж байна...", { id: "pdf-export" })

        try {
            // Load ZDN logo
            let zdnLogoBase64 = ''
            try {
                zdnLogoBase64 = await loadImageAsBase64('/zdn-logo.png')
            } catch (error) {
                console.warn('Could not load ZDN logo:', error)
            }

            // Create PDF document
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.width
            const pageHeight = doc.internal.pageSize.height
            const margin = 20
            const contentWidth = pageWidth - (margin * 2)
            let yPosition = margin

            // Helper to convert canvas pixels to PDF points
            // Canvas renders at device pixel ratio, PDF uses 72 DPI
            // For better accuracy: 1 canvas pixel ≈ 0.264583 mm, 1 PDF point = 0.352778 mm
            // So: 1 canvas pixel ≈ 0.75 PDF points (but we need to account for actual rendering)
            // Using a more accurate conversion based on typical browser rendering
            const pxToPt = (px: number) => px * (72 / 96) // 96 DPI screen to 72 DPI PDF

            // Helper function to add header with logo
            const addHeader = async () => {
                // Professional Header with gradient effect
                doc.setFillColor(0, 51, 102)
                doc.rect(0, 0, pageWidth, 40, 'F')
                
                // Add subtle gradient effect (darker at top)
                doc.setFillColor(0, 40, 85)
                doc.rect(0, 0, pageWidth, 8, 'F')
                
                if (zdnLogoBase64) {
                    try {
                        // White background box for logo
                        doc.setFillColor(255, 255, 255)
                        doc.rect(margin, 10, 55, 22, 'F')
                        doc.addImage(zdnLogoBase64, 'PNG', margin + 8, 12, 40, 18)
                    } catch (error) {
                        console.warn('Could not add ZDN logo:', error)
                    }
                }

                // Title with better styling - render as image for Unicode support
                const titleResult = await renderUnicodeText("Бүтээгдэхүүний танилцуулга", 20, '#FFFFFF', 'bold')
                if (titleResult.image) {
                    const titleWidth = 140
                    const titleHeight = 14
                    doc.addImage(titleResult.image, 'PNG', pageWidth - margin - titleWidth, 15, titleWidth, titleHeight)
                } else {
                    doc.setFontSize(20)
                    doc.setFont("helvetica", "bold")
                    doc.setTextColor(255, 255, 255)
                    doc.text("Product Information", pageWidth - margin, 25, { align: 'right' })
                }
                
                // Subtitle with count
                const countText = selectedProducts.size > 0 
                    ? `Сонгосон: ${productsToExport.length}`
                    : `Нийт: ${productsToExport.length}`
                const subtitleResult = await renderUnicodeText(countText, 10, '#E0E6F0', 'normal')
                if (subtitleResult.image) {
                    const scaleFactor = 0.75
                    const subtitleWidth = subtitleResult.width * scaleFactor
                    const subtitleHeight = subtitleResult.height * scaleFactor
                    doc.addImage(subtitleResult.image, 'PNG', pageWidth - margin - subtitleWidth, 33, subtitleWidth, subtitleHeight)
                } else {
                    doc.setFontSize(10)
                    doc.setFont("helvetica", "normal")
                    doc.setTextColor(220, 230, 240)
                    doc.text(countText, pageWidth - margin, 33, { align: 'right' })
                }
                
                yPosition = 50
            }

            // Add header to first page
            await addHeader()

            // Process each product - using same layout as detail page
            for (let index = 0; index < productsToExport.length; index++) {
                const product = productsToExport[index]
                
                // Check if we need a new page
                if (yPosition > pageHeight - 100) {
                    doc.addPage()
                    await addHeader()
                }

                // Product card section - two column layout (same as detail page)
                const cardStartY = yPosition
                const cardPadding = 15
                const imageColumnWidth = 120
                const textColumnWidth = contentWidth - imageColumnWidth - (cardPadding * 2)
                const imageX = margin + cardPadding
                const textX = imageX + imageColumnWidth + cardPadding

                // Load product image and brand logo
                let productImageBase64 = ''
                let brandLogoBase64 = ''
                
                if (product.image) {
                    try {
                        productImageBase64 = await loadImageAsBase64(product.image)
                    } catch (error) {
                        console.warn(`Could not load product image for ${product.code}:`, error)
                    }
                }
                
                if (product.brandLogo) {
                    try {
                        brandLogoBase64 = await loadImageAsBase64(product.brandLogo)
                    } catch (error) {
                        console.warn(`Could not load brand logo for ${product.brandName}:`, error)
                    }
                }

                // First, calculate all content heights to determine card height
                const imageSize = 110
                let calculatedCardY = cardStartY + cardPadding
                
                // Calculate heights for all elements - match detail page exactly
                const scaleFactor = 0.75
                const codeResult = await renderUnicodeText(product.code, 28, '#003366', 'bold')
                calculatedCardY += codeResult.image ? (codeResult.height * scaleFactor) + 6 : 22
                
                const nameResult = await renderUnicodeText(product.name, 16, '#1E1E1E', 'bold', textColumnWidth)
                calculatedCardY += nameResult.image ? (nameResult.height * scaleFactor) + 8 : 22
                
                calculatedCardY += 8 // Divider
                
                if (product.category?.name) {
                    const categoryValueResult = await renderUnicodeText(product.category.name, 11, '#003366', 'bold', textColumnWidth - 40)
                    const badgeHeight = Math.max(categoryValueResult.height * scaleFactor, 12)
                    calculatedCardY += badgeHeight + 4
                }
                
                if (product.brandName) {
                    const brandValueResult = await renderUnicodeText(product.brandName, 11, '#003366', 'bold', textColumnWidth - 35)
                    const badgeHeight = Math.max(brandValueResult.height * scaleFactor, 12)
                    calculatedCardY += badgeHeight + 4
                }
                
                if (brandLogoBase64) {
                    calculatedCardY += 30
                }
                
                // Don't include description in card height calculation - it will be below the card
                
                const finalCardHeight = Math.max(imageSize + 20, calculatedCardY - cardStartY) + cardPadding
                
                // Draw product card background FIRST (so content appears on top)
                doc.setFillColor(250, 252, 255)
                doc.rect(margin, cardStartY, contentWidth, finalCardHeight, 'F')
                doc.setDrawColor(220, 225, 230)
                doc.setLineWidth(0.8)
                doc.rect(margin, cardStartY, contentWidth, finalCardHeight, 'S')

                // Now draw all content on top of the background
                let cardY = cardStartY + cardPadding

                // Product image (left column)
                if (productImageBase64) {
                    try {
                        const imageY = cardY
                        // White background for image
                        doc.setFillColor(255, 255, 255)
                        doc.rect(imageX, imageY, imageSize + 10, imageSize + 10, 'F')
                        // Border
                        doc.setDrawColor(200, 205, 210)
                        doc.setLineWidth(0.5)
                        doc.rect(imageX, imageY, imageSize + 10, imageSize + 10, 'S')
                        // Product image
                        doc.addImage(productImageBase64, 'PNG', imageX + 5, imageY + 5, imageSize, imageSize)
                    } catch (error) {
                        console.warn(`Could not add product image to PDF:`, error)
                    }
                }

                // Product information (right column)
                // Product code - large and prominent (render as image for Unicode)
                if (codeResult.image) {
                    const codeHeight = codeResult.height * scaleFactor
                    const codeWidth = Math.min(codeResult.width * scaleFactor, textColumnWidth)
                    doc.addImage(codeResult.image, 'PNG', textX, cardY, codeWidth, codeHeight)
                    cardY += codeHeight + 6
                } else {
                    doc.setFontSize(28)
                    doc.setFont("helvetica", "bold")
                    doc.setTextColor(0, 51, 102)
                    doc.text(product.code, textX, cardY + 10)
                    cardY += 22
                }

                // Product name (render as image for Unicode)
                if (nameResult.image) {
                    const nameHeight = nameResult.height * scaleFactor
                    const nameWidth = Math.min(nameResult.width * scaleFactor, textColumnWidth)
                    doc.addImage(nameResult.image, 'PNG', textX, cardY, nameWidth, nameHeight)
                    cardY += nameHeight + 8
                } else {
                    doc.setFontSize(16)
                    doc.setFont("helvetica", "bold")
                    doc.setTextColor(30, 30, 30)
                    const fallbackNameLines = doc.splitTextToSize(product.name, textColumnWidth)
                    doc.text(fallbackNameLines, textX, cardY)
                    cardY += fallbackNameLines.length * 8 + 8
                }

                // Divider
                doc.setDrawColor(220, 225, 230)
                doc.setLineWidth(0.5)
                doc.line(textX, cardY, textX + textColumnWidth, cardY)
                cardY += 10

                // Category and Brand badges
                if (product.category?.name || product.brandName) {
                    if (product.category?.name) {
                        // Render category label and value as images for Unicode
                        const categoryLabelResult = await renderUnicodeText('Категори:', 11, '#646464', 'normal')
                        const categoryValueResult = await renderUnicodeText(product.category.name, 11, '#003366', 'bold', textColumnWidth - 40)
                        
                        const badgeHeight = Math.max(
                            categoryLabelResult.height * scaleFactor,
                            categoryValueResult.height * scaleFactor,
                            12
                        )
                        const badgeWidth = textColumnWidth
                        
                        doc.setFillColor(240, 245, 250)
                        doc.rect(textX, cardY, badgeWidth, badgeHeight + 3, 'F')
                        
                        if (categoryLabelResult.image) {
                            const labelHeight = categoryLabelResult.height * scaleFactor
                            const labelWidth = categoryLabelResult.width * scaleFactor
                            doc.addImage(categoryLabelResult.image, 'PNG', textX + 5, cardY + 1.5, labelWidth, labelHeight)
                        }
                        if (categoryValueResult.image && product.category.name) {
                            const valueHeight = categoryValueResult.height * scaleFactor
                            const valueWidth = Math.min(categoryValueResult.width * scaleFactor, badgeWidth - 45)
                            doc.addImage(categoryValueResult.image, 'PNG', textX + 38, cardY + 1.5, valueWidth, valueHeight)
                        }
                        cardY += badgeHeight + 4
                    }
                    
                    if (product.brandName) {
                        // Render brand label and value as images for Unicode
                        const brandLabelResult = await renderUnicodeText('Брэнд:', 11, '#646464', 'normal')
                        const brandValueResult = await renderUnicodeText(product.brandName, 11, '#003366', 'bold', textColumnWidth - 35)
                        
                        const badgeHeight = Math.max(
                            brandLabelResult.height * scaleFactor,
                            brandValueResult.height * scaleFactor,
                            12
                        )
                        const badgeWidth = textColumnWidth
                        
                        doc.setFillColor(240, 245, 250)
                        doc.rect(textX, cardY, badgeWidth, badgeHeight + 3, 'F')
                        
                        if (brandLabelResult.image) {
                            const labelHeight = brandLabelResult.height * scaleFactor
                            const labelWidth = brandLabelResult.width * scaleFactor
                            doc.addImage(brandLabelResult.image, 'PNG', textX + 5, cardY + 1.5, labelWidth, labelHeight)
                        }
                        if (brandValueResult.image && product.brandName) {
                            const valueHeight = brandValueResult.height * scaleFactor
                            const valueWidth = Math.min(brandValueResult.width * scaleFactor, badgeWidth - 40)
                            doc.addImage(brandValueResult.image, 'PNG', textX + 34, cardY + 1.5, valueWidth, valueHeight)
                        }
                        cardY += badgeHeight + 4
                    }
                }

                // Brand logo
                if (brandLogoBase64) {
                    try {
                        doc.addImage(brandLogoBase64, 'PNG', textX, cardY, 60, 30)
                        cardY += 32
                    } catch (error) {
                        console.warn(`Could not add brand logo to PDF:`, error)
                    }
                }

                yPosition = cardStartY + finalCardHeight + 20

                // Description section with same styling as detail page
                if (product.description) {
                    // Section header - render as image for Unicode
                    yPosition += 10
                    const sectionHeaderResult = await renderUnicodeText("Дэлгэрэнгүй мэдээлэл", 18, '#003366', 'bold')
                    if (sectionHeaderResult.image) {
                        const headerHeight = sectionHeaderResult.height * scaleFactor
                        const headerWidth = Math.min(sectionHeaderResult.width * scaleFactor, 130)
                        doc.addImage(sectionHeaderResult.image, 'PNG', margin, yPosition - 2, headerWidth, headerHeight)
                        yPosition += headerHeight + 10
                    } else {
                        doc.setFontSize(18)
                        doc.setFont("helvetica", "bold")
                        doc.setTextColor(0, 51, 102)
                        doc.text("Details", margin, yPosition)
                        yPosition += 12
                    }
                    
                    // Divider
                    doc.setDrawColor(0, 51, 102)
                    doc.setLineWidth(1)
                    doc.line(margin, yPosition, margin + 80, yPosition)
                    yPosition += 12

                    const desc = product.description
                    const hasStructure = desc.includes('Загвар:') || desc.includes('Техникийн') || desc.includes('Давуу талууд') || desc.includes('Стандарт') || desc.includes('•') || desc.includes('-')
                    
                    // Description container
                    const descStartY = yPosition
                    const descPadding = 12
                    
                    if (hasStructure) {
                        const lines = desc.split('\n')
                        let descY = descStartY + descPadding
                        
                        for (let i = 0; i < lines.length && descY < pageHeight - 50; i++) {
                            const line = lines[i].trim()
                            if (!line) {
                                descY += 4
                                continue
                            }
                            
                            // Section headers - render as image for Unicode
                            if (line.match(/^(Загвар:|Техникийн|Давуу талууд|Стандарт|Хүчдэл|Гүйдэл|Давтамж|Нарийвчлал|Температур|Хэмжээ|Жин)/)) {
                                descY += 6
                                // Background for section header
                                doc.setFillColor(245, 247, 250)
                                const headerTextWidth = contentWidth - (descPadding * 2)
                                const headerResult = await renderUnicodeText(line, 13, '#003366', 'bold', headerTextWidth)
                                const headerHeight = headerResult.height * scaleFactor
                                doc.rect(margin, descY - 4, contentWidth, Math.max(headerHeight + 4, 12), 'F')
                                
                                if (headerResult.image) {
                                    const headerWidth = Math.min(headerResult.width * scaleFactor, headerTextWidth)
                                    doc.addImage(headerResult.image, 'PNG', margin + descPadding, descY - 1, headerWidth, headerHeight)
                                    descY += headerHeight + 6
                                } else {
                                    doc.setFontSize(12)
                                    doc.setFont("helvetica", "bold")
                                    doc.setTextColor(0, 51, 102)
                                    const headerLines = doc.splitTextToSize(line, headerTextWidth)
                                    doc.text(headerLines, margin + descPadding, descY)
                                    descY += headerLines.length * 6 + 4
                                }
                            } 
                            // Bullet points - render as image for Unicode
                            else if (line.match(/^[•\-\*]\s/) || line.match(/^\d+\.\s/)) {
                                // Bullet point with better styling
                                doc.setFillColor(0, 51, 102)
                                doc.circle(margin + descPadding, descY - 1, 1.5, 'F')
                                
                                const bulletText = line.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '')
                                const bulletTextWidth = contentWidth - (descPadding * 2) - 8
                                const bulletResult = await renderUnicodeText(bulletText, 11, '#323232', 'normal', bulletTextWidth)
                                
                                if (bulletResult.image) {
                                    const bulletHeight = bulletResult.height * scaleFactor
                                    const bulletWidth = Math.min(bulletResult.width * scaleFactor, bulletTextWidth)
                                    doc.addImage(bulletResult.image, 'PNG', margin + descPadding + 5, descY - 1, bulletWidth, bulletHeight)
                                    descY += bulletHeight + 4
                                } else {
                                    doc.setFontSize(10)
                                    doc.setFont("helvetica", "normal")
                                    doc.setTextColor(50, 50, 50)
                                    const bulletLines = doc.splitTextToSize(bulletText, bulletTextWidth)
                                    doc.text(bulletLines, margin + descPadding + 5, descY)
                                    descY += bulletLines.length * 5 + 3
                                }
                            } 
                            // Regular text - render as image for Unicode
                            else {
                                const textWidth = contentWidth - (descPadding * 2)
                                const textResult = await renderUnicodeText(line, 11, '#464646', 'normal', textWidth)
                                
                                if (textResult.image) {
                                    const textHeight = textResult.height * scaleFactor
                                    const textImageWidth = Math.min(textResult.width * scaleFactor, textWidth)
                                    doc.addImage(textResult.image, 'PNG', margin + descPadding, descY - 1, textImageWidth, textHeight)
                                    descY += textHeight + 3
                                } else {
                                    doc.setFontSize(10)
                                    doc.setFont("helvetica", "normal")
                                    doc.setTextColor(70, 70, 70)
                                    const textLines = doc.splitTextToSize(line, textWidth)
                                    doc.text(textLines, margin + descPadding, descY)
                                    descY += textLines.length * 5 + 2
                                }
                            }
                            
                            if (descY > pageHeight - 60) {
                                // Draw description container before new page
                                const descHeight = descY - descStartY + descPadding
                                doc.setFillColor(255, 255, 255)
                                doc.rect(margin, descStartY, contentWidth, descHeight, 'F')
                                doc.setDrawColor(230, 235, 240)
                                doc.setLineWidth(0.5)
                                doc.rect(margin, descStartY, contentWidth, descHeight, 'S')
                                
                                doc.addPage()
                                await addHeader()
                                yPosition = margin + 10
                                descY = yPosition + descPadding
                                
                                // Redraw section header on new page
                                const newSectionHeaderResult = await renderUnicodeText("Дэлгэрэнгүй мэдээлэл", 18, '#003366', 'bold')
                                if (newSectionHeaderResult.image) {
                                    const headerHeight = newSectionHeaderResult.height * scaleFactor
                                    const headerWidth = Math.min(newSectionHeaderResult.width * scaleFactor, 130)
                                    doc.addImage(newSectionHeaderResult.image, 'PNG', margin, yPosition - 2, headerWidth, headerHeight)
                                    yPosition += headerHeight + 10
                                } else {
                                    doc.setFontSize(16)
                                    doc.setFont("helvetica", "bold")
                                    doc.setTextColor(0, 51, 102)
                                    doc.text("Details", margin, yPosition)
                                    yPosition += 10
                                }
                                doc.setDrawColor(0, 51, 102)
                                doc.setLineWidth(1)
                                doc.line(margin, yPosition, margin + 80, yPosition)
                                yPosition += 12
                                descY = yPosition + descPadding
                            }
                        }
                        
                        // Draw final description container
                        const descHeight = descY - descStartY + descPadding
                        doc.setFillColor(255, 255, 255)
                        doc.rect(margin, descStartY, contentWidth, descHeight, 'F')
                        doc.setDrawColor(230, 235, 240)
                        doc.setLineWidth(0.5)
                        doc.rect(margin, descStartY, contentWidth, descHeight, 'S')
                        
                        yPosition = descStartY + descHeight + 10
                    } else {
                        // Simple description in container - render as image for Unicode
                        const descTextWidth = contentWidth - (descPadding * 2)
                        const descResult = await renderUnicodeText(desc, 11, '#464646', 'normal', descTextWidth)
                        const descHeight = (descResult.height * scaleFactor) + (descPadding * 2)
                        
                        doc.setFillColor(255, 255, 255)
                        doc.rect(margin, descStartY, contentWidth, descHeight, 'F')
                        doc.setDrawColor(230, 235, 240)
                        doc.setLineWidth(0.5)
                        doc.rect(margin, descStartY, contentWidth, descHeight, 'S')
                        
                        if (descResult.image) {
                            const imageHeight = descResult.height * scaleFactor
                            const imageWidth = Math.min(descResult.width * scaleFactor, descTextWidth)
                            doc.addImage(descResult.image, 'PNG', margin + descPadding, descStartY + descPadding, imageWidth, imageHeight)
                        } else {
                            doc.setFontSize(11)
                            doc.setFont("helvetica", "normal")
                            doc.setTextColor(70, 70, 70)
                            const descLines = doc.splitTextToSize(desc, descTextWidth)
                            doc.text(descLines, margin + descPadding, descStartY + descPadding)
                        }
                        yPosition = descStartY + descHeight + 10
                    }
                } else {
                    yPosition += 10
                }

                // Add separator line between products (except last)
                if (index < productsToExport.length - 1) {
                    yPosition += 10
                    doc.setDrawColor(220, 220, 220)
                    doc.setLineWidth(0.5)
                    doc.line(margin + 10, yPosition, pageWidth - margin - 10, yPosition)
                    yPosition += 15
                }
            }

            // Footer with logo on all pages
            const totalPages = doc.getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i)
                
                // Footer line
                doc.setDrawColor(200, 200, 200)
                doc.setLineWidth(0.3)
                doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18)
                
                // Footer text - render as image for Unicode
                const footerText = `Хуудас ${i} / ${totalPages} | ${new Date().toLocaleDateString('mn-MN')}`
                const footerResult = await renderUnicodeText(footerText, 8, '#969696', 'normal')
                if (footerResult.image) {
                    const scaleFactor = 0.75
                    const footerHeight = footerResult.height * scaleFactor
                    const footerWidth = footerResult.width * scaleFactor
                    doc.addImage(footerResult.image, 'PNG', (pageWidth - footerWidth) / 2, pageHeight - 10, footerWidth, footerHeight)
                } else {
                    doc.setFontSize(8)
                    doc.setTextColor(150, 150, 150)
                    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' })
                }
                
                // ZDN logo in footer (small, on last page)
                if (zdnLogoBase64 && i === totalPages) {
                    try {
                        doc.addImage(zdnLogoBase64, 'PNG', pageWidth - margin - 35, pageHeight - 15, 30, 12)
                    } catch (error) {
                        console.warn('Could not add footer logo:', error)
                    }
                }
            }

            // Save the PDF - ensure it's a valid PDF and download correctly
            const timestamp = Date.now()
            const fileName = selectedProducts.size > 0 
                ? `selected-products-${timestamp}.pdf` 
                : `all-products-${timestamp}.pdf`
            
            // Get PDF as array buffer to verify it's valid
            const pdfArrayBuffer = doc.output('arraybuffer')
            
            // Verify PDF signature (PDF files must start with %PDF)
            const pdfHeader = new Uint8Array(pdfArrayBuffer.slice(0, 4))
            const pdfSignature = String.fromCharCode(...pdfHeader)
            
            if (!pdfSignature.startsWith('%PDF')) {
                console.error('ERROR: Generated file is not a valid PDF! Signature:', pdfSignature)
                toast.error("PDF үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.", { id: "pdf-export" })
                return
            }
            
            // Create blob with explicit PDF MIME type
            const pdfBlob = new Blob([pdfArrayBuffer], { 
                type: 'application/pdf'
            })
            
            // Verify blob type
            if (pdfBlob.type !== 'application/pdf') {
                console.error('ERROR: Blob type is incorrect:', pdfBlob.type)
                toast.error("PDF үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.", { id: "pdf-export" })
                return
            }
            
            // Create download using blob URL with explicit PDF extension
            const blobUrl = URL.createObjectURL(pdfBlob)
            const downloadLink = document.createElement('a')
            downloadLink.href = blobUrl
            
            // Ensure filename has .pdf extension and set it multiple ways
            const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
            downloadLink.download = cleanFileName
            downloadLink.setAttribute('download', cleanFileName)
            downloadLink.setAttribute('type', 'application/pdf')
            downloadLink.style.display = 'none'
            
            // Log for debugging
            console.log('Downloading PDF:', {
                fileName: cleanFileName,
                blobType: pdfBlob.type,
                blobSize: pdfBlob.size,
                pdfSignature: pdfSignature
            })
            
            // Append to body, trigger download, then remove
            document.body.appendChild(downloadLink)
            
            // Use both click methods to ensure download triggers
            if (downloadLink.click) {
                downloadLink.click()
            } else {
                // Fallback for older browsers
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                })
                downloadLink.dispatchEvent(event)
            }
            
            // Cleanup after a delay to ensure download starts
            setTimeout(() => {
                if (document.body.contains(downloadLink)) {
                    document.body.removeChild(downloadLink)
                }
                URL.revokeObjectURL(blobUrl)
            }, 200)
            
            toast.success(
                selectedProducts.size > 0
                    ? `${selectedProducts.size} бүтээгдэхүүний танилцуулга амжилттай татлаа`
                    : `${productsToExport.length} бүтээгдэхүүний танилцуулга амжилттай татлаа`,
                { id: "pdf-export" }
            )
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error("PDF үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.", { id: "pdf-export" })
        }
    }

    return (
        <div className="border p-4 lg:p-5 rounded-lg border-border bg-card" id="products">
            <div className="text-center mb-4 lg:mb-6 rounded-lg bg-gray-700 py-3 px-4 lg:pl-6 text-sm lg:text-md text-white">
                <h3>Бүтээгдэхүүний баруун доод булан дээр даран бүтээгдэхүүний танилцуулгыг татах боломжтой.</h3>
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
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDownload()
                            }}
                            className="w-full lg:w-auto rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {selectedProducts.size > 0 
                                ? `Танилцуулга татах (${selectedProducts.size})`
                                : "Танилцуулга татах"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground">
                        {selectedCategoryId 
                            ? "Энэ категорийн бүтээгдэхүүн байхгүй байна."
                            : selectedBrand 
                            ? "Энэ брэндийн бүтээгдэхүүн байхгүй байна."
                            : "Бүтээгдэхүүн олдсонгүй."}
                    </p>
                </div>
            )}
        </div>
    )
}