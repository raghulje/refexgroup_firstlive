require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { sequelize } = require("./models");
const status = require("./helpers/response");

const app = express();

// CORS Configuration
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from origin: ${req.headers.origin || 'no-origin'}`);

  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Middleware - increased limits for large file uploads (200MB)
app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// Routes
// Authentication routes (public)
app.use("/api/v1/auth", require("./routes/auth"));
// User management routes (protected)
app.use("/api/v1/users", require("./routes/users"));
// Permissions routes (protected, admin only)
app.use("/api/v1/permissions", require("./routes/permissions"));

app.use("/api/v1/pages", require("./routes/pages"));
app.use("/api/v1/sections", require("./routes/sections"));
app.use("/api/v1/section-content", require("./routes/sectionContent"));
app.use("/api/v1/hero-slides", require("./routes/heroSlides"));
app.use("/api/v1/business-cards", require("./routes/businessCards"));
app.use("/api/v1/awards", require("./routes/awards"));
app.use("/api/v1/newsroom", require("./routes/newsroom"));
app.use("/api/v1/gallery", require("./routes/gallery"));
app.use("/api/v1/leaders", require("./routes/leaders"));
app.use("/api/v1/sdg-cards", require("./routes/sdgCards"));
app.use("/api/v1/core-values", require("./routes/coreValues"));
app.use("/api/v1/testimonials", require("./routes/testimonials"));
app.use("/api/v1/jobs", require("./routes/jobs"));
app.use("/api/v1/navigation", require("./routes/navigation"));
app.use("/api/v1/footer", require("./routes/footer"));
app.use("/api/v1/social-links", require("./routes/socialLinks"));
app.use("/api/v1/contact-info", require("./routes/contactInfo"));
app.use("/api/v1/contact-form", require("./routes/contactForm"));
app.use("/api/v1/global-settings", require("./routes/globalSettings"));
app.use("/api/v1/media", require("./routes/media"));
app.use("/api/v1/cms", require("./routes/cms"));
app.use("/api/v1", require("./routes/homeSections"));
// Email and form submission routes
app.use("/api/v1/email-settings", require("./routes/emailSettings"));
app.use("/api/v1/form-submissions", require("./routes/formSubmissions"));
// Advanced CMS features
app.use("/api/v1/versions", require("./routes/versions"));
app.use("/api/v1/audit-logs", require("./routes/auditLogs"));
app.use("/api/v1/activity-logs", require("./routes/activityLogs"));
app.use("/api/v1/login-history", require("./routes/loginHistory"));
app.use("/api/v1/publish", require("./routes/publish"));

// Image upload endpoint
const uploadImage = require('./middlewares/uploadImage');
const uploadDocument = require('./middlewares/uploadDocument');
const multer = require('multer');

app.post('/api/v1/upload/image', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Always use 'general' for both page and section
    const pageName = 'general';
    const sectionName = 'general';

    // Build organized path: /uploads/images/general/general/filename
    const imageUrl = `/uploads/images/${pageName}/${sectionName}/${req.file.filename}`;
    const localPath = path.join(__dirname, 'uploads', 'images', pageName, sectionName, req.file.filename);


    // Create Media record if mediaService is available
    try {
      const { Media } = require('./models');
      // Determine file type based on extension
      const ext = path.extname(req.file.originalname || req.file.filename).toLowerCase();
      let fileType = 'image';
      if (['.pdf', '.doc', '.docx'].includes(ext)) {
        fileType = 'document';
      } else if (ext === '.svg') {
        fileType = 'svg';
      }

      const media = await Media.create({
        fileName: req.file.originalname || req.file.filename,
        filePath: imageUrl,
        fileType: fileType,
        altText: req.body.altText || req.file.originalname?.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || '',
        pageName: null, // Always null since we use general/general
        sectionName: null // Always null since we use general/general
      });

      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
        localPath: localPath,
        mediaId: media.id,
        pageName: pageName,
        sectionName: sectionName,
        media: media
      });
    } catch (mediaError) {
      // If Media creation fails, still return success with file info
      console.warn('Media record creation failed:', mediaError);
      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
        localPath: localPath,
        pageName: pageName,
        sectionName: sectionName,
        warning: 'Media record not created'
      });
    }
  } catch (error) {
    console.error('Image upload error:', error);
    // Handle multer errors specifically
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 200MB limit' });
      }
      return res.status(400).json({ error: error.message || 'File upload error' });
    }
    // Handle other errors
    const errorMessage = error.message || 'Failed to upload image';
    res.status(500).json({ error: errorMessage });
  }
});

// Document upload endpoint
app.post('/api/v1/upload/file', uploadDocument.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file provided' });
    }

    // Save directly to /uploads/documents/ with original filename
    const fileUrl = `/uploads/documents/${req.file.filename}`;
    const localPath = path.join(__dirname, 'uploads', 'documents', req.file.filename);

    // Create Media record if mediaService is available
    try {
      const { Media } = require('./models');
      const media = await Media.create({
        fileName: req.file.originalname || req.file.filename,
        filePath: fileUrl,
        fileType: 'document',
        altText: req.body.altText || req.file.originalname?.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || '',
        pageName: null,
        sectionName: null
      });

      res.json({
        success: true,
        fileUrl: fileUrl,
        filename: req.file.filename,
        localPath: localPath,
        mediaId: media.id,
        media: media
      });
    } catch (mediaError) {
      // If Media creation fails, still return success with file info
      console.warn('Media record creation failed:', mediaError);
      res.json({
        success: true,
        fileUrl: fileUrl,
        filename: req.file.filename,
        localPath: localPath,
        warning: 'Media record not created'
      });
    }
  } catch (error) {
    console.error('Document upload error:', error);
    // Handle multer errors specifically
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 200MB limit' });
      }
      return res.status(400).json({ error: error.message || 'File upload error' });
    }
    // Handle other errors
    const errorMessage = error.message || 'Failed to upload document';
    res.status(500).json({ error: errorMessage });
  }
});

// Error handler for multer upload errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 200MB limit' });
    }
    return res.status(400).json({ error: error.message || 'File upload error' });
  }
  if (error) {
    return res.status(400).json({ error: error.message || 'File upload error' });
  }
  next();
});

// Helper function to stream PDF file
const streamPDFFile = (filePath, filename, req, res) => {
  try {
    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    console.log(`[PDF Request] File size: ${fileSize} bytes (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

    // Set headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Handle range requests for better performance (allows resuming downloads)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      console.log(`[PDF Request] Range request: bytes ${start}-${end}/${fileSize}`);
      
      const file = fs.createReadStream(filePath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'application/pdf',
      });
      
      file.on('error', (error) => {
        console.error('[PDF Request] Error streaming file (range):', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error reading file' });
        }
      });

      file.on('end', () => {
        console.log(`[PDF Request] Successfully streamed range ${start}-${end}`);
      });
      
      file.pipe(res);
    } else {
      // Stream the entire file
      console.log(`[PDF Request] Streaming full file`);
      const file = fs.createReadStream(filePath);
      
      file.on('error', (error) => {
        console.error('[PDF Request] Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error reading file' });
        } else {
          res.end();
        }
      });

      file.on('end', () => {
        console.log(`[PDF Request] Successfully streamed file: ${filename}`);
      });

      // Handle client disconnect
      req.on('close', () => {
        if (file && !file.destroyed) {
          file.destroy();
          console.log(`[PDF Request] Client disconnected, stream destroyed`);
        }
      });

      file.pipe(res);
    }
  } catch (error) {
    console.error('[PDF Request] Error processing file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error processing file' });
    }
  }
};

