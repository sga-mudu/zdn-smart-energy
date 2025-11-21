# Environment Variables Setup Guide

This guide explains how to set up your `.env` file for the ZDN Smart Energy application.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and fill in your values:**
   - Open `.env` in a text editor
   - Replace all placeholder values with your actual configuration
   - See sections below for details on each variable

3. **Verify your setup:**
   - Make sure all REQUIRED variables are set
   - Double-check your DATABASE_URL format
   - Ensure NEXTAUTH_SECRET is a strong random string

## Required Variables

### DATABASE_URL
**Required:** Yes  
**Format:** `mysql://username:password@host:port/database_name?connection_limit=3&pool_timeout=20`

**Example:**
```env
DATABASE_URL=mysql://zdn_user:MySecurePass123@localhost:3306/zdn_smart_energy?connection_limit=3&pool_timeout=20
```

**How to get these values:**
- **username:** Database user created in cPanel MySQL Databases
- **password:** Password for the database user
- **host:** Usually `localhost` (check your cPanel for exact hostname)
- **port:** Usually `3306` for MySQL
- **database_name:** Name of your database in cPanel

**Important:** The `?connection_limit=3&pool_timeout=20` part is required for proper connection pooling.

### NEXTAUTH_SECRET
**Required:** Yes  
**Type:** String (minimum 32 characters)

**Generate a secure secret:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Example:**
```env
NEXTAUTH_SECRET=K8mN2pQ5rT9vW3xZ6bC1dF4gH7jL0kM5nP8qR2sT5uV8wX1yZ4aB7cD0eF3gH6
```

**Security:** 
- Use a different secret for each environment (dev, staging, production)
- Never share this secret publicly
- If compromised, regenerate immediately

### NEXTAUTH_URL
**Required:** Yes  
**Format:** Full URL with protocol

**Examples:**
```env
# Production:
NEXTAUTH_URL=https://zdn.mn

# Development:
NEXTAUTH_URL=http://localhost:3000

# Staging:
NEXTAUTH_URL=https://staging.zdn.mn
```

**Important:** Must match the actual URL where your app is accessible.

## Optional Variables

### NEXT_PUBLIC_SITE_URL
**Required:** No (but recommended)  
**Default:** Uses NEXTAUTH_URL if not set

**Purpose:** Used for SEO, structured data, and public links

**Example:**
```env
NEXT_PUBLIC_SITE_URL=https://zdn.mn
```

### MAX_FILE_SIZE
**Required:** No  
**Default:** `5242880` (5MB)

**Purpose:** Maximum file upload size in bytes

**Common values:**
- 5MB = `5242880`
- 10MB = `10485760`
- 20MB = `20971520`

**Example:**
```env
MAX_FILE_SIZE=10485760
```

### ALLOWED_FILE_TYPES
**Required:** No  
**Default:** `image/jpeg,image/jpg,image/png,image/webp,image/gif`

**Purpose:** Comma-separated list of allowed MIME types for file uploads

**Example:**
```env
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/gif
```

### RATE_LIMIT_ENABLED
**Required:** No  
**Default:** `true`

**Purpose:** Enable/disable rate limiting for API endpoints

**Example:**
```env
RATE_LIMIT_ENABLED=true
```

### RATE_LIMIT_MAX_REQUESTS
**Required:** No  
**Default:** `100`

**Purpose:** Maximum number of requests allowed per window

**Example:**
```env
RATE_LIMIT_MAX_REQUESTS=100
```

### RATE_LIMIT_WINDOW_MS
**Required:** No  
**Default:** `60000` (1 minute)

**Purpose:** Time window for rate limiting in milliseconds

**Example:**
```env
RATE_LIMIT_WINDOW_MS=60000
```

### NODE_ENV
**Required:** No (but recommended)  
**Default:** `development`

**Values:** `development` | `production` | `test`

**Example:**
```env
NODE_ENV=production
```

## Environment-Specific Setup

### Development (.env.local)
For local development, create `.env.local` (it overrides `.env`):

```env
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/zdn_dev?connection_limit=1&pool_timeout=20
NEXTAUTH_SECRET=dev-secret-key-minimum-32-characters-long
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (.env.production)
For production deployment:

```env
NODE_ENV=production
DATABASE_URL=mysql://prod_user:secure_password@localhost:3306/zdn_prod?connection_limit=3&pool_timeout=20
NEXTAUTH_SECRET=production-secret-key-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://zdn.mn
NEXT_PUBLIC_SITE_URL=https://zdn.mn
MAX_FILE_SIZE=10485760
```

## Security Best Practices

1. **Never commit .env files:**
   - `.env` is already in `.gitignore`
   - Never push secrets to version control
   - Use `.env.example` as a template

2. **Use strong secrets:**
   - NEXTAUTH_SECRET should be at least 32 characters
   - Use cryptographically secure random generators
   - Different secrets for each environment

3. **Protect your .env file:**
   - Set file permissions to 600 (owner read/write only)
   - Don't share .env files via email or chat
   - Use secure methods to transfer secrets

4. **Rotate secrets regularly:**
   - Change NEXTAUTH_SECRET periodically
   - Update database passwords regularly
   - Revoke old secrets when rotating

5. **Use environment-specific files:**
   - `.env.local` for local development
   - `.env.production` for production
   - Never use production secrets in development

## Troubleshooting

### "Missing required environment variable" error
- Check that all REQUIRED variables are set
- Verify variable names are spelled correctly
- Ensure there are no extra spaces around `=`

### Database connection errors
- Verify DATABASE_URL format is correct
- Check database credentials are correct
- Ensure database server is running
- Verify connection_limit and pool_timeout are included

### Authentication not working
- Verify NEXTAUTH_SECRET is set and is at least 32 characters
- Check NEXTAUTH_URL matches your actual domain
- Ensure HTTPS is used in production

### File upload errors
- Check MAX_FILE_SIZE is sufficient
- Verify ALLOWED_FILE_TYPES includes your file type
- Ensure upload directory has write permissions

## cPanel Specific Notes

When deploying to cPanel, you can set environment variables in two ways:

1. **Node.js Selector (Recommended):**
   - Go to cPanel → Node.js Selector
   - Click your app → Environment Variables
   - Add each variable individually

2. **.env file:**
   - Create `.env` in your project root
   - Set permissions to 600: `chmod 600 .env`
   - Fill in all required variables

**Important:** If using both methods, Node.js Selector variables take precedence.

## Example Complete .env File

```env
# ============================================
# REQUIRED VARIABLES
# ============================================
NODE_ENV=production
DATABASE_URL=mysql://zdn_user:SecurePass123@localhost:3306/zdn_smart_energy?connection_limit=3&pool_timeout=20
NEXTAUTH_SECRET=K8mN2pQ5rT9vW3xZ6bC1dF4gH7jL0kM5nP8qR2sT5uV8wX1yZ4aB7cD0eF3gH6
NEXTAUTH_URL=https://zdn.mn
NEXT_PUBLIC_SITE_URL=https://zdn.mn

# ============================================
# OPTIONAL VARIABLES (with defaults)
# ============================================
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/gif
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

---

**Last Updated:** After project finalization  
**For cPanel deployment:** See `CPANEL_DEPLOYMENT.md`

