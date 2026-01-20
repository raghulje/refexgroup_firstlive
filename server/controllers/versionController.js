const { ContentVersion, User } = require('../models');
const status = require('../helpers/response');
const { Op } = require('sequelize');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error('Version controller error:', e);
      return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
    });
  };
}

/**
 * Get all versions for an entity
 * GET /api/v1/versions/:entityType/:entityId
 */
exports.getVersions = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  
  const versions = await ContentVersion.findAll({
    where: {
      entity_type: entityType,
      entity_id: entityId,
    },
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'email'],
    }],
    order: [['version_number', 'DESC']],
  });

  return status.responseStatus(res, 200, 'OK', versions);
});

/**
 * Get a specific version
 * GET /api/v1/versions/:id
 */
exports.getVersion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const version = await ContentVersion.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'email'],
    }],
  });

  if (!version) {
    return status.responseStatus(res, 404, 'Version not found', null);
  }

  return status.responseStatus(res, 200, 'OK', version);
});

/**
 * Revert to a specific version
 * POST /api/v1/versions/:id/revert
 */
exports.revertToVersion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const version = await ContentVersion.findByPk(id);
  
  if (!version) {
    return status.responseStatus(res, 404, 'Version not found', null);
  }

  // Mark this version as current
  await ContentVersion.update(
    { is_current: false },
    {
      where: {
        entity_type: version.entity_type,
        entity_id: version.entity_id,
      },
    }
  );

  await version.update({ is_current: true });

  return status.responseStatus(res, 200, 'OK', {
    message: 'Reverted to version successfully',
    version: version,
  });
});

/**
 * Compare two versions
 * GET /api/v1/versions/compare/:versionId1/:versionId2
 */
exports.compareVersions = asyncHandler(async (req, res) => {
  const { versionId1, versionId2 } = req.params;
  
  const [version1, version2] = await Promise.all([
    ContentVersion.findByPk(versionId1),
    ContentVersion.findByPk(versionId2),
  ]);

  if (!version1 || !version2) {
    return status.responseStatus(res, 404, 'One or both versions not found', null);
  }

  // Simple comparison (can be enhanced)
  const differences = {};
  const content1 = version1.content || {};
  const content2 = version2.content || {};
  
  const allKeys = new Set([...Object.keys(content1), ...Object.keys(content2)]);
  
  for (const key of allKeys) {
    if (JSON.stringify(content1[key]) !== JSON.stringify(content2[key])) {
      differences[key] = {
        old: content1[key],
        new: content2[key],
      };
    }
  }

  return status.responseStatus(res, 200, 'OK', {
    version1: {
      id: version1.id,
      versionNumber: version1.version_number,
      createdAt: version1.created_at,
    },
    version2: {
      id: version2.id,
      versionNumber: version2.version_number,
      createdAt: version2.created_at,
    },
    differences,
  });
});

module.exports = exports;

