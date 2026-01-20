const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditLogController');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');

// All routes require admin access
router.use(requireAuth);
router.use(requireAdmin);

// Get audit logs
router.get('/', controller.getAuditLogs);

// Get specific audit log
router.get('/:id', controller.getAuditLog);

// Get audit logs for entity
router.get('/entity/:entityType/:entityId', controller.getEntityAuditLogs);

module.exports = router;

