import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { FormField } from '../../shared/FormField';
import { ImageUpload } from '../../shared/ImageUpload';
import { getAssetPath } from '../../shared/utils';
import { navigationService, globalSettingsService } from '../../../../services/apiService';
import type { CMSComponentProps } from '../../shared/types';

interface HeaderProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  setCurrentEntityType: (type: string) => void;
  uploadImageUtil?: (file: File) => Promise<string | null>;
  uploadingImage?: boolean;
}

export default function Header_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType,
  uploadImageUtil,
  uploadingImage
}: HeaderProps) {
  const [activeTab, setActiveTab] = useState<'navigation' | 'settings'>('navigation');
  const [headerNav, setHeaderNav] = useState<any[]>([]);
  const [headerSettings, setHeaderSettings] = useState<any>({
    logo: null,
    ctaLabel: 'Get in touch',
    ctaUrl: '/contact',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeaderData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchHeaderData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchHeaderData = async () => {
    try {
      setLoading(true);
      const navData = await navigationService.getByLocation('header');
      // Sort parent items by orderIndex, then children by orderIndex
      const sortedNav = navData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)).map(parent => ({
        ...parent,
        children: parent.children ? parent.children.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0)) : []
      }));
      setHeaderNav(sortedNav);

      const settings = await globalSettingsService.getAll();
      if (settings) {
        setHeaderSettings((prev: any) => ({
          ...prev,
          logo: settings.logo_main_id || settings['logo_main_id'] || null,
          logoId: settings.logo_main_id || settings['logo_main_id'] || null,
          ctaLabel: settings.header_cta_label || settings['header_cta_label'] || 'Get in touch',
          ctaUrl: settings.header_cta_url || settings['header_cta_url'] || '/contact',
          aboutMegaMenuImage: settings.about_mega_menu_image_id ? { id: settings.about_mega_menu_image_id, filePath: settings.about_mega_menu_image_url } : null,
          aboutMegaMenuImageId: settings.about_mega_menu_image_id || null,
          aboutMegaMenuTitle: settings.about_mega_menu_title || 'About Refex Group',
          aboutMegaMenuDescription: settings.about_mega_menu_description || 'Refex Group, a trusted name in the industry for two decades. Our commitment to core values and a growth mindset drives excellence and innovation.',
          businessMegaMenuImage: settings.business_mega_menu_image_id ? { id: settings.business_mega_menu_image_id, filePath: settings.business_mega_menu_image_url } : null,
          businessMegaMenuImageId: settings.business_mega_menu_image_id || null,
          businessMegaMenuTitle: settings.business_mega_menu_title || 'Our Businesses',
          businessMegaMenuDescription: settings.business_mega_menu_description || 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.',
        }));
      }
    } catch (error) {
      console.error('Error fetching header data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    const existingNav = await navigationService.getByLocation('header');
    const hasExistingData = existingNav && existingNav.length > 0;
    
    const confirmMessage = hasExistingData
      ? 'This will DELETE all existing navigation items and create default ones. This action cannot be undone. Continue?'
      : 'This will create default header navigation items. Continue?';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      
      // Delete existing navigation if it exists
      if (hasExistingData) {
        for (const item of existingNav) {
          try {
            // Delete children first
            if (item.children && item.children.length > 0) {
              for (const child of item.children) {
                await navigationService.delete(child.id);
              }
            }
            await navigationService.delete(item.id);
          } catch (e) {
            console.error('Error deleting navigation item:', e);
          }
        }
      }

      // Create default navigation items
      const defaultNavItems = [
        { menuLocation: 'header', label: 'Home', linkType: 'internal', linkUrl: '/', orderIndex: 0, isActive: true },
        { 
          menuLocation: 'header',
          label: 'About Refex', 
          linkType: 'dropdown', 
          linkUrl: '/about-refex', 
          orderIndex: 1, 
          isActive: true,
          megaMenuTitle: 'About Refex Group',
          description: 'Refex Group, a trusted name in the industry for two decades. Our commitment to core values and a growth mindset drives excellence and innovation.',
        },
        { 
          menuLocation: 'header',
          label: 'Business', 
          linkType: 'dropdown', 
          linkUrl: '/#business', 
          orderIndex: 2, 
          isActive: true,
          megaMenuTitle: 'Our Businesses',
          description: 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.',
        },
        { menuLocation: 'header', label: 'Investments', linkType: 'internal', linkUrl: '/investments', orderIndex: 3, isActive: true },
        { menuLocation: 'header', label: 'ESG', linkType: 'internal', linkUrl: '/esg', orderIndex: 4, isActive: true },
      ];

      const createdItems: any[] = [];
      for (const item of defaultNavItems) {
        const created = await navigationService.create(item);
        createdItems.push(created);
      }

      // Create submenu items for About Refex (full list as per design)
      const aboutMenu = createdItems.find(item => item.label === 'About Refex');
      if (aboutMenu) {
        const aboutSubmenus = [
          { label: 'About Refex', linkUrl: '/about-refex', orderIndex: 0 },
          { label: 'Leadership Team', linkUrl: '/about-refex#leadership', orderIndex: 1 },
          { label: 'Mission & Vision', linkUrl: '/about-refex#missionvision', orderIndex: 2 },
          { label: 'Careers', linkUrl: '/careers', orderIndex: 3 },
          { label: 'Newsroom', linkUrl: '/newsroom', orderIndex: 4 },
          { label: 'Diversity & Inclusion', linkUrl: '/diversity-inclusion', orderIndex: 5 },
          { label: 'Gallery', linkUrl: '/gallery', orderIndex: 6 },
        ];
        for (const submenu of aboutSubmenus) {
          await navigationService.create({
            ...submenu,
            menuLocation: 'header',
            linkType: 'internal',
            parentId: aboutMenu.id,
            isActive: true,
          });
        }
      }

      // Create submenu items for Business
      const businessMenu = createdItems.find(item => item.label === 'Business');
      if (businessMenu) {
        const businessSubmenus = [
          { label: 'Refex Refrigerants', linkUrl: '/refex-refrigerants', orderIndex: 0 },
          { label: 'Refex Renewables', linkUrl: '/refex-renewables', orderIndex: 1 },
          { label: 'Refex Ash & Coal Handling', linkUrl: '/refex-ash-coal-handling', orderIndex: 2 },
          { label: 'Refex Medtech', linkUrl: '/refex-medtech', orderIndex: 3 },
          { label: 'Refex Capital', linkUrl: '/refex-capital', orderIndex: 4 },
          { label: 'Refex Airports and Transportation', linkUrl: '/refex-airports', orderIndex: 5 },
          { label: 'Refex Mobility', linkUrl: '/refex-mobility', orderIndex: 6 },
          { label: 'Refex Life Sciences', linkUrl: '/pharma-rl-fine-chem', orderIndex: 7 },
          { label: 'Venwind Refex', linkUrl: '/venwind-refex', orderIndex: 8 },
        ];
        for (const submenu of businessSubmenus) {
          await navigationService.create({
            ...submenu,
            menuLocation: 'header',
            linkType: 'internal',
            parentId: businessMenu.id,
            isActive: true,
          });
        }
      }

      // Initialize default settings
      const defaultSettings = [
        { key: 'header_cta_label', value: 'Get in touch', valueType: 'string' },
        { key: 'header_cta_url', value: '/contact', valueType: 'string' },
      ];

      for (const setting of defaultSettings) {
        try {
          await globalSettingsService.create(setting);
        } catch (e) {
          // Setting might already exist, ignore
        }
      }

      alert('Header navigation initialized successfully!');
      fetchHeaderData();
    } catch (error) {
      console.error('Error initializing header:', error);
      alert('Failed to initialize header. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNavItem = () => {
    setEditingItem(null);
    setFormData({
      menuLocation: 'header',
      label: '',
      linkType: 'internal',
      linkUrl: '',
      parentId: null,
      orderIndex: headerNav.length,
      isActive: true,
      megaMenuTitle: '',
      description: '',
      megaMenuMediaId: null,
    });
    setModalType('add');
    setCurrentEntityType('navigation');
    setShowModal(true);
  };

  const handleEditNavItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      megaMenuMediaId: item.megaMenuMediaId || item.megaMenu?.id || null,
    });
    setModalType('edit');
    setCurrentEntityType('navigation');
    setShowModal(true);
  };

  const handleAddSubmenu = (parentItem: any) => {
    setEditingItem(null);
    setFormData({
      menuLocation: 'header',
      label: '',
      linkType: 'internal',
      linkUrl: '',
      parentId: parentItem.id,
      orderIndex: (parentItem.children?.length || 0),
      isActive: true,
    });
    setModalType('add');
    setCurrentEntityType('navigation');
    setShowModal(true);
  };

  const handleSaveSettings = async () => {
    try {
      const settingsToUpdate: { key: string; value: any; valueType: string }[] = [
        { key: 'header_cta_label', value: headerSettings.ctaLabel || 'Get in touch', valueType: 'string' },
        { key: 'header_cta_url', value: headerSettings.ctaUrl || '/contact', valueType: 'string' },
      ];

      for (const setting of settingsToUpdate) {
        try {
          await globalSettingsService.update(setting.key, {
            value: setting.value,
            valueType: setting.valueType,
          });
        } catch {
          await globalSettingsService.create(setting);
        }
      }

      // Handle logo update if changed
      if (headerSettings.logo !== null && uploadImageUtil) {
        // Logo is handled separately through media upload
        try {
          await globalSettingsService.update('logo_main_id', {
            value: headerSettings.logo,
            valueType: 'number',
          });
        } catch {
          await globalSettingsService.create({
            key: 'logo_main_id',
            value: headerSettings.logo,
            valueType: 'number',
          });
        }
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Header settings saved successfully!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);

      window.dispatchEvent(new Event('cms-refresh'));
    } catch (error) {
      console.error('Error saving header settings:', error);
      alert('Failed to save header settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading header data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Header Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage header navigation, logo, and CTA button
          </p>
        </div>
        <button
          onClick={() => window.open('/', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Header
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('navigation')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'navigation'
                ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <i className="ri-menu-line" />
            Navigation
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <i className="ri-settings-3-line" />
            Header Settings
          </button>
        </div>
      </div>

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Header Navigation</h3>
            <div className="flex gap-2">
              {/* Hidden: Initialize/Reset Default button */}
              {/* <button
                onClick={handleInitialize}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors flex items-center gap-2"
                title={headerNav.length === 0 ? "Initialize with default navigation items" : "Reset to default navigation items (will delete existing)"}
              >
                <i className="ri-database-2-line" />
                {headerNav.length === 0 ? 'Initialize Default' : 'Reset to Default'}
              </button> */}
              <button
                onClick={handleAddNavItem}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line" />
                Add Nav Item
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {headerNav.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No navigation items found. Click "Add Nav Item" to create one.</p>
            ) : (
              headerNav.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.label}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {item.linkType === 'dropdown' && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">
                            Dropdown
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.linkUrl || 'No URL'}
                      </p>
                      {(item.megaMenuTitle || item.description || item.megaMenu) && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs">
                          <p><strong>Mega Menu:</strong> {item.megaMenuTitle || 'N/A'}</p>
                          {item.description && <p className="mt-1">{item.description}</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {item.linkType === 'dropdown' && (
                        <button
                          onClick={() => handleAddSubmenu(item)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          title="Add submenu item"
                        >
                          <i className="ri-add-line"></i> Submenu
                        </button>
                      )}
                      <button
                        onClick={() => handleEditNavItem(item)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete && handleDelete(item)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Submenu Items:</p>
                      <div className="space-y-2">
                        {item.children.map((child: any) => (
                          <div key={child.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                            <div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{child.label}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{child.linkUrl}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditNavItem(child)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete && handleDelete(child)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Header Settings</h3>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <i className="ri-save-3-line" />
              Save Settings
            </button>
          </div>

          <div className="space-y-6">
            {/* Logo */}
            {uploadImageUtil && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Header Logo</h4>
                <ImageUpload
                  label="Logo Image"
                  value={headerSettings.logo || ''}
                  onChange={(mediaId) => setHeaderSettings((prev: any) => ({ ...prev, logo: mediaId }))}
                  onUpload={uploadImageUtil}
                  uploading={uploadingImage || false}
                />
                {headerSettings.logo && (
                  <div className="mt-3">
                    <img
                      src={getAssetPath(headerSettings.logo)}
                      alt="Header Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Get in Touch Button</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Button Label"
                  name="header_cta_label"
                  type="text"
                  value={headerSettings.ctaLabel}
                  onChange={(value) => setHeaderSettings((prev: any) => ({ ...prev, ctaLabel: value }))}
                  placeholder="Get in touch"
                />
                <FormField
                  label="Button URL"
                  name="header_cta_url"
                  type="text"
                  value={headerSettings.ctaUrl}
                  onChange={(value) => setHeaderSettings((prev: any) => ({ ...prev, ctaUrl: value }))}
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

