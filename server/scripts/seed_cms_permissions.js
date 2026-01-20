/**
 * Seed default CMS permissions for all roles
 * This creates default permissions for all CMS pages
 * 
 * Run with: node scripts/seed_cms_permissions.js
 */

require('dotenv').config();
const { sequelize, CmsPermission } = require('../models');

const CMS_PAGES = [
    'home',
    'about',
    'business',
    'careers',
    'contact',
    'diversity-inclusion',
    'esg',
    'investments',
    'newsroom',
    'refex-renewables',
    'refex-capital',
    'refex-medtech',
    'refex-mobility',
    'refex-refrigerants',
    'refex-airports',
    'refex-ash-coal',
    'pharma-rl',
    'venwind',
    'global-settings',
    'user-management',
];

const ROLES = ['Super Admin', 'Admin', 'Editor', 'Viewer'];

async function seedPermissions() {
    try {
        console.log('Starting CMS permissions seeding...');

        // Sync database
        await sequelize.sync();
        console.log('Database synced');

        // Clear existing permissions
        await CmsPermission.destroy({ where: {}, truncate: true });
        console.log('Cleared existing permissions');

        const permissions = [];

        // Create permissions for each role and page
        for (const role of ROLES) {
            for (const pageKey of CMS_PAGES) {
                let canCreate, canEdit, canDelete, canView;

                if (role === 'Super Admin') {
                    // Super Admin has all permissions
                    canCreate = true;
                    canEdit = true;
                    canDelete = true;
                    canView = true;
                } else if (role === 'Admin') {
                    // Admin has all permissions except user management delete
                    canCreate = true;
                    canEdit = true;
                    canDelete = pageKey !== 'user-management';
                    canView = true;
                } else if (role === 'Editor') {
                    // Editor can create and edit, but not delete
                    canCreate = pageKey !== 'user-management' && pageKey !== 'global-settings';
                    canEdit = pageKey !== 'user-management' && pageKey !== 'global-settings';
                    canDelete = false;
                    canView = true;
                } else if (role === 'Viewer') {
                    // Viewer can only view
                    canCreate = false;
                    canEdit = false;
                    canDelete = false;
                    canView = true;
                }

                permissions.push({
                    role,
                    pageKey,
                    canCreate,
                    canEdit,
                    canDelete,
                    canView,
                });
            }
        }

        // Bulk create permissions
        await CmsPermission.bulkCreate(permissions);

        console.log(`✓ Created ${permissions.length} permissions (${ROLES.length} roles × ${CMS_PAGES.length} pages)`);
        console.log('\nPermissions summary:');
        console.log('  Super Admin: Full access to all pages');
        console.log('  Admin: Full access except cannot delete users');
        console.log('  Editor: Can create/edit content pages (not settings/users)');
        console.log('  Viewer: View-only access to all pages');
        console.log('\nSeeding completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding permissions:', error);
        process.exit(1);
    }
}

seedPermissions();
