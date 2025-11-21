"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { FlaskConical, Monitor, ArrowRight, Check, ArrowLeft, X } from "lucide-react"
import { track } from "@vercel/analytics/react"

interface AnalysisType {
  category: string
  items: string[]
}

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
  details: {
    description: string
    fullDescription: string
    certification?: string
    serviceTypes?: string[]
    analysisTypes?: AnalysisType[]
    serviceScope?: string[]
    controlServiceTypes?: string[]
    pricing?: {
      service: string
      price: string
      note?: string
    }
    contact?: {
      phone?: string[]
      email?: string[]
      address?: string
    }
  }
}

const services: Service[] = [
  {
    id: "lab-service",
    icon: FlaskConical,
    title: "ЛАБОРАТОРИ",
    subtitle: "Газрын тос, газрын тосны бүтээгдэхүүний сорилтын лаборатори",
    image: "https://images.pexels.com/photos/3912364/pexels-photo-3912364.jpeg",
    overlayGradient: "from-blue-900/80 via-blue-800/70 to-cyan-900/80",
    features: [
      "Автобензин",
      "Дизель түлш",
      "Түүхий нефть",
      "Хөргөлтийн шингэн, тос тосолгооны материал",
    ],
    ctaText: "Дэлгэрэнгүй мэдээлэл",
    ctaLink: "#contact",
    details: {
      description: "Газрын тос, газрын тосны бүтээгдэхүүний сорилтын лаборатори",
      certification: "MNS ISO/IEC 17025:2018 итгэмжлэгдсэн",
      fullDescription: "Лаборатори нь үндэсний болон импортын газрын тос, газрын тосны бүтээгдэхүүнд батлагдсан арга аргачлалын дагуу чанарын өндөр түвшинд шинжилгээ хийж, хэрэглэгчдэд үнэн зөв, найдвартай үр дүн гарган хүргэдэг.",
      serviceTypes: [
        "Автобензин",
        "Дизель түлш",
        "Түүхий нефть",
        "Хөргөлтийн шингэн, тос тосолгооны материал",
      ],
      analysisTypes: [
        {
          category: "Автобензин",
          items: [
            "Октан тоо",
            "Найрлагын бүрэлдэхүүн",
            "Хувийн жин",
            "Ус, чийг",
            "Механик хольц",
            "Нийт хүхрийн хэмжээ",
            "Өнгө",
            "Зэс хавтгайн туршилт",
            "Ханаасан уурын даралт",
          ],
        },
        {
          category: "Дизель түлш",
          items: [
            "Цетан тоо",
            "Найрлагын бүрэлдэхүүн",
            "Хувийн жин",
            "Ус, чийг",
            "Кинематик зуурамтгай чанар",
            "Дөл үүсэх температур",
            "Булингартах, царцах температур",
            "Шугамдах хэмийн хязгаар",
            "Механик хольц",
            "Нийт хүхрийн хэмжээ",
            "Өнгө",
            "Зэс хавтгайн туршилт",
            "Анилины цэг",
          ],
        },
        {
          category: "Түүхий нефть",
          items: [
            "Хувийн жин",
            "Ус, чийг",
            "Механик хольц",
            "Нийт хүхрийн хэмжээ",
            "Кинематик зуурамтгай чанар",
            "Царцах температур",
            "Ноцож асах температур",
          ],
        },
        {
          category: "Хөргөлтийн шингэн, тос тосолгооны материал",
          items: [
            "Хувийн жин",
            "Механик хольц",
            "Өнгө",
            "Усны агууламж",
            "Булингартал, царцах цэг",
            "Кинематик зуурамтгай чанар",
            "Дөл үүсэх температур",
          ],
        },
      ],
      contact: {
        phone: ["+976-9913-6635", "+976-9996-9896"],
        email: ["monkhr@yahoo.com", "b.ninjee92@gmail.com"],
        address: "Улаанбаатар хот, БЗД, 4-р хороо, МУИС – Улаанбаатар Парк, 1-р давхар",
      },
    },
  },
  {
    id: "monitoring-service",
    icon: Monitor,
    title: "ТООНЫ ХЯНАЛТЫН АЛБА",
    subtitle: "Газрын тос, газрын тосны бүтээгдхүүний тооны хөндлөнгийн хяналт",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
    overlayGradient: "from-cyan-900/80 via-teal-800/70 to-blue-900/80",
    features: [
      "Экспорт, импортын хяналт",
      "Тээвэрлэлт, хадгалалт, түгээлтийн хяналт",
      "Магадлагаа",
    ],
    ctaText: "Дэлгэрэнгүй мэдээлэл",
    ctaLink: "#contact",
    details: {
      description: "Тооны хяналтын алба",
      fullDescription: "\"ЗДТ Ди Эн Смарт Энерджи\" ХХК нь 2023 оноос газрын тос, газрын тосны бүтээгдэхүүнийг MNS 150/IЕС 17025-2018 стандартаар баталгаажсан арга, дээжний тоног төхөөрөмжөөр чанарын шинжилгээ хийж эхэлсэн. Үүнтэй зэрэгцүүлэн MNS ISO/IEC 17005-2013 стандартын нэрвүүлэн тооны хяналтын албыг байгуулж, ҮИТ-аас итгэмжлэгдсэн.",
      serviceScope: [
        "Экспорт, импортын газрын тос, газрын тосны бүтээгдэхүүн",
        "Тээвэрлэлт, хадгалалт, түгээлтийн үеийн тооны хөндлөнгийн хяналт",
        "Магадлагаа",
        "Гадаад худалдааны үйл ажиллагааны явцад гарах маргааныг шийдвэрлэх",
        "Техникийн хөндлөнгийн хяналт (Зорилго: Тооны бүртгэл, хэмжилтийн үнэн зөв байдлыг баталгаажуулах)",
      ],
      controlServiceTypes: [
        "Вагоноцистерн / Автоцистерн",
        "Хувийн жин (0.6–0.9 г/см³)",
        "Усны хэмжээ",
        "Эзлэхүүн жин (≤ 80000 литр хүртэл)",
      ],
      pricing: {
        service: "Тооны хяналт",
        price: "20,000₮",
        note: "Хурдан шуурхай үйлчилгээ",
      },
      contact: {
        phone: ["+976-8614-4444", "+976-8087-8025"],
        email: ["gankhuugansukh317@gmail.com"],
      },
    },
  },
]

