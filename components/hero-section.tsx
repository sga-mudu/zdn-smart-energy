"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const heroSlides = [
    {
      image: "./brand-homepage-background1.jpg",
      title: "ХЭМЖИЛТ, ХЯНАЛТЫН ТОНОГ ТӨХӨӨРӨМЖ",
      subtitle: "Дэлхийн тэргүүн чанартай хэмжилтийн техник хэрэгсэл",
      cta: "БҮТЭЭГДЭХҮҮН ҮЗЭХ",
      link: "/all-products"
    },
    {
      image: "./brand-homepage-background2.jpg",
      title: "ЦАХИЛГААН ЭРЧИМ ХҮЧНИЙ ШИЙДЛҮҮД",
      subtitle: "Тогтвортой, найдвартай эрчим хүчний системийн тоног төхөөрөмж",
      cta: "МЭДЛЭГ АВАХ",
      link: "/news"
    },
    {
      image: "./brand-homepage-background3.jpg",
      title: "ТОНОГ ТӨХӨӨРӨМЖИЙН ШИНЭЧЛЭЛ",
      subtitle: "Хамгийн сүүлийн үеийн технологиудын нэгдэл",
      cta: "ХОЛБОО БАРИХ",
      link: "#contact"
    },
  ]

  const totalSlides = heroSlides.length

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [totalSlides, isPaused])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  return (
    <section 
      className="relative h-[450px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images with overlay */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            currentSlide === index 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="max-w-2xl">
            {heroSlides.map((slide, index) => {
              const isActive = currentSlide === index
              return (
                <div
                  key={index}
                  className={`${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none absolute"
                  } transition-opacity duration-500 ease-in-out`}
                >
                  <div
                    className={`${
                      isActive
                        ? "translate-x-0"
                        : "-translate-x-8"
                    } transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-100`}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                  </div>
                  <div
                    className={`${
                      isActive
                        ? "translate-x-0"
                        : "-translate-x-8"
                    } transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-200`}
                  >
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-8 max-w-xl leading-relaxed drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </div>
                  <div
                    className={`${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-8 opacity-0"
                    } transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-300`}
                  >
                    <Link href={slide.link}>
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 md:px-8 py-6 md:py-7 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-200 hover:scale-110 border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-200 hover:scale-110 border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-white w-10 md:w-12 h-2 md:h-3"
                : "bg-white/50 hover:bg-white/75 w-2 md:w-3 h-2 md:h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
