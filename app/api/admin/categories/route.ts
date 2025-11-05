import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { parentId: "asc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, image, parentId } = body

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image,
        parentId
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

