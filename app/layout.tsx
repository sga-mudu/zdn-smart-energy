import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { ConditionalAnalytics } from "@/components/conditional-analytics"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zdn.mn'),
  title: {
    default: "ZDN Smart Energy - Газрын тосны лаборатори, тооны хяналт | ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ ХХК",
    template: "%s | ZDN Smart Energy"
  },
  description: "MNS ISO/IEC 17025:2018 стандартаар итгэмжлэгдсэн газрын тос, газрын тосны бүтээгдэхүүний сорилтын лаборатори, тооны хяналтын алба. Автобензин, дизель түлш, түүхий нефть, хөргөлтийн шингэний шинжилгээ. Улаанбаатар, Монгол улс.",
  keywords: [
    "газрын тосны лаборатори",
    "тооны хяналт",
    "шинжилгээний лаборатори",
    "MNS ISO/IEC 17025",
    "автобензин шинжилгээ",
    "дизель түлш шинжилгээ",
    "түүхий нефть",
    "тооны хөндлөнгийн хяналт",
    "магадлагаа",
    "ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ",
    "ZDN Smart Energy",
    "Улаанбаатар лаборатори",
    "Монгол улсын лаборатори",
    "газрын тосны бүтээгдэхүүн",
    "чанарын хяналт",
    "сорилтын лаборатори"
  ],
  authors: [{ name: "ZDN Smart Energy LLC" }],
  creator: "ZDN Smart Energy LLC",
  publisher: "ZDN Smart Energy LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zdn.mn',
    siteName: "ZDN Smart Energy",
    title: "ZDN Smart Energy - Газрын тосны лаборатори, тооны хяналт",
    description: "MNS ISO/IEC 17025:2018 стандартаар итгэмжлэгдсэн газрын тос, газрын тосны бүтээгдэхүүний сорилтын лаборатори, тооны хяналтын алба. Улаанбаатар, Монгол улс.",
    images: [
      {
        url: "/zdn-logo.svg",
        width: 1200,
        height: 630,
        alt: "ZDN Smart Energy - Газрын тосны лаборатори",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZDN Smart Energy - Газрын тосны лаборатори, тооны хяналт",
    description: "MNS ISO/IEC 17025:2018 стандартаар итгэмжлэгдсэн газрын тосны лаборатори, тооны хяналтын алба.",
    images: ["/zdn-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://zdn.mn',
  },
  category: "Laboratory Services",
  classification: "Business",
  icons: {
    icon: [
      { url: "/zdn-logo.svg", type: "image/svg+xml" },
      { url: "/zdn-logo.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/zdn-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/zdn-logo.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" dir="ltr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <ConditionalAnalytics />
        </Suspense>
      </body>
    </html>
  )
}
