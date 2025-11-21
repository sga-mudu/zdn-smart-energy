#!/bin/bash

# cPanel Deployment Script
# This script creates a deployment package excluding unnecessary files

echo "🚀 Creating cPanel deployment package..."
echo ""

# Create deployment directory
DEPLOY_DIR="zdn-smart-energy-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "📦 Copying files..."

# Copy all files except excluded ones
rsync -av \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.env*' \
  --exclude='.DS_Store' \
  --exclude='*.swp' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='coverage' \
  --exclude='.nyc_output' \
  --exclude='scripts' \
  --exclude='prisma/dev.db' \
  --exclude='prisma/migrations' \
  --exclude='*.tsbuildinfo' \
  --exclude='CPANEL_DEPLOYMENT.md' \
  --exclude='deploy-to-cpanel.sh' \
  . "$DEPLOY_DIR/"

echo ""
echo "✅ Files copied successfully!"
echo ""
echo "📝 Creating archive..."

# Create tar.gz archive
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"

echo "✅ Archive created: ${DEPLOY_DIR}.tar.gz"
echo ""
echo "📊 Archive size:"
du -h "${DEPLOY_DIR}.tar.gz"
echo ""
echo "✨ Ready to upload to cPanel!"
echo ""
echo "Next steps:"
echo "1. Upload ${DEPLOY_DIR}.tar.gz to your cPanel File Manager"
echo "2. Extract it in your domain's public_html folder"
echo "3. Follow the instructions in CPANEL_DEPLOYMENT.md"
echo ""

