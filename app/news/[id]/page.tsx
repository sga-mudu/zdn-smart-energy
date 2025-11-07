import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { NewsDetail } from "@/components/news-section/news-detail"

export default function NewsDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="text-center py-12">Loading article...</div>}>
        <NewsDetail />
      </Suspense>
      <Footer />
    </main>
  )
}

