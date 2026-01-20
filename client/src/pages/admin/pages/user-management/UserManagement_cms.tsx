import React, { useEffect, useState } from 'react';
import { DataTable } from '../../shared/DataTable';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { usersService, permissionsService, type User } from '../../../../services/apiService';
import { authService } from '../../shared/authService';
import { NotificationToast, useNotification } from '../../shared/NotificationToast';

// CMS Pages list for permissions
const CMS_PAGES = [
  { key: 'home', label: 'Home Page' },
  { key: 'about', label: 'About Page' },
  { key: 'business', label: 'Business Page' },
  { key: 'careers', label: 'Careers Page' },
  { key: 'contact', label: 'Contact Page' },
  { key: 'diversity-inclusion', label: 'Diversity & Inclusion Page' },
  { key: 'esg', label: 'ESG Page' },
  { key: 'investments', label: 'Investments Page' },
  { key: 'newsroom', label: 'Newsroom Page' },
  { key: 'refex-renewables', label: 'Refex Renewables Page' },
  { key: 'refex-capital', label: 'Refex Capital Page' },
  { key: 'refex-medtech', label: 'Refex MedTech Page' },
  { key: 'refex-mobility', label: 'Refex Mobility Page' },
  { key: 'refex-refrigerants', label: 'Refex Refrigerants Page' },
  { key: 'refex-airports', label: 'Refex Airports Page' },
  { key: 'refex-ash-coal', label: 'Refex Ash & Coal Handling Page' },
  { key: 'pharma-rl', label: 'Pharma RL Fine Chem Page' },
  { key: 'venwind', label: 'Venwind Refex Page' },
  { key: 'global-settings', label: 'Global Settings' },
  { key: 'user-management', label: 'User Management' },
];

const ROLES = ['Super Admin', 'Admin', 'Editor', 'Viewer'];

type Permission = {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
};

type PermissionsState = Record<string, Record<string, Permission>>; // role -> pageKey -> permissions

