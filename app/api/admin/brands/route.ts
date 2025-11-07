import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { brandCreateSchema, paginationSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest, validateSearchParams } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(req.url)
    
    // Make pagination optional - if not provided, return all brands
    const hasPagination = searchParams.has('page') || searchParams.has('limit')
    
    if (hasPagination) {
      const pagination = validateSearchParams(searchParams, paginationSchema)

      if (!pagination.success) {
        return pagination.response
      }

      const { page, limit } = pagination.data
      
      // TypeScript guard
      if (typeof page !== 'number' || typeof limit !== 'number') {
        return errorResponse(new Error("Invalid pagination parameters"), "Invalid pagination")
      }
      
      const skip = (page - 1) * limit

      const [brands, total] = await Promise.all([
        prisma.brand.findMany({
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.brand.count(),
      ])

      return successResponse({
        brands,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } else {
      // No pagination - return all brands as array
      const brands = await prisma.brand.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })

      return successResponse(brands)
    }
  } catch (error) {
    return errorResponse(error, "Failed to fetch brands")
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const validation = await validateRequest(req, brandCreateSchema)
    if (!validation.success) {
      return validation.response
    }

    const brand = await prisma.brand.create({
      data: validation.data,
    })

    return successResponse(brand, 201)
  } catch (error) {
    return errorResponse(error, "Failed to create brand")
  }
}

