const { verifyToken } = require('../utils/jwt');
const status = require('../helpers/response');

/**
 * Middleware to verify JWT token
 */
const requireAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return status.responseStatus(res, 401, 'No token provided', null);
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return status.responseStatus(res, 401, 'No token provided', null);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId || decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.message === 'Token has expired') {
      return status.responseStatus(res, 401, 'Token has expired', null);
    }
    if (error.message === 'Invalid token') {
      return status.responseStatus(res, 401, 'Invalid token', null);
    }
    return status.responseStatus(res, 500, `Internal Server Error: ${error.message}`, null);
  }
};

/**
 * Middleware to check if user is authenticated (optional)
 * Doesn't fail if no token, but attaches user if token is valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

      if (token) {
        try {
          const decoded = verifyToken(token);
          req.user = {
            id: decoded.userId || decoded.id,
            username: decoded.username,
            role: decoded.role,
          };
        } catch (error) {
          // Token invalid, but continue without user
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};

