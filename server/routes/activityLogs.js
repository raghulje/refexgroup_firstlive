const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityLogController');
const { requireAuth } = require('../middlewares/auth');

// All routes require authentication
router.use(requireAuth);

// Get activity logs
router.get('/', controller.getActivityLogs);

// Mark as read
router.put('/:id/read', controller.markAsRead);

// Mark all as read
router.put('/read-all', controller.markAllAsRead);

// Get unread count
router.get('/unread-count', controller.getUnreadCount);

module.exports = router;

