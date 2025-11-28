import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { env } from "@/lib/env"
import { errorResponse, successResponse } from "@/lib/api-utils"
import { writeFile, mkdir, access, constants } from "fs/promises"
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
    // Use process.cwd() which resolves to the app root on cPanel
    const uploadDir = join(process.cwd(), "public", "uploads", type)
    
    // Create directory with proper permissions (755 for cPanel)
    if (!existsSync(uploadDir)) {
      try {
        await mkdir(uploadDir, { recursive: true, mode: 0o755 })
      } catch (dirError) {
        console.error(`Failed to create upload directory: ${uploadDir}`, dirError)
        return errorResponse(
          new Error("Failed to create upload directory"),
          `Unable to create upload directory. Please ensure the public/uploads folder exists and is writable.`,
          500
        )
      }
    }

    // Verify directory is writable (important for cPanel)
    try {
      await access(uploadDir, constants.W_OK)
    } catch (accessError) {
      console.error(`Upload directory is not writable: ${uploadDir}`, accessError)
      return errorResponse(
        new Error("Upload directory not writable"),
        `Upload directory is not writable. Please check file permissions on cPanel (should be 755 for directories).`,
        500
      )
    }

    // Generate secure filename
    // Extract extension from original filename BEFORE sanitization
    const originalName = file.name
    const lastDotIndex = originalName.lastIndexOf(".")
    let extension = lastDotIndex > 0 
      ? originalName.substring(lastDotIndex + 1).toLowerCase() 
      : ""
    
    // If no extension found, determine from MIME type
    if (!extension) {
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
      }
      extension = mimeToExt[file.type] || "jpg"
    }
    
    // Sanitize extension (only allow alphanumeric, max 5 chars)
    extension = extension.replace(/[^a-z0-9]/g, "").substring(0, 5) || "jpg"
    
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString("hex")
    const filename = `${timestamp}_${randomString}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file with proper permissions (644 for files on cPanel)
    try {
      await writeFile(filepath, buffer, { mode: 0o644 })
    } catch (writeError) {
      console.error(`Failed to write file: ${filepath}`, writeError)
      return errorResponse(
        new Error("Failed to save file"),
        `Unable to save uploaded file. Please check file permissions on cPanel.`,
        500
      )
    }

    // Return the public URL
    const publicUrl = `/uploads/${type}/${filename}`

    return successResponse({
      success: true,
      url: publicUrl,
      filename,
    })
  } catch (error) {
    // Enhanced error logging for cPanel debugging
    console.error("Upload error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
    })
    
    // Provide more helpful error messages for common cPanel issues
    if (error instanceof Error) {
      if (error.message.includes("EACCES") || error.message.includes("permission")) {
        return errorResponse(
          error,
          "Permission denied. Please ensure the public/uploads directory has write permissions (755) on cPanel.",
          500
        )
      }
      if (error.message.includes("ENOENT")) {
        return errorResponse(
          error,
          "Upload directory not found. Please create the public/uploads directory on cPanel.",
          500
        )
      }
      if (error.message.includes("ENOSPC")) {
        return errorResponse(
          error,
          "Insufficient disk space on server. Please contact your hosting provider.",
          500
        )
      }
    }
    
    return errorResponse(error, "Failed to upload file. Please check server logs for details.")
  }
}

