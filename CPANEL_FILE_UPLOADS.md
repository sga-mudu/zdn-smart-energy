# cPanel File Upload Setup Guide

This guide helps you set up file uploads from the admin panel to cPanel's file system.

## ✅ Quick Setup (5 minutes)

### Step 1: Create Upload Directories

Via **cPanel File Manager** or **SSH/Terminal**:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy  # Your app path
mkdir -p public/uploads/product
mkdir -p public/uploads/brand
mkdir -p public/uploads/news
```

### Step 2: Set File Permissions

**Via cPanel File Manager:**
1. Navigate to `public/uploads` folder
2. Right-click → **Change Permissions**
3. Set to **755** (check: Owner: Read/Write/Execute, Group: Read/Execute, Public: Read/Execute)
4. Click **Change Permissions**
5. Repeat for `product`, `brand`, and `news` subdirectories

**Via SSH/Terminal:**
```bash
chmod 755 public/uploads
chmod 755 public/uploads/product
chmod 755 public/uploads/brand
chmod 755 public/uploads/news
```

### Step 3: Verify Setup

Test that directories are writable:
```bash
touch public/uploads/product/test.txt
rm public/uploads/product/test.txt
# If no errors, permissions are correct ✅
```

### Step 4: Test Upload from Admin Panel

1. Log into admin panel: `https://zdn.mn/admin/login`
2. Go to Products/Brands/News → Create New
3. Try uploading an image
4. Check if file appears in `public/uploads/{type}/` directory

---

## 📁 Directory Structure

After setup, your upload directories should look like:

```
public/
└── uploads/
    ├── product/     (755 permissions)
    ├── brand/       (755 permissions)
    └── news/        (755 permissions)
```

Uploaded files will be saved as:
- `public/uploads/product/{timestamp}_{random}.{ext}`
- `public/uploads/brand/{timestamp}_{random}.{ext}`
- `public/uploads/news/{timestamp}_{random}.{ext}`

---

## 🔧 How It Works

1. **Admin uploads image** → Admin panel sends file to `/api/upload`
2. **API validates file** → Checks type, size, content (magic numbers)
3. **File saved to cPanel** → Saved to `public/uploads/{type}/` directory
4. **Public URL returned** → `/uploads/{type}/{filename}` (accessible via web)

The upload route automatically:
- ✅ Creates directories if they don't exist
- ✅ Validates file permissions before saving
- ✅ Generates secure, unique filenames
- ✅ Returns helpful error messages if something fails

---

## ⚠️ Common Issues & Solutions

### Issue: "Permission denied" error

**Solution:**
```bash
chmod 755 public/uploads
chmod 755 public/uploads/product
chmod 755 public/uploads/brand
chmod 755 public/uploads/news
```

### Issue: "Upload directory not found"

**Solution:**
Create the directories manually:
```bash
mkdir -p public/uploads/{product,brand,news}
chmod 755 public/uploads
chmod 755 public/uploads/*
```

### Issue: Files upload but don't appear

**Check:**
1. Files are saved to: `public/uploads/{type}/`
2. Check file permissions: `ls -la public/uploads/product/`
3. Verify files exist: `ls public/uploads/product/`

### Issue: "File too large" error

**Solution:**
The default max file size is 5MB. To change:
1. Set environment variable in cPanel Node.js Selector:
   - `MAX_FILE_SIZE=10485760` (for 10MB)
2. Restart the application

### Issue: "Invalid file type" error

**Allowed file types:**
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/webp`

To add more types, set in cPanel environment variables:
- `ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/gif`

---

## 🔍 Verify Uploads Are Working

### Check via cPanel File Manager:
1. Navigate to `public/uploads/product/` (or brand/news)
2. Upload an image from admin panel
3. Refresh File Manager - new file should appear

### Check via Terminal:
```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy
ls -lh public/uploads/product/
# Should show recently uploaded files with timestamps
```

### Check via Browser:
Upload an image, then visit:
- `https://zdn.mn/uploads/product/{filename}`
- Image should display if upload was successful

---

## 📝 File Permissions Reference

| Type | Permission | Description |
|------|-----------|-------------|
| Directories | `755` | Owner: read/write/execute, Others: read/execute |
| Files | `644` | Owner: read/write, Others: read only |

**Why 755 for directories?**
- Owner (your app) needs write access to save files
- Web server needs read/execute to serve files
- Others need read/execute for security

---

## 🚀 Production Checklist

Before going live, verify:

- [ ] Upload directories exist (`product/`, `brand/`, `news/`)
- [ ] All directories have `755` permissions
- [ ] Test upload from admin panel works
- [ ] Uploaded images are accessible via URL
- [ ] File size limits are appropriate (default 5MB)
- [ ] Only allowed file types can be uploaded

---

## 📞 Need Help?

If uploads still don't work:

1. **Check Application Logs:**
   - cPanel → Node.js Selector → Your App → View Logs
   - Look for upload-related errors

2. **Check File Permissions:**
   ```bash
   ls -la public/uploads/
   # Should show drwxr-xr-x (755) for directories
   ```

3. **Verify Directory Path:**
   The app uses `process.cwd()` which resolves to your app root on cPanel
   - App root: `/home/zdnmnkw5/public_html/zdn-smart-energy-deploy`
   - Upload path: `{app_root}/public/uploads/{type}/`

4. **Test Manually:**
   ```bash
   # Try creating a test file
   echo "test" > public/uploads/product/test.txt
   # If this fails, permissions are wrong
   ```

---

**Last Updated:** Based on cPanel deployment setup
**App URL:** https://zdn.mn
**Upload Endpoint:** `/api/upload`

