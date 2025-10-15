import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductsSection from "@/components/products-section"
import AboutSection from "@/components/about-section"
import BrandsSection from "@/components/brands-section"
import WindEnergySection from "@/components/wind-energy-section"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <BrandsSection />
      <WindEnergySection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
