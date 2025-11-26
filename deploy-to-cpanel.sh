#!/bin/bash

echo "🚀 Building Next.js locally..."
npm install
npm run build

DEPLOY_DIR="zdn-smart-energy-deploy"
rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

echo "📦 Copying files..."

rsync -av \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.vscode' \
  --exclude='*.log' \
  --exclude='deploy-to-cpanel.sh' \
  --exclude='CPANEL_DEPLOYMENT.md' \
  . "$DEPLOY_DIR/"

# very important: DO NOT remove `.next` at any point
echo "📁 Ensuring .next folder is included..."
ls -lah "$DEPLOY_DIR/.next"

echo "📦 Creating archive..."
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"

echo "🎉 Deployment package ready!"
echo "Upload to cPanel → extract → run 'Install Dependencies' → Start app."
