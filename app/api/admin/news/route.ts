import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { newsCreateSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest } from "@/lib/api-utils"

export async function GET() {
  try {
    await requireAuth()

    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    return successResponse(news)
  } catch (error) {
    return errorResponse(error, "Failed to fetch news")
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const validation = await validateRequest(req, newsCreateSchema)
    if (!validation.success) {
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development' && validation.error) {
        console.error('News creation validation failed:', validation.error)
      }
      return validation.response
    }

    const data = {
      ...validation.data,
      image: validation.data.image === '' ? null : validation.data.image,
      excerpt: validation.data.excerpt === '' ? null : validation.data.excerpt,
      publishedAt: validation.data.published ? new Date() : null
    }

    const news = await prisma.news.create({
      data
    })

    return successResponse(news, 201)
  } catch (error) {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('News creation error:', error)
    }
    return errorResponse(error, "Failed to create news")
  }
}

