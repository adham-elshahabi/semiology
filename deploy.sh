#!/bin/bash

set -e  # Stop script on any error

echo "🔨 Building Vite project..."
npm run build -- --outDir dist

echo "🧹 Preparing deployment directory..."

TARGET_DIR="/var/www/html/semiology"

# Create the target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
  echo "📁 Creating deployment directory at $TARGET_DIR"
  sudo mkdir -p "$TARGET_DIR"
fi

echo "🧹 Cleaning old deployment..."
sudo rm -rf "$TARGET_DIR"/*

echo "📦 Copying new build to server directory..."
sudo cp -r dist/* "$TARGET_DIR"

echo "✅ Deployment complete: https://adham.elshahabi.com/semiology/"
