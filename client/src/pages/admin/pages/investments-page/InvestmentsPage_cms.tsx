import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface InvestmentsPageProps extends Partial<CMSComponentProps> {
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

export default function InvestmentsPage_cms({
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
}: InvestmentsPageProps) {
  const [investmentsPage, setInvestmentsPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'intro', 'message-anil-jain', 'listed-companies', 'contact-info', 'cta'];

  useEffect(() => {
    fetchInvestmentsData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchInvestmentsData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchInvestmentsData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('investments');
      setInvestmentsPage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);
    } catch (error) {
      console.error('Error fetching investments data:', error);
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

    // If there's a media relationship, use it
    if (contentItem.media?.filePath) {
      return contentItem.media.filePath;
    }
    if (contentItem.media?.url) {
      return contentItem.media.url;
    }

    // Otherwise use contentValue
    return contentItem.contentValue || '';
  };

  const handleEditFixedSection = async (targetSection: any) => {
    if (!targetSection) return;

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
          } else {
            contentData[item.contentKey] = item.contentValue;
          }
        }
      });
    }

    setEditingItem(targetSection);
    setFormData(contentData);
    setModalType('edit');

    // Set entity type based on section key
    const entityTypeMap: Record<string, string> = {
      'hero': 'section-content-hero-investments',
      'intro': 'section-content-intro-investments',
      'message-anil-jain': 'section-content-message-anil-jain',
      'listed-companies': 'section-content-listed-companies',
      'contact-info': 'section-content-contact-info-investments',
      'cta': 'section-content-cta-investments'
    };

    const entityType = entityTypeMap[targetSection.sectionKey] || `section-content-${targetSection.sectionKey}`;
    setCurrentEntityType(entityType);

    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const introSection = getSectionByKey('intro');
  const messageSection = getSectionByKey('message-anil-jain');
  const listedCompaniesSection = getSectionByKey('listed-companies');
  const contactInfoSection = getSectionByKey('contact-info');
  const ctaSection = getSectionByKey('cta');

  return (
    <div className="space-y-6">
      {/* Page Title and Preview */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Investments Page Management</h2>
        <button
          onClick={() => {
            // Open preview in new tab
            window.open(`/investments`, '_blank');
          }}
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

          {/* Intro Section Tab */}
          <button
            onClick={() => setActiveSection('intro')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'intro'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-text-line text-base"></i>
            <span className="font-medium">Intro</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'intro'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Message from Anil Jain Tab */}
          <button
            onClick={() => setActiveSection('message-anil-jain')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'message-anil-jain'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-user-voice-line text-base"></i>
            <span className="font-medium">Message from Anil Jain</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'message-anil-jain'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Listed Companies Tab */}
          <button
            onClick={() => setActiveSection('listed-companies')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'listed-companies'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-building-line text-base"></i>
            <span className="font-medium">Listed Companies</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'listed-companies'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Contact Info Tab */}
          <button
            onClick={() => setActiveSection('contact-info')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'contact-info'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-mail-line text-base"></i>
            <span className="font-medium">Contact Info</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'contact-info'
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(heroSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(heroSection, 'backgroundImage'))}
                  alt="Hero Background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Intro Section */}
      {activeSection === 'intro' && introSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Intro Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage intro section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(introSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(introSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Logo</label>
              {getImagePath(introSection, 'logo') ? (
                <img
                  src={getAssetPath(getImagePath(introSection, 'logo'))}
                  alt="Logo"
                  className="h-20 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlN2U5ZWIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gTG9nbzwvdGV4dD48L3N2Zz4=';
                  }}
                />
              ) : (
                <p className="text-gray-400">No logo set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message from Anil Jain Section */}
      {activeSection === 'message-anil-jain' && messageSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Message from Anil Jain</h3>
              <p className="text-sm text-gray-500 mt-1">Manage message section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(messageSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(messageSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Position</label>
              <p className="text-gray-600">{getContentValue(messageSection, 'position') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Content</label>
              {(() => {
                try {
                  const content = JSON.parse(getContentValue(messageSection, 'content') || '[]');
                  return (
                    <div className="space-y-2">
                      {Array.isArray(content) && content.map((para: string, idx: number) => (
                        <p key={idx} className="text-gray-600">{para}</p>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-600">{getContentValue(messageSection, 'content') || 'Not set'}</p>;
                }
              })()}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(messageSection, 'image') ? (
                <img
                  src={getAssetPath(getImagePath(messageSection, 'image'))}
                  alt="Message Background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listed Companies Section */}
      {activeSection === 'listed-companies' && listedCompaniesSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Listed Companies</h3>
              <p className="text-sm text-gray-500 mt-1">Manage listed companies section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(listedCompaniesSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(listedCompaniesSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(listedCompaniesSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Companies</label>
              {(() => {
                try {
                  const companies = JSON.parse(getContentValue(listedCompaniesSection, 'companies') || '[]');
                  return (
                    <div className="space-y-3">
                      {Array.isArray(companies) && companies.map((company: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{company.name || `Company ${idx + 1}`}</h4>
                          {company.bse && (
                            <p className="text-sm text-gray-600">BSE: {company.bse.price} ({company.bse.change})</p>
                          )}
                          {company.nse && (
                            <p className="text-sm text-gray-600">NSE: {company.nse.price} ({company.nse.change})</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No companies data</p>;
                }
              })()}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Disclaimer</label>
              <p className="text-gray-600 text-sm">{getContentValue(listedCompaniesSection, 'disclaimer') || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Section */}
      {activeSection === 'contact-info' && contactInfoSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Contact Info</h3>
              <p className="text-sm text-gray-500 mt-1">Manage contact info section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(contactInfoSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Text</label>
              <p className="text-gray-600">{getContentValue(contactInfoSection, 'text') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-600">{getContentValue(contactInfoSection, 'email') || 'Not set'}</p>
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
              <label className="text-sm font-medium text-gray-700">Background Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: getContentValue(ctaSection, 'backgroundColor') || '#3b9dd6' }}
                ></div>
                <span className="text-gray-600">{getContentValue(ctaSection, 'backgroundColor') || '#3b9dd6'}</span>
              </div>
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

      {/* Dynamic Page Sections */}
      {!fixedSectionKeys.includes(activeSection) && (() => {
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
