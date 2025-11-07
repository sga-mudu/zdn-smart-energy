import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            parentId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return successResponse(categories)
  } catch (error) {
    return errorResponse(error, "Failed to fetch categories")
  }
}

