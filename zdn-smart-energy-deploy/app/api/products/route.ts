import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { paginationSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateSearchParams } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Get category filter if provided
    const categoryId = searchParams.get('categoryId') || searchParams.get('category')
    
    // Get featured filter if provided
    const featured = searchParams.get('featured')
    
    // Build where clause
    const whereClause: { categoryId?: string; featured?: boolean } = {}
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    if (featured === 'true') {
      whereClause.featured = true
    }
    
    // Make pagination optional - if not provided, return all products
    const hasPagination = searchParams.has('page') || searchParams.has('limit')
    
    if (hasPagination) {
      const pagination = validateSearchParams(searchParams, paginationSchema)
      
      if (!pagination.success) {
        return pagination.response
      }

      const { page = 1, limit = 20 } = pagination.data
      const skip = (page - 1) * limit

      const [fetchedProducts, fetchedTotal] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                description: true,
                parentId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.product.count({
          where: whereClause,
        }),
      ])
      
      return successResponse({
        products: fetchedProducts,
        pagination: {
          page,
          limit,
          total: fetchedTotal,
          totalPages: Math.ceil(fetchedTotal / limit),
        },
      })
    } else {
      // No pagination - return all products for backward compatibility
      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              parentId: true,
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
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Products API Error:', error)
    }
    return errorResponse(error, "Failed to fetch products")
  }
}

