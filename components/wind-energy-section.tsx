"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string | null
  image: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export default function WindEnergySection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch last 5 news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news?published=true")
        if (response.ok) {
          const data = await response.json()
          // Handle both array and response object formats
          let newsData: NewsArticle[] = []
          if (Array.isArray(data)) {
            newsData = data
          } else if (data && Array.isArray(data.news)) {
            newsData = data.news
          } else if (data && Array.isArray(data.data)) {
            newsData = data.data
          }
          // Get last 5 news articles
          setNews(newsData.slice(0, 5))
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Convert news to slides format
  const slides = news.map((article) => ({
    id: article.id,
    image: article.image || "/wind-turbines-blue-sky.jpg",
    title: article.title,
    description: article.excerpt || article.content.substring(0, 200) + "...",
    link: `/news/${article.id}`,
  }))

  // Reset current slide when news changes
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0)
    }
  }, [slides.length, currentSlide])

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused || slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  const goToSlide = (index: number) => {
    if (slides.length > 0) {
      setCurrentSlide(index)
    }
  }

  const goToPrevious = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  const goToNext = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }
  }

  // Don't render if loading or no news
  if (loading) {
    return (
      <section className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading news...</p>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <section 
      className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="max-w-2xl ml-auto text-right">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`transition-all duration-700 ease-out ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 translate-x-0"
                    : "opacity-0 translate-y-8 translate-x-8 pointer-events-none absolute"
                }`}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-8 leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
                <Link href={slide.link}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 hover:border-white text-white px-6 md:px-8 py-6 md:py-7 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group"
                  >
                    ЦААШ УНШИХ
                    <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
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

      {/* Carousel indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
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
