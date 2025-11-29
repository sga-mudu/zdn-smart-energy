/**
 * Environment variable validation and access
 * Ensures all required environment variables are set before the app starts
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  
  // Don't throw during module load - allow the module to load
  // Validation will happen later when actually needed
  if (!value) {
    // Log warning but return empty string to allow module to load
    // This prevents 500 errors on pages that don't need these values
    if (process.env.NODE_ENV === 'production') {
      // In production, log error but don't throw (yet)
      // This allows the login page to load even if env vars are missing
      console.error(`⚠️  Missing environment variable: ${name}. Will fail when used.`)
    } else {
      console.warn(`⚠️  Missing environment variable: ${name}`)
    }
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

// Lazy validation - only validate when actually accessing the values
// This prevents module-load-time errors that would prevent the login page from loading
let validationWarned = false

function validateEnvVars() {
  if (typeof window !== 'undefined') return // Client-side, skip validation
  
  if (validationWarned) return // Only warn once
  
  const missing = []
  if (!env.DATABASE_URL) missing.push('DATABASE_URL')
  if (!env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET')
  
  if (missing.length > 0) {
    validationWarned = true
    
    if (isProduction) {
      // In production, log error but don't throw to allow login page to load
      console.error('❌ CRITICAL: Missing environment variables:', missing.join(', '))
      console.error('❌ Set these in cPanel → Node.js Selector → Environment Variables')
      console.error('❌ See TROUBLESHOOTING_500_ERROR.md for help')
      // Don't throw here - let individual operations fail gracefully
    } else {
      console.warn('⚠️  Missing environment variables:', missing.join(', '))
    }
  }
}

// Export validation function for use in critical paths
export function ensureEnvVars(): void {
  validateEnvVars()
  
  if (isProduction && typeof window === 'undefined') {
    const missing = []
    if (!env.DATABASE_URL) missing.push('DATABASE_URL')
    if (!env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET')
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}. ` +
        `Please set these in cPanel Node.js Selector → Environment Variables.`
      )
    }
  }
}

