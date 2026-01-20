const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginHistoryController');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');

// All routes require authentication
router.use(requireAuth);

// Get my login history (any authenticated user)
router.get('/me', controller.getMyLoginHistory);

// Get all login history (admin only)
router.get('/', requireAdmin, controller.getLoginHistory);

module.exports = router;

