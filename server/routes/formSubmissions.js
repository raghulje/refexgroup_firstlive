const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const formSubmissionController = require('../controllers/formSubmissionController');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');

// Create uploads/resumes directory if it doesn't exist
const resumesDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
}

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, resumesDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `resume-${name}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept PDF, DOC, DOCX files
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

// Public routes (no authentication required)
router.post('/career-application', upload.single('resume'), formSubmissionController.submitCareerApplication);
router.post('/contact-form', formSubmissionController.submitContactForm);

// Admin routes (authentication required)
router.get('/', requireAuth, requireAdmin, formSubmissionController.getFormSubmissions);
router.put('/:id/status', requireAuth, requireAdmin, formSubmissionController.updateSubmissionStatus);

module.exports = router;
