# cPanel Quick Command Reference

## 🚀 Complete Deployment Commands

Copy and paste these commands in order in your cPanel Terminal or SSH:

### Step 1: Activate Environment & Install Dependencies

**⚠️ Important:** For Next.js builds, you need ALL dependencies (including dev) because Tailwind CSS and PostCSS are required during build time.

```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy && npm install
```

**Note:** We use `npm install` (not `--production`) because Next.js needs build-time dependencies like `@tailwindcss/postcss`, `tailwindcss`, and `postcss` to compile your CSS.

### Step 2: Generate Prisma Client
```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy && npx prisma generate
```

### Step 3: Build the Application
```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy && npm run build
```

### Step 4: Run Database Migrations
```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy && npx prisma migrate deploy
```

---

## 📝 Alternative: One-Line Setup (All Steps)

If you want to run everything at once:

```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy && npm install && npx prisma generate && npm run build && npx prisma migrate deploy
```

**Note:** Using `npm install` (not `--production`) because build requires Tailwind CSS dependencies.

---

## 🔧 Common Commands

### Activate Environment (Start each session with this)
```bash
source /home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate && cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy
```

### Check Node.js Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Verify Prisma Client
```bash
npx prisma --version
```

### Check if .next folder exists
```bash
ls -la .next
```

### View Application Logs
```bash
# In cPanel, go to Node.js Selector → Your App → View Logs
```

---

## ⚠️ Important Notes

1. **Always activate the virtual environment first** - The `source` command activates the Node.js environment
2. **The `20` in the path** refers to Node.js version 20.19.4
3. **Use `--production` flag** when installing to exclude dev dependencies
4. **Environment variables** must be set in cPanel Node.js Selector before building

---

## 🆘 Troubleshooting

### Command not found: npm
- Make sure you activated the virtual environment first
- Verify the path is correct: `/home/zdnmnkw5/nodevenv/public_html/zdn-smart-energy-deploy/20/bin/activate`

### Permission denied
- Check file permissions: `chmod 755 .`
- Verify you're in the correct directory

### Build fails
- Check environment variables are set in cPanel
- Verify DATABASE_URL is correct
- Check Node.js version (should be 20.19.4)

---

**Last Updated:** Based on cPanel Node.js Selector setup

