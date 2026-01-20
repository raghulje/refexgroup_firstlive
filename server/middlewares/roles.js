const status = require('../helpers/response');

/**
 * Middleware to check if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return status.responseStatus(res, 401, 'Authentication required', null);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return status.responseStatus(res, 403, 'Insufficient permissions', null);
    }

    next();
  };
};

/**
 * Middleware to check if user is Super Admin
 */
const requireSuperAdmin = requireRole('Super Admin');

/**
 * Middleware to check if user is Admin or Super Admin
 */
const requireAdmin = requireRole('Super Admin', 'Admin');

/**
 * Middleware to check if user can edit (Editor, Admin, or Super Admin)
 */
const requireEditor = requireRole('Super Admin', 'Admin', 'Editor');

module.exports = {
  requireRole,
  requireSuperAdmin,
  requireAdmin,
  requireEditor,
};

