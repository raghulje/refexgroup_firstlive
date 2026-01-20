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

// Configure multer for document uploads - save directly to /uploads/documents/ with original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save directly to /uploads/documents/ (no subfolders)
    const uploadsDir = path.join(__dirname, '../uploads/documents');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use original filename, but handle conflicts by adding a number suffix
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    
    // Sanitize filename to remove special characters that might cause issues
    const sanitizedBaseName = baseName
      .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid filename characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    
    const uploadsDir = path.join(__dirname, '../uploads/documents');
    let filename = `${sanitizedBaseName}${ext}`;
    let filePath = path.join(uploadsDir, filename);
    let counter = 1;
    
    // If file exists, add a number suffix
    while (fs.existsSync(filePath)) {
      filename = `${sanitizedBaseName}_${counter}${ext}`;
      filePath = path.join(uploadsDir, filename);
      counter++;
    }
    
    cb(null, filename);
  }
});

// File filter to only allow documents
const fileFilter = (req, file, cb) => {
  // Check MIME type
  const validMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/plain',
    'text/csv',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
  ];
  
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  
  // Fallback: check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv', '.ppt', '.pptx'];
  
  if (allowedExtensions.includes(ext)) {
    // Accept the file even if MIME type is incorrect
    cb(null, true);
  } else {
    cb(new Error(`Only document files are allowed! Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV, PPT, PPTX. Received: ${file.mimetype || 'unknown'}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit for documents
  },
  fileFilter: fileFilter
});

module.exports = upload;

