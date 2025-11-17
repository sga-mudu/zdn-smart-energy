"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

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

export function NewsList() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news?published=true")
        if (response.ok) {
          const data = await response.json()
          // Handle both array and response object formats
          if (Array.isArray(data)) {
            setNews(data)
          } else if (data && Array.isArray(data.news)) {
            setNews(data.news)
          } else if (data && Array.isArray(data.data)) {
            setNews(data.data)
          } else {
            setNews([])
          }
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading news...</p>
        </div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мэдээ, мэдээлэл</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Мэдээ, мэдээлэл</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {article.image && (
              <div className="relative w-full h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                  loading="lazy"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              {article.publishedAt && (
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt || article.content.substring(0, 150) + "..."}
              </p>
              <Link href={`/news/${article.id}`}>
                <Button variant="outline" className="w-full">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

