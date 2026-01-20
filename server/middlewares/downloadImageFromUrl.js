const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Try to use uuid, fallback to timestamp-based ID
let uuidv4;
try {
  uuidv4 = require('uuid').v4;
} catch {
  uuidv4 = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
}

/**
 * Download image from URL and save to organized folder structure
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} pageName - Name of the page (e.g., 'home-page', 'about-page')
 * @param {string} sectionName - Name of the section (e.g., 'hero', 'about')
 * @returns {Promise<{filePath: string, fileName: string}>}
 */
async function downloadImageFromUrl(imageUrl, pageName = 'general', sectionName = 'general') {
  return new Promise((resolve, reject) => {
    // Validate URL
    if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
      reject(new Error('Invalid URL. Must start with http:// or https://'));
      return;
    }

    // Determine protocol
    const protocol = imageUrl.startsWith('https://') ? https : http;
    
    // Get file extension from URL
    const urlPath = new URL(imageUrl).pathname;
    const urlExtension = path.extname(urlPath).toLowerCase() || '.jpg';
    
    // Validate extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.avif'];
    const extension = validExtensions.includes(urlExtension) ? urlExtension : '.jpg';
    
    // Create organized folder structure: uploads/images/[page-name]/[section-name]/
    const uploadsDir = path.join(__dirname, '../uploads/images');
    const pageDir = path.join(uploadsDir, pageName);
    const sectionDir = path.join(pageDir, sectionName);
    
    // Ensure directories exist
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }
    
    // Generate unique filename
    const fileName = `${uuidv4()}${extension}`;
    const filePath = path.join(sectionDir, fileName);
    
    // Download the file
    const file = fs.createWriteStream(filePath);
    
    protocol.get(imageUrl, (response) => {
      // Check if response is successful
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath); // Delete the file on error
        reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
        return;
      }
      
      // Check content type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`Invalid content type: ${contentType}. Expected image/*`));
        return;
      }
      
      // Pipe the response to file
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const relativePath = `/uploads/images/${pageName}/${sectionName}/${fileName}`;
        resolve({
          filePath: relativePath,
          fileName: fileName,
          fullPath: filePath
        });
      });
      
      file.on('error', (err) => {
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(err);
      });
    }).on('error', (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

module.exports = downloadImageFromUrl;

