import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")

    const where: any = {}
    
    // Only show published news to public
    if (published === "true" || published === null) {
      where.published = true
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: {
        publishedAt: "desc"
      }
    })

    return successResponse(news)
  } catch (error) {
    return errorResponse(error, "Failed to fetch news")
  }
}

