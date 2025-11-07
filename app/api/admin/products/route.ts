import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { productCreateSchema, paginationSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest, validateSearchParams } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(req.url)
    
    // Make pagination optional - if not provided, return all products
    const hasPagination = searchParams.has('page') || searchParams.has('limit')
    
    if (hasPagination) {
      const pagination = validateSearchParams(searchParams, paginationSchema)

      if (!pagination.success) {
        return pagination.response
      }

      const { page, limit } = pagination.data
      
      // TypeScript guard - these should always be defined if pagination.success is true
      if (typeof page !== 'number' || typeof limit !== 'number') {
        return errorResponse(new Error("Invalid pagination parameters"), "Invalid pagination")
      }
      
      const skip = (page - 1) * limit

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.product.count(),
      ])

      return successResponse({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } else {
      // No pagination - return all products as array
      const products = await prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return successResponse(products)
    }
  } catch (error) {
    return errorResponse(error, "Failed to fetch products")
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const validation = await validateRequest(req, productCreateSchema)
    if (!validation.success) {
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development' && validation.error) {
        console.error('Product creation validation failed:', validation.error)
      }
      return validation.response
    }

    // Convert empty strings to null for image and brandLogo
    const data = {
      ...validation.data,
      image: validation.data.image === '' ? null : validation.data.image,
      brandLogo: validation.data.brandLogo === '' ? null : validation.data.brandLogo,
      brandName: validation.data.brandName === '' ? null : validation.data.brandName,
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return successResponse(product, 201)
  } catch (error) {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Product creation error:', error)
    }
    return errorResponse(error, "Failed to create product")
  }
}

