import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { idParamSchema } from "@/lib/validations"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid brand ID")
    }

    const brand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!brand) {
      return errorResponse(new Error("Brand not found"), "Brand not found", 404)
    }

    return successResponse(brand)
  } catch (error) {
    return errorResponse(error, "Failed to fetch brand")
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid brand ID")
    }

    const body = await req.json()
    const { name, logo, description, website, featured } = body

    if (!name) {
      return errorResponse(new Error("Brand name is required"), "Brand name is required", 400)
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!existingBrand) {
      return errorResponse(new Error("Brand not found"), "Brand not found", 404)
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        logo: logo || null,
        description: description || null,
        website: website || null,
        featured: featured || false
      }
    })

    return successResponse(brand)
  } catch (error) {
    return errorResponse(error, "Failed to update brand")
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid brand ID")
    }

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!brand) {
      return errorResponse(new Error("Brand not found"), "Brand not found", 404)
    }

    // Check if there are products using this brand name
    const productsCount = await prisma.product.count({
      where: { brandName: brand.name }
    })

    if (productsCount > 0) {
      return errorResponse(
        new Error("Cannot delete brand with associated products"),
        `Cannot delete brand. There are ${productsCount} product(s) using this brand. Please update or remove those products first.`,
        400
      )
    }

    await prisma.brand.delete({
      where: { id }
    })

    return successResponse({ success: true })
  } catch (error) {
    return errorResponse(error, "Failed to delete brand")
  }
}
