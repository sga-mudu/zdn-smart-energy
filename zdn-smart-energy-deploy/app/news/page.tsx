import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { NewsList } from "@/components/news-section/news-list"

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="text-center py-12">Loading news...</div>}>
        <NewsList />
      </Suspense>
      <Footer />
    </main>
  )
}

