import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { newsUpdateSchema, idParamSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest } from "@/lib/api-utils"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid news ID")
    }

    const news = await prisma.news.findUnique({
      where: { id },
    })

    if (!news) {
      return errorResponse(new Error("News not found"), "News not found", 404)
    }

    return successResponse(news)
  } catch (error) {
    return errorResponse(error, "Failed to fetch news")
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid news ID")
    }

    const validation = await validateRequest(req, newsUpdateSchema)
    if (!validation.success) {
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development' && validation.error) {
        console.error('News update validation failed:', validation.error)
      }
      return validation.response
    }

    // Convert empty strings to null for image and excerpt
    const data: any = { ...validation.data }
    if (data.image === '') data.image = null
    if (data.excerpt === '') data.excerpt = null
    if (data.published !== undefined) {
      data.publishedAt = data.published ? new Date() : null
    }

    const news = await prisma.news.update({
      where: { id },
      data,
    })

    return successResponse(news)
  } catch (error) {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('News update error:', error)
    }
    return errorResponse(error, "Failed to update news")
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid news ID")
    }

    await prisma.news.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    return errorResponse(error, "Failed to delete news")
  }
}

