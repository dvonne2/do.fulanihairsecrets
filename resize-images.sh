#!/bin/bash

# Resize oversized WebP images for performance optimization
# Target: 700px max dimension (down from 2048x2048)

echo "🔧 Resizing oversized WebP images for performance..."

# Images to resize (mentioned in PageSpeed report)
IMAGES=(
    "public/assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp"
    "public/assets/Gemini_Generated_Image_gj65n6gj65n6gj65.webp"
    "public/assets/Gemini_Generated_Image_1knotm1knotm1kno.webp"
)

for img in "${IMAGES[@]}"; do
    if [ -f "$img" ]; then
        echo "📸 Processing: $img"
        
        # Get original size
        original_size=$(stat -f%z "$img")
        echo "   Original size: $((original_size / 1024)) KB"
        
        # Create temporary file
        temp_file="${img%.webp}_temp.webp"
        
        # Resize with cwebp (target 700px, quality 85)
        cwebp -resize 700 700 -q 85 "$img" -o "$temp_file"
        
        # Replace original
        mv "$temp_file" "$img"
        
        # Get new size
        new_size=$(stat -f%z "$img")
        savings=$((original_size - new_size))
        echo "   New size: $((new_size / 1024)) KB (saved $((savings / 1024)) KB)"
        echo "   ✅ Done"
    else
        echo "❌ File not found: $img"
    fi
done

echo "🎉 Image resizing complete!"
