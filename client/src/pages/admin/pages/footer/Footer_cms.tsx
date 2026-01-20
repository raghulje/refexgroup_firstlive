import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { FormField } from '../../shared/FormField';
import { ImageUpload } from '../../shared/ImageUpload';
import { getAssetPath } from '../../shared/utils';
import { PagePreview } from '../../shared/PagePreview';
import { footerService, socialLinksService, globalSettingsService } from '../../../../services/apiService';
import type { CMSComponentProps } from '../../shared/types';

interface FooterProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  setCurrentEntityType: (type: string) => void;
  uploadImageUtil?: (file: File) => Promise<string | null>;
  uploadingImage?: boolean;
}

export default function Footer_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType,
  uploadImageUtil,
  uploadingImage
}: FooterProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'social' | 'settings'>('sections');
  const [footerSections, setFooterSections] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [footerSettings, setFooterSettings] = useState<any>({
    logo: null,
    copyrightText: '2024 REFEX. All right reserved.',
    complaintPhone: '+91 96297 38734',
    complaintEmail: 'refexcares@refex.co.in',
    privacyPolicyUrl: 'https://www.refex.group/privacy-policy/',
    termsOfUseUrl: 'https://www.refex.group/terms-of-use/',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchFooterData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const sectionsData = await footerService.getAll();
      setFooterSections(sectionsData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));

      const socialData = await socialLinksService.getAll();
      setSocialLinks(socialData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));

      const settings = await globalSettingsService.getAll();
      if (settings) {
        setFooterSettings((prev: any) => ({
          ...prev,
          logo: settings.logo_footer_id || settings['logo_footer_id'] || null,
          logoId: settings.logo_footer_id || settings['logo_footer_id'] || null,
          copyrightText: settings.copyright_text || settings['copyright_text'] || '2024 REFEX. All right reserved.',
          complaintPhone: settings.footer_complaint_phone || settings['footer_complaint_phone'] || '+91 96297 38734',
          complaintEmail: settings.footer_complaint_email || settings['footer_complaint_email'] || 'refexcares@refex.co.in',
          privacyPolicyUrl: settings.footer_privacy_policy_url || settings['footer_privacy_policy_url'] || 'https://www.refex.group/privacy-policy/',
          termsOfUseUrl: settings.footer_terms_of_use_url || settings['footer_terms_of_use_url'] || 'https://www.refex.group/terms-of-use/',
        }));
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    const existingSections = await footerService.getAll();
    const existingSocial = await socialLinksService.getAll();
    const hasExistingData = (existingSections && existingSections.length > 0) || (existingSocial && existingSocial.length > 0);
    
    const confirmMessage = hasExistingData
      ? 'This will DELETE all existing footer sections and social links, then create default ones. This action cannot be undone. Continue?'
      : 'This will create default footer sections and social links. Continue?';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      
      // Delete existing footer sections if they exist
      if (existingSections && existingSections.length > 0) {
        for (const section of existingSections) {
          try {
            await footerService.deleteSection(section.id);
          } catch (e) {
            console.error('Error deleting footer section:', e);
          }
        }
      }

      // Delete existing social links if they exist
      if (existingSocial && existingSocial.length > 0) {
        for (const link of existingSocial) {
          try {
            await socialLinksService.delete(link.id);
          } catch (e) {
            console.error('Error deleting social link:', e);
          }
        }
      }

      // Create default footer sections
      const defaultSections = [
        {
          sectionType: 'business',
          sectionTitle: 'BUSINESS',
          links: [
            { label: 'Refex Refrigerants', path: '/refex-refrigerants' },
            { label: 'Refex Renewables', path: '/refex-renewables' },
            { label: 'Refex Ash & Coal Handling', path: '/refex-ash-coal-handling' },
            { label: 'Refex Medtech', path: '/refex-medtech' },
            { label: 'Refex Capital', path: '/refex-capital' },
            { label: 'Refex Airports and Transportation', path: '/refex-airports' },
            { label: 'Refex Mobility', path: '/refex-mobility' },
            { label: 'Refex Life Sciences', path: '/pharma-rl-fine-chem' },
            { label: 'Venwind Refex', path: '/venwind-refex' }
          ],
          orderIndex: 0,
          isActive: true,
        },
        {
          sectionType: 'quick-links',
          sectionTitle: 'QUICK LINKS',
          links: [
            { label: 'About Refex', path: '/about-refex' },
            { label: 'Leadership Team', path: '/about-refex#leadership' },
            { label: 'Gallery', path: '/gallery' },
            { label: 'ESG', path: '/esg' },
            { label: 'Diversity & Inclusion', path: '/diversity-inclusion' }
          ],
          orderIndex: 1,
          isActive: true,
        },
        {
          sectionType: 'other-links',
          sectionTitle: '',
          links: [
            { label: 'INVESTMENTS', path: '/investments' },
            { label: 'NEWSROOM', path: '/newsroom' },
            { label: 'CAREERS', path: '/careers' },
            { label: 'CONTACT US', path: '/contact' }
          ],
          orderIndex: 2,
          isActive: true,
        },
      ];

      for (const section of defaultSections) {
        try {
          await footerService.createSection(section);
        } catch (e) {
          console.error('Error creating footer section:', e);
          throw e; // Re-throw to show error to user
        }
      }

      // Create default social links (always create since we deleted existing ones above)
      const defaultSocialLinks = [
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/refex-group/', orderIndex: 0, isActive: true },
        { platform: 'Facebook', url: 'https://www.facebook.com/refexindustrieslimited/', orderIndex: 1, isActive: true },
        { platform: 'X', url: 'https://twitter.com/GroupRefex', orderIndex: 2, isActive: true },
        { platform: 'YouTube', url: 'https://www.youtube.com/@refexgroup', orderIndex: 3, isActive: true },
        { platform: 'Instagram', url: 'https://www.instagram.com/refexgroup/', orderIndex: 4, isActive: true },
      ];

      for (const socialLink of defaultSocialLinks) {
        try {
          await socialLinksService.create(socialLink);
        } catch (e) {
          console.error('Error creating social link:', e);
          // Continue with other links even if one fails
        }
      }

      // Initialize default settings
      const defaultSettings = [
        { key: 'copyright_text', value: '2024 REFEX. All right reserved.', valueType: 'string' },
        { key: 'footer_complaint_phone', value: '+91 96297 38734', valueType: 'string' },
        { key: 'footer_complaint_email', value: 'refexcares@refex.co.in', valueType: 'string' },
        { key: 'footer_privacy_policy_url', value: 'https://www.refex.group/privacy-policy/', valueType: 'string' },
        { key: 'footer_terms_of_use_url', value: 'https://www.refex.group/terms-of-use/', valueType: 'string' },
      ];

      for (const setting of defaultSettings) {
        try {
          await globalSettingsService.create(setting);
        } catch (e: any) {
          // Setting might already exist, try to update instead
          try {
            await globalSettingsService.update(setting.key, {
              value: setting.value,
              valueType: setting.valueType,
            });
          } catch (updateError) {
            console.warn(`Could not create or update setting ${setting.key}:`, updateError);
            // Continue with other settings
          }
        }
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Footer initialized successfully!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);

      fetchFooterData();
    } catch (error: any) {
      console.error('Error initializing footer:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initialize footer. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    setEditingItem(null);
    setFormData({
      sectionType: 'business',
      sectionTitle: '',
      links: [],
      orderIndex: footerSections.length + 1,
      isActive: true,
    });
    setModalType('add');
    setCurrentEntityType('footer-section');
    setShowModal(true);
  };

  const handleEditSection = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      links: typeof item.links === 'string' ? JSON.parse(item.links) : item.links || [],
    });
    setModalType('edit');
    setCurrentEntityType('footer-section');
    setShowModal(true);
  };

  const handleAddSocialLink = () => {
    setEditingItem(null);
    setFormData({
      platform: '',
      url: '',
      iconId: null,
      orderIndex: socialLinks.length + 1,
      isActive: true,
    });
    setModalType('add');
    setCurrentEntityType('social-link');
    setShowModal(true);
  };

  const handleEditSocialLink = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      iconId: item.iconId || item.icon?.id || null,
    });
    setModalType('edit');
    setCurrentEntityType('social-link');
    setShowModal(true);
  };

  const handleSaveSettings = async () => {
    try {
      const settingsToUpdate: { key: string; value: any; valueType: string }[] = [
        { key: 'copyright_text', value: footerSettings.copyrightText || '2024 REFEX. All right reserved.', valueType: 'string' },
        { key: 'footer_complaint_phone', value: footerSettings.complaintPhone || '+91 96297 38734', valueType: 'string' },
        { key: 'footer_complaint_email', value: footerSettings.complaintEmail || 'refexcares@refex.co.in', valueType: 'string' },
        { key: 'footer_privacy_policy_url', value: footerSettings.privacyPolicyUrl || 'https://www.refex.group/privacy-policy/', valueType: 'string' },
        { key: 'footer_terms_of_use_url', value: footerSettings.termsOfUseUrl || 'https://www.refex.group/terms-of-use/', valueType: 'string' },
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
      if (footerSettings.logo !== null && uploadImageUtil) {
        try {
          await globalSettingsService.update('logo_footer_id', {
            value: footerSettings.logo,
            valueType: 'number',
          });
        } catch {
          await globalSettingsService.create({
            key: 'logo_footer_id',
            value: footerSettings.logo,
            valueType: 'number',
          });
        }
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Footer settings saved successfully!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);

      window.dispatchEvent(new Event('cms-refresh'));
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Failed to save footer settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading footer data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Footer Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage footer sections, links, social media, and settings
          </p>
        </div>
        <PagePreview pageName="Footer" pagePath="/" />
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'sections', label: 'Footer Sections', icon: 'ri-links-line' },
            { id: 'social', label: 'Social Links', icon: 'ri-share-line' },
            { id: 'settings', label: 'Footer Settings', icon: 'ri-settings-3-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Sections Tab */}
      {activeTab === 'sections' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Footer Sections</h3>
            <div className="flex gap-2">
              {/* Hidden: Initialize/Reset Default button */}
              {/* <button
                onClick={handleInitialize}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors flex items-center gap-2"
                title={footerSections.length === 0 ? "Initialize with default footer sections" : "Reset to default footer sections (will delete existing)"}
              >
                <i className="ri-database-2-line" />
                {footerSections.length === 0 ? 'Initialize Default' : 'Reset to Default'}
              </button> */}
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Section
              </button>
            </div>
          </div>
          <DataTable
            data={footerSections}
            columns={[
              { key: 'id', header: 'ID' },
              {
                key: 'sectionType',
                header: 'TYPE',
                render: (value) => (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold uppercase">
                    {value}
                  </span>
                ),
              },
              { key: 'sectionTitle', header: 'TITLE' },
              {
                key: 'links',
                header: 'LINKS COUNT',
                render: (value) => {
                  const links = typeof value === 'string' ? JSON.parse(value) : value || [];
                  return <span className="text-gray-600 dark:text-gray-400">{links.length} links</span>;
                },
              },
              {
                key: 'isActive',
                header: 'STATUS',
                render: (value) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      value
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {value ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
              { key: 'orderIndex', header: 'ORDER' },
            ]}
            onEdit={handleEditSection}
            onDelete={(item) => handleDelete && handleDelete(item)}
            emptyMessage="No footer sections found"
          />
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Social Media Links</h3>
            <div className="flex gap-2">
              {/* Hidden: Initialize/Reset Default button */}
              {/* <button
                onClick={handleInitialize}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors flex items-center gap-2"
                title={socialLinks.length === 0 ? "Initialize with default social links" : "Reset to default social links (will delete existing)"}
              >
                <i className="ri-database-2-line" />
                {socialLinks.length === 0 ? 'Initialize Default' : 'Reset to Default'}
              </button> */}
              <button
                onClick={handleAddSocialLink}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Social Link
              </button>
            </div>
          </div>
          <DataTable
            data={socialLinks}
            columns={[
              { key: 'id', header: 'ID' },
              {
                key: 'platform',
                header: 'PLATFORM',
                render: (value) => (
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</span>
                ),
              },
              {
                key: 'url',
                header: 'URL',
                render: (value) => (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate max-w-xs block"
                  >
                    {value}
                  </a>
                ),
              },
              {
                key: 'icon',
                header: 'ICON',
                render: (value, item) => {
                  const iconPath = item.icon?.filePath || item.iconId || '';
                  if (!iconPath) return <span className="text-gray-400">No icon</span>;
                  return (
                    <img
                      src={getAssetPath(iconPath)}
                      alt={item.platform}
                      className="w-8 h-8 object-contain"
                    />
                  );
                },
              },
              {
                key: 'isActive',
                header: 'STATUS',
                render: (value) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      value
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {value ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
              { key: 'orderIndex', header: 'ORDER' },
            ]}
            onEdit={handleEditSocialLink}
            onDelete={(item) => handleDelete && handleDelete(item)}
            emptyMessage="No social links found"
          />
        </div>
      )}

      {/* Footer Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Footer Settings</h3>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <i className="ri-save-3-line"></i>
              Save Settings
            </button>
          </div>

          <div className="space-y-6">
            {/* Logo */}
            {uploadImageUtil && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Footer Logo</h4>
                <ImageUpload
                  label="Logo Image"
                  value={footerSettings.logo || ''}
                  onChange={(mediaId) => setFooterSettings((prev: any) => ({ ...prev, logo: mediaId }))}
                  onUpload={uploadImageUtil}
                  uploading={uploadingImage || false}
                />
                {footerSettings.logo && (
                  <div className="mt-3">
                    <img
                      src={getAssetPath(footerSettings.logo)}
                      alt="Footer Logo"
                      className="w-40 h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Copyright Text */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <FormField
                label="Copyright Text"
                name="copyright_text"
                type="text"
                value={footerSettings.copyrightText}
                onChange={(value) => setFooterSettings((prev: any) => ({ ...prev, copyrightText: value }))}
                placeholder="2024 REFEX. All right reserved."
              />
            </div>

            {/* Complaint Contact */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Complaint Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Phone"
                  name="footer_complaint_phone"
                  type="text"
                  value={footerSettings.complaintPhone}
                  onChange={(value) => setFooterSettings((prev: any) => ({ ...prev, complaintPhone: value }))}
                  placeholder="+91 96297 38734"
                />
                <FormField
                  label="Email"
                  name="footer_complaint_email"
                  type="email"
                  value={footerSettings.complaintEmail}
                  onChange={(value) => setFooterSettings((prev: any) => ({ ...prev, complaintEmail: value }))}
                  placeholder="refexcares@refex.co.in"
                />
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legal Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Privacy Policy URL"
                  name="footer_privacy_policy_url"
                  type="text"
                  value={footerSettings.privacyPolicyUrl}
                  onChange={(value) => setFooterSettings((prev: any) => ({ ...prev, privacyPolicyUrl: value }))}
                  placeholder="/privacy-policy"
                />
                <FormField
                  label="Terms of Use URL"
                  name="footer_terms_of_use_url"
                  type="text"
                  value={footerSettings.termsOfUseUrl}
                  onChange={(value) => setFooterSettings((prev: any) => ({ ...prev, termsOfUseUrl: value }))}
                  placeholder="/terms-of-use"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

