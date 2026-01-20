const express = require('express');
const router = express.Router();
const controller = require('../controllers/publishController');
const { requireAuth } = require('../middlewares/auth');
const { requireEditor } = require('../middlewares/roles');

// All routes require authentication and editor role
router.use(requireAuth);
router.use(requireEditor);

// Publish content
router.post('/:entityType/:entityId', controller.publish);

// Unpublish content
router.post('/:entityType/:entityId/unpublish', controller.unpublish);

// Bulk publish
router.post('/bulk', controller.bulkPublish);

module.exports = router;

