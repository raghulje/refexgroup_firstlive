import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, contactInfoService } from '../../../../services/apiService';

interface ContactPageProps extends Partial<CMSComponentProps> {
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

export default function ContactPage_cms({
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
}: ContactPageProps) {
  const [contactPage, setContactPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [contactInfoItems, setContactInfoItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'contact-form', 'cta'];

  useEffect(() => {
    fetchContactData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      console.log('CMS refresh event received, fetching fresh data...');
      fetchContactData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('contact');
      setContactPage(page);

      // Fetch fresh sections with all relationships
      const pageSections = await sectionsService.getByPageId(page.id);
      console.log('Fetched sections:', pageSections);
      setSections(pageSections);

      const infoItems = await contactInfoService.getAll();
      setContactInfoItems(infoItems);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionByKey = (key: string) => {
    return sections.find(s => s.sectionKey === key);
  };

  const getContentValue = (section: any, key: string) => {
    if (!section?.content) return '';
    const contentItem = section.content.find((c: any) => c.contentKey === key);
    return contentItem?.contentValue || '';
  };

  // Helper function to get image path from content value or media object
  const getImagePath = (section: any, key: string) => {
    if (!section?.content) return '';
    const contentItem = section.content.find((c: any) => c.contentKey === key);
    if (!contentItem) return '';

    // Priority 1: If contentValue is a direct path (URL or file path), use it
    // This handles cases where user entered a URL path directly
    if (contentItem.contentValue && typeof contentItem.contentValue === 'string') {
      const contentValue = contentItem.contentValue.trim();
      // If it's a direct path (starts with /, http://, or https://), use it
      if (contentValue && (contentValue.startsWith('/') || contentValue.startsWith('http://') || contentValue.startsWith('https://'))) {
        // Only use media if contentValue is NOT a direct path
        // If contentValue looks like a media reference path (/uploads/media/123), check media
        if (!contentValue.startsWith('/uploads/media/')) {
          return contentValue;
        }
      }
    }

    // Priority 2: If there's a media relationship, use it
    if (contentItem.media) {
      if (contentItem.media.filePath) {
        return contentItem.media.filePath;
      }
      if (contentItem.media.url) {
        return contentItem.media.url;
      }
    }

    // Priority 3: If there's a mediaId but no media object, we need to fetch it
    // For now, return empty and let the form handle it
    if (contentItem.mediaId && !contentItem.media) {
      // The media relationship should be included in the API response
      // If it's not, we might need to fetch it separately
      // For preview purposes, return empty and show "No image set"
      return '';
    }

    // Priority 4: Use contentValue as fallback
    if (contentItem.contentValue && typeof contentItem.contentValue === 'string') {
      const contentValue = contentItem.contentValue.trim();
      if (contentValue) {
        return contentValue;
      }
    }

    return '';
  };

  const handleEditFixedSection = async (targetSection: any) => {
    if (!targetSection) return;

    // Fetch fresh section data to ensure we have the latest content
    try {
      const freshSection = await sectionsService.getById(targetSection.id);
      if (!freshSection) {
        console.error('Section not found');
        return;
      }

      const contentData: any = {};

      if (freshSection.content && Array.isArray(freshSection.content)) {
        freshSection.content.forEach((item: any) => {
          if (item.contentType === 'json') {
            try {
              contentData[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              contentData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image fields (especially backgroundImage), prefer contentValue if it's a direct path
            // This allows the ImageUpload component to show the preview correctly
            if (item.contentKey === 'backgroundImage') {
              // If there's a direct path in contentValue, use it
              if (item.contentValue && (item.contentValue.startsWith('/') || item.contentValue.startsWith('http'))) {
                contentData[item.contentKey] = item.contentValue;
              } else if (item.mediaId) {
                contentData[item.contentKey] = item.mediaId;
              } else if (item.media?.id) {
                contentData[item.contentKey] = item.media.id;
              } else if (item.media?.filePath) {
                contentData[item.contentKey] = item.media.filePath;
              } else {
                contentData[item.contentKey] = item.contentValue || '';
              }
            } else {
              // For other image fields, use mediaId if available
              if (item.mediaId) {
                contentData[item.contentKey] = item.mediaId;
              } else if (item.media?.id) {
                contentData[item.contentKey] = item.media.id;
              } else {
                contentData[item.contentKey] = item.contentValue || '';
              }
            }
          }
        });
      }

      setEditingItem(freshSection);
      setFormData(contentData);
      setModalType('edit');

      // Set entity type based on section key
      if (freshSection.sectionKey === 'hero') {
        setCurrentEntityType('section-content-hero-contact');
      } else if (freshSection.sectionKey === 'cta') {
        setCurrentEntityType('section-content-cta-contact');
      } else {
        setCurrentEntityType(`section-content-${freshSection.sectionKey}`);
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error fetching fresh section data:', error);
      // Fallback to using the provided section
      const contentData: any = {};

      if (targetSection.content && Array.isArray(targetSection.content)) {
        targetSection.content.forEach((item: any) => {
          if (item.contentType === 'json') {
            try {
              contentData[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              contentData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image fields, use mediaId if available
            if (item.mediaId) {
              contentData[item.contentKey] = item.mediaId;
            } else if (item.media?.id) {
              contentData[item.contentKey] = item.media.id;
            } else {
              contentData[item.contentKey] = item.contentValue || '';
            }
          }
        });
      }

      setEditingItem(targetSection);
      setFormData(contentData);
      setModalType('edit');

      if (targetSection.sectionKey === 'hero') {
        setCurrentEntityType('section-content-hero-contact');
      } else if (targetSection.sectionKey === 'cta') {
        setCurrentEntityType('section-content-cta-contact');
      } else {
        setCurrentEntityType(`section-content-${targetSection.sectionKey}`);
      }

      setShowModal(true);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const contactFormSection = getSectionByKey('contact-form');
  const ctaSection = getSectionByKey('cta');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contact Page Management</h2>
        <button
          onClick={() => window.open('/contact', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Section Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Section Tab */}
          <button
            onClick={() => setActiveSection('hero')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-2-line text-base"></i>
            <span className="font-medium">Hero</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Contact Form Tab */}
          <button
            onClick={() => setActiveSection('contact-form')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'contact-form'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-mail-send-line text-base"></i>
            <span className="font-medium">Contact Form</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'contact-form'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA Section Tab */}
          <button
            onClick={() => setActiveSection('cta')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-arrow-right-circle-line text-base"></i>
            <span className="font-medium">CTA</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic Page Sections Tabs */}
          {sections
            .filter(s => !fixedSectionKeys.includes(s.sectionKey))
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.sectionKey)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === section.sectionKey
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <i className="ri-file-list-line text-base"></i>
                <span className="font-medium capitalize">
                  {section.sectionKey?.replace(/-/g, ' ') || 'Untitled Section'}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === section.sectionKey
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {section.content?.length || 0}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && heroSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage hero section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(heroSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {(() => {
                const imagePath = getImagePath(heroSection, 'backgroundImage');

                if (!imagePath || imagePath.trim() === '') {
                  return <p className="text-gray-400">No image set</p>;
                }

                const assetPath = getAssetPath(imagePath);

                return (
                  <img
                    src={assetPath}
                    alt="Hero Background"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      // Try direct path if getAssetPath didn't work
                      if (imagePath.startsWith('/wp-content/') || imagePath.startsWith('/assets/')) {
                        (e.target as HTMLImageElement).src = imagePath;
                      } else {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                      }
                    }}
                  />
                );
              })()}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Office Title</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'officeTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'companyName') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              {(() => {
                try {
                  const address = JSON.parse(getContentValue(heroSection, 'address') || '[]');
                  return (
                    <div className="space-y-1">
                      {Array.isArray(address) && address.map((line: string, idx: number) => (
                        <p key={idx} className="text-gray-600">{line}</p>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-600">{getContentValue(heroSection, 'address') || 'Not set'}</p>;
                }
              })()}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'phone') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'email') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Overlay Opacity</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'overlayOpacity') || '10'}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Section */}
      {activeSection === 'contact-form' && contactFormSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Contact Form Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage contact form section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(contactFormSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(contactFormSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(contactFormSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Map URL</label>
              {getContentValue(contactFormSection, 'mapUrl') ? (
                <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={getContentValue(contactFormSection, 'mapUrl')}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map Preview"
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-400">No map URL set</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Contact Email</label>
              <p className="text-gray-900 font-semibold">{getContentValue(contactFormSection, 'contactEmail') || 'Not set'}</p>
              <p className="text-xs text-gray-500 mt-1">This email will receive all contact form submissions</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta' && ctaSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage CTA section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(ctaSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Color/Gradient</label>
              <p className="text-gray-600 text-sm">{getContentValue(ctaSection, 'backgroundColor') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">CTA Cards</label>
              {(() => {
                try {
                  const cards = JSON.parse(getContentValue(ctaSection, 'cards') || '[]');
                  return (
                    <div className="space-y-3">
                      {Array.isArray(cards) && cards.map((card: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{card.title || `Card ${idx + 1}`}</h4>
                          <p className="text-sm text-gray-600">Button: {card.buttonText} → {card.buttonLink}</p>
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No cards data</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Section - Commented out for now */}
      {/* {activeSection === 'contact-info' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Information Items</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  infoType: 'email',
                  label: '',
                  value: '',
                  iconClass: '',
                  displayLocation: 'footer',
                  orderIndex: contactInfoItems.length,
                  isActive: true
                });
                setModalType('add');
                setCurrentEntityType('contact-info');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Contact Info
            </button>
          </div>
          {contactInfoItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-contacts-line text-4xl mb-2"></i>
              <p>No contact info items found</p>
            </div>
          ) : (
            <DataTable
              data={contactInfoItems}
              columns={[
                { key: 'id', header: 'ID' },
                {
                  key: 'infoType',
                  header: 'TYPE',
                  render: (value) => (
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${value === 'email'
                        ? 'bg-blue-100 text-blue-700'
                        : value === 'phone'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                      {value || 'N/A'}
                    </span>
                  )
                },
                {
                  key: 'label',
                  header: 'LABEL',
                  render: (value) => <span className="font-medium text-gray-900">{value || 'N/A'}</span>
                },
                {
                  key: 'value',
                  header: 'VALUE',
                  render: (value) => <span className="text-gray-600">{value || 'N/A'}</span>
                },
                {
                  key: 'displayLocation',
                  header: 'LOCATION',
                  render: (value) => (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {value || 'N/A'}
                    </span>
                  )
                },
                {
                  key: 'orderIndex',
                  header: 'ORDER',
                  render: (value) => <span className="text-gray-600">{value ?? 0}</span>
                },
                {
                  key: 'isActive',
                  header: 'STATUS',
                  render: (value) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                      {value ? 'Active' : 'Inactive'}
                    </span>
                  )
                }
              ]}
              onEdit={(item) => {
                setEditingItem(item);
                setFormData(item);
                setModalType('edit');
                setCurrentEntityType('contact-info');
                setShowModal(true);
              }}
              onDelete={(item) => handleDelete(item, 'contact-info')}
            />
          )}
        </div>
      )} */}

      {/* Dynamic Page Sections */}
      {!fixedSectionKeys.includes(activeSection) && activeSection !== 'contact-info' && (() => {
        const selectedSection = sections.find(s => s.sectionKey === activeSection);
        if (!selectedSection) return null;

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 capitalize">
                  {selectedSection.sectionKey?.replace(/-/g, ' ')}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Type: <span className="capitalize">{selectedSection.sectionType}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData({
                    sectionId: selectedSection.id,
                    contentKey: '',
                    contentType: 'text',
                    contentValue: '',
                    mediaId: null
                  });
                  setModalType('add');
                  setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Content
              </button>
            </div>

            {/* Section Contents */}
            {selectedSection.content && selectedSection.content.length > 0 ? (
              <DataTable
                data={selectedSection.content}
                columns={[
                  {
                    key: 'contentKey',
                    header: 'KEY',
                    render: (value) => <span className="font-medium text-gray-900">{value}</span>
                  },
                  {
                    key: 'contentType',
                    header: 'TYPE',
                    render: (value) => <span className="text-gray-600 capitalize">{value || 'text'}</span>
                  },
                  {
                    key: 'contentValue',
                    header: 'VALUE',
                    render: (value, item) => {
                      if (item.contentType === 'json') {
                        try {
                          const parsed = JSON.parse(value || '{}');
                          return <span className="text-gray-600 text-sm">{JSON.stringify(parsed).substring(0, 50)}...</span>;
                        } catch {
                          return <span className="text-gray-600 text-sm">{String(value || '').substring(0, 50)}...</span>;
                        }
                      }
                      return <span className="text-gray-600 text-sm">{String(value || '').substring(0, 100)}</span>;
                    }
                  },
                  {
                    key: 'media',
                    header: 'MEDIA',
                    render: (value, item) => {
                      if (item.mediaId && item.media) {
                        const mediaPath = item.media.url || item.media.filePath || '';
                        return (
                          <img
                            src={getAssetPath(mediaPath)}
                            alt={item.contentKey || 'Media'}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        );
                      }
                      return <span className="text-gray-400 text-xs">No media</span>;
                    }
                  }
                ]}
                onEdit={(item) => {
                  setEditingItem(item);
                  const formDataToSet: any = {
                    ...item,
                    mediaId: item.mediaId || item.media?.id || null,
                    sectionId: selectedSection.id,
                    _section: selectedSection
                  };
                  if (item.contentType === 'json' && typeof item.contentValue === 'string') {
                    try {
                      formDataToSet.contentValue = JSON.parse(item.contentValue);
                    } catch (e) { }
                  }
                  setFormData(formDataToSet);
                  setModalType('edit');
                  setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                  setShowModal(true);
                }}
                onDelete={(item) => handleDelete(item, 'section-content')}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <i className="ri-file-list-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-600 mb-4">No content items in this section</p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({
                      sectionId: selectedSection.id,
                      contentKey: '',
                      contentType: 'text',
                      contentValue: '',
                      mediaId: null
                    });
                    setModalType('add');
                    setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Content
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
