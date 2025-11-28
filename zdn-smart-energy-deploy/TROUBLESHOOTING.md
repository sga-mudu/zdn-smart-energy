# Troubleshooting 500 Internal Server Error

If you're getting a 500 error when setting up your Node.js app in cPanel, follow these steps:

## Step 1: Check Application Logs

1. In cPanel → Node.js Selector
2. Click on your application
3. Click "View Logs" or "Error Log"
4. Look for error messages - they will tell you what's wrong

## Step 2: Verify Prerequisites

### ✅ Check 1: Dependencies Installed
```bash
cd /home/zdnmnkw5/public_html  # or your app path
npm install --production
```

### ✅ Check 2: Application Built
```bash
npm run build
```
This creates the `.next` folder which is required.

### ✅ Check 3: Prisma Client Generated
```bash
npx prisma generate
```

### ✅ Check 4: Database Migrations Run
```bash
npx prisma migrate deploy
```

## Step 3: Verify Environment Variables

In cPanel → Node.js Selector → Your App → Environment Variables, ensure these are set:

**Required:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = `mysql://username:password@localhost:3306/database_name?connection_limit=3&pool_timeout=20`
- `NEXTAUTH_SECRET` = (a secure 32+ character string)
- `NEXTAUTH_URL` = `https://zdn.mn`

**Check:**
- No extra spaces around `=`
- No quotes around values (unless the value itself contains spaces)
- `DATABASE_URL` uses `localhost` (not your domain name)

## Step 4: Verify File Structure

Your project should have:
```
/home/zdnmnkw5/public_html/
├── .next/              ← Must exist (created by npm run build)
├── node_modules/      ← Must exist (created by npm install)
├── prisma/
│   └── schema.prisma
├── public/
├── server.js          ← Startup file
├── package.json
└── .env               ← Optional (if not using cPanel env vars)
```

## Step 5: Check File Permissions

```bash
# Set correct permissions
chmod 755 .
chmod 644 package.json
chmod 755 server.js
chmod -R 755 public/
chmod -R 755 .next/
```

## Step 6: Test Database Connection

Create a test file `test-db.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.$connect()
  .then(() => {
    console.log('✅ Database connection successful!')
    prisma.$disconnect()
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message)
    process.exit(1)
  })
```

Run it:
```bash
node test-db.js
```

## Step 7: Common Issues & Solutions

### Issue: "Missing required environment variable"
**Solution:** Add all required env vars in cPanel Node.js Selector

### Issue: "Cannot find module '@prisma/client'"
**Solution:** 
```bash
npm install
npx prisma generate
```

### Issue: "Cannot find module 'next'"
**Solution:**
```bash
npm install --production
```

### Issue: "EACCES: permission denied"
**Solution:**
```bash
chmod 755 .
chmod -R 755 node_modules
```

### Issue: Database connection timeout
**Solution:**
- Verify `DATABASE_URL` uses `localhost` (not domain name)
- Check database credentials are correct
- Ensure database user has proper permissions

### Issue: ".next folder not found"
**Solution:**
```bash
npm run build
```

### Issue: File uploads not working / "Permission denied" errors
**Solution:**
1. **Create upload directories:**
```bash
cd /home/zdnmnkw5/public_html  # Your app path
mkdir -p public/uploads/product
mkdir -p public/uploads/brand
mkdir -p public/uploads/news
```

2. **Set correct permissions:**
```bash
# Set permissions for upload directories (755 = read/write/execute for owner, read/execute for others)
chmod 755 public/uploads
chmod 755 public/uploads/product
chmod 755 public/uploads/brand
chmod 755 public/uploads/news

# Ensure public directory is accessible
chmod 755 public
```

3. **Verify permissions via cPanel File Manager:**
   - Navigate to `public/uploads` folder
   - Right-click → Change Permissions
   - Set to `755` for directories
   - Ensure owner has read/write/execute permissions

4. **Check if directories exist:**
```bash
ls -la public/uploads/
# Should show: product/, brand/, news/ directories
```

5. **Test write permissions:**
```bash
touch public/uploads/product/test.txt
rm public/uploads/product/test.txt
# If this works, permissions are correct
```

**Common Upload Errors:**
- `EACCES: permission denied` → Run `chmod 755 public/uploads` and subdirectories
- `ENOENT: no such file or directory` → Create the upload directories manually
- `Upload directory not writable` → Check permissions are 755, not 644

## Step 8: Manual Startup Test

Try starting the app manually to see errors:
```bash
cd /home/zdnmnkw5/public_html
node server.js
```

This will show you the exact error message.

## Step 9: Check Node.js Version

Ensure you selected Node.js 20.19.4 or 18.20.8 in cPanel (not 10.x or 12.x).

## Still Not Working?

1. **Check cPanel Error Logs:**
   - cPanel → Metrics → Errors
   - Look for recent errors

2. **Check Application Logs:**
   - cPanel → Node.js Selector → Your App → View Logs

3. **Verify Startup File:**
   - Application startup file should be: `server.js`

4. **Check Port:**
   - Make sure the port assigned by cPanel is correct
   - Usually shown in Node.js Selector

5. **Restart Application:**
   - In Node.js Selector, click "Restart App"

## Quick Fix Checklist

Run these commands in order:
```bash
cd /home/zdnmnkw5/public_html  # Your app path

# 1. Install dependencies
npm install --production

# 2. Generate Prisma client
npx prisma generate

# 3. Build the application
npm run build

# 4. Run migrations
npx prisma migrate deploy

# 5. Restart app in cPanel Node.js Selector
```

After each step, check if the error is resolved.

