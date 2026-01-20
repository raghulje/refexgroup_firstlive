const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to sanitize folder/file names
function sanitizeName(name) {
  if (!name) return 'general';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

// Configure multer for image uploads with organized structure
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always use 'general' for both page and section
    // All uploads go to /uploads/images/general/general/
    const pageName = 'general';
    const sectionName = 'general';
    
    // Create organized folder structure: uploads/images/general/general/
    const uploadsDir = path.join(__dirname, '../uploads/images');
    const pageDir = path.join(uploadsDir, pageName);
    const sectionDir = path.join(pageDir, sectionName);
    
    // Ensure directories exist
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }
    
    // Store pageName and sectionName in request for later use
    req.uploadPageName = pageName;
    req.uploadSectionName = sectionName;
    
    cb(null, sectionDir);
  },
  filename: (req, file, cb) => {
    // Always use 'general' for both page and section
    const pageName = 'general';
    const sectionName = 'general';
    
    // Get original filename without extension
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const sanitizedOriginalName = sanitizeName(originalName);
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Generate readable filename: general-general-[original-name]-[timestamp].[ext]
    // Example: general-general-slider-1-1703123456789.jpg
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1E6);
    
    // Build filename: prefer original name if available, otherwise use descriptive name
    let filename;
    if (sanitizedOriginalName && sanitizedOriginalName !== 'general') {
      filename = `${pageName}-${sectionName}-${sanitizedOriginalName}-${timestamp}-${uniqueSuffix}${ext}`;
    } else {
      filename = `${pageName}-${sectionName}-image-${timestamp}-${uniqueSuffix}${ext}`;
    }
    
    cb(null, filename);
  }
});

// File filter to only allow images and documents - support all common formats
const fileFilter = (req, file, cb) => {
  // Check MIME type for images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
    return;
  }
  
  // Check MIME type for documents (PDF, DOCX)
  const documentMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];
  if (documentMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  
  // Fallback: check file extension for formats that might have incorrect MIME types
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.heic', '.heif', '.avif', '.ico',
    // Documents
    '.pdf', '.doc', '.docx'
  ];
  
  if (allowedExtensions.includes(ext)) {
    // Accept the file even if MIME type is incorrect
    cb(null, true);
  } else {
    cb(new Error(`Only image and document files are allowed! Supported formats: JPG, PNG, GIF, WEBP, SVG, BMP, TIFF, HEIC, HEIF, AVIF, PDF, DOC, DOCX. Received: ${file.mimetype || 'unknown'}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;

