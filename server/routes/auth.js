const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');
const { authRateLimiter } = require('../middlewares/rateLimit');

// Public routes with rate limiting
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authRateLimiter, authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', requireAuth, authController.getMe);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;

