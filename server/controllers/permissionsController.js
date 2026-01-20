const { CmsPermission } = require('../models');
const status = require('../helpers/response');

function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((e) => {
            console.error('Permissions controller error:', e);
            return status.responseStatus(res, 500, `Internal Server Error: ${e.message}`, null);
        });
    };
}

/**
 * Get all permissions
 * GET /api/v1/permissions
 */
exports.getAll = asyncHandler(async (req, res) => {
    const permissions = await CmsPermission.findAll({
        order: [['role', 'ASC'], ['pageKey', 'ASC']],
    });

    // Transform to nested structure: { role: { pageKey: permissions } }
    const permissionsMap = {};
    permissions.forEach(perm => {
        if (!permissionsMap[perm.role]) {
            permissionsMap[perm.role] = {};
        }
        permissionsMap[perm.role][perm.pageKey] = {
            create: perm.canCreate,
            edit: perm.canEdit,
            delete: perm.canDelete,
            view: perm.canView,
        };
    });

    return status.responseStatus(res, 200, 'OK', permissionsMap);
});

/**
 * Get permissions for a specific role
 * GET /api/v1/permissions/:role
 */
exports.getByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;

    const permissions = await CmsPermission.findAll({
        where: { role },
        order: [['pageKey', 'ASC']],
    });

    // Transform to object: { pageKey: permissions }
    const permissionsMap = {};
    permissions.forEach(perm => {
        permissionsMap[perm.pageKey] = {
            create: perm.canCreate,
            edit: perm.canEdit,
            delete: perm.canDelete,
            view: perm.canView,
        };
    });

    return status.responseStatus(res, 200, 'OK', permissionsMap);
});

/**
 * Update permission for a specific role and page
 * PUT /api/v1/permissions/:role/:pageKey
 */
exports.update = asyncHandler(async (req, res) => {
    const { role, pageKey } = req.params;
    const { canCreate, canEdit, canDelete, canView } = req.body;

    // Prevent modification of Super Admin permissions
    if (role === 'Super Admin') {
        return status.responseStatus(res, 403, 'Super Admin permissions cannot be modified', null);
    }

    // Find or create permission
    const [permission, created] = await CmsPermission.findOrCreate({
        where: { role, pageKey },
        defaults: {
            canCreate: canCreate || false,
            canEdit: canEdit || false,
            canDelete: canDelete || false,
            canView: canView !== undefined ? canView : true,
        },
    });

    // Update if not newly created
    if (!created) {
        if (canCreate !== undefined) permission.canCreate = canCreate;
        if (canEdit !== undefined) permission.canEdit = canEdit;
        if (canDelete !== undefined) permission.canDelete = canDelete;
        if (canView !== undefined) permission.canView = canView;
        await permission.save();
    }

    return status.responseStatus(res, 200, created ? 'Created' : 'Updated', {
        role: permission.role,
        pageKey: permission.pageKey,
        canCreate: permission.canCreate,
        canEdit: permission.canEdit,
        canDelete: permission.canDelete,
        canView: permission.canView,
    });
});

/**
 * Bulk update permissions
 * POST /api/v1/permissions/bulk
 */
exports.bulkUpdate = asyncHandler(async (req, res) => {
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== 'object') {
        return status.responseStatus(res, 400, 'Invalid permissions data', null);
    }

    const updates = [];

    // Process each role
    for (const [role, pages] of Object.entries(permissions)) {
        // Skip Super Admin
        if (role === 'Super Admin') continue;

        // Process each page for this role
        for (const [pageKey, perms] of Object.entries(pages)) {
            const [permission] = await CmsPermission.findOrCreate({
                where: { role, pageKey },
                defaults: {
                    canCreate: perms.create || false,
                    canEdit: perms.edit || false,
                    canDelete: perms.delete || false,
                    canView: perms.view !== undefined ? perms.view : true,
                },
            });

            // Update existing permission
            permission.canCreate = perms.create || false;
            permission.canEdit = perms.edit || false;
            permission.canDelete = perms.delete || false;
            permission.canView = perms.view !== undefined ? perms.view : true;

            await permission.save();
            updates.push({ role, pageKey });
        }
    }

    return status.responseStatus(res, 200, 'Bulk update completed', {
        updated: updates.length,
        items: updates,
    });
});

/**
 * Check if user has permission for a specific action
 * GET /api/v1/permissions/check/:pageKey/:action
 */
exports.checkPermission = asyncHandler(async (req, res) => {
    const { pageKey, action } = req.params;
    const userRole = req.user.role;

    // Super Admin always has all permissions
    if (userRole === 'Super Admin') {
        return status.responseStatus(res, 200, 'OK', { hasPermission: true });
    }

    const permission = await CmsPermission.findOne({
        where: { role: userRole, pageKey },
    });

    if (!permission) {
        // Default: view-only access
        return status.responseStatus(res, 200, 'OK', {
            hasPermission: action === 'view'
        });
    }

    const actionMap = {
        create: permission.canCreate,
        edit: permission.canEdit,
        delete: permission.canDelete,
        view: permission.canView,
    };

    const hasPermission = actionMap[action] || false;

    return status.responseStatus(res, 200, 'OK', { hasPermission });
});

module.exports = exports;
