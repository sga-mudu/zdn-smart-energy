"use client"

import type React from "react"

import { Send, Phone, Mail, MapPin, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      toast.success("Баярлалаа! Таны мессежийг хүлээн авлаа. Бид удахгүй холбогдох болно.")
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 overflow-hidden border-t border-gray-200" id="contact">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6 max-w-7xl py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Company Information */}
          <div className="space-y-10">
            {/* Company Name */}
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                ZDN SMART ENERGY LLC
              </h3>
              <p className="text-base md:text-lg text-gray-600">ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ ХХК</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">УТАС</h4>
                  </div>
                  <a 
                    href="tel:+97670009098"
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    + (976) 7000-9098
                  </a>
                  <a 
                    href="tel:+97688010600"
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors block hover:translate-x-1 transform duration-200"
                  >
                    8801-0600
                  </a>
                </div>

                {/* Address */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">ХАЯГ</h4>
                  </div>
                  <address className="text-sm leading-relaxed text-gray-700 not-italic">
                    Иист Плаза 703,
                    <br />
                    Энхтайваны Өргөн Чөлөө,
                    <br />
                    1б-Р Хороо, Баянзүрх Дүүрэг,
                    <br />
                    Улаанбаатар 13373,
                    <br />
                    Монгол Улс
                  </address>
                </div>
              </div>

              {/* Email and Working Hours */}
              <div className="space-y-6">
                {/* Email */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">И-МЭЙЛ</h4>
                  </div>
                  <a 
                    href="mailto:info@zdn.mn" 
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors inline-block hover:translate-x-1 transform duration-200 break-all"
                  >
                    info@zdn.mn
                  </a>
                </div>

                {/* Working Hours */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">АЖЛЫН ЦАГ</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Даваа-Баасан 9:00 - 18:00
                    <br />
                    Бямба-Ням Амарна
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:pl-8">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center lg:text-left">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                САНАЛ, ХҮСЭЛТ ИЛГЭЭХ
              </span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Нэр"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-300 shadow-sm"
                />
                <input
                  type="email"
                  placeholder="И-мэйл"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-300 shadow-sm"
                />
                <input
                  type="tel"
                  placeholder="Утас"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-300 shadow-sm"
                />
              </div>

              {/* Textarea with Send Button */}
              <div className="relative">
                <textarea
                  placeholder="Санал хүсэлт"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pb-12 sm:pb-14 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-300 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-2.5 sm:p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Send message"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright and Agency Link */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
              © 2016-2025 БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.


            </p>
            <div className="text-xs md:text-sm text-gray-500">
              <span className="text-gray-400">Хөгжүүлсэн: </span>
              <a
                href="https://www.gobitech.dev/mn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
              >
                Gobitech
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;