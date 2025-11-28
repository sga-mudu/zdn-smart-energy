import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categoryCreateSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest } from "@/lib/api-utils"

export async function GET() {
  try {
    await requireAuth()

    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { parentId: "asc" },
        { createdAt: "desc" },
      ],
    })

    return successResponse(categories)
  } catch (error) {
    return errorResponse(error, "Failed to fetch categories")
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const validation = await validateRequest(req, categoryCreateSchema)
    if (!validation.success) {
      return validation.response
    }

    const category = await prisma.category.create({
      data: validation.data,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return successResponse(category, 201)
  } catch (error) {
    return errorResponse(error, "Failed to create category")
  }
}

