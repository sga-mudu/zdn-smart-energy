import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { env } from "@/lib/env"
import { errorResponse, successResponse } from "@/lib/api-utils"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { randomBytes } from "crypto"

// Magic numbers for image file types (file signatures)
const FILE_SIGNATURES: Record<string, Buffer[]> = {
  "image/jpeg": [
    Buffer.from([0xff, 0xd8, 0xff]),
  ],
  "image/png": [
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ],
  "image/webp": [
    Buffer.from("RIFF", "ascii"),
    Buffer.from("WEBP", "ascii"),
  ],
  "image/gif": [
    Buffer.from("GIF89a", "ascii"),
    Buffer.from("GIF87a", "ascii"),
  ],
}

/**
 * Validate file content by checking magic numbers
 */
function validateFileContent(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType]
  if (!signatures) return false

  return signatures.some((signature) => {
    const fileStart = buffer.slice(0, signature.length)
    return fileStart.equals(signature)
  })
}

/**
 * Sanitize filename to prevent directory traversal and other attacks
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.\./g, "") // Remove .. to prevent directory traversal
    .replace(/^\./, "") // Remove leading dot
    .substring(0, 100) // Limit length
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return errorResponse(new Error("No file uploaded"), "No file uploaded", 400)
    }

    if (!type || (type !== "product" && type !== "brand" && type !== "news")) {
      return errorResponse(
        new Error("Invalid upload type"),
        "Invalid upload type. Must be 'product', 'brand', or 'news'",
        400
      )
    }

    // Validate MIME type
    if (!env.ALLOWED_FILE_TYPES.includes(file.type)) {
      return errorResponse(
        new Error("Invalid file type"),
        `Invalid file type. Allowed types: ${env.ALLOWED_FILE_TYPES.join(", ")}`,
        400
      )
    }

    // Validate file size
    if (file.size > env.MAX_FILE_SIZE) {
      const maxSizeMB = Math.round(env.MAX_FILE_SIZE / (1024 * 1024))
      return errorResponse(
        new Error("File too large"),
        `File size exceeds ${maxSizeMB}MB limit`,
        400
      )
    }

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file content (magic number check)
    if (!validateFileContent(buffer, file.type)) {
      return errorResponse(
        new Error("Invalid file content"),
        "File content does not match the declared file type",
        400
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", type)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate secure filename
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString("hex")
    const sanitizedName = sanitizeFilename(file.name)
    const extension = sanitizedName.split(".").pop() || "jpg"
    const filename = `${timestamp}_${randomString}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/${type}/${filename}`

    return successResponse({
      success: true,
      url: publicUrl,
      filename,
    })
  } catch (error) {
    return errorResponse(error, "Failed to upload file")
  }
}

