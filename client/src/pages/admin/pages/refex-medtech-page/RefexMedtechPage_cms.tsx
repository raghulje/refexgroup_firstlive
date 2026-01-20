import { useEffect, useState } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexMedtechPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexMedtechPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexMedtechPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  // MedTech specific sections we treat as fixed tabs (excluded from generic list)
  const fixedSectionKeys = [
    'hero-section',
    'associate-companies',
    'stats',
    'commitment',
    'specialities',
    'products',
    'certifications',
    'clientele',
    'cta-section',
    // Legacy/generic sections that exist in DB but we don't want as extra tabs
    'overview',
    'technology',
    'quality',
    'applications',
    'gallery'
  ];

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchPageData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const output = await pagesService.getBySlug('refex-medtech');
      setPage(output);
      const sectionsData = await sectionsService.getByPageId(output.id);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSectionContent = (item: any, section: any) => {
    setEditingItem(item);
    const formDataToSet: any = {
      ...item,
      mediaId: item.mediaId || item.media?.id || null,
      sectionId: section.id,
      _section: section
    };

    if (item.contentType === 'json' && typeof item.contentValue === 'string') {
      try {
        formDataToSet.contentValue = JSON.parse(item.contentValue);
      } catch {
        formDataToSet.contentValue = item.contentValue;
      }
    }

    setFormData(formDataToSet);
    setModalType('edit');
    setCurrentEntityType(`section-content-${section.sectionKey}`);
    setShowModal(true);
  };

  const handleEditFixedSection = async (sectionKey: string) => {
    if (!page?.id) return;

    try {
      setLoading(true);

      let section = sections.find(s => s.sectionKey === sectionKey);

      if (!section) {
        section = await sectionsService.create({
          pageId: page.id,
          sectionKey,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        const updatedSections = await sectionsService.getByPageId(page.id);
        setSections(updatedSections);
        section = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      }

      if (!section) return;

      const formData: any = {
        sectionId: section.id,
        _section: section
      };

      if (section.content && section.content.length > 0) {
        section.content.forEach((item: any) => {
          if (item.contentType === 'json') {
            try {
              formData[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            formData[item.contentKey] = item.contentValue;
          }

          if (item.mediaId) {
            formData[item.contentKey] = item.mediaId;
          }
        });
      }

      setEditingItem(section);
      setFormData(formData);
      setModalType('edit');
      setCurrentEntityType(`section-content-${sectionKey}`);
      setShowModal(true);
    } catch (error) {
      console.error('Error handling fixed section:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Refex MedTech Page Management</h2>
        <button
          onClick={() => window.open('/refex-medtech', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Fixed section tabs (match actual MedTech sections) */}
          <button
            onClick={() => setActiveSection('hero-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-2-line text-base"></i>
            <span className="font-medium">Hero Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('associate-companies')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'associate-companies'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-building-4-line text-base"></i>
            <span className="font-medium">Associate Companies</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'associate-companies'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('stats')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'stats'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-bar-chart-2-line text-base"></i>
            <span className="font-medium">Stats</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'stats'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('commitment')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'commitment'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-heart-pulse-line text-base"></i>
            <span className="font-medium">Commitment</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'commitment'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('specialities')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'specialities'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-stack-line text-base"></i>
            <span className="font-medium">Specialities</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'specialities'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('products')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'products'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-box-3-line text-base"></i>
            <span className="font-medium">Products</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'products'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('certifications')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'certifications'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-award-line text-base"></i>
            <span className="font-medium">Certifications</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'certifications'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('clientele')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'clientele'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-user-star-line text-base"></i>
            <span className="font-medium">Clientele</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'clientele'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('cta')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-arrow-right-circle-line text-base"></i>
            <span className="font-medium">CTA Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic sections (non‑fixed) */}
          {sections
            .filter(s => !fixedSectionKeys.includes(s.sectionKey))
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection('page-section');
                  setActivePageSection(section.sectionKey);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'page-section' && activePageSection === section.sectionKey
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <i className="ri-file-list-line text-base"></i>
                <span className="font-medium capitalize">
                  {section.sectionKey?.replace(/-/g, ' ') || 'Untitled Section'}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'page-section' && activePageSection === section.sectionKey
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {section.content?.length || 0}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Hero Section preview */}
      {activeSection === 'hero-section' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
              <p className="text-gray-500 mt-1">Manage the main banner content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('hero-section')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'hero-section');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');
            const equipmentImage = section?.content?.find((c: any) => c.contentKey === 'image');

            return (
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  {bgImage?.media ? (
                    <img
                      src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                      alt="Hero Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <i className="ri-image-line text-4xl mb-2"></i>
                      <p>No background image</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-between px-6">
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">{title || 'Refex MedTech'}</h2>
                      {description && (
                        <p className="text-gray-700 text-sm max-w-xl line-clamp-3">
                          {description}
                        </p>
                      )}
                    </div>
                    {equipmentImage?.media && (
                      <div className="flex-shrink-0 ml-4">
                        <img
                          src={getAssetPath(equipmentImage.media.url || equipmentImage.media.filePath)}
                          alt="Equipment"
                          className="h-40 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Associate Companies */}
      {activeSection === 'associate-companies' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Associate Companies</h3>
              <p className="text-gray-500 mt-1">Manage the 3i MedTech and Adonis content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('associate-companies')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'associate-companies');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const companiesItem = section?.content?.find((c: any) => c.contentKey === 'companies');

            let companies: Array<{ name: string; description: string }> = [];
            if (companiesItem) {
              try {
                companies = Array.isArray(companiesItem.contentValue)
                  ? companiesItem.contentValue
                  : JSON.parse(companiesItem.contentValue || '[]');
              } catch {
                companies = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                {companies.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {companies.map((company, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800">{company.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No companies configured yet. Click edit to manage associate companies.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Stats */}
      {activeSection === 'stats' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Stats</h3>
              <p className="text-gray-500 mt-1">Manage key MedTech statistics</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('stats')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'stats');
            const statsItem = section?.content?.find((c: any) => c.contentKey === 'stats');

            let stats: Array<{ value: string; suffix?: string; label: string }> = [];
            if (statsItem) {
              try {
                stats = Array.isArray(statsItem.contentValue)
                  ? statsItem.contentValue
                  : JSON.parse(statsItem.contentValue || '[]');
              } catch {
                stats = [];
              }
            }

            return (
              <div className="grid sm:grid-cols-3 gap-4">
                {stats.length > 0 ? (
                  stats.map((stat, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                      <p className="text-2xl font-bold text-blue-700">
                        {stat.value}
                        {stat.suffix}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    No stats configured yet. Click edit to add MedTech stats.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Commitment */}
      {activeSection === 'commitment' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Commitment</h3>
              <p className="text-gray-500 mt-1">Manage our commitment cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('commitment')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'commitment');
            const label = section?.content?.find((c: any) => c.contentKey === 'label')?.contentValue;
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const commitmentsItem = section?.content?.find((c: any) => c.contentKey === 'commitments');

            let commitments: Array<{ title: string; description: string }> = [];
            if (commitmentsItem) {
              try {
                commitments = Array.isArray(commitmentsItem.contentValue)
                  ? commitmentsItem.contentValue
                  : JSON.parse(commitmentsItem.contentValue || '[]');
              } catch {
                commitments = [];
              }
            }

            return (
              <div className="space-y-4">
                {label && <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{label}</p>}
                {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                {commitments.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {commitments.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No commitments configured yet. Click edit to manage the cards.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Specialities */}
      {activeSection === 'specialities' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Specialities</h3>
              <p className="text-gray-500 mt-1">Manage speciality list and image</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('specialities')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'specialities');
            const label = section?.content?.find((c: any) => c.contentKey === 'label')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const imageItem = section?.content?.find((c: any) => c.contentKey === 'image');
            const specialitiesItem = section?.content?.find((c: any) => c.contentKey === 'specialities');

            let specialitiesList: Array<{ icon: string; name: string }> = [];
            if (specialitiesItem) {
              try {
                specialitiesList = Array.isArray(specialitiesItem.contentValue)
                  ? specialitiesItem.contentValue
                  : JSON.parse(specialitiesItem.contentValue || '[]');
              } catch {
                specialitiesList = [];
              }
            }

            return (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {label && <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{label}</p>}
                  {description && <p className="text-gray-600 whitespace-pre-wrap">{description}</p>}
                  {imageItem && (
                    <img
                      src={getAssetPath(imageItem.contentValue || imageItem.media?.filePath || '')}
                      alt="Specialities"
                      className="mt-3 rounded-lg border border-gray-200 max-w-md"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  {specialitiesList.length > 0 ? (
                    <ul className="space-y-2">
                      {specialitiesList.map((sp, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <i className={`${sp.icon || 'ri-check-line'} text-blue-600`}></i>
                          <span>{sp.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">
                      No specialities configured yet. Click edit to manage the list.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Products (detailed list) */}
      {activeSection === 'products' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Products</h3>
              <p className="text-gray-500 mt-1">Manage detailed product information</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('products')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'products');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const productsItem = section?.content?.find((c: any) => c.contentKey === 'products');

            let products: Array<{ title: string; subtitle?: string }> = [];
            if (productsItem) {
              try {
                products = Array.isArray(productsItem.contentValue)
                  ? productsItem.contentValue
                  : JSON.parse(productsItem.contentValue || '[]');
              } catch {
                products = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                {description && <p className="text-gray-600 whitespace-pre-wrap">{description}</p>}
                {products.length > 0 ? (
                  <div className="space-y-3">
                    {products.map((prod, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="font-semibold text-gray-800">{prod.title}</p>
                        {prod.subtitle && <p className="text-sm text-gray-600">{prod.subtitle}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No products configured yet. Click edit to manage the product list.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Certifications */}
      {activeSection === 'certifications' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Certifications</h3>
              <p className="text-gray-500 mt-1">Manage certification logos</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('certifications')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'certifications');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const certsItem = section?.content?.find((c: any) => c.contentKey === 'certifications');

            let certs: Array<{ image: string; title: string }> = [];
            if (certsItem) {
              try {
                certs = Array.isArray(certsItem.contentValue)
                  ? certsItem.contentValue
                  : JSON.parse(certsItem.contentValue || '[]');
              } catch {
                certs = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                {certs.length > 0 ? (
                  <div className="grid sm:grid-cols-4 gap-4">
                    {certs.map((cert, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        <p className="text-sm font-semibold text-gray-800">{cert.title}</p>
                        <p className="text-[11px] text-gray-500 break-all mt-1">{cert.image}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No certifications configured yet. Click edit to manage them.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Clientele */}
      {activeSection === 'clientele' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Clientele</h3>
              <p className="text-gray-500 mt-1">Manage client logo list</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('clientele')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'clientele');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const logosItem = section?.content?.find((c: any) => c.contentKey === 'clientLogos');

            let logos: string[] = [];
            if (logosItem) {
              try {
                logos = Array.isArray(logosItem.contentValue)
                  ? logosItem.contentValue
                  : JSON.parse(logosItem.contentValue || '[]');
              } catch {
                logos = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
                {logos.length > 0 ? (
                  <p className="text-sm text-gray-600">
                    {logos.length} client logos configured. Edit to update the list.
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    No client logos configured yet. Click edit to manage them.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* CTA Section preview */}
      {activeSection === 'cta' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
              <p className="text-gray-500 mt-1">Manage call to action cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('cta-section')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          {(() => {
            const section = sections.find(s => s.sectionKey === 'cta-section');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');
            const button1Text = section?.content?.find((c: any) => c.contentKey === 'button1Text')?.contentValue;
            const button2Text = section?.content?.find((c: any) => c.contentKey === 'button2Text')?.contentValue;

            return (
              <div className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  {bgImage?.media ? (
                    <img
                      src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                      alt="CTA Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-blue-900/10" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {title || 'Adonis & 3i MedTech'}
                    </h2>
                    {description && (
                      <p className="text-white/90 text-sm max-w-xl line-clamp-2 mb-4">
                        {description}
                      </p>
                    )}
                    <div className="flex gap-3">
                      {button1Text && (
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                          {button1Text}
                        </span>
                      )}
                      {button2Text && (
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                          {button2Text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Dynamic sections table */}
      {activeSection === 'page-section' && activePageSection && (
        <div className="space-y-4">
          {(() => {
            const selectedSection = sections.find(s => s.sectionKey === activePageSection);
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

                <DataTable
                  data={selectedSection.content || []}
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
                      render: (_value, item) => {
                        if (item.mediaId && item.media) {
                          const mediaPath = item.media.url || item.media.filePath || '';
                          return (
                            <img
                              src={getAssetPath(mediaPath)}
                              alt={item.contentKey || 'Media'}
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          );
                        }
                        return <span className="text-gray-400 text-xs">No media</span>;
                      }
                    }
                  ]}
                  onEdit={(item) => handleEditSectionContent(item, selectedSection)}
                  onDelete={(item) => handleDelete(item, 'section-content')}
                />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}


