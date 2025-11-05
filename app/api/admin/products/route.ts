import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { code, name, description, image, brandLogo, brandName, categoryId, featured } = body

    if (!code || !name || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        description: description || null,
        image: image || null,
        brandLogo: brandLogo || null,
        brandName: brandName || null,
        categoryId,
        featured: featured || false
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

