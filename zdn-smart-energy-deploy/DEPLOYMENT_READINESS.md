# Deployment Readiness Checklist

This document verifies that everything is ready for deployment to cPanel.

## ✅ Pre-Deployment Verification

### 1. Dependencies & Build
- [x] **node_modules exists** - Dependencies are installed
- [x] **Production build successful** - `npm run build` completed without errors
- [x] **.next folder created** - Build artifacts are present
- [x] **Prisma client generated** - `npx prisma generate` completed successfully
- [x] **No critical build errors** - Build completed successfully

### 2. Configuration Files
- [x] **package.json** - Present and valid
- [x] **server.js** - Present, executable, and syntax-valid
- [x] **next.config.mjs** - Present and configured
- [x] **prisma/schema.prisma** - Present and valid
- [x] **.env.example** - Present (template for production .env)
- [x] **deploy-to-cpanel.sh** - Present and executable

### 3. Required Files Structure
```
✓ app/                    - Next.js app directory
✓ components/             - React components
✓ lib/                    - Utility libraries
✓ public/                 - Static assets
✓ public/uploads/         - Upload directories
✓ prisma/                 - Database schema
✓ server.js               - Node.js entry point
✓ package.json            - Dependencies
✓ .env.example            - Environment template
```

### 4. Environment Variables (To be set on server)
Required variables that must be set in cPanel Node.js Selector:
- `NODE_ENV=production`
- `DATABASE_URL=mysql://user:pass@localhost:3306/dbname?connection_limit=3&pool_timeout=20`
- `NEXTAUTH_SECRET=<32+ character secret>`
- `NEXTAUTH_URL=https://zdn.mn`
- `NEXT_PUBLIC_SITE_URL=https://zdn.mn` (optional but recommended)

### 5. Deployment Script
- [x] **deploy-to-cpanel.sh** - Executable and ready
- [x] **Excludes sensitive files** - .env, node_modules, .next, .git
- [x] **Includes .env.example** - Template for server setup

## 📦 Deployment Package Contents

The deployment script creates a package that includes:
- ✅ All source code (app/, components/, lib/)
- ✅ Configuration files (package.json, next.config.mjs, etc.)
- ✅ Prisma schema (prisma/schema.prisma)
- ✅ Public assets (public/)
- ✅ .env.example template
- ✅ server.js entry point
- ✅ Documentation files

Excluded from package:
- ❌ node_modules (will be installed on server)
- ❌ .next (will be built on server)
- ❌ .env files (security - create on server)
- ❌ .git (version control)
- ❌ Development files (.DS_Store, logs, etc.)

## 🚀 Deployment Steps

### Step 1: Create Deployment Package
```bash
./deploy-to-cpanel.sh
```
This creates `zdn-smart-energy-deploy.tar.gz`

### Step 2: Upload to cPanel
1. Log into cPanel → File Manager
2. Navigate to your domain's public_html folder
3. Upload `zdn-smart-energy-deploy.tar.gz`
4. Extract the archive

### Step 3: Set Up Node.js App in cPanel
1. Go to cPanel → Node.js Selector
2. Create new application:
   - **Node.js version:** 18.x or 20.x (LTS)
   - **Application mode:** Production
   - **Application root:** `/home/username/public_html`
   - **Application startup file:** `server.js`
   - **Application URL:** Your domain

### Step 4: Configure Environment Variables
In Node.js Selector → Your App → Environment Variables:
- Set all required variables (see section 4 above)
- Verify no extra spaces around `=`
- Use `localhost` for DATABASE_URL host (not domain name)

### Step 5: Install Dependencies & Build
Via SSH or cPanel Terminal:
```bash
cd /home/username/public_html
npm install --production
npx prisma generate
npm run build
npx prisma migrate deploy
```

### Step 6: Create .env File (Optional)
If not using cPanel environment variables:
```bash
cp .env.example .env
# Edit .env with production values
chmod 600 .env
```

### Step 7: Set File Permissions
```bash
chmod 755 .
chmod 644 package.json
chmod 755 server.js
chmod -R 755 public/
chmod -R 755 .next/
```

### Step 8: Start Application
In Node.js Selector:
- Click "Restart App"
- Check "View Logs" for any errors

## ⚠️ Important Notes

1. **Database Setup:** Ensure MySQL database is created in cPanel before deployment
2. **Node.js Version:** Use Node.js 18.x or 20.x (not 10.x or 12.x)
3. **Port Configuration:** cPanel will assign a port automatically
4. **Environment Variables:** Must be set in cPanel Node.js Selector for production
5. **Build on Server:** Always build on the server after uploading (don't upload .next folder)
6. **Prisma Migrations:** Run `npx prisma migrate deploy` on server, not `prisma migrate dev`

## 🔍 Verification Checklist (After Deployment)

- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] Admin login works (`/admin/login`)
- [ ] Public pages load correctly
- [ ] File uploads work (test in admin panel)
- [ ] API routes respond correctly
- [ ] No 500 errors in logs

## 📝 Troubleshooting

If you encounter issues:
1. Check cPanel → Node.js Selector → View Logs
2. Verify all environment variables are set correctly
3. Ensure database is accessible from `localhost`
4. Check file permissions (755 for directories, 644 for files)
5. Verify `.next` folder exists (run `npm run build` if missing)
6. See `TROUBLESHOOTING.md` for detailed solutions

## 📚 Related Documentation

- `CPANEL_DEPLOYMENT.md` - Detailed deployment guide
- `ENV_SETUP.md` - Environment variables setup
- `TROUBLESHOOTING.md` - Common issues and solutions
- `ADMIN_SETUP.md` - Admin panel setup

---

**Status:** ✅ Ready for Deployment
**Last Verified:** $(date)
**Build Status:** ✅ Successful
**Prisma Client:** ✅ Generated

