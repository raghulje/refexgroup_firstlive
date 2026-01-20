const express = require('express');
const router = express.Router();
const emailSettingsController = require('../controllers/emailSettingsController');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');

// All routes require admin authentication
router.use(requireAuth);

// Get email settings
router.get('/', requireAdmin, emailSettingsController.getEmailSettings);

// Update email settings
router.put('/', requireAdmin, emailSettingsController.updateEmailSettings);

// Test email configuration
router.post('/test', requireAdmin, emailSettingsController.testEmailSettings);

module.exports = router;
