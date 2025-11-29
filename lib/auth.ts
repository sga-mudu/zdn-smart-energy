import { getServerSession } from "next-auth/next"
import { Session, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { env, ensureEnvVars } from "@/lib/env"
import bcrypt from "bcryptjs"
import { ApiError } from "./api-utils"

// Check if NextAuth is properly configured
const isNextAuthConfigured = () => {
  return !!(env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length > 0)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        // Check if NextAuth is configured
        if (!isNextAuthConfigured()) {
          throw new Error("Authentication not configured. Please set NEXTAUTH_SECRET.")
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !await bcrypt.compare(credentials.password, user.password)) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          // Log error but don't expose details
          if (env.isDevelopment) {
            console.error("Auth error:", error)
          }
          throw new Error("Invalid credentials")
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  // Use a fallback secret if not configured (NextAuth requires a secret)
  // This allows the app to load but auth won't work until properly configured
  secret: env.NEXTAUTH_SECRET || "temp-secret-change-in-production",
  debug: env.isDevelopment,
}

/**
 * Get the session in App Router
 * Wrapper around getServerSession for consistent usage
 */
export async function getSession(): Promise<Session | null> {
  // Early return if NextAuth is not configured
  if (!isNextAuthConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ NEXTAUTH_SECRET is not set. Authentication will not work.")
    }
    return null
  }

  try {
    // In App Router, getServerSession automatically reads from cookies
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    // Log error for debugging (helps identify database connection issues)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // In production, log to help diagnose issues without exposing details
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ Error getting session:", errorMessage)
      // Check if it's a database connection error
      if (errorMessage.includes('database') || errorMessage.includes('Prisma') || errorMessage.includes('connect')) {
        console.error("❌ Database connection issue. Check DATABASE_URL and ensure database is accessible.")
      }
      // Check if it's a NextAuth configuration error
      if (errorMessage.includes('NEXTAUTH_SECRET') || errorMessage.includes('secret')) {
        console.error("❌ NextAuth configuration issue. Check NEXTAUTH_SECRET is set correctly.")
      }
    } else {
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

