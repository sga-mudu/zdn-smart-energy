"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string | null
  image: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
}

// Calculate reading time based on content length (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return minutes
}

// Format date to "Published Oct 29, 2025" format
function formatDate(dateString: string | null): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
  return `Published ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export default function WindEnergySection() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news?published=true")
        if (response.ok) {
          const data = await response.json()
          // Handle both array and response object formats
          let newsData: NewsArticle[] = []
          if (Array.isArray(data)) {
            newsData = data
          } else if (data && Array.isArray(data.news)) {
            newsData = data.news
          } else if (data && Array.isArray(data.data)) {
            newsData = data.data
          }
          setNews(newsData)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-stone-50 via-stone-50/50 to-stone-50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Loading blog posts...</p>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-stone-50 via-stone-50/50 to-stone-50 relative overflow-hidden">
      {/* Background decoration - consistent with other sections */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        {/* Section Header - consistent with other sections */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            МЭДЭЭ МЭДЭЭЛЭЛ
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Blog List */}
        <div className="space-y-6 sm:space-y-8">
          {news.map((article) => {
            const readingTime = calculateReadingTime(article.content)
            const formattedDate = formatDate(article.publishedAt || article.createdAt)

            return (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-40 md:h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 192px, 224px"
                        quality={85}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Date and Reading Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {formattedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{readingTime} min</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      {(article.excerpt || article.content) && (
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                          {article.excerpt || article.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
