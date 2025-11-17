"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

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

export function NewsDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        if (response.ok) {
          const data = await response.json()
          // Handle both direct data and response.data formats
          const news = data.news || data.data || data
          setArticle(news)
        } else {
          setArticle(null)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNews()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-6">The news article you're looking for doesn't exist or has been removed.</p>
          <Link href="/news">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to News
      </Button>

      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {article.image && (
          <div className="relative w-full h-96">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              quality={90}
              priority
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          {article.publishedAt && (
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <Calendar className="w-5 h-5" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          )}

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic">{article.excerpt}</p>
          )}

          <div 
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
          />
        </div>
      </article>
    </div>
  )
}

