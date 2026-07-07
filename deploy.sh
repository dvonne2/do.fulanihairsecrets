#!/bin/bash

# Manual deployment script for fulani-gro-magic
# This builds the site and uploads it to your server

echo "🏗️  Building the site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo "📦 Deploying dist/ folder to server..."
echo ""
echo "You need to manually upload the 'dist/' folder to your server at:"
echo "  /home/fulamwhx/public_html"
echo ""
echo "Options to upload:"
echo "1. Use your hosting control panel's file manager"
echo "2. Use FTP client (FileZilla, Cyberduck, etc.)"
echo "3. Use SCP if you have SSH access"
echo ""
echo "After uploading, the site will be live at: https://fulanihairsecrets.com"
