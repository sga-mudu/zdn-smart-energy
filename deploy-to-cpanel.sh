#!/bin/bash

# ============================================
# Next.js cPanel Deployment Script
# Based on: https://dev.to/saad4software/run-nextjs-app-in-shared-hosting-cpanel-domain-1d4g
# ============================================

set -e  # Exit on error

echo "🚀 Building Next.js locally..."
echo "⚠️  Make sure you've committed your changes before deploying!"
echo ""

# Install dependencies and build
npm install
npm run build

DEPLOY_DIR="zdn-smart-energy-deploy"
rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

echo ""
echo "📦 Copying files (excluding unnecessary files)..."

# Copy files excluding unnecessary items
rsync -av \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.vscode' \
  --exclude='*.log' \
  --exclude='deploy-to-cpanel.sh' \
  --exclude='CPANEL_DEPLOYMENT.md' \
  --exclude='prisma/dev.db' \
  --exclude='*.tar.gz' \
  --exclude='*.zip' \
  --exclude='zdn-smart-energy-deploy' \
  --exclude='.env.local' \
  --exclude='.env.development' \
  --exclude='.env.test' \
  --exclude='*.md' \
  --exclude='scripts/' \
  . "$DEPLOY_DIR/"

# Clean .next/cache/ folder (as per article recommendation)
echo ""
echo "🧹 Cleaning .next/cache/ folder..."
if [ -d "$DEPLOY_DIR/.next/cache" ]; then
  rm -rf "$DEPLOY_DIR/.next/cache"/*
  echo "✅ Removed .next/cache/ contents"
else
  echo "⚠️  .next/cache/ folder not found (this is okay)"
fi

# Very important: DO NOT remove `.next` folder itself
echo ""
echo "📁 Verifying .next folder is included..."
if [ -d "$DEPLOY_DIR/.next" ]; then
  echo "✅ .next folder found"
  echo "   Size: $(du -sh "$DEPLOY_DIR/.next" | cut -f1)"
else
  echo "❌ ERROR: .next folder not found! Run 'npm run build' first."
  exit 1
fi

# Verify essential folders exist
echo ""
echo "📁 Verifying essential folders..."
if [ ! -d "$DEPLOY_DIR/public" ]; then
  echo "⚠️  WARNING: public folder not found!"
fi
if [ ! -f "$DEPLOY_DIR/app.js" ]; then
  echo "⚠️  WARNING: app.js not found! Make sure it's in the root directory."
fi
if [ ! -f "$DEPLOY_DIR/package.json" ]; then
  echo "❌ ERROR: package.json not found!"
  exit 1
fi

# Calculate size before compression
DEPLOY_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
echo ""
echo "📊 Deployment package size: $DEPLOY_SIZE"

# Create zip archive (more universal than tar.gz for cPanel)
echo ""
echo "📦 Creating zip archive..."
cd "$DEPLOY_DIR"
zip -r "../${DEPLOY_DIR}.zip" . -q
cd ..
rm -rf "$DEPLOY_DIR"

ZIP_SIZE=$(du -sh "${DEPLOY_DIR}.zip" | cut -f1)
echo "✅ Created: ${DEPLOY_DIR}.zip ($ZIP_SIZE)"

echo ""
echo "🎉 Deployment package ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Upload ${DEPLOY_DIR}.zip to cPanel File Manager"
echo "   2. Extract the zip file in your app directory"
echo "   3. In cPanel → Node.js Selector → Your App:"
echo "      - Click 'Run NPM install' (or use SSH: npm install)"
echo "      - Make sure .htaccess has PassengerEnvVar directives"
echo "      - Restart the app"
echo ""
echo "⚠️  Remember:"
echo "   - Environment variables must be set in .htaccess (PassengerEnvVar)"
echo "   - Do NOT run 'npm run dev' on the server"
echo "   - The .next folder must remain intact"
echo ""
