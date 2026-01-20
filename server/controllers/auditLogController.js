const { AuditLog, User } = require('../models');
const status = require('../helpers/response');
const { Op } = require('sequelize');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Audit log controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Get audit logs with filters
 * GET /api/v1/audit-logs
 */
exports.getAuditLogs = asyncHandler(async (req, res) => {
  const {
    userId,
    entityType,
    entityId,
    action,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = req.query;

  const where = {};
  
  if (userId) where.user_id = userId;
  if (entityType) where.entity_type = entityType;
  if (entityId) where.entity_id = entityId;
  if (action) where.action = action;
  
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = new Date(startDate);
    if (endDate) where.created_at[Op.lte] = new Date(endDate);
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await AuditLog.findAndCountAll({
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
    logs: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
});

/**
 * Get audit log by ID
 * GET /api/v1/audit-logs/:id
 */
exports.getAuditLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const log = await AuditLog.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'email', 'role'],
    }],
  });

  if (!log) {
    return status.responseStatus(res, 404, 'Audit log not found', null);
  }

  return status.responseStatus(res, 200, 'OK', log);
});

/**
 * Get audit logs for a specific entity
 * GET /api/v1/audit-logs/entity/:entityType/:entityId
 */
exports.getEntityAuditLogs = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  
  const logs = await AuditLog.findAll({
    where: {
      entity_type: entityType,
      entity_id: entityId,
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'email', 'role'],
    }],
    order: [['created_at', 'DESC']],
    limit: 100,
  });

  return status.responseStatus(res, 200, 'OK', logs);
});

module.exports = exports;

