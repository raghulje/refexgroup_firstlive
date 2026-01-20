const { ContentVersion } = require('../models');

/**
 * Middleware to create content versions before updates
 */
const createVersion = async (req, res, next) => {
  // Store original json method
  const originalJson = res.json;

  // Override res.json to capture response
  res.json = function(data) {
    res.versionData = data;
    return originalJson.call(this, data);
  };

  next();

  // After successful update, create version
  res.on('finish', async () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const method = req.method;
        const entityType = extractEntityType(req.path);
        const entityId = req.params.id || req.params.albumId || req.params.eventId || 
                        req.params.imageId || req.body.id;

        // Only create versions for updates
        if ((method === 'PUT' || method === 'PATCH') && entityId && res.versionData?.data) {
          // Get current version number
          const lastVersion = await ContentVersion.findOne({
            where: {
              entity_type: entityType,
              entity_id: entityId,
            },
            order: [['version_number', 'DESC']],
          });

          const nextVersion = lastVersion ? lastVersion.version_number + 1 : 1;

          // Mark previous version as not current
          if (lastVersion) {
            await ContentVersion.update(
              { is_current: false },
              {
                where: {
                  entity_type: entityType,
                  entity_id: entityId,
                },
              }
            );
          }

          // Create new version
          await ContentVersion.create({
            entity_type: entityType,
            entity_id: entityId,
            version_number: nextVersion,
            content: res.versionData.data,
            action: 'update',
            created_by: req.user.id,
            is_current: true,
            changes: extractChanges(req.body, res.versionData.data),
          });
        } else if (method === 'POST' && res.versionData?.data) {
          // Create initial version for new content
          const entityId = res.versionData.data.id;
          if (entityId) {
            await ContentVersion.create({
              entity_type: entityType,
              entity_id: entityId,
              version_number: 1,
              content: res.versionData.data,
              action: 'create',
              created_by: req.user.id,
              is_current: true,
            });
          }
        }
      }
    } catch (error) {
      console.error('Version control error:', error);
      // Don't fail the request
    }
  });
};

/**
 * Extract entity type from path
 */
function extractEntityType(path) {
  const cleanPath = path.replace(/^\/api\/v1\//, '');
  const parts = cleanPath.split('/');
  
  // Handle nested routes
  if (cleanPath.includes('gallery/albums')) return 'gallery-album';
  if (cleanPath.includes('gallery/events')) return 'gallery-event';
  if (cleanPath.includes('gallery/images')) return 'gallery-image';
  
  return parts[0]?.replace(/-/g, '-') || 'unknown';
}

/**
 * Extract changes between old and new data
 */
function extractChanges(oldData, newData) {
  if (!oldData || !newData) return null;
  
  const changes = {};
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key],
      };
    }
  }
  return Object.keys(changes).length > 0 ? changes : null;
}

module.exports = { createVersion };

