"use client"

import { Building2, Users, Award, TrendingUp, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { icon: Building2, value: "2016", label: "Эхэлсэн он", delay: "0" },
    { icon: Users, value: "10+", label: "Хамтрагч компани", delay: "100" },
    { icon: Award, value: "100+", label: "Бүтээгдэхүүн", delay: "200" },
    { icon: TrendingUp, value: "24/7", label: "Дэмжлэг", delay: "300" },
  ]

  const partners = [
    "2PA SMART ENERGY",
    "CALMET",
    "SAUTER",
    "OKONDT GROUP",
    "GNORIT ELECTRICAL",
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden" 
      id="about"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => {
          const delay = i * 0.3
          const duration = 5 + (i % 3) * 2
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full blur-sm animate-float"
              style={{
                left: `${15 + (i % 3) * 30}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            />
          )
        })}
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
              БИДНИЙ ТУХАЙ
            </h2>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="space-y-8 md:space-y-10">
            {/* Introduction Card */}
            <div 
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200/50 transition-all duration-700 hover:shadow-2xl hover:scale-[1.01] ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-6">
                <div className="flex-shrink-0 w-1 h-12 sm:h-16 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full animate-pulse"></div>
                <div className="flex-grow">
                  <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                    <span className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ ХХК</span> нь <span className="font-semibold text-blue-600">2016 оноос</span> үйл ажиллаа явуулж, хэмжүүрүүлэлт, хэмжилийн техник хэрэгсэл, тоног төхөөрөмж, шинэ үйлдвэрлэл нэвтрүүлэх хэмжилт бодит.
                  </p>
                </div>
              </div>
            </div>

            {/* Partners Section */}
            <div 
              className={`bg-gradient-to-br from-blue-50/50 to-cyan-50/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-blue-100/50 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                  Албан ёсны төлөөлөгч компаниуд
                </h3>
                <p className="text-sm sm:text-base text-gray-600 ml-4">
                  Бид дараах дэлхийн тэргүүн үйлдвэрлэгч компаниудын Монгол улс дахь <span className="font-semibold text-blue-600">албан ёсны төлөөлөгчөөр</span> ажиллаж байна:
                </p>
              </div>

              {/* Partners List - Enhanced Design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {partners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Animated dot */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 group-hover:bg-cyan-600 transition-all duration-300"></div>
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-400 group-hover:animate-ping opacity-0 group-hover:opacity-75"></div>
                    </div>
                    
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors relative z-10">
                      {partner}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Card */}
            <div 
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-gray-200/50 transition-all duration-700 hover:shadow-2xl hover:scale-[1.01] ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-1 h-12 sm:h-16 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="flex-grow">
                  <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                    Бид <span className="font-semibold text-gray-900">БНХАУ-ын</span> бүх төрлийн цахилгаан төхөөрөмж, усалгааны систем, усалгааны төхөөрөмж, цахилгаан эрчим хүчний хэмжилт, хяналт, тоолуур үйлдвэрлэгч компаниудтай хамтран ажиллаж байна.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 md:p-8 text-center shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-110 border border-gray-100 group relative overflow-hidden"
                style={{
                  transitionDelay: `${stat.delay}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon container with enhanced animation */}
                <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-3 sm:mb-4 group-hover:from-blue-200 group-hover:to-cyan-200 group-hover:scale-110 transition-all duration-500 mx-auto">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 group-hover:text-blue-700 group-hover:rotate-12 transition-all duration-500" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Value with counter animation */}
                <div className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="relative z-10 text-xs sm:text-sm md:text-base text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
