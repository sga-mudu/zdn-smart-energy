/**
 * Environment variable validation and access
 * Ensures all required environment variables are set before the app starts
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  
  if (!value) {
    const error = new Error(
      `Missing required environment variable: ${name}. ` +
      `Please check your .env file or environment configuration.`
    )
    
    // In production, throw immediately
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
    
    // In development, log warning but return empty string to prevent crashes
    console.warn(`⚠️  ${error.message}`)
    return ''
  }
  
  return value
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export const env = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // NextAuth
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment,
  isProduction,
  
  // File Upload (optional with defaults)
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  // Rate Limiting (optional with defaults)
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED !== 'false',
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
} as const

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  // Validate required environment variables
  if (!env.DATABASE_URL || !env.NEXTAUTH_SECRET) {
    const missing = []
    if (!env.DATABASE_URL) missing.push('DATABASE_URL')
    if (!env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET')
    
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please check your .env file or environment configuration.`
    )
    
    if (isProduction) {
      throw error
    } else {
      console.error('❌ Environment validation failed:', error.message)
    }
  }
}

