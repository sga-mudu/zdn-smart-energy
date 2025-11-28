import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { headers } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the pathname from headers to check if we're on the login page
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  
  // Skip authentication check for login page
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return <>{children}</>
  }
  
  const session = await getSession()
  
  // Only redirect if not authenticated
  if (!session) {
    redirect("/admin/login")
  }
  
  return <>{children}</>
}

