const status = require('../helpers/response');
const { ActivityLog } = require('../models');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Publish controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Generic publish handler
 */
async function handlePublish(entityType, entityId, req, res, publishDate = null) {
  try {
    const { sequelize } = require('../models');
    const tableName = getTableName(entityType);
    
    if (!tableName) {
      return status.responseStatus(res, 400, 'Invalid entity type', null);
    }

    const updateData = {
      status: publishDate ? 'scheduled' : 'published',
      published_at: publishDate || new Date(),
      scheduled_publish_at: publishDate || null,
    };

    // Update the entity
    await sequelize.query(`
      UPDATE \`${tableName}\` 
      SET \`status\` = :status, 
          \`published_at\` = :publishedAt, 
          \`scheduled_publish_at\` = :scheduledPublishAt,
          \`is_active\` = 1
      WHERE \`id\` = :id
    `, {
      replacements: {
        status: updateData.status,
        publishedAt: updateData.published_at,
        scheduledPublishAt: updateData.scheduled_publish_at,
        id: entityId,
      },
      type: sequelize.QueryTypes.UPDATE,
    });

    // Create activity log
    await ActivityLog.create({
      userId: req.user.id,
      activityType: 'content_published',
      entityType: entityType,
      entityId: entityId,
      title: `Published ${entityType}`,
      description: `${req.user.username} published ${entityType} #${entityId}`,
    });

    return status.responseStatus(res, 200, 'OK', {
      message: publishDate ? 'Content scheduled for publication' : 'Content published successfully',
      status: updateData.status,
      publishedAt: updateData.published_at,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Generic unpublish handler
 */
async function handleUnpublish(entityType, entityId, req, res) {
  try {
    const { sequelize } = require('../models');
    const tableName = getTableName(entityType);
    
    if (!tableName) {
      return status.responseStatus(res, 400, 'Invalid entity type', null);
    }

    // Update the entity
    await sequelize.query(`
      UPDATE \`${tableName}\` 
      SET \`status\` = 'draft',
          \`is_active\` = 0
      WHERE \`id\` = :id
    `, {
      replacements: { id: entityId },
      type: sequelize.QueryTypes.UPDATE,
    });

    // Create activity log
    await ActivityLog.create({
      userId: req.user.id,
      activityType: 'content_unpublished',
      entityType: entityType,
      entityId: entityId,
      title: `Unpublished ${entityType}`,
      description: `${req.user.username} unpublished ${entityType} #${entityId}`,
    });

    return status.responseStatus(res, 200, 'OK', {
      message: 'Content unpublished successfully',
      status: 'draft',
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get table name from entity type
 */
function getTableName(entityType) {
  const mapping = {
    'hero-slide': 'hero_slides',
    'business-card': 'business_cards',
    'award': 'awards',
    'newsroom-item': 'newsroom_items',
    'gallery-album': 'gallery_albums',
    'gallery-event': 'gallery_events',
    'gallery-image': 'gallery_images',
    'leader': 'leaders',
    'testimonial': 'testimonials',
    'job': 'jobs',
    'section-content': 'section_contents',
    'home-video-section': 'home_video_sections',
    'home-about-section': 'home_about_sections',
    'home-careers-section': 'home_careers_sections',
    'home-cta-section': 'home_cta_sections',
    'core-value': 'core_values',
    'sdg-card': 'sdg_cards',
  };
  return mapping[entityType];
}

/**
 * Publish content
 * POST /api/v1/publish/:entityType/:entityId
 */
exports.publish = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  const { scheduledPublishAt } = req.body;

  const publishDate = scheduledPublishAt ? new Date(scheduledPublishAt) : null;
  return handlePublish(entityType, parseInt(entityId), req, res, publishDate);
});

/**
 * Unpublish content
 * POST /api/v1/publish/:entityType/:entityId/unpublish
 */
exports.unpublish = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  return handleUnpublish(entityType, parseInt(entityId), req, res);
});

/**
 * Bulk publish
 * POST /api/v1/publish/bulk
 */
exports.bulkPublish = asyncHandler(async (req, res) => {
  const { entityType, entityIds, scheduledPublishAt } = req.body;

  if (!Array.isArray(entityIds) || entityIds.length === 0) {
    return status.responseStatus(res, 400, 'entityIds array is required', null);
  }

  const publishDate = scheduledPublishAt ? new Date(scheduledPublishAt) : null;
  const results = [];

  for (const entityId of entityIds) {
    try {
      await handlePublish(entityType, entityId, req, res, publishDate);
      results.push({ entityId, success: true });
    } catch (error) {
      results.push({ entityId, success: false, error: error.message });
    }
  }

  return status.responseStatus(res, 200, 'OK', { results });
});

module.exports = exports;

