import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    // Get product counts for each brand
    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        const productCount = await prisma.product.count({
          where: {
            brandName: brand.name
          }
        })
        return {
          ...brand,
          productCount
        }
      })
    )

    return NextResponse.json(brandsWithCounts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

