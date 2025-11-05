"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-0 py-3 md:py-1 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/zdn-logo.png"
            alt="ZDN Smart Energy"
            width={120}
            height={50}
            className="h-10 md:h-15 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link href="/all-products" className="text-sm text-foreground transition-transform duration-300 hover:scale-115">
            БҮТЭЭГДЭХҮҮН
          </Link>
          <Link href="#about" className="text-sm text-foreground transition-transform duration-300 hover:scale-115">
            МЭДЭЭЛЭЛ
          </Link>
          <Link href="#contact" className="text-sm text-foreground transition-transform duration-300 hover:scale-115">
            ХОЛБОО БАРИХ
          </Link>
        </nav>

        <Button variant="ghost" size="icon-lg" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-10 h-10" /> : <Menu className="w-10 h-10" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/all-products"
              className="text-sm text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              БҮТЭЭГДЭХҮҮН
            </Link>
            <Link
              href="#about"
              className="text-sm text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              МЭДЭЭЛЭЛ
            </Link>
            <Link
              href="#contact"
              className="text-sm text-foreground hover:text-primary transition-colors py-2"
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
