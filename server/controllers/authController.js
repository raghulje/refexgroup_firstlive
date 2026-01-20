const { User, LoginHistory, ActivityLog } = require('../models');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const status = require('../helpers/response');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Auth controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Login user
 * POST /api/v1/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return status.responseStatus(res, 400, 'Username and password are required', null);
  }

  // Find user with password hash
  const user = await User.scope('withPassword').findOne({
    where: { username },
  });

  if (!user) {
    return status.responseStatus(res, 401, 'Invalid username or password', null);
  }

  // Check if account is locked
  if (user.isLocked()) {
    const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
    
    // Log locked account attempt
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.get('user-agent');
    
    await LoginHistory.create({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginStatus: 'locked',
      failureReason: 'account_locked',
    });
    
    return status.responseStatus(res, 423, `Account is locked. Try again in ${minutesLeft} minutes`, null);
  }

  // Check if account is active
  if (!user.isActive) {
    return status.responseStatus(res, 403, 'Account is deactivated', null);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    // Increment failed login attempts
    await user.incrementFailedAttempts();
    
    // Log failed login
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.get('user-agent');
    
    await LoginHistory.create({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginStatus: 'failed',
      failureReason: 'invalid_password',
    });
    
    return status.responseStatus(res, 401, 'Invalid username or password', null);
  }

  // Reset failed attempts on successful login
  await user.resetFailedAttempts();

  // Log successful login
  const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  const userAgent = req.get('user-agent');
  
  const loginHistory = await LoginHistory.create({
    userId: user.id,
    ipAddress: ipAddress,
    userAgent: userAgent,
    loginStatus: 'success',
  });

  // Create activity log
  await ActivityLog.create({
    userId: user.id,
    activityType: 'user_login',
    title: 'User Login',
    description: `${user.username} logged in from ${ipAddress}`,
    metadata: {
      ipAddress,
      userAgent,
    },
  });

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Return user data (without password hash)
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  };

  return status.responseStatus(res, 200, 'OK', {
    token,
    refreshToken,
    user: userData,
    loginHistoryId: loginHistory.id, // For tracking logout
  });
});

/**
 * Get current user
 * GET /api/v1/auth/me
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  };

  return status.responseStatus(res, 200, 'OK', userData);
});

/**
 * Refresh token
 * POST /api/v1/auth/refresh
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return status.responseStatus(res, 400, 'Refresh token is required', null);
  }

  try {
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(refreshToken);

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId || decoded.id);

    if (!user || !user.isActive) {
      return status.responseStatus(res, 401, 'Invalid refresh token', null);
    }

    // Generate new token
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const newToken = generateToken(tokenPayload);

    return status.responseStatus(res, 200, 'OK', {
      token: newToken,
    });
  } catch (error) {
    return status.responseStatus(res, 401, 'Invalid refresh token', null);
  }
});

/**
 * Logout (client-side token removal, but we can track it here if needed)
 * POST /api/v1/auth/logout
 */
exports.logout = asyncHandler(async (req, res) => {
  const { loginHistoryId } = req.body;
  
  // Update login history with logout time if provided
  if (loginHistoryId) {
    const loginHistory = await LoginHistory.findByPk(loginHistoryId);
    if (loginHistory) {
      const logoutAt = new Date();
      const sessionDuration = Math.floor((logoutAt - loginHistory.createdAt) / 1000);
      
      await loginHistory.update({
        logoutAt: logoutAt,
        sessionDuration: sessionDuration,
      });
    }
  }
  
  // Create activity log
  if (req.user) {
    await ActivityLog.create({
      userId: req.user.id,
      activityType: 'user_logout',
      title: 'User Logout',
      description: `${req.user.username} logged out`,
    });
  }
  
  return status.responseStatus(res, 200, 'OK', { message: 'Logged out successfully' });
});

/**
 * Change password
 * POST /api/v1/auth/change-password
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return status.responseStatus(res, 400, 'Current password and new password are required', null);
  }

  // Validate password strength
  const validation = validatePasswordStrength(newPassword);
  if (!validation.valid) {
    return status.responseStatus(res, 400, validation.errors.join(', '), null);
  }

  // Get user with password hash
  const user = await User.scope('withPassword').findByPk(req.user.id);

  if (!user) {
    return status.responseStatus(res, 404, 'User not found', null);
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    return status.responseStatus(res, 401, 'Current password is incorrect', null);
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  user.passwordHash = newPasswordHash;
  await user.save();

  return status.responseStatus(res, 200, 'OK', { message: 'Password changed successfully' });
});

