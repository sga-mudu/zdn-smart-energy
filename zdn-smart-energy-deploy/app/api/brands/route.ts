import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    // Get all brands
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get product counts for all brands in a single query using groupBy
    // This is more efficient than multiple count queries
    const productCounts = await prisma.product.groupBy({
      by: ["brandName"],
      _count: {
        id: true,
      },
      where: {
        brandName: {
          not: null,
        },
      },
    })

    // Create a map of brandName to product count for O(1) lookup
    const countMap = new Map(
      productCounts.map((item) => [item.brandName, item._count.id])
    )

    // Combine brands with their product counts
    const brandsWithCounts = brands.map((brand) => ({
      ...brand,
      productCount: countMap.get(brand.name) || 0,
    }))

    return successResponse(brandsWithCounts)
  } catch (error) {
    return errorResponse(error, "Failed to fetch brands")
  }
}

