const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication endpoints
 * Limits to 20 failed login attempts per 15 minutes per IP
 * Successful logins don't count towards the limit
 * 
 * Note: Rate limits are stored in memory. Restart the server to clear them.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 failed attempts per windowMs
  message: {
    error: 'Too many login attempts',
    message: 'Please try again after 15 minutes or contact your administrator.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful login attempts
  skipFailedRequests: false, // Count failed login attempts
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      error: 'Rate limit exceeded',
    });
  },
});

/**
 * General API rate limiter
 * Limits to 100 requests per 15 minutes per IP
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authRateLimiter,
  apiRateLimiter,
};

