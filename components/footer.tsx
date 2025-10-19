"use client"

import type React from "react"

import { Send } from "lucide-react"
import { useState } from "react"

function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <footer className="bg-[#5a5a5a] text-white py-12 md:py-16" id="contact">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Company Information */}
          <div className="space-y-8">
            {/* Company Name */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">ZDN SMART ENERGY LLC</h3>
              <p className="text-base md:text-lg">ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ ХХК</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <div>
                  <h4 className="font-semibold mb-2">УТАС</h4>
                  <p className="text-sm">
                    + (976) 7000-9098,
                    <br />
                    8801-0600
                  </p>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-semibold mb-2">ХАЯГ</h4>
                  <p className="text-sm leading-relaxed">
                    Иист Плаза 703,
                    <br />
                    Энхтайваны Өргөн Чөлөө,
                    <br />
                    1б-Р Хороо, Баянзүрх Дүүрэг,
                    <br />
                    Улаанбаатар 13373,
                    <br />
                    Монгол Улс
                  </p>
                </div>
              </div>

              {/* Email and Working Hours */}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <h4 className="font-semibold mb-2">И-МЭЙЛ</h4>
                  <a href="mailto:info@zdn.mn" className="text-sm hover:underline">
                    info@zdn.mn
                  </a>
                </div>

                {/* Working Hours */}
                <div>
                  <h4 className="font-semibold mb-2">АЖЛЫН ЦАГ</h4>
                  <p className="text-sm leading-relaxed">
                    Даваа-Баасан 9:00 - 18:00
                    <br />
                    Бямба-Ням Амарна
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 text-center">САНАЛ, ХҮСЭЛТ ИЛГЭЭХ</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Нэр"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 bg-white/90 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="email"
                  placeholder="И-мэйл"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 bg-white/90 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Утас"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-3 bg-white/90 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Textarea with Send Button */}
              <div className="relative">
                <textarea
                  placeholder="Санал хүсэлт"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-white/90 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute bottom-4 right-4 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-xs md:text-sm">© COPYRIGHT 2021 ZDN SMART ENERGY LLC. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;