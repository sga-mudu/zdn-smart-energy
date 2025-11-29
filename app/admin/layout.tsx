import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { headers } from "next/headers"

// Helper to check if error is a Next.js redirect
function isRedirectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  // Next.js redirect errors have specific properties
  return (
    ('digest' in error && typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) ||
    (error instanceof Error && error.message === 'NEXT_REDIRECT')
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // First, try to get the pathname to check if we're on the login page
  let pathname = ""
  let canGetPathname = false
  try {
    const headersList = await headers()
    pathname = headersList.get("x-pathname") || ""
    canGetPathname = true
  } catch (error) {
    // If we can't get headers, log but continue - we'll allow rendering
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ Could not get headers in AdminLayout:", error instanceof Error ? error.message : String(error))
    }
    // If we can't get pathname, we'll be more defensive and allow rendering
    // to avoid redirect loops
  }
  
  // Skip authentication check for login page - allow it to render even if auth fails
  if (canGetPathname && (pathname === "/admin/login" || pathname.startsWith("/admin/login/"))) {
    return <>{children}</>
  }
  
  // For other admin pages, check authentication
  try {
    const session = await getSession()
    
    // If not authenticated, redirect to login
    // This redirect throws a special error that Next.js catches
    if (!session) {
      redirect("/admin/login")
    }
    
    return <>{children}</>
  } catch (error) {
    // Check if this is a redirect error - if so, re-throw it immediately
    if (isRedirectError(error)) {
      throw error
    }
    
    // If auth check fails (missing env vars, database connection), log and allow rendering
    // This prevents 500 errors and allows the login page to render
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ AdminLayout auth check failed:", errorMessage)
      // Check for common issues
      if (errorMessage.includes('DATABASE_URL') || errorMessage.includes('NEXTAUTH_SECRET')) {
        console.error("❌ Missing environment variables. Check cPanel → Node.js Selector → Environment Variables")
      }
      if (errorMessage.includes('database') || errorMessage.includes('Prisma') || errorMessage.includes('connect')) {
        console.error("❌ Database connection issue. Check DATABASE_URL and ensure database is accessible.")
      }
    } else {
      console.error("AdminLayout error:", error)
    }
    
    // Be defensive - if we can't reliably determine the pathname, always allow rendering
    // This prevents 500 errors and redirect loops
    // The login page layout will handle showing the login form if needed
    if (!canGetPathname || !pathname) {
      return <>{children}</>
    }
    
    // Only redirect if we know we're not already on login page
    // This redirect throws a special error that Next.js catches
    if (pathname !== "/admin/login" && !pathname.startsWith("/admin/login/")) {
      redirect("/admin/login")
    }
    
    // If we reach here, we're on login page or can't determine - allow rendering
    return <>{children}</>
  }
}

