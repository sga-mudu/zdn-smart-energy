"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-4 md:py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/zdn-logo.svg"
            alt="ZDN Smart Energy - Газрын тосны лаборатори, тооны хяналт"
            width={120}
            height={50}
            className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 120px, 150px"
            quality={90}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link 
            href="/all-products" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 relative group py-2"
          >
            БҮТЭЭГДЭХҮҮН
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/news" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 relative group py-2"
          >
            МЭДЭЭЛЭЛ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="#contact" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 relative group py-2"
          >
            ХОЛБОО БАРИХ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <Button 
          variant="ghost" 
          size="icon-lg" 
          className="md:hidden text-gray-700 hover:text-blue-600 hover:bg-gray-100" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/all-products"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              БҮТЭЭГДЭХҮҮН
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              МЭДЭЭЛЭЛ
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              ХОЛБОО БАРИХ
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
