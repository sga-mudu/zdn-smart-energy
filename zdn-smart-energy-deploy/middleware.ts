import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create a response
  const response = NextResponse.next()
  
  // Set the pathname in a header so the layout can access it
  response.headers.set("x-pathname", pathname)
  
  return response
}

export const config = {
  matcher: "/admin/:path*",
}