export default function UserManagement_cms() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User & { password: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  // Permissions state
  const [permissions, setPermissions] = useState<PermissionsState>({});
  const [permissionsChanged, setPermissionsChanged] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Load users from API
  useEffect(() => {
    fetchUsers();
    initializePermissions();
  }, []);

  // Initialize permissions from backend
  const initializePermissions = async () => {
    try {
      const permissionsData = await permissionsService.getAll();
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Fallback to default permissions if API fails
      initializeDefaultPermissions();
    }
  };

  // Fallback: Initialize permissions with default values
  const initializeDefaultPermissions = () => {
    const initialPermissions: PermissionsState = {};

    ROLES.forEach(role => {
      initialPermissions[role] = {};
      CMS_PAGES.forEach(page => {
        // Super Admin gets all permissions by default
        if (role === 'Super Admin') {
          initialPermissions[role][page.key] = {
            create: true,
            edit: true,
            delete: true,
            view: true,
          };
        } else {
          // Other roles start with view-only
          initialPermissions[role][page.key] = {
            create: false,
            edit: false,
            delete: false,
            view: true,
          };
        }
      });
    });

    setPermissions(initialPermissions);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await usersService.getAll();
      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showNotification(
        error.response?.data?.message || error.message || 'Failed to load users',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setIsEditMode(false);
    setCurrentUser({ username: '', email: '', role: 'Editor', password: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setIsEditMode(true);
    setCurrentUser({ ...user, password: '' }); // Don't include password
    setErrors({});
    setModalOpen(true);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!currentUser.username?.trim()) {
      nextErrors.username = 'Username is required';
    } else if (currentUser.username.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters';
    }

    if (!currentUser.email?.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email)) {
      nextErrors.email = 'Invalid email format';
    }

    if (!currentUser.role?.trim()) {
      nextErrors.role = 'Role is required';
    }

    // Password validation
    if (!isEditMode) {
      // New user must have password
      if (!currentUser.password?.trim()) {
        nextErrors.password = 'Password is required';
      } else {
        const passwordErrors = validatePassword(currentUser.password);
        if (passwordErrors.length > 0) {
          nextErrors.password = passwordErrors.join(', ');
        }
      }
    } else {
      // Edit mode: password is optional, but if provided, must be valid
      if (currentUser.password && currentUser.password.trim()) {
        const passwordErrors = validatePassword(currentUser.password);
        if (passwordErrors.length > 0) {
          nextErrors.password = passwordErrors.join(', ');
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      setErrors({});

      if (isEditMode && currentUser.id) {
        // Update existing user
        const updateData: any = {
          username: currentUser.username!.trim(),
          email: currentUser.email!.trim(),
          role: currentUser.role as any,
        };

        // Only include password if provided
        if (currentUser.password && currentUser.password.trim()) {
          updateData.password = currentUser.password.trim();
        }

        await usersService.update(currentUser.id, updateData);
        showNotification('User updated successfully', 'success');
      } else {
        // Create new user
        await usersService.create({
          username: currentUser.username!.trim(),
          email: currentUser.email!.trim(),
          password: currentUser.password!.trim(),
          role: currentUser.role as any,
        });
        showNotification('User created successfully', 'success');
      }

      setModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to save user';

      // Handle specific error cases
      if (errorMessage.includes('username') || errorMessage.includes('Username')) {
        setErrors({ username: errorMessage });
      } else if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.includes('password') || errorMessage.includes('Password')) {
        setErrors({ password: errorMessage });
      } else {
        showNotification(errorMessage, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    // Prevent deleting own account
    const currentUser = authService.getUser();
    if (currentUser && (Number(currentUser.id) === Number(user.id) || currentUser.id === user.id)) {
      showNotification('You cannot delete your own account', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await usersService.delete(user.id);
      showNotification('User deleted successfully', 'success');
      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete user';
      showNotification(errorMessage, 'error');
    }
  };

  const currentUserData = authService.getUser();
  const canManageUsers = currentUserData && (currentUserData.role === 'Super Admin' || currentUserData.role === 'Admin');

  // Handle permission toggle
  const togglePermission = (role: string, pageKey: string, permissionType: keyof Permission) => {
    // Super Admin permissions cannot be changed
    if (role === 'Super Admin') return;

    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [pageKey]: {
          ...prev[role][pageKey],
          [permissionType]: !prev[role][pageKey][permissionType],
        },
      },
    }));
    setPermissionsChanged(true);
  };

  // Save permissions
  const handleSavePermissions = async () => {
    try {
      setSavingPermissions(true);
      await permissionsService.bulkUpdate(permissions);

      showNotification('Permissions saved successfully', 'success');
      setPermissionsChanged(false);
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      showNotification(error.response?.data?.message || 'Failed to save permissions', 'error');
    } finally {
      setSavingPermissions(false);
    }
  };

  // Reset permissions
  const handleResetPermissions = () => {
    if (confirm('Are you sure you want to reset all permissions to default values?')) {
      initializePermissions();
      setPermissionsChanged(false);
      showNotification('Permissions reset to defaults', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage CMS admin users. Users are stored securely in the database.
          </p>
        </div>
        {canManageUsers && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-user-add-line"></i>
            Add User
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DataTable
            data={users}
            columns={[
              {
                key: 'username',
                header: 'USERNAME',
                render: (value) => <span className="font-medium text-gray-900">{value}</span>
              },
              {
                key: 'email',
                header: 'EMAIL',
                render: (value) => <span className="text-gray-700 text-sm">{value}</span>
              },
              {
                key: 'role',
                header: 'ROLE',
                render: (value) => {
                  const roleColors: Record<string, string> = {
                    'Super Admin': 'bg-purple-100 text-purple-700',
                    'Admin': 'bg-blue-100 text-blue-700',
                    'Editor': 'bg-green-100 text-green-700',
                    'Viewer': 'bg-gray-100 text-gray-700',
                  };
                  return (
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${roleColors[value as string] || 'bg-gray-100 text-gray-700'}`}>
                      {value}
                    </span>
                  );
                }
              },
              {
                key: 'isActive',
                header: 'STATUS',
                render: (value) => (
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )
              },
              {
                key: 'lastLogin',
                header: 'LAST LOGIN',
                render: (value) => {
                  if (!value) return <span className="text-gray-400 text-xs">Never</span>;
                  const date = new Date(value);
                  return <span className="text-gray-600 text-sm">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>;
                }
              }
            ]}
            onEdit={canManageUsers ? ((item) => openEdit(item as User)) : undefined}
            onDelete={canManageUsers && currentUserData?.role === 'Super Admin' ? ((item) => handleDelete(item as User)) : undefined}
            loading={loading}
            emptyMessage="No users found"
          />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentUser({});
          setErrors({});
        }}
        title={isEditMode ? 'Edit User' : 'Add User'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setModalOpen(false);
                setCurrentUser({});
                setErrors({});
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  {isEditMode ? 'Save Changes' : 'Create User'}
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Username"
            name="username"
            value={currentUser.username || ''}
            onChange={(value) => setCurrentUser((prev) => ({ ...prev, username: value }))}
            required
            error={errors.username}
            helpText="Username must be at least 3 characters"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={currentUser.email || ''}
            onChange={(value) => setCurrentUser((prev) => ({ ...prev, email: value }))}
            required
            error={errors.email}
          />

          <FormField
            label="Role"
            name="role"
            type="select"
            value={currentUser.role || 'Editor'}
            onChange={(value) => setCurrentUser((prev) => ({ ...prev, role: value as any }))}
            required
            error={errors.role}
            options={[
              { value: 'Super Admin', label: 'Super Admin' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Editor', label: 'Editor' },
              { value: 'Viewer', label: 'Viewer' },
            ]}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={currentUser.password || ''}
            onChange={(value) => setCurrentUser((prev) => ({ ...prev, password: value }))}
            required={!isEditMode}
            error={errors.password}
            helpText={
              isEditMode
                ? 'Leave blank to keep current password'
                : 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
            }
          />

          {currentUser.password && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-1">Password Requirements:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className={currentUser.password.length >= 8 ? 'text-green-600' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[A-Z]/.test(currentUser.password) ? 'text-green-600' : ''}>
                  ✓ One uppercase letter
                </li>
                <li className={/[a-z]/.test(currentUser.password) ? 'text-green-600' : ''}>
                  ✓ One lowercase letter
                </li>
                <li className={/[0-9]/.test(currentUser.password) ? 'text-green-600' : ''}>
                  ✓ One number
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(currentUser.password) ? 'text-green-600' : ''}>
                  ✓ One special character
                </li>
              </ul>
            </div>
          )}
        </div>
      </Modal>

      {/* CMS Permissions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">CMS Page Permissions</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure role-based permissions for CMS pages. Super Admin always has full access.
            </p>
          </div>
          <div className="flex gap-2">
            {/* Hidden: Reset Permissions button */}
            {/* <button
              onClick={handleResetPermissions}
              disabled={!permissionsChanged || savingPermissions}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i className="ri-refresh-line"></i>
              Reset
            </button> */}
            <button
              onClick={handleSavePermissions}
              disabled={!permissionsChanged || savingPermissions}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingPermissions ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>

        {permissionsChanged && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
            <i className="ri-alert-line text-yellow-600"></i>
            <p className="text-sm text-yellow-800">You have unsaved permission changes</p>
          </div>
        )}

        {/* Permissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200 sticky left-0 bg-gray-50 z-10">
                  CMS Page
                </th>
                {ROLES.map(role => (
                  <th key={role} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200" colSpan={4}>
                    {role}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 border-b border-gray-200 sticky left-0 bg-gray-50 z-10"></th>
                {ROLES.map(role => (
                  <React.Fragment key={role}>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-b border-gray-200" title="Create">
                      <i className="ri-add-circle-line"></i>
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-b border-gray-200" title="Edit">
                      <i className="ri-edit-line"></i>
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-b border-gray-200" title="Delete">
                      <i className="ri-delete-bin-line"></i>
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-b border-gray-200" title="View">
                      <i className="ri-eye-line"></i>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {CMS_PAGES.map((page, index) => (
                <tr key={page.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200 sticky left-0 z-10" style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    {page.label}
                  </td>
                  {ROLES.map(role => {
                    const pagePermissions = permissions[role]?.[page.key] || { create: false, edit: false, delete: false, view: false };
                    const isSuperAdmin = role === 'Super Admin';

                    return (
                      <React.Fragment key={role}>
                        {/* Create */}
                        <td className="px-2 py-3 text-center border-b border-gray-200">
                          <input
                            type="checkbox"
                            checked={pagePermissions.create}
                            onChange={() => togglePermission(role, page.key, 'create')}
                            disabled={isSuperAdmin}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                        {/* Edit */}
                        <td className="px-2 py-3 text-center border-b border-gray-200">
                          <input
                            type="checkbox"
                            checked={pagePermissions.edit}
                            onChange={() => togglePermission(role, page.key, 'edit')}
                            disabled={isSuperAdmin}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                        {/* Delete */}
                        <td className="px-2 py-3 text-center border-b border-gray-200">
                          <input
                            type="checkbox"
                            checked={pagePermissions.delete}
                            onChange={() => togglePermission(role, page.key, 'delete')}
                            disabled={isSuperAdmin}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                        {/* View */}
                        <td className="px-2 py-3 text-center border-b border-gray-200">
                          <input
                            type="checkbox"
                            checked={pagePermissions.view}
                            onChange={() => togglePermission(role, page.key, 'view')}
                            disabled={isSuperAdmin}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="ri-add-circle-line"></i>
            <span>Create</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="ri-edit-line"></i>
            <span>Edit</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="ri-delete-bin-line"></i>
            <span>Delete</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="ri-eye-line"></i>
            <span>View</span>
          </div>
          <div className="ml-auto text-xs text-gray-500">
            <i className="ri-information-line"></i> Super Admin permissions cannot be modified
          </div>
        </div>
      </div>
    </div>
  );
}
