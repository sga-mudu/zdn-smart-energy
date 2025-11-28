import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductsSection from "@/components/products-section"
import AboutSection from "@/components/about-section"
import BrandsSection from "@/components/brands-section"
import WindEnergySection from "@/components/wind-energy-section"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zdn.mn'
  
  // Structured Data (JSON-LD) for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZDN Smart Energy LLC",
    "alternateName": "ЗЭТ ДИ ЭН СМАРТ ЭНЕРЖИ ХХК",
    "url": baseUrl,
    "logo": `${baseUrl}/zdn-logo.svg`,
    "description": "MNS ISO/IEC 17025:2018 стандартаар итгэмжлэгдсэн газрын тос, газрын тосны бүтээгдэхүүний сорилтын лаборатори, тооны хяналтын алба",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Иист Плаза 703, Энхтайваны Өргөн Чөлөө, 1б-р Хороо",
      "addressLocality": "Баянзүрх Дүүрэг",
      "addressRegion": "Улаанбаатар",
      "postalCode": "13373",
      "addressCountry": "MN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+976-7000-9098",
      "contactType": "customer service",
      "email": "info@zdn.mn",
      "availableLanguage": ["Mongolian", "English"]
    },
    "sameAs": []
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ZDN Smart Energy LLC",
    "image": `${baseUrl}/zdn-logo.svg`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": "+976-7000-9098",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Иист Плаза 703, Энхтайваны Өргөн Чөлөө, 1б-р Хороо",
      "addressLocality": "Баянзүрх Дүүрэг",
      "addressRegion": "Улаанбаатар",
      "postalCode": "13373",
      "addressCountry": "MN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "47.9200",
      "longitude": "106.9200"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Mongolia"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Laboratory Services",
    "provider": {
      "@type": "Organization",
      "name": "ZDN Smart Energy LLC"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Mongolia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Laboratory and Measurement Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Газрын тосны лабораторийн шинжилгээ",
            "description": "Автобензин, дизель түлш, түүхий нефть, хөргөлтийн шингэний шинжилгээ"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Тооны хяналтын алба",
            "description": "Экспорт, импортын тооны хөндлөнгийн хяналт, магадлагаа"
          }
        }
      ]
    }
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <ProductsSection />
        <FeaturesSection />
        <BrandsSection />
        <AboutSection />
        <WindEnergySection />
        <Footer />
      </main>
    </>
  )
}
