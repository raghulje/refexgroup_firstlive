const { ActivityLog, User } = require('../models');
const status = require('../helpers/response');
const { Op } = require('sequelize');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Activity log controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Get activity logs (activity feed)
 * GET /api/v1/activity-logs
 */
exports.getActivityLogs = asyncHandler(async (req, res) => {
  const {
    userId,
    activityType,
    entityType,
    entityId,
    isRead,
    page = 1,
    limit = 50,
  } = req.query;

  const where = {};
  
  if (userId) where.user_id = userId;
  if (activityType) where.activity_type = activityType;
  if (entityType) where.entity_type = entityType;
  if (entityId) where.entity_id = entityId;
  if (isRead !== undefined) where.is_read = isRead === 'true';

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await ActivityLog.findAndCountAll({
    where,
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'email', 'role'],
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: offset,
  });

  return status.responseStatus(res, 200, 'OK', {
    activities: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
});

/**
 * Mark activity as read
 * PUT /api/v1/activity-logs/:id/read
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const activity = await ActivityLog.findByPk(id);
  
  if (!activity) {
    return status.responseStatus(res, 404, 'Activity log not found', null);
  }

  await activity.update({ is_read: true });

  return status.responseStatus(res, 200, 'OK', activity);
});

/**
 * Mark all activities as read
 * PUT /api/v1/activity-logs/read-all
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await ActivityLog.update(
    { is_read: true },
    {
      where: {
        is_read: false,
      },
    }
  );

  return status.responseStatus(res, 200, 'OK', { message: 'All activities marked as read' });
});

/**
 * Get unread count
 * GET /api/v1/activity-logs/unread-count
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await ActivityLog.count({
    where: {
      is_read: false,
    },
  });

  return status.responseStatus(res, 200, 'OK', { count });
});

module.exports = exports;

