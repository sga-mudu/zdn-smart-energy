import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            parentId: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: errorMessage 
      },
      { status: 500 }
    )
  }
}

