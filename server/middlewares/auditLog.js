const { AuditLog, ActivityLog } = require('../models');
const status = require('../helpers/response');

/**
 * Middleware to automatically log audit trails for CRUD operations
 */
const auditLog = async (req, res, next) => {
  // Store original methods
  const originalSend = res.json;
  const originalStatus = res.status;

  // Override res.json to capture response
  res.json = function(data) {
    // Store response data for audit logging
    res.auditData = data;
    return originalSend.call(this, data);
  };

  // Call next middleware
  next();

  // After response is sent, log the audit
  res.on('finish', async () => {
    try {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = req.user;
        if (!user) return; // Skip if not authenticated

        const method = req.method;
        const path = req.path;
        const entityType = extractEntityType(path, method);
        const action = extractAction(method, path);
        
        // Skip logging for certain endpoints
        if (shouldSkipAudit(path)) {
          return;
        }

        // Get entity ID from params or body
        const entityId = req.params.id || req.params.albumId || req.params.eventId || 
                        req.params.imageId || req.body.id || null;

        // Prepare audit log data
        const auditData = {
          userId: user.id,
          entityType: entityType,
          entityId: entityId,
          action: action,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          description: generateDescription(user, action, entityType, entityId),
        };

        // For updates, try to capture old and new values
        if (action === 'update' && res.auditData?.data) {
          auditData.newValue = res.auditData.data;
          // Old value would need to be fetched before update (handled in controllers)
        } else if (action === 'create' && res.auditData?.data) {
          auditData.newValue = res.auditData.data;
        } else if (action === 'delete' && res.auditData?.data) {
          auditData.oldValue = res.auditData.data;
        }

        // Create audit log
        await AuditLog.create(auditData);

        // Create activity log for user-facing activities
        if (['create', 'update', 'delete', 'publish', 'unpublish'].includes(action)) {
          await ActivityLog.create({
            userId: user.id,
            activityType: mapActionToActivityType(action),
            entityType: entityType,
            entityId: entityId,
            title: generateActivityTitle(action, entityType),
            description: auditData.description,
            metadata: {
              path: path,
              method: method,
            },
          });
        }
      }
    } catch (error) {
      // Don't fail the request if audit logging fails
      console.error('Audit log error:', error);
    }
  });
};

/**
 * Extract entity type from route path
 */
function extractEntityType(path, method) {
  // Remove /api/v1 prefix
  const cleanPath = path.replace(/^\/api\/v1\//, '');
  
  // Extract entity type from common patterns
  if (cleanPath.includes('hero-slides')) return 'hero-slide';
  if (cleanPath.includes('business-cards')) return 'business-card';
  if (cleanPath.includes('awards')) return 'award';
  if (cleanPath.includes('leaders')) return 'leader';
  if (cleanPath.includes('jobs')) return 'job';
  if (cleanPath.includes('testimonials')) return 'testimonial';
  if (cleanPath.includes('newsroom')) return 'newsroom-item';
  if (cleanPath.includes('gallery/albums')) return 'gallery-album';
  if (cleanPath.includes('gallery/events')) return 'gallery-event';
  if (cleanPath.includes('gallery/images')) return 'gallery-image';
  if (cleanPath.includes('media')) return 'media';
  if (cleanPath.includes('users')) return 'user';
  if (cleanPath.includes('sections')) return 'section';
  if (cleanPath.includes('section-content')) return 'section-content';
  if (cleanPath.includes('pages')) return 'page';
  
  // Default: extract first part of path
  const parts = cleanPath.split('/');
  return parts[0] || 'unknown';
}

/**
 * Extract action from HTTP method and path
 */
function extractAction(method, path) {
  if (method === 'POST') {
    if (path.includes('publish')) return 'publish';
    if (path.includes('unpublish')) return 'unpublish';
    return 'create';
  }
  if (method === 'PUT' || method === 'PATCH') return 'update';
  if (method === 'DELETE') return 'delete';
  if (method === 'GET') {
    if (path.includes('export')) return 'export';
    return 'read';
  }
  return 'unknown';
}

/**
 * Check if audit logging should be skipped for this path
 */
function shouldSkipAudit(path) {
  const skipPaths = [
    '/api/v1/auth/me',
    '/api/v1/auth/refresh',
    '/api/v1/audit-logs',
    '/api/v1/activity-logs',
    '/api/v1/login-history',
  ];
  return skipPaths.some(skipPath => path.startsWith(skipPath));
}

/**
 * Generate human-readable description
 */
function generateDescription(user, action, entityType, entityId) {
  const actionMap = {
    'create': 'created',
    'update': 'updated',
    'delete': 'deleted',
    'publish': 'published',
    'unpublish': 'unpublished',
  };
  
  const actionVerb = actionMap[action] || action;
  const entityName = entityType.replace(/-/g, ' ');
  
  if (entityId) {
    return `${user.username} ${actionVerb} ${entityName} #${entityId}`;
  }
  return `${user.username} ${actionVerb} ${entityName}`;
}

/**
 * Map action to activity type
 */
function mapActionToActivityType(action) {
  const map = {
    'create': 'content_created',
    'update': 'content_updated',
    'delete': 'content_deleted',
    'publish': 'content_published',
    'unpublish': 'content_unpublished',
  };
  return map[action] || 'content_updated';
}

/**
 * Generate activity title
 */
function generateActivityTitle(action, entityType) {
  const actionMap = {
    'create': 'Created',
    'update': 'Updated',
    'delete': 'Deleted',
    'publish': 'Published',
    'unpublish': 'Unpublished',
  };
  
  const entityName = entityType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `${actionMap[action] || 'Modified'} ${entityName}`;
}

module.exports = { auditLog };

