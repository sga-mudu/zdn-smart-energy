import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { productUpdateSchema, idParamSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest } from "@/lib/api-utils"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid product ID")
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    if (!product) {
      return errorResponse(new Error("Product not found"), "Product not found", 404)
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error, "Failed to fetch product")
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const paramValidation = idParamSchema.safeParse({ id })

    if (!paramValidation.success) {
      return errorResponse(paramValidation.error, "Invalid product ID")
    }

    const validation = await validateRequest(req, productUpdateSchema)
    if (!validation.success) {
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development' && validation.error) {
        console.error('Product update validation failed:', validation.error)
      }
      return validation.response
    }

    // Convert empty strings to null for image and brandLogo
    const data: any = { ...validation.data }
    if (data.image === '') data.image = null
    if (data.brandLogo === '') data.brandLogo = null
    if (data.brandName === '') data.brandName = null

    const product = await prisma.product.update({
      where: { id },
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

    return successResponse(product)
  } catch (error) {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Product update error:', error)
    }
    return errorResponse(error, "Failed to update product")
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
      return errorResponse(paramValidation.error, "Invalid product ID")
    }

    await prisma.product.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    return errorResponse(error, "Failed to delete product")
  }
}
