# cPanel Cleanup Guide - Removing .git Directory

## ⚠️ Why Remove .git?

The `.git` directory is your Git version control folder. It should **NOT** be on your production server because:
- ❌ Security risk (exposes commit history, branches, config)
- ❌ Unnecessary (not needed for running the app)
- ❌ Wastes disk space (can be several MB/GB)
- ❌ Not used by your application

## 🗑️ How to Remove .git from cPanel

### Option 1: Via cPanel File Manager (Easiest)

1. Log into **cPanel**
2. Open **File Manager**
3. Navigate to your app directory:
   - `/home/zdnmnkw5/public_html/zdn-smart-energy-deploy`
4. Look for the `.git` folder (it may be hidden - enable "Show Hidden Files")
5. Right-click on `.git` folder → **Delete**
6. Confirm deletion

### Option 2: Via SSH/Terminal (Recommended)

```bash
# Navigate to your app directory
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy

# Remove .git directory (CAREFUL - this is permanent!)
rm -rf .git

# Verify it's gone
ls -la | grep .git
# Should return nothing
```

### Option 3: Via cPanel Terminal

1. Go to **cPanel → Terminal**
2. Run the commands from Option 2 above

## ✅ Verify .git is Removed

After deletion, verify:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy
ls -la | grep .git
# Should return nothing (empty)
```

Or check file count:
```bash
du -sh .git 2>/dev/null || echo ".git directory not found ✅"
```

## 🔒 Prevent Future Issues

Your deployment script (`deploy-to-cpanel.sh`) already excludes `.git`, but to be extra safe:

1. **Always use the deployment script** - Don't manually copy files
2. **Check before uploading** - Verify `.git` is not in your archive
3. **Use .gitignore** - Ensure sensitive files are ignored

## 📋 Other Files/Folders to Remove (if present)

While cleaning up, also remove these if they exist:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy

# Remove development files
rm -rf .vscode          # VS Code settings
rm -rf .idea            # IDE settings
rm -rf .DS_Store        # macOS files
rm -rf *.log            # Log files
rm -rf .env.local       # Local env files
rm -rf .env.development # Dev env files

# Keep these (they're needed):
# ✅ .next/              # Next.js build output
# ✅ node_modules/      # Dependencies
# ✅ public/            # Public assets
# ✅ .env               # Production env (if used)
```

## 🛡️ Security Best Practices

After removing `.git`, also check:

1. **No .env files with secrets** - Use cPanel environment variables instead
2. **No development files** - Remove `.vscode`, `.idea`, etc.
3. **Proper file permissions** - Directories: 755, Files: 644
4. **No backup files** - Remove `.bak`, `.old`, `.backup` files

## ⚡ Quick Cleanup Script

Run this to clean up common unnecessary files:

```bash
cd /home/zdnmnkw5/public_html/zdn-smart-energy-deploy

# Remove .git
rm -rf .git

# Remove IDE files
rm -rf .vscode .idea

# Remove macOS files
find . -name ".DS_Store" -delete

# Remove log files
rm -f *.log

# Verify cleanup
echo "✅ Cleanup complete!"
ls -la | grep -E "\.git|\.vscode|\.idea"
```

---

**Note:** The `.git` directory removal is **permanent**. Make sure you have your code backed up in your local Git repository before removing it from cPanel.

