import { PrismaClient } from '@prisma/client'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// Ensure DATABASE_URL has connection pooling parameters
function ensureConnectionPooling(dbUrl: string): string {
  // If URL already has connection_limit or pool_timeout, return as is
  if (dbUrl.includes('connection_limit') || dbUrl.includes('pool_timeout')) {
    return dbUrl
  }

  // Add connection pooling parameters
  // Use connection_limit=1 for development to prevent connection exhaustion
  // In production, you can increase this
  const connectionLimit = env.isDevelopment ? 1 : 3
  const separator = dbUrl.includes('?') ? '&' : '?'
  return `${dbUrl}${separator}connection_limit=${connectionLimit}&pool_timeout=20`
}

const dbUrlWithPooling = ensureConnectionPooling(env.DATABASE_URL)

// Create or reuse Prisma Client instance
// This singleton pattern prevents multiple instances in Next.js
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: env.isDevelopment ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbUrlWithPooling,
      },
    },
  })
  
  // Only log once per process start, not on every hot reload
  if (env.isDevelopment && !process.env.PRISMA_LOGGED) {
    console.log('🔌 Prisma Client initialized')
    process.env.PRISMA_LOGGED = 'true'
  }
}

export const prisma = globalForPrisma.prisma

// Handle graceful shutdown (only register once)
if (typeof window === 'undefined' && !(globalForPrisma.prisma as any)?.['__disconnectHandlersRegistered']) {
  // Mark handlers as registered to prevent duplicate registrations
  ;(globalForPrisma.prisma as any)['__disconnectHandlersRegistered'] = true

  // Disconnect on process termination
  const disconnect = async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      // Ignore disconnect errors
    }
  }

  process.on('beforeExit', disconnect)
  process.on('SIGINT', async () => {
    await disconnect()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await disconnect()
    process.exit(0)
  })
}

