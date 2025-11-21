# cPanel Deployment Guide

This guide will help you deploy your ZDN Smart Energy Next.js application to cPanel.

## Prerequisites

- cPanel account with Node.js support (Node.js Selector)
- MySQL database created in cPanel
- FTP/File Manager access to cPanel
- SSH access (recommended, but not required)

## Step 1: Prepare Your Project

### Build the project locally:

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Step 2: Database Setup

1. **Create MySQL Database in cPanel:**
   - Go to cPanel → MySQL Databases
   - Create a new database (e.g., `zdn_smart_energy`)
   - Create a database user
   - Add user to database with ALL PRIVILEGES

2. **Get Database Connection Details:**
   - Host: Usually `localhost` (check your cPanel for the exact hostname)
   - Database name: The database you created
   - Username: The database user
   - Password: The password you set

3. **Update DATABASE_URL:**
   ```
   mysql://username:password@host:port/database_name?connection_limit=3&pool_timeout=20
   ```
   
   Example:
   ```
   mysql://zdn_user:your_password@localhost:3306/zdn_smart_energy?connection_limit=3&pool_timeout=20
   ```

## Step 3: Upload Files to cPanel

### Option A: Using File Manager (Recommended for beginners)

1. **Compress your project:**
   ```bash
   # Exclude node_modules and .next folder (we'll rebuild on server)
   tar -czf zdn-smart-energy.tar.gz \
     --exclude='node_modules' \
     --exclude='.next' \
     --exclude='.git' \
     --exclude='*.log' \
     --exclude='.env*' \
     .
   ```

2. **Upload via File Manager:**
   - Log into cPanel → File Manager
   - Navigate to your domain's public_html or subdomain folder
   - Upload the tar.gz file
   - Extract it

### Option B: Using FTP/SFTP

1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your cPanel account
3. Upload all files except:
   - `node_modules/` (will be installed on server)
   - `.next/` (will be built on server)
   - `.git/`
   - `.env*` (create on server)

## Step 4: Set Up Node.js App in cPanel

1. **Go to Node.js Selector:**
   - cPanel → Software → Node.js Selector

