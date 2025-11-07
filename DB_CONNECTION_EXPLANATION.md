# Why You're Getting Many Database Connections

## Root Causes

### 1. **Next.js Development Mode Hot Reload**
- In dev mode, Next.js uses hot module replacement (HMR)
- When you save files, modules get re-evaluated
- Each time `lib/prisma.ts` is re-evaluated, it might create a new Prisma Client instance
- Even with the singleton pattern, hot reload can sometimes bypass it

### 2. **Multiple Concurrent API Requests**
When a page loads, multiple API routes are called simultaneously:
- `/api/products` 
- `/api/brands`
- `/api/categories`
- Each route imports `prisma` from `lib/prisma.ts`
- If the singleton isn't working perfectly, each import might create a new instance

### 3. **Connection Pool Per Instance**
- Each Prisma Client instance can create up to `connection_limit` connections
- If `connection_limit=3` and 3 instances are created = 9 connections
- Your database user has a `max_user_connections` limit (likely 5-10)

### 4. **Next.js Module Caching**
- Next.js caches modules, but in dev mode this can be inconsistent
- The `global` object might be reset during hot reload
- This breaks the singleton pattern

## Current Situation

You have:
- **30+ API routes** using Prisma
- **Multiple concurrent requests** on page load
- **Hot reload** creating new instances
- **Connection limit of 3** per instance
- **Database limit** of ~5-10 connections per user

**Result**: 3-4 instances × 3 connections = 9-12 connections (exceeds limit!)

## Solutions

### Solution 1: Reduce Connection Limit (Already Implemented)
✅ Set `connection_limit=1` in development
- This reduces connections per instance
- But doesn't solve the multiple instances problem

### Solution 2: Better Singleton Pattern (Already Implemented)
✅ Always store in global, not just in dev mode
- Helps, but hot reload can still cause issues

### Solution 3: Kill Old Connections (Manual)
✅ Run `npm run kill:connections` periodically
- Temporary fix, doesn't prevent the issue

### Solution 4: Restart Dev Server
✅ When you see connection errors, restart the server
- Clears all connections
- Fresh start

### Solution 5: Use Prisma Connection Pooling (Recommended)
We need to ensure the connection pool is shared properly.

## Best Practices

1. **Always restart dev server** after seeing connection errors
2. **Use `connection_limit=1`** in development
3. **Kill old connections** before starting dev server
4. **Monitor connections** with `npm run kill:connections`
5. **In production**, use a connection pooler like PgBouncer or Prisma Data Proxy

## Why This Happens in Development

Development mode is different from production:
- **Dev**: Hot reload, multiple instances, no connection pooling
- **Production**: Single instance, proper connection pooling, better resource management

The connection issues are primarily a **development environment problem**.