// Route to serve files by media ID (looks up actual file path from database)
app.get('/uploads/media/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log(`[Media Request] Requested media ID: ${id}`);
  
  try {
    const { Media } = require('./models');
    const media = await Media.findByPk(id);
    
    if (!media) {
      console.error(`[Media Request] Media not found: ${id}`);
      return res.status(404).json({ error: 'Media not found' });
    }
    
    if (!media.filePath) {
      console.error(`[Media Request] No file path for media: ${id}`);
      return res.status(404).json({ error: 'File path not found' });
    }
    
    // Resolve file path
    let filePath;
    if (media.filePath.startsWith('/uploads/')) {
      // Remove leading slash and join with server directory
      const relativePath = media.filePath.substring(1); // Remove leading /
      filePath = path.join(__dirname, relativePath);
    } else if (media.filePath.startsWith('uploads/')) {
      filePath = path.join(__dirname, media.filePath);
    } else {
      filePath = path.join(__dirname, 'uploads', media.filePath);
    }
    
    console.log(`[Media Request] Resolved path: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`[Media Request] File not found: ${filePath}`);
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check file type
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      streamPDFFile(filePath, media.fileName || path.basename(filePath), req, res);
    } else {
      // For other file types, use express.static behavior
      res.sendFile(filePath);
    }
  } catch (error) {
    console.error('[Media Request] Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error retrieving media' });
    }
  }
});

// Route to serve PDFs from consolidated folder (fallback for legacy files)
app.get('/uploads/consolidated/:filename', (req, res) => {
  const { filename } = req.params;
  
  console.log(`[PDF Request] Consolidated route: ${filename}`);
  
  // Security: prevent path traversal
  if (filename.includes('..')) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  const filePath = path.join(__dirname, 'uploads', 'consolidated', filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`[PDF Request] File not found in consolidated: ${filePath}`);
    return res.status(404).json({ error: 'File not found' });
  }

  if (!filename.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  streamPDFFile(filePath, filename, req, res);
});

// Route for documents directly in /uploads/documents/ (new structure)
app.get('/uploads/documents/:filename', (req, res) => {
  const { filename } = req.params;
  
  console.log(`[Document Request] Requested: /uploads/documents/${filename}`);
  
  // Security: prevent path traversal
  if (filename.includes('..')) {
    console.error(`[Document Request] Invalid path detected: ${filename}`);
    return res.status(400).json({ error: 'Invalid file path' });
  }

  // Try direct location first: uploads/documents/filename
  let filePath = path.join(__dirname, 'uploads', 'documents', filename);
  console.log(`[Document Request] Trying direct path: ${filePath}`);

  // If not found, try legacy structure (general/general/)
  if (!fs.existsSync(filePath)) {
    const legacyPath = path.join(__dirname, 'uploads', 'documents', 'general', 'general', filename);
    console.log(`[Document Request] Direct path not found, trying legacy: ${legacyPath}`);
    if (fs.existsSync(legacyPath)) {
      filePath = legacyPath;
      console.log(`[Document Request] Found in legacy location: ${filePath}`);
    }
  }

  // If still not found, try consolidated folder as fallback
  if (!fs.existsSync(filePath)) {
    const consolidatedPath = path.join(__dirname, 'uploads', 'consolidated', filename);
    console.log(`[Document Request] Trying consolidated: ${consolidatedPath}`);
    if (fs.existsSync(consolidatedPath)) {
      filePath = consolidatedPath;
      console.log(`[Document Request] Found in consolidated: ${filePath}`);
    }
  }

  // Final check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`[Document Request] File not found: ${filename}`);
    return res.status(404).json({ error: 'File not found' });
  }

  // Determine file type and serve accordingly
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') {
    streamPDFFile(filePath, filename, req, res);
  } else {
    // For other document types, send file directly
    res.sendFile(filePath);
  }
});

// Dedicated route for PDF files with streaming support (legacy structure)
app.get('/uploads/documents/:pageName/:sectionName/:filename', (req, res) => {
  const { pageName, sectionName, filename } = req.params;
  
  console.log(`[PDF Request] Requested: /uploads/documents/${pageName}/${sectionName}/${filename}`);
  
  // Security: prevent path traversal
  if (filename.includes('..') || pageName.includes('..') || sectionName.includes('..')) {
    console.error(`[PDF Request] Invalid path detected: ${filename}`);
    return res.status(400).json({ error: 'Invalid file path' });
  }

  // Try legacy location first: uploads/documents/pageName/sectionName/filename
  let filePath = path.join(__dirname, 'uploads', 'documents', pageName, sectionName, filename);
  console.log(`[PDF Request] Trying legacy path: ${filePath}`);
  
  // If not found, try direct location (new structure)
  if (!fs.existsSync(filePath)) {
    const directPath = path.join(__dirname, 'uploads', 'documents', filename);
    console.log(`[PDF Request] Legacy path not found, trying direct: ${directPath}`);
    if (fs.existsSync(directPath)) {
      filePath = directPath;
      console.log(`[PDF Request] Found in direct location: ${filePath}`);
    }
  }

  // If not found, try consolidated folder as fallback
  if (!fs.existsSync(filePath)) {
    const consolidatedPath = path.join(__dirname, 'uploads', 'consolidated', filename);
    console.log(`[PDF Request] Primary path not found, trying consolidated: ${consolidatedPath}`);
    
    if (fs.existsSync(consolidatedPath)) {
      filePath = consolidatedPath;
      console.log(`[PDF Request] Found in consolidated folder: ${filePath}`);
    } else {
      // Try to find by exact filename (case-insensitive) in consolidated
      const consolidatedDir = path.join(__dirname, 'uploads', 'consolidated');
      if (fs.existsSync(consolidatedDir)) {
        const files = fs.readdirSync(consolidatedDir);
        const exactMatch = files.find(f => f.toLowerCase() === filename.toLowerCase());
        
        if (exactMatch) {
          filePath = path.join(consolidatedDir, exactMatch);
          console.log(`[PDF Request] Found exact match (case-insensitive) in consolidated: ${filePath}`);
        } else {
          // Try partial match - extract key parts from filename
          const filenameLower = filename.toLowerCase().replace('.pdf', '');
          // Extract meaningful parts (remove timestamps and random numbers)
          const keyParts = filenameLower.split('-').filter(part => 
            part.length > 3 && !/^\d+$/.test(part) && !part.includes('general')
          );
          
          const matchingFile = files.find(f => {
            if (!f.toLowerCase().endsWith('.pdf')) return false;
            const fLower = f.toLowerCase().replace('.pdf', '');
            // Check if any key part matches
            return keyParts.some(part => fLower.includes(part)) || fLower.includes(filenameLower);
          });
          
          if (matchingFile) {
            filePath = path.join(consolidatedDir, matchingFile);
            console.log(`[PDF Request] Found partial match in consolidated: ${filePath}`);
          }
        }
      }
    }
  }

  // Final check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`[PDF Request] File not found in any location. Searched:`);
    console.error(`  - Primary: ${path.join(__dirname, 'uploads', 'documents', pageName, sectionName, filename)}`);
    console.error(`  - Consolidated: ${path.join(__dirname, 'uploads', 'consolidated', filename)}`);
    return res.status(404).json({ error: 'File not found' });
  }

  // Check if it's actually a PDF
  if (!filename.toLowerCase().endsWith('.pdf')) {
    console.error(`[PDF Request] Invalid file type: ${filename}`);
    return res.status(400).json({ error: 'Invalid file type' });
  }

  // Stream the file
  streamPDFFile(filePath, filename, req, res);
});

// Serve uploaded files (images, documents, etc.) with proper content-type headers
// Note: PDF files in /uploads/documents/ are handled by the dedicated route above
app.use('/uploads', (req, res, next) => {
  // Set proper content-type for Word documents
  if (req.path.endsWith('.doc') || req.path.endsWith('.docx')) {
    res.type('application/msword');
  }
  // Set proper content-type for Excel files
  else if (req.path.endsWith('.xls') || req.path.endsWith('.xlsx')) {
    res.type('application/vnd.ms-excel');
  }
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set cache headers for static files
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running well",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.all("/api/v1/*", (req, res) => {
  return status.responseStatus(res, 404, "Endpoint Not Found");
});

// Only serve built client files if SERVE_CLIENT is explicitly set to 'true'
// When running separately, client will be on port 3000 (Vite dev server)
const shouldServeClient = process.env.SERVE_CLIENT === 'true';
const clientPath = path.join(__dirname, "../client/out");

if (shouldServeClient && fs.existsSync(clientPath)) {
  // Production mode: serve built client files
  app.use(express.static(clientPath));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      res.sendFile(path.join(clientPath, "index.html"));
    }
  });
} else {
  // Development mode - don't serve client, just API
  // Return helpful message for non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      res.json({
        message: "API Server is running. Client should be running separately on port 3000.",
        apiUrl: `http://localhost:${process.env.PORT || 3002}/api/v1`,
        clientUrl: "http://localhost:3000",
        note: "Set SERVE_CLIENT=true in .env to serve built client files"
      });
    }
  });
}
// Start server
const PORT = process.env.PORT || 3002;

