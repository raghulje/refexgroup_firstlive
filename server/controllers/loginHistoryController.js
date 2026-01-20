const { LoginHistory, User } = require('../models');
const status = require('../helpers/response');
const { Op } = require('sequelize');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Login history controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Get login history
 * GET /api/v1/login-history
 */
exports.getLoginHistory = asyncHandler(async (req, res) => {
  const {
    userId,
    loginStatus,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = req.query;

  const where = {};
  
  if (userId) where.user_id = userId;
  if (loginStatus) where.login_status = loginStatus;
  
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = new Date(startDate);
    if (endDate) where.created_at[Op.lte] = new Date(endDate);
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await LoginHistory.findAndCountAll({
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
    history: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
});

/**
 * Get login history for current user
 * GET /api/v1/login-history/me
 */
exports.getMyLoginHistory = asyncHandler(async (req, res) => {
  const history = await LoginHistory.findAll({
    where: {
      user_id: req.user.id,
    },
    order: [['created_at', 'DESC']],
    limit: 50,
  });

  return status.responseStatus(res, 200, 'OK', history);
});

module.exports = exports;

