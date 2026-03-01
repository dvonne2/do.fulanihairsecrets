import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Function to convert a single image to WebP
async function convertToWebP(inputPath, quality = 80) {
  try {
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ WebP already exists: ${outputPath}`);
      return;
    }

    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✓ Converted: ${inputPath} → ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

// Function to find all image files recursively
function findImageFiles(dir, extensions = ['.png', '.jpg', '.jpeg']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and dist folders
        if (item !== 'node_modules' && item !== 'dist' && item !== '.git') {
          traverse(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main conversion function
async function convertAllImages() {
  const projectRoot = process.cwd();
  const imageFiles = findImageFiles(projectRoot);
  
  console.log(`Found ${imageFiles.length} images to convert...`);
  console.log('─'.repeat(60));
  
  // Convert all images
  for (const imagePath of imageFiles) {
    await convertToWebP(imagePath, 80);
  }
  
  console.log('─'.repeat(60));
  console.log('✅ Conversion complete!');
  
  // Show file size comparison for a few files
  console.log('\n📊 Sample file size comparisons:');
  const sampleFiles = imageFiles.slice(0, 5);
  
  for (const originalPath of sampleFiles) {
    const webpPath = originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    if (fs.existsSync(webpPath)) {
      const originalStats = fs.statSync(originalPath);
      const webpStats = fs.statSync(webpPath);
      
      const originalSize = (originalStats.size / 1024).toFixed(1);
      const webpSize = (webpStats.size / 1024).toFixed(1);
      const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`${path.basename(originalPath)}: ${originalSize}KB → ${webpSize}KB (${savings}% smaller)`);
    }
  }
}

// Run the conversion
convertAllImages().catch(console.error);
