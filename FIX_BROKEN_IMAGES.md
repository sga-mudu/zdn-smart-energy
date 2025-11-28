# Fix Broken Product Images on cPanel

## 🔍 Problem

Product images are not displaying on the frontend, showing broken image placeholders instead.

## ✅ Solution Steps

### Step 1: Check if File Exists on Server

Via **cPanel File Manager** or **SSH**:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy
ls -la public/uploads/product/
```

Look for the file mentioned in the admin panel. For example:
- Admin shows: `/uploads/product/1764166537267_77681dc39fe17990.jp`
- Check if file exists: `1764166537267_77681dc39fe17990.jp` or `1764166537267_77681dc39fe17990.jpg`

### Step 2: Fix Extension Issues

If the file has a wrong extension (like `.jp` instead of `.jpg`):

**Option A: Re-upload the image (Recommended)**
1. Go to Admin Panel → Edit Product
2. Upload a new image
3. The new upload will use the fixed extension extraction

**Option B: Rename the file manually**
```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy/public/uploads/product
# Rename .jp to .jpg
mv 1764166537267_77681dc39fe17990.jp 1764166537267_77681dc39fe17990.jpg
```

Then update the database:
- The image path in the database should match the actual filename

### Step 3: Verify File Permissions

Ensure files are readable by the web server:

```bash
chmod 644 public/uploads/product/*
chmod 644 public/uploads/brand/*
chmod 644 public/uploads/news/*
```

### Step 4: Check Image Path in Database

The image path stored in the database should be:
- ✅ Correct: `/uploads/product/1764166537267_77681dc39fe17990.jpg`
- ❌ Wrong: `/uploads/product/1764166537267_77681dc39fe17990.jp`

### Step 5: Test Image URL Directly

Try accessing the image directly in your browser:
```
https://zdn.mn/uploads/product/1764166537267_77681dc39fe17990.jpg
```

If the image loads:
- ✅ File exists and is accessible
- ✅ Issue is likely in the frontend code or database path

If you get 404:
- ❌ File doesn't exist or wrong path
- ❌ Check file permissions
- ❌ Verify the file is in the correct directory

### Step 6: Clear Browser Cache

Sometimes cached broken images persist:
1. Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache completely

## 🔧 Common Issues & Fixes

### Issue: File extension is `.jp` instead of `.jpg`

**Cause:** Old upload code had extension extraction bug

**Fix:**
1. Re-upload the image (new code fixes this automatically)
2. Or manually rename the file and update database

### Issue: Image shows broken placeholder

**Possible causes:**
1. File doesn't exist on server
2. Wrong file path in database
3. File permissions too restrictive
4. File extension mismatch

**Fix:**
```bash
# Check if file exists
ls -la public/uploads/product/ | grep "filename"

# Fix permissions
chmod 644 public/uploads/product/filename.jpg

# Verify file is accessible
curl -I https://zdn.mn/uploads/product/filename.jpg
```

### Issue: Images work locally but not on cPanel

**Cause:** Path resolution differences between local and production

**Fix:**
- Ensure `public/uploads/` directory exists on cPanel
- Check file permissions (755 for directories, 644 for files)
- Verify `process.cwd()` resolves correctly on cPanel

## 📝 Quick Fix Script

Run this to check and fix common image issues:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy

# Check upload directories exist
echo "Checking upload directories..."
ls -la public/uploads/

# Check file permissions
echo "Checking file permissions..."
ls -la public/uploads/product/ | head -5

# Fix permissions if needed
chmod 755 public/uploads
chmod 755 public/uploads/product
chmod 755 public/uploads/brand
chmod 755 public/uploads/news
chmod 644 public/uploads/product/* 2>/dev/null
chmod 644 public/uploads/brand/* 2>/dev/null
chmod 644 public/uploads/news/* 2>/dev/null

echo "✅ Permissions fixed!"
```

## 🚀 Prevention

To prevent broken images in the future:

1. **Always use the upload feature** - Don't manually add image paths
2. **Check file after upload** - Verify the image appears in File Manager
3. **Test image URL** - Try accessing the image URL directly
4. **Use correct file types** - Only upload: jpg, png, webp, gif

## 🔍 Debugging Steps

If images still don't work:

1. **Check Application Logs:**
   - cPanel → Node.js Selector → Your App → View Logs
   - Look for upload or file access errors

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for image loading errors

3. **Check Network Tab:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try loading the page
   - Check if image requests return 404 or other errors

4. **Verify File Path:**
   ```bash
   # Check actual file path
   find public/uploads -name "*1764166537267*"
   
   # Check database path (if you have database access)
   # The image field should match the actual file path
   ```

## 📞 Still Not Working?

If images still don't display:

1. **Verify Next.js Image Configuration:**
   - Check `next.config.mjs` has `unoptimized: true` (required for cPanel)
   - Images should be in `public/` folder

2. **Check .htaccess (if exists):**
   - Ensure it's not blocking image requests
   - Should allow access to `/uploads/` directory

3. **Test with regular `<img>` tag:**
   - Temporarily replace Next.js `<Image>` with `<img>` to test
   - If `<img>` works, issue is with Next.js Image component
   - If `<img>` doesn't work, issue is with file path/permissions

---

**Last Updated:** After fixing extension extraction bug
**Related Files:** `app/api/upload/route.ts`, `app/products/[id]/page.tsx`

