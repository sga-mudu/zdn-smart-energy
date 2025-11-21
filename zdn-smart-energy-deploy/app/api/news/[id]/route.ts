import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { idParamSchema } from "@/lib/validations"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid news ID")
    }

    const news = await prisma.news.findUnique({
      where: { 
        id,
        published: true // Only show published news to public
      },
    })

    if (!news) {
      return errorResponse(new Error("News not found"), "News not found", 404)
    }

    return successResponse(news)
  } catch (error) {
    return errorResponse(error, "Failed to fetch news")
  }
}

