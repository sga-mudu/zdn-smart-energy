import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

// This layout allows the login page to bypass the admin layout's authentication check
// But if user is already authenticated, redirect to dashboard
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  // If already authenticated, redirect to dashboard
  if (session) {
    redirect("/admin/dashboard")
  }
  
  return <>{children}</>
}
