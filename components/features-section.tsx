"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { FlaskConical, Monitor, ArrowRight, Check } from "lucide-react"
import { track } from "@vercel/analytics/react"

interface Service {
  id: string
  icon: typeof FlaskConical
  title: string
  subtitle: string
  image: string
  overlayGradient: string
  features: string[]
  ctaText: string
  ctaLink: string
}

const services: Service[] = [
  {
    id: "lab-service",
    icon: FlaskConical,
    title: "LAB SERVICE",
    subtitle: "Тохируулга, баталгаажуулалт, калибрлэлтийн мэргэжлийн үйлчилгээ",
    image: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1200",
    overlayGradient: "from-blue-900/80 via-blue-800/70 to-cyan-900/80",
    features: [
      "Тохируулга, калибрлэлтийн мэргэжлийн үйлчилгээ",
      "ISO стандартын дагуу баталгаажуулалт",
      "Тоног төхөөрөмжийн засвар, үйлчилгээ",
    ],
    ctaText: "Холбоо барих",
    ctaLink: "#contact",
  },
  {
    id: "monitoring-service",
    icon: Monitor,
    title: "MONITORING SERVICE",
    subtitle: "Бодит цагт хяналт, шинжилгээ, тайлангийн систем",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
    overlayGradient: "from-cyan-900/80 via-teal-800/70 to-blue-900/80",
    features: [
      "Бодит цагт хяналт, шинжилгээний систем",
      "Автомат тайлан, мэдэгдэл",
      "Ухаалаг шинжилгээ, урьдчилан таамаглал",
    ],
    ctaText: "Үнэ авах",
    ctaLink: "#contact",
  },
]

export default function FeaturesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const handleMouseEnter = (serviceId: string) => {
    setHoveredId(serviceId)
    track("service_hover", { service: serviceId })
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
  }

  const handleCtaClick = (serviceId: string, ctaText: string) => {
    track("service_cta_click", {
      service: serviceId,
      cta_text: ctaText,
    })
  }

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            ҮЙЛЧИЛГЭЭ
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Services Grid with Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredId === service.id
            const delay = index * 150

            return (
              <div
                key={service.id}
                className={`group relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden transition-all duration-1000 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
                onMouseEnter={() => handleMouseEnter(service.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                  />
                </div>

                {/* Gradient Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${service.overlayGradient} transition-opacity duration-500 ${
                    isHovered ? 'opacity-90' : 'opacity-70'
                  }`}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10">
                  {/* Top Section - Icon and Title */}
                  <div>
                    <div 
                      className={`inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-md mb-6 transition-all duration-500 ${
                        isHovered ? 'scale-110 rotate-6 bg-white/30' : 'scale-100 rotate-0'
                      }`}
                    >
                      <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                    </div>
                    
                    <h3 
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 transition-all duration-500 ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-100'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p 
                      className={`text-base sm:text-lg text-white/90 leading-relaxed transition-all duration-500 ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                      }`}
                    >
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Bottom Section - Features and CTA (appears on hover) */}
                  <div 
                    className={`transition-all duration-500 ${
                      isHovered 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-8 opacity-0'
                    }`}
                  >
                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li 
                          key={idx}
                          className="flex items-start gap-3"
                          style={{
                            transitionDelay: `${idx * 50}ms`,
                            transform: isHovered ? 'translateX(0)' : 'translateX(-20px)',
                            opacity: isHovered ? 1 : 0,
                            transition: 'all 0.3s ease-out'
                          }}
                        >
                          <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm sm:text-base text-white leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <a
                      href={service.ctaLink}
                      onClick={() => handleCtaClick(service.id, service.ctaText)}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 border border-white/30 hover:border-white/50 ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: '200ms'
                      }}
                    >
                      {service.ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div 
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium transition-all duration-300 ${
                    isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                >
                  Ховер хийж дэлгэрэнгүй үзнэ үү
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
