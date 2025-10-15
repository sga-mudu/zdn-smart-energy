"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const slides = [
  {
    image: "/wind-turbines-blue-sky.jpg",
    title: "САЛХИНЫ ЭРЧИМ ХҮЧ",
    description:
      "Дэлхийн тэргүүн дээр явагч цацраг хэмх үүс хэмжээгээр тусгайн үйлдвэр-тавилгын үүрэн эрчим хүчний үүлдвэр хэмжээгээр шилжих үзэгдэл болсон бөгөөд үүнийг үүх тавилгын салхи тэж нээлттэй.",
  },
  {
    image: "/renewable-energy-solar-panels.jpg",
    title: "НАРНЫ ЭРЧИМ ХҮЧ",
    description:
      "Нарны эрчим хүчний технологи нь байгаль орчинд ээлтэй, цэвэр эрчим хүчний эх үүсвэр бөгөөд ирээдүйн эрчим хүчний шийдэл юм.",
  },
  {
    image: "/green-energy-technology.jpg",
    title: "НОГООН ТЕХНОЛОГИ",
    description: "Дэвшилтэт ногоон технологи ашиглан байгаль орчныг хамгаалж, тогтвортой хөгжлийг дэмжиж байна.",
  },
]

export default function WindEnergySection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[280px] sm:h-[320px] md:h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-105 translate-x-8"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />

          <div
            className={`absolute top-6 sm:top-8 md:top-12 right-3 sm:right-4 md:right-16 max-w-[280px] sm:max-w-md md:max-w-xl text-white text-right transition-all duration-700 delay-200 ${
              index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 text-balance leading-tight">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-pretty">{slide.description}</p>
          </div>

          <div
            className={`absolute bottom-10 sm:bottom-12 md:bottom-16 right-3 sm:right-4 md:right-16 transition-all duration-700 delay-300 ${
              index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#"
              className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-white hover:underline"
            >
              ЦААШ УНШИХ
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      ))}

      {/* Carousel indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-white w-8 md:w-8 h-2 md:h-2"
                : "bg-white/50 hover:bg-white/75 w-2 h-2 md:w-2 md:h-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
