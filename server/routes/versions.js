const express = require('express');
const router = express.Router();
const controller = require('../controllers/versionController');
const { requireAuth } = require('../middlewares/auth');
const { requireEditor } = require('../middlewares/roles');

// All routes require authentication
router.use(requireAuth);

// Get versions for an entity
router.get('/:entityType/:entityId', requireEditor, controller.getVersions);

// Get specific version
router.get('/:id', requireEditor, controller.getVersion);

// Revert to version
router.post('/:id/revert', requireEditor, controller.revertToVersion);

// Compare versions
router.get('/compare/:versionId1/:versionId2', requireEditor, controller.compareVersions);

module.exports = router;

