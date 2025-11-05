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

    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(brands)
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
    const { name, logo, description, website, featured } = body

    if (!name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        logo: logo || null,
        description: description || null,
        website: website || null,
        featured: featured || false
      }
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

