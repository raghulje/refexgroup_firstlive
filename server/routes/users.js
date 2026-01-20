const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { requireAuth } = require('../middlewares/auth');
const { requireSuperAdmin, requireAdmin } = require('../middlewares/roles');

// All user routes require authentication
router.use(requireAuth);

// Get all users (Admin and Super Admin only)
router.get('/', requireAdmin, usersController.getAll);

// Get user by ID (Admin and Super Admin only)
router.get('/:id', requireAdmin, usersController.getById);

// Create user (Super Admin only)
router.post('/', requireSuperAdmin, usersController.create);

// Update user (Admin can update, but Super Admin has full access)
router.put('/:id', requireAdmin, usersController.update);

// Delete user (Super Admin only)
router.delete('/:id', requireSuperAdmin, usersController.delete);

// Activate/Deactivate user (Super Admin only)
router.put('/:id/activate', requireSuperAdmin, usersController.activate);
router.put('/:id/deactivate', requireSuperAdmin, usersController.deactivate);

module.exports = router;

