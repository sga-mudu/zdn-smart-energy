import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

// Helper to check if error is a Next.js redirect
function isRedirectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  // Next.js redirect errors have specific properties
  return (
    ('digest' in error && typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) ||
    (error instanceof Error && error.message === 'NEXT_REDIRECT')
  )
}

// This layout allows the login page to bypass the admin layout's authentication check
// But if user is already authenticated, redirect to dashboard
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  
  try {
    // Try to get session - if environment variables or database are not configured,
    // this will fail gracefully and we'll still show the login page
    session = await getSession()
  } catch (error) {
    // Check if this is a redirect error - if so, re-throw it immediately
    if (isRedirectError(error)) {
      throw error
    }
    
    // If there's an error getting session (missing env vars, database connection, etc.)
    // Log it but still allow the login page to render
    // The user needs to see the login page to know the system is working
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Log the error for debugging, but don't throw - allow login page to render
    if (process.env.NODE_ENV === 'production') {
      console.error("❌ Error checking session in login layout:", errorMessage)
      // Check for common issues
      if (errorMessage.includes('DATABASE_URL') || errorMessage.includes('NEXTAUTH_SECRET')) {
        console.error("❌ Missing environment variables. Check cPanel → Node.js Selector → Environment Variables")
      }
      if (errorMessage.includes('database') || errorMessage.includes('Prisma') || errorMessage.includes('connect')) {
        console.error("❌ Database connection issue. Check DATABASE_URL and ensure database is accessible.")
      }
    } else {
      console.error("Error getting session in login layout:", error)
    }
    
    // Continue to render login page even if session check failed
    // This allows the user to at least see the login page
    return <>{children}</>
  }
  
  // If already authenticated, redirect to dashboard
  // This redirect is outside the try-catch so it won't be caught
  // redirect() throws a special error that Next.js catches - don't catch it!
  if (session) {
    redirect("/admin/dashboard")
  }
  
  return <>{children}</>
}