// Function to find next available port
function findAvailablePort(startPort, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    const net = require('net');
    let currentPort = startPort;
    let attempts = 0;

    function tryPort(port) {
      if (attempts >= maxAttempts) {
        reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
        return;
      }

      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => {
          resolve(port);
        });
        server.close();
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          currentPort++;
          tryPort(currentPort);
        } else {
          reject(err);
        }
      });
    }

    tryPort(currentPort);
  });
}

console.log("Starting database sync...");

// Check if sync should be disabled (for production with imported database)
const SKIP_SYNC = process.env.SKIP_DB_SYNC === 'true' || process.env.NODE_ENV === 'production';

if (SKIP_SYNC) {
  console.log("Database sync skipped (SKIP_DB_SYNC=true or NODE_ENV=production). Using existing database schema.");
  // Just authenticate and start server
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection established.");
      startServer();
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
      process.exit(1);
    });
} else {
  // Check if tables already exist (database was imported from SQL)
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection established.");
      // Check if media table exists
      return sequelize.getQueryInterface().showAllTables();
    })
    .then((tables) => {
      const hasMediaTable = tables.some(table => 
        table.toLowerCase() === 'media' || table === 'Media' || table === 'media'
      );
      
      if (hasMediaTable && tables.length > 0) {
        console.log(`Database already has ${tables.length} tables. Skipping sync (using existing schema).`);
        // Don't sync if tables exist - database was imported from SQL
        return Promise.resolve();
      } else {
        console.log("No existing tables found. Running sync to create tables...");
        // Only sync if tables don't exist
        return sequelize.sync({ force: false, alter: false });
      }
    })
    .then(() => {
      console.log("Database ready.");
      startServer();
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
      // Still try to start server even if sync fails (tables might already exist)
      console.log("Attempting to start server anyway (tables may already exist)...");
      startServer();
    });
}

// Helper function to start the server
function startServer() {
  // Try to find available port
  findAvailablePort(PORT)
    .then((availablePort) => {
      app.listen(availablePort, () => {
        console.log(`Server is running on port ${availablePort}.`);
        if (availablePort !== PORT) {
          console.log(`Note: Port ${PORT} was in use, using port ${availablePort} instead.`);
        }
      });
    })
    .catch((err) => {
      console.error("Error finding available port:", err);
      // Fallback: try default port anyway
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
      });
    });
}

