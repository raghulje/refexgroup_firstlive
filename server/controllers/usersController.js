const { User } = require('../models');
const { hashPassword, validatePasswordStrength } = require('../utils/password');
const status = require('../helpers/response');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Users controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Get all users
 * GET /api/v1/users
 */
exports.getAll = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    order: [['createdAt', 'DESC']],
  });

  return status.responseStatus(res, 200, 'OK', users);
});

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  return status.responseStatus(res, 200, 'OK', user);
});

/**
 * Create user
 * POST /api/v1/users
 */
exports.create = asyncHandler(async (req, res) => {
  const { username, email, password, role, isActive } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return status.responseStatus(res, 400, 'Username, email, and password are required', null);
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    return status.responseStatus(res, 400, passwordValidation.errors.join(', '), null);
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    return status.responseStatus(res, 409, 'Conflict', null, 'Username already exists');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return status.responseStatus(res, 409, 'Email already exists', null);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await User.create({
    username,
    email,
    passwordHash,
    role: role || 'Editor',
    isActive: isActive !== undefined ? isActive : true,
  });

  // Return user without password hash
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return status.responseStatus(res, 201, 'Created', userData);
});

/**
 * Update user
 * PUT /api/v1/users/:id
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, role, isActive, password } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  // Prevent users from modifying their own role (unless Super Admin)
  if (Number(req.user.id) === Number(id) && req.user.role !== 'Super Admin') {
    if (role && role !== user.role) {
      return status.responseStatus(res, 403, 'You cannot change your own role', null);
    }
  }

  // Prevent users from deactivating themselves
  if (Number(req.user.id) === Number(id) && isActive === false) {
    return status.responseStatus(res, 403, 'You cannot deactivate your own account', null);
  }

  // Update username if provided and different
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return status.responseStatus(res, 409, 'Username already exists', null);
    }
    user.username = username;
  }

  // Update email if provided and different
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return status.responseStatus(res, 409, 'Email already exists', null);
    }
    user.email = email;
  }

  // Update role if provided
  if (role) {
    user.role = role;
  }

  // Update isActive if provided
  if (isActive !== undefined) {
    user.isActive = isActive;
  }

  // Update password if provided
  if (password) {
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return status.responseStatus(res, 400, passwordValidation.errors.join(', '), null);
    }
    user.passwordHash = await hashPassword(password);
  }

  await user.save();

  // Return updated user without password hash
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return status.responseStatus(res, 200, 'Updated', userData);
});

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent users from deleting themselves
  if (Number(req.user.id) === Number(id)) {
    return status.responseStatus(res, 403, 'You cannot delete your own account', null);
  }

  const user = await User.findByPk(id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  await user.destroy();

  return status.responseStatus(res, 200, 'Deleted', { message: 'User deleted successfully' });
});

/**
 * Deactivate user
 * PUT /api/v1/users/:id/deactivate
 */
exports.deactivate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent users from deactivating themselves
  if (Number(req.user.id) === Number(id)) {
    return status.responseStatus(res, 403, 'You cannot deactivate your own account', null);
  }

  const user = await User.findByPk(id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  user.isActive = false;
  await user.save();

  return status.responseStatus(res, 200, 'OK', { message: 'User deactivated successfully' });
});

/**
 * Activate user
 * PUT /api/v1/users/:id/activate
 */
exports.activate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  user.isActive = true;
  await user.save();

  return status.responseStatus(res, 200, 'OK', { message: 'User activated successfully' });
});