export default function FeaturesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedService(null)
    }, 300) // Wait for animation to complete
  }, [])

  const handleCtaClick = (service: Service, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedService(service)
    setIsModalOpen(true)
    track("service_cta_click", {
      service: service.id,
      cta_text: service.ctaText,
    })
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleCloseModal()
    }
  }

  // Handle modal close on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen, handleCloseModal])

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
                    <button
                      onClick={(e) => handleCtaClick(service, e)}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 border border-white/30 hover:border-white/50 ${
                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: '200ms'
                      }}
                    >
                      {service.ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </button>
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

      {/* Service Details Modal */}
      {selectedService && (
        <div
          ref={modalRef}
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
            isModalOpen
              ? 'opacity-100 backdrop-blur-sm'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundColor: isModalOpen ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
          }}
        >
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] sm:max-h-[95vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              isModalOpen
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-95 opacity-0 translate-y-8'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image */}
            <div className="relative h-40 md:h-48">
              <Image
                src={selectedService.image}
                alt={selectedService.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={90}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${selectedService.overlayGradient} opacity-90`}
              />
              
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-200 text-white hover:scale-110"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Header Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/20 backdrop-blur-md mb-2">
                  <selectedService.icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {selectedService.title}
                </h3>
                <p className="text-sm md:text-base text-white/90 line-clamp-2">
                  {selectedService.details.description}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-12rem)] sm:max-h-[calc(95vh-12rem)]">
              <div className="p-4 md:p-6 space-y-4 sm:space-y-5">
                {/* Certification */}
                {selectedService.details.certification && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r">
                    <p className="text-sm md:text-base text-blue-900 font-medium">
                      {selectedService.details.certification}
                    </p>
                  </div>
                )}

                {/* Introduction (Monitoring Service) */}
                {selectedService.id === "monitoring-service" && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      📝 Танилцуулга
                    </h4>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {selectedService.details.fullDescription}
                    </p>
                  </div>
                )}

                {/* Full Description (Lab Service) */}
                {selectedService.id === "lab-service" && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      📌 Лабораторийн үйлчилгээний дэлгэрэнгүй тайлбар
                    </h4>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {selectedService.details.fullDescription}
                    </p>
                  </div>
                )}

                {/* Service Types */}
                {selectedService.details.serviceTypes && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      ⚙️ Лабораторийн үйлчилгээний төрөл
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedService.details.serviceTypes.map((type, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm md:text-base text-gray-700">{type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Analysis Types (Lab Service) */}
                {selectedService.details.analysisTypes && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      🔬 Хийгдэх шинжилгээ – төрлөөр
                    </h4>
                    <div className="space-y-4">
                      {selectedService.details.analysisTypes.map((analysis, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 md:p-4">
                          <h5 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                            {idx + 1}) {analysis.category}
                          </h5>
                          <ul className="space-y-1.5">
                            {analysis.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2.5">
                                <div className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-sm md:text-base text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Scope (Monitoring Service) */}
                {selectedService.details.serviceScope && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      ⚙️ Тооны хяналтын албаны үйлчилгээ
                    </h4>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                      Тооны хяналтын алба нь:
                    </p>
                    <ul className="space-y-1.5">
                      {selectedService.details.serviceScope.map((scope, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm md:text-base text-gray-700">{scope}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Control Service Types (Monitoring Service) */}
                {selectedService.details.controlServiceTypes && (
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      👁‍🗨 Хяналтын үйлчилгээний төрөл
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedService.details.controlServiceTypes.map((type, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm md:text-base text-gray-700">{type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing (Monitoring Service) */}
                {selectedService.details.pricing && (
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      💲 Үйлчилгээний үнэ
                    </h4>
                    <div className="space-y-1">
                      <p className="text-base md:text-lg font-semibold text-gray-900">
                        {selectedService.details.pricing.service} – {selectedService.details.pricing.price}
                      </p>
                      {selectedService.details.pricing.note && (
                        <p className="text-sm md:text-base text-gray-600">
                          {selectedService.details.pricing.note}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {selectedService.details.contact && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      📞 Холбоо барих{selectedService.id === "lab-service" ? " (Лаборатори)" : " (Тооны хяналтын алба)"}
                    </h4>
                    <div className="space-y-2">
                      {selectedService.details.contact.phone && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Утас:</p>
                          <div className="space-y-1">
                            {selectedService.details.contact.phone.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className="block text-sm md:text-base text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {phone}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedService.details.contact.email && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Имэйл:</p>
                          <div className="space-y-1">
                            {selectedService.details.contact.email.map((email, idx) => (
                              <a
                                key={idx}
                                href={`mailto:${email}`}
                                className="block text-sm md:text-base text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {email}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedService.details.contact.address && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Хаяг:</p>
                          <p className="text-sm md:text-base text-gray-700">
                            {selectedService.details.contact.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                Буцах
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