2. **Create Node.js App:**
   - Click "Create Application"
   - **Node.js version:** Select latest LTS (18.x or 20.x)
   - **Application mode:** Production
   - **Application root:** `/home/username/your_domain/public_html` (or subdomain path)
   - **Application URL:** Your domain or subdomain
   - **Application startup file:** `server.js` (we'll create this)
   - Click "Create"

3. **Note the App URL and Port:**
   - You'll see something like: `http://yourdomain.com:3000`
   - Or: `http://yourdomain.com` (if using reverse proxy)

## Step 5: Create Server Entry Point

Create a `server.js` file in your project root:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

## Step 6: Install Dependencies

1. **Via SSH (Recommended):**
   ```bash
   cd /home/username/your_domain/public_html
   npm install --production
   ```

2. **Via Terminal in cPanel:**
   - Go to cPanel → Terminal
   - Navigate to your project directory
   - Run: `npm install --production`

## Step 7: Set Environment Variables

You have two options for setting environment variables in cPanel:

### Option A: Using Node.js Selector (Recommended)

1. **In Node.js Selector:**
   - Click on your app → "Environment Variables"
   - Add the following variables one by one:

   ```
   NODE_ENV=production
   DATABASE_URL=mysql://username:password@host:port/database_name?connection_limit=3&pool_timeout=20
   NEXTAUTH_SECRET=your-generated-secret-key-here
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator, but make sure it's at least 32 characters long.

### Option B: Using .env File

1. **Create .env file:**
   - In File Manager, navigate to your project root
   - Create a new file named `.env` (with the dot at the beginning)
   - Copy the contents from `.env.example` in your project
   - Fill in your actual values

2. **Example .env file:**
   ```env
   NODE_ENV=production
   DATABASE_URL=mysql://zdn_user:your_password@localhost:3306/zdn_smart_energy?connection_limit=3&pool_timeout=20
   NEXTAUTH_SECRET=your-generated-secret-key-minimum-32-characters
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

3. **Secure the .env file:**
   - Set file permissions to 600 (read/write for owner only)
   - In File Manager: Right-click `.env` → Change Permissions → 600
   - Or via SSH: `chmod 600 .env`

### Important Notes:

- **Never commit .env to version control** - it's already in .gitignore
- **Use different secrets for development and production**
- **Keep your NEXTAUTH_SECRET secure** - if compromised, regenerate it
- **DATABASE_URL format:** `mysql://username:password@host:port/database_name?connection_limit=3&pool_timeout=20`
- **Replace all placeholder values** with your actual configuration

## Step 8: Build the Application

1. **Via SSH or Terminal:**
   ```bash
   cd /home/username/your_domain/public_html
   npm run build
   ```

   This will create the `.next` folder with optimized production files.

## Step 9: Run Database Migrations

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

## Step 10: Start/Restart the Application

1. **In Node.js Selector:**
   - Click on your app
   - Click "Restart App"

2. **Check Logs:**
   - Click "View Logs" to see if there are any errors
   - Check both "Error Log" and "Output Log"

## Step 11: Configure Domain/Subdomain

### If using a subdomain or custom domain:

1. **Set up Reverse Proxy (if needed):**
   - Some cPanel setups require reverse proxy configuration
   - Check with your hosting provider

2. **Update .htaccess (if using Apache):**
   Create `.htaccess` in public_html:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ http://localhost:PORT/$1 [P,L]
   ```
   Replace `PORT` with your Node.js app port.

## Step 12: Set Up File Uploads Directory

1. **Create uploads directory:**
   ```bash
   mkdir -p public/uploads/product
   mkdir -p public/uploads/brand
   mkdir -p public/uploads/news
   ```

2. **Set permissions:**
   ```bash
   chmod 755 public/uploads
   chmod 755 public/uploads/product
   chmod 755 public/uploads/brand
   chmod 755 public/uploads/news
   ```

## Troubleshooting

### Application won't start:
- Check Node.js version (should be 18.x or 20.x)
- Verify all environment variables are set
- Check logs in Node.js Selector
- Ensure port is not in use

### Database connection errors:
- Verify DATABASE_URL format
- Check database user has correct permissions
- Ensure database host is correct (might be `localhost` or specific hostname)
- Check if MySQL is running

### 500 Internal Server Error:
- Check server logs
- Verify environment variables
- Ensure `.next` folder exists (run `npm run build`)
- Check file permissions

### Static files not loading:
- Verify `public` folder is in correct location
- Check file permissions (should be 644 for files, 755 for directories)
- Clear browser cache

### Build errors:
- Ensure all dependencies are installed
- Check Node.js version compatibility
- Verify Prisma schema is correct

## Production Checklist

- [ ] Environment variables set correctly
- [ ] Database created and migrated
- [ ] Application built (`npm run build`)
- [ ] Prisma client generated
- [ ] Node.js app started and running
- [ ] File upload directories created with correct permissions
- [ ] Domain/subdomain configured
- [ ] SSL certificate installed (HTTPS)
- [ ] Admin user created (via seed script)
- [ ] Test admin login
- [ ] Test file uploads
- [ ] Test all major features

## Security Recommendations

1. **Change default admin password** after first login
2. **Use strong NEXTAUTH_SECRET** (32+ characters)
3. **Enable HTTPS/SSL** for secure connections
4. **Restrict file upload sizes** (already configured)
5. **Regular backups** of database and files
6. **Keep dependencies updated**

## Maintenance

### Update the application:
1. Upload new files (excluding node_modules, .next)
2. Run `npm install` (if new dependencies)
3. Run `npm run build`
4. Restart Node.js app

### Backup:
- Database: Export via phpMyAdmin or command line
- Files: Download via File Manager or FTP

## Support

If you encounter issues:
1. Check cPanel error logs
2. Check Node.js application logs
3. Verify all environment variables
4. Test database connection separately
5. Contact your hosting provider if issues persist

---

**Last Updated:** After project finalization
**Next.js Version:** 15.5.6
**Node.js Required:** 18.x or 20.x

