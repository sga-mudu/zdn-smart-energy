import { NextRequest } from "next/server"
import { contactFormSchema } from "@/lib/validations"
import { errorResponse, successResponse, validateRequest } from "@/lib/api-utils"
import { z } from "zod"

// Simple rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5 // 5 requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown"

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return errorResponse(
        new Error("Rate limit exceeded"),
        "Too many requests. Please try again later.",
        429
      )
    }

    // Validate request body
    const validation = await validateRequest(req, contactFormSchema)
    if (!validation.success) {
      return validation.response
    }

    const { name, email, phone, message } = validation.data

    // Note: Contact form submissions are currently logged in development mode.
    // For production, implement:
    // 1. Save to database (create ContactMessage model)
    // 2. Send email notification to admin
    // 3. Send auto-reply to user

    if (process.env.NODE_ENV === "development") {
      console.log("Contact form submission:", { name, email, phone, message })
    }

    return successResponse(
      {
        success: true,
        message: "Thank you for your message. We'll get back to you soon.",
      },
      201
    )
  } catch (error) {
    return errorResponse(error, "Failed to submit contact form")
  }
}

