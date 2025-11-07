/**
 * API utility functions for consistent error handling and responses
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: unknown,
  defaultMessage: string = 'Internal server error',
  statusCode?: number
): NextResponse {
  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: statusCode || error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: unknown }
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this value already exists' },
        { status: 409 }
      )
    }
    
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      )
    }
  }

  // Handle database connection errors
  if (error instanceof Error && error.message.includes('connect')) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Database connection failed. Please try again later.' },
      { status: 503 }
    )
  }

  // Log unexpected errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Unexpected error:', error)
  }

  // Return generic error in production
  return NextResponse.json(
    { error: defaultMessage },
    { status: statusCode || 500 }
  )
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse; error?: unknown }> {
  try {
    const body = await request.json()
    
    // Log request body in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Request body:', JSON.stringify(body, null, 2))
    }
    
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    // Log validation errors in development
    if (process.env.NODE_ENV === 'development' && error instanceof z.ZodError) {
      console.error('Validation error details:', {
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code
        }))
      })
    }
    return {
      success: false,
      response: errorResponse(error, 'Invalid request data'),
      error,
    }
  }
}

/**
 * Validate URL search params with Zod schema
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      response: errorResponse(error, 'Invalid query parameters'),
    }
  }
}

