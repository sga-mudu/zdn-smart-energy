"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Brand {
    id: string
    name: string
    subtitle?: string | null
    logo: string | null
    productCount: number
}

interface BrandSectionProps {
    onBrandSelect?: (brandId: string | null) => void
    selectedBrand?: string | null
}

export function BrandSection({ onBrandSelect, selectedBrand }: BrandSectionProps) {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [itemsToShow, setItemsToShow] = useState(1)

    // Fetch brands from database
    useEffect(() => {
        fetch("/api/brands")
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}))
                    const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${res.status}`
                    throw new Error(errorMessage)
                }
                return res.json()
            })
            .then((data) => {
                // Ensure data is an array
                if (Array.isArray(data)) {
                    // Map API data to component format
                    const mappedBrands = data.map((brand: any) => ({
                        id: brand.name, // Use name as ID for filtering
                        name: brand.name,
                        subtitle: brand.description || "Европ чанар",
                        logo: brand.logo,
                        productCount: brand.productCount || 0
                    }))
                    setBrands(mappedBrands)
                } else {
                    console.error("Invalid brands data:", data)
                    setBrands([])
                }
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching brands:", error)
                setBrands([])
                setLoading(false)
            })
    }, [])

    const handleBrandClick = (brandId: string) => {
        if (onBrandSelect) {
            // Toggle: if clicking the same brand, deselect it
            const newSelection = selectedBrand === brandId ? null : brandId
            if (process.env.NODE_ENV === 'development') {
                console.log('Brand clicked:', { brandId, newSelection, previousSelection: selectedBrand })
            }
            onBrandSelect(newSelection)
        }
    }

    // Update items to show based on screen size
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth >= 1024) {
                setItemsToShow(4) // Desktop - not used in carousel but for calculation
            } else if (window.innerWidth >= 640) {
                setItemsToShow(2) // Tablet - show 2 brands
            } else {
                setItemsToShow(1) // Mobile - show 1 brand
            }
        }

        updateItemsToShow()
        window.addEventListener('resize', updateItemsToShow)

        return () => window.removeEventListener('resize', updateItemsToShow)
    }, [])

    // Auto-rotate brands every 3 seconds (mobile/tablet only)
    useEffect(() => {
        if (!isAutoPlaying || itemsToShow >= 4 || brands.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + itemsToShow
                return nextIndex >= brands.length ? 0 : nextIndex
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, itemsToShow, brands.length])

    const nextBrand = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + itemsToShow
            return nextIndex >= brands.length ? 0 : nextIndex
        })
        setIsAutoPlaying(false)
    }

    const prevBrand = () => {
        setCurrentIndex((prevIndex) => {
            const prevIndexNew = prevIndex - itemsToShow
            return prevIndexNew < 0 ? brands.length - itemsToShow : prevIndexNew
        })
        setIsAutoPlaying(false)
    }

    const goToBrand = (index: number) => {
        setCurrentIndex(index * itemsToShow)
        setIsAutoPlaying(false)
    }

    // Resume auto-play after 10 seconds of no interaction
    useEffect(() => {
        if (!isAutoPlaying && itemsToShow < 4) {
            const timeout = setTimeout(() => {
                setIsAutoPlaying(true)
            }, 10000)

            return () => clearTimeout(timeout)
        }
    }, [isAutoPlaying, itemsToShow])

    // Get current brands to display
    const getCurrentBrands = () => {
        if (brands.length === 0) return []
        const currentBrands = []
        for (let i = 0; i < itemsToShow; i++) {
            const index = (currentIndex + i) % brands.length
            currentBrands.push(brands[index])
        }
        return currentBrands
    }

    // Calculate total slides for dot indicators
    const totalSlides = brands.length === 0 ? 0 : Math.ceil(brands.length / itemsToShow)

    // Calculate current slide index for dot indicators
    const currentSlide = brands.length === 0 ? 0 : Math.floor(currentIndex / itemsToShow)

    return (
        <div className="mb-6 lg:mb-8 rounded-lg border p-4 lg:p-5 border-border bg-card">
            <h2 className="mb-4 lg:mb-6 text-xl lg:text-2xl font-bold uppercase tracking-wide text-muted-foreground text-center lg:text-left">
                БРЭНДҮҮД
            </h2>

            {loading ? (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground">Брэндууд ачаалж байна...</p>
                </div>
            ) : brands.length === 0 ? (
                <div className="py-8 text-center">
                    <p className="text-muted-foreground">Брэнд олдсонгүй.</p>
                </div>
            ) : (
                <>
                    {/* Mobile/Tablet Carousel (hidden on desktop) */}
            <div className="lg:hidden relative">
                {/* Navigation Arrows */}
                <button
                    onClick={prevBrand}
                    className="absolute -left-4 top-1/3 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all"
                    aria-label="Previous brand"
                >
                    <ChevronLeft className="h-4 w-4 sm:h-7 sm:w-7" />
                </button>

                <button
                    onClick={nextBrand}
                    className="absolute -right-4 top-1/3 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all"
                    aria-label="Next brand"
                >
                    <ChevronRight className="h-4 w-4 sm:h-7 sm:w-7" />
                </button>

                {/* Current Brands Display */}
                <div className={`flex justify-center gap-3 ${itemsToShow === 2 ? 'max-w-2xl mx-auto' : 'max-w-md mx-auto'
                    }`}>
                    {getCurrentBrands().map((brand, index) => (
                        <Card
                            key={`${brand.id}-${currentIndex + index}`}
                            onClick={() => handleBrandClick(brand.id)}
                            className={`flex flex-row cursor-pointer items-center gap-3 rounded-lg p-3 transition-all hover:bg-accent/50 ${selectedBrand === brand.id ? 'bg-primary/10 border-primary' : ''} ${itemsToShow === 2 ? 'flex-1 min-w-0' : 'w-full'
                                }`}
                        >
                            <div className={`flex flex-shrink-0 items-center justify-center ${itemsToShow === 2 ? 'h-12 w-16' : 'h-16 w-24'
                                }`}>
                                <Image
                                    src={brand.logo || "/placeholder.svg"}
                                    alt={brand.name}
                                    width={itemsToShow === 2 ? 64 : 96}
                                    height={itemsToShow === 2 ? 48 : 64}
                                    className="object-contain"
                                    sizes="(max-width: 640px) 96px, 64px"
                                    quality={90}
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex flex-col mx-auto gap-3 items-center justify-between min-w-0">
                                <div className="text-left min-w-0">
                                    <h3 className={`font-bold text-foreground truncate ${itemsToShow === 2 ? 'text-xs' : 'text-sm'
                                        }`}>
                                        {brand.name}
                                    </h3>
                                    <p className={`text-muted-foreground ${itemsToShow === 2 ? 'text-xs' : 'text-xs'
                                        }`}>
                                        {brand.subtitle}
                                    </p>
                                </div>
                                <div className={`flex items-center justify-center rounded-full bg-muted flex-shrink-0 ${itemsToShow === 2 ? 'h-8 w-8 ml-2' : 'h-10 w-10'
                                    }`}>
                                    <span className={`font-semibold text-muted-foreground ${itemsToShow === 2 ? 'text-xs' : 'text-sm'
                                        }`}>
                                        {brand.productCount}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToBrand(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? "bg-primary w-6"
                                : "bg-muted w-2 hover:bg-muted-foreground"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

            </div>

            {/* Desktop Grid Layout (hidden on mobile/tablet) */}
            <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-4">
                {brands.map((brand) => (
                    <Card
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.id)}
                        className={`flex flex-row m-2 cursor-pointer items-center gap-4 rounded-lg p-3 transition-all hover:bg-accent/50 ${selectedBrand === brand.id ? 'bg-primary/10 border-primary' : ''}`}
                    >
                        <div className="flex h-12 w-30 flex-shrink-0 items-center justify-center">
                            <Image
                                src={brand.logo || "/placeholder.svg"}
                                alt={brand.name}
                                width={100}
                                height={60}
                                className="object-contain"
                                sizes="100px"
                                quality={90}
                                loading="lazy"
                            />
                        </div>
                        <div className="grid gap-3 items-center">
                            <div className="text-left">
                                <h3 className="text-sm font-bold text-foreground">{brand.name}</h3>
                                <p className="text-xs text-muted-foreground">{brand.subtitle}</p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <span className="text-sm font-semibold text-muted-foreground">{brand.productCount}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
                </>
            )}
        </div>
    )
}