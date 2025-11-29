import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

// Check if NextAuth is properly configured
const isConfigured = !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length > 0)

const handler = NextAuth(authOptions)

// Wrap handlers to catch errors gracefully
export async function GET(req: Request) {
  if (!isConfigured) {
    return NextResponse.json(
      { error: "Authentication not configured. Please set NEXTAUTH_SECRET." },
      { status: 500 }
    )
  }
  
  try {
    return await handler(req)
  } catch (error) {
    console.error("NextAuth GET error:", error)
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  if (!isConfigured) {
    return NextResponse.json(
      { error: "Authentication not configured. Please set NEXTAUTH_SECRET." },
      { status: 500 }
    )
  }
  
  try {
    return await handler(req)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    )
  }
}

