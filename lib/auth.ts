import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Session } from "next-auth"
import { ApiError } from "./api-utils"

/**
 * Get the session in App Router
 * Wrapper around getServerSession for consistent usage
 */
export async function getSession(): Promise<Session | null> {
  try {
    // In App Router, getServerSession automatically reads from cookies
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    // Only log in development to avoid exposing errors
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting session:", error)
    }
    return null
  }
}

/**
 * Verify if the user is authenticated
 * Throws ApiError if not authenticated (for use in API routes)
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  
  if (!session) {
    throw new ApiError(401, "Unauthorized", "UNAUTHORIZED")
  }
  
  return session
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth()
  
  // TypeScript now knows role exists due to type augmentation
  if (!session.user || session.user.role !== 'admin') {
    throw new ApiError(403, "Forbidden - Admin access required", "FORBIDDEN")
  }
  
  return session
}

