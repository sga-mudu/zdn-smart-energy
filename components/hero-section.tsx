"use client"

import { useState, useEffect } from "react"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    "./brand-homepage-background1.jpg",
    "./brand-homepage-background2.jpg",
    "./brand-homepage-background3.jpg",
  ]

  const totalSlides = heroImages.length

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(timer)
  }, [totalSlides])

  return (
    <section className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[700px] 2xl:h-[600px] overflow-hidden bg-white w-full">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Hero slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${currentSlide === index ? "bg-gray-800 w-8 md:w-10" : "bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
