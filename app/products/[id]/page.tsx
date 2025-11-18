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
import jsPDF from "jspdf"
import { toast } from "sonner"

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

  // Helper function to load image as base64
  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
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
      img.onerror = () => resolve('')
      img.src = imageUrl
    })
  }

  const handleDownload = async () => {
    if (!product) return
    
    toast.loading("PDF бэлдэж байна...", { id: "pdf-export" })

    try {
      // Load images
      let productImageBase64 = ''
      let brandLogoBase64 = ''
      let zdnLogoBase64 = ''

      if (product.image) {
        try {
          productImageBase64 = await loadImageAsBase64(product.image)
        } catch (error) {
          console.warn('Could not load product image:', error)
        }
      }

      if (product.brandLogo) {
        try {
          brandLogoBase64 = await loadImageAsBase64(product.brandLogo)
        } catch (error) {
          console.warn('Could not load brand logo:', error)
        }
      }

      try {
        zdnLogoBase64 = await loadImageAsBase64('/zdn-logo.png')
      } catch (error) {
        console.warn('Could not load ZDN logo:', error)
      }

      // Create PDF
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      let yPosition = margin

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
        // Fallback
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(255, 255, 255)
        doc.text("Product Information", pageWidth - margin, 25, { align: 'right' })
      }
      
      // Subtitle
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(220, 230, 240)
      doc.text("Product Information", pageWidth - margin, 33, { align: 'right' })
      
      yPosition = 50

      // Product card section - two column layout
      const cardStartY = yPosition
      const cardPadding = 15
      const imageColumnWidth = 120
      const textColumnWidth = contentWidth - imageColumnWidth - (cardPadding * 2)
      const imageX = margin + cardPadding
      const textX = imageX + imageColumnWidth + cardPadding

      // Helper to convert canvas pixels to PDF points
      // Canvas renders at device pixel ratio, PDF uses 72 DPI
      // For better accuracy: 1 canvas pixel ≈ 0.264583 mm, 1 PDF point = 0.352778 mm
      // So: 1 canvas pixel ≈ 0.75 PDF points (but we need to account for actual rendering)
      // Using a more accurate conversion based on typical browser rendering
      const pxToPt = (px: number) => px * (72 / 96) // 96 DPI screen to 72 DPI PDF

      // First, calculate all content heights to determine card height
      const imageSize = 110
      let calculatedCardY = cardStartY + cardPadding
      
      // Calculate heights for all elements
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
          console.warn('Could not add product image:', error)
        }
      }

      // Product information (right column)
      // Product code - large and prominent (render as image for Unicode)
      if (codeResult.image) {
        // Scale down from canvas pixels to PDF points more accurately
        const scaleFactor = 0.75 // Canvas to PDF scale
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
        const scaleFactor = 0.75
        const nameHeight = nameResult.height * scaleFactor
        const nameWidth = Math.min(nameResult.width * scaleFactor, textColumnWidth)
        doc.addImage(nameResult.image, 'PNG', textX, cardY, nameWidth, nameHeight)
        cardY += nameHeight + 8
      } else {
        // Fallback if Unicode rendering fails
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
          
          const scaleFactor = 0.75
          const badgeHeight = Math.max(
            categoryLabelResult.height * scaleFactor,
            categoryValueResult.height * scaleFactor,
            12
          )
          const badgeWidth = textColumnWidth
          
          doc.setFillColor(240, 245, 250)
          doc.rect(textX, cardY, badgeWidth, badgeHeight + 3, 'F')
          
          if (categoryLabelResult.image) {
            const scaleFactor = 0.75
            const labelHeight = categoryLabelResult.height * scaleFactor
            const labelWidth = categoryLabelResult.width * scaleFactor
            doc.addImage(categoryLabelResult.image, 'PNG', textX + 5, cardY + 1.5, labelWidth, labelHeight)
          }
          if (categoryValueResult.image && product.category.name) {
            const scaleFactor = 0.75
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
          
          const scaleFactor = 0.75
          const badgeHeight = Math.max(
            brandLabelResult.height * scaleFactor,
            brandValueResult.height * scaleFactor,
            12
          )
          const badgeWidth = textColumnWidth
          
          doc.setFillColor(240, 245, 250)
          doc.rect(textX, cardY, badgeWidth, badgeHeight + 3, 'F')
          
          if (brandLabelResult.image) {
            const scaleFactor = 0.75
            const labelHeight = brandLabelResult.height * scaleFactor
            const labelWidth = brandLabelResult.width * scaleFactor
            doc.addImage(brandLabelResult.image, 'PNG', textX + 5, cardY + 1.5, labelWidth, labelHeight)
          }
          if (brandValueResult.image && product.brandName) {
            const scaleFactor = 0.75
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
          console.warn('Could not add brand logo:', error)
        }
      }

      yPosition = cardStartY + finalCardHeight + 20

      // Description section with better formatting
      if (product.description) {
        // Section header - render as image for Unicode
        yPosition += 10
        const sectionHeaderResult = await renderUnicodeText("Дэлгэрэнгүй мэдээлэл", 18, '#003366', 'bold')
        if (sectionHeaderResult.image) {
          const scaleFactor = 0.75
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
              const scaleFactor = 0.75
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
                const scaleFactor = 0.75
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
                const scaleFactor = 0.75
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
              yPosition = margin + 10
              descY = yPosition + descPadding
              
              // Redraw section header on new page
              const newSectionHeaderResult = await renderUnicodeText("Дэлгэрэнгүй мэдээлэл", 18, '#003366', 'bold')
              if (newSectionHeaderResult.image) {
                const scaleFactor = 0.75
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
          const scaleFactor = 0.75
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
      }

      // Footer with logo on all pages
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        
        // Footer line
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18)
        
        // Footer text
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Хуудас ${i} / ${totalPages} | ${new Date().toLocaleDateString('mn-MN')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
        
        // ZDN logo in footer (small, on last page)
        if (zdnLogoBase64 && i === totalPages) {
          try {
            doc.addImage(zdnLogoBase64, 'PNG', pageWidth - margin - 35, pageHeight - 15, 30, 12)
          } catch (error) {
            console.warn('Could not add footer logo:', error)
          }
        }
      }

      // Save PDF
      const fileName = `${product.code}-${product.name.replace(/\s+/g, "-")}.pdf`
      const pdfArrayBuffer = doc.output('arraybuffer')
      
      // Verify PDF signature
      const pdfHeader = new Uint8Array(pdfArrayBuffer.slice(0, 4))
      const pdfSignature = String.fromCharCode(...pdfHeader)
      
      if (!pdfSignature.startsWith('%PDF')) {
        console.error('ERROR: Generated file is not a valid PDF!')
        toast.error("PDF үүсгэхэд алдаа гарлаа.", { id: "pdf-export" })
        return
      }

      const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
      setTimeout(() => {
    document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }, 100)

      toast.success("Бүтээгдэхүүний танилцуулга амжилттай татлаа", { id: "pdf-export" })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error("PDF үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.", { id: "pdf-export" })
    }
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
                      <div className="pt-2 border-t border-gray-100 min-h-[1.5rem]">
                        {relatedProduct.brandLogo ? (
                          <Image
                            src={relatedProduct.brandLogo}
                            alt={relatedProduct.brandName || "Brand"}
                            width={60}
                            height={30}
                            className="h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="h-5" aria-hidden="true" />
                        )}
                      </div>
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


