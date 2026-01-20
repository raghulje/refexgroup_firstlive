const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
const { requireAuth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');

// All permission routes require authentication and admin access
router.use(requireAuth);
router.use(requireAdmin);

// Get all permissions
router.get('/', permissionsController.getAll);

// Get permissions for a specific role
router.get('/:role', permissionsController.getByRole);

// Check if current user has permission for an action
router.get('/check/:pageKey/:action', permissionsController.checkPermission);

// Update permission for a specific role and page
router.put('/:role/:pageKey', permissionsController.update);

// Bulk update permissions
router.post('/bulk', permissionsController.bulkUpdate);

module.exports = router;
