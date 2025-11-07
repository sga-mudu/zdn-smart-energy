/**
 * Environment variable validation and access
 * Ensures all required environment variables are set before the app starts
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Please check your .env file or environment configuration.`
    )
  }
  
  return value
}

export const env = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // NextAuth
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
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

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server-side
  try {
    // This will throw if required vars are missing
    const _ = env.DATABASE_URL && env.NEXTAUTH_SECRET
  } catch (error) {
    console.error('❌ Environment validation failed:', error instanceof Error ? error.message : error)
    if (env.isProduction) {
      throw error
    }
  }
}

