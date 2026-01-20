import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { globalSettingsService } from '../../../../services/apiService';

interface GlobalSettingsProps extends Partial<CMSComponentProps> {
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (item: any, entityType?: string) => void;
  uploadImageUtil: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function GlobalSettings_cms({
  token,
  showModal,
  setShowModal,
  modalType,
  setModalType,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  handleDelete,
  uploadImageUtil,
  uploadingImage,
  setUploadingImage,
  setCurrentEntityType
}: GlobalSettingsProps) {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [websiteFont, setWebsiteFont] = useState<string>('Montserrat');

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchGlobalSettings();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchGlobalSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await globalSettingsService.getAll();
      
      // Get website font setting
      const fontSetting = settingsData?.website_font || 'Montserrat';
      setWebsiteFont(fontSetting);
      
      // Convert object to array for DataTable
      const settingsArray = Object.entries(settingsData).map(([key, value]: [string, any]) => ({
        id: key,
        key,
        value,
        valueType: typeof value === 'object' ? 'json' : typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'
      }));
      setSettings(settingsArray);
    } catch (error) {
      console.error('Error fetching global settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetting = () => {
    setEditingItem(null);
    setFormData({
      key: '',
      value: '',
      type: 'text',
      description: ''
    });
    setModalType('add');
    setCurrentEntityType('global-setting');
    setShowModal(true);
  };

  const handleEditSetting = (setting: any) => {
    setEditingItem(setting);
    setFormData({
      key: setting.key,
      value: typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : String(setting.value || ''),
      type: setting.valueType || 'text',
      description: setting.description || '',
      image: setting.logo?.id || setting.logo?.url || setting.logo || setting.image || ''
    });
    setModalType('edit');
    setCurrentEntityType('global-setting');
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleFontChange = async (font: string) => {
    try {
      setWebsiteFont(font);
      
      // Save to global settings
      try {
        await globalSettingsService.update('website_font', {
          value: font,
          valueType: 'string',
        });
      } catch {
        // If update fails, try creating
        await globalSettingsService.create({
          key: 'website_font',
          value: font,
          valueType: 'string',
        });
      }

      // Apply font immediately
      const root = document.documentElement;
      if (font === 'Source Sans Pro') {
        root.style.setProperty('--website-font', "'Source Sans Pro', sans-serif");
      } else {
        root.style.setProperty('--website-font', "'Montserrat', sans-serif");
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Font updated successfully!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);

      // Refresh settings
      fetchGlobalSettings();
      
      // Dispatch refresh event for other components
      window.dispatchEvent(new Event('cms-refresh'));
    } catch (error) {
      console.error('Error updating font:', error);
      alert('Failed to update font. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800">Global Settings Management</h2>

      {/* Website Font Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Website Font</h3>
          <p className="text-sm text-gray-500">
            Select the font family to be used across the entire website
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Font Family:
          </label>
          <select
            value={websiteFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Montserrat">Montserrat</option>
            <option value="Source Sans Pro">Source Sans Pro</option>
          </select>
          <div className="text-sm text-gray-600">
            Current: <span className="font-semibold">{websiteFont}</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> The selected font will be applied to all pages and components across the website. 
            Changes take effect immediately.
          </p>
        </div>
      </div>

      {/* Settings Overview Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Website Settings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage global website configuration and settings
            </p>
          </div>
          <button
            onClick={handleAddSetting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Setting
          </button>
        </div>

        {settings.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <i className="ri-settings-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">No settings configured</p>
            <button
              onClick={handleAddSetting}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Setting
            </button>
          </div>
        ) : (
          <DataTable
            data={settings}
            columns={[
              {
                key: 'key',
                header: 'SETTING KEY',
                render: (value) => (
                  <span className="font-medium text-gray-900 font-mono text-sm">
                    {value || 'N/A'}
                  </span>
                )
              },
              {
                key: 'value',
                header: 'VALUE',
                render: (value, item) => {
                  // Handle image/logo settings
                  if ((item.key === 'logo' || item.key?.includes('image') || item.key?.includes('icon')) && value) {
                    const imagePath = typeof value === 'string' ? value : (value?.url || value?.filePath || '');
                    return (
                      <img
                        src={getAssetPath(imagePath)}
                        alt={item.key}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    );
                  }
                  
                  // Handle different value types
                  if (typeof value === 'object') {
                    return (
                      <span className="text-gray-600 text-sm font-mono">
                        {JSON.stringify(value).substring(0, 50)}...
                      </span>
                    );
                  }
                  
                  const displayValue = String(value || 'N/A');
                  return (
                    <span className="text-gray-700 text-sm" title={displayValue}>
                      {displayValue.length > 60 ? `${displayValue.substring(0, 60)}...` : displayValue}
                    </span>
                  );
                }
              },
              {
                key: 'valueType',
                header: 'TYPE',
                render: (value) => (
                  <span className="px-2 py-1 rounded text-xs font-semibold capitalize bg-blue-100 text-blue-700">
                    {value || 'string'}
                  </span>
                )
              }
            ]}
            onEdit={handleEditSetting}
            onDelete={(item) => handleDelete(item, 'global-setting')}
          />
        )}
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <i className="ri-information-line text-2xl text-blue-600 mt-1"></i>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">About Global Settings</h4>
            <p className="text-sm text-blue-800">
              Global settings control site-wide configuration like site name, tagline, company information, and other shared values across the website. 
              These settings are used throughout the site and can be referenced in any page or component.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
