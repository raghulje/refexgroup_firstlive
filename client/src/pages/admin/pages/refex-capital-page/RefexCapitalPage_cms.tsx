import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexCapitalPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexCapitalPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexCapitalPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  // Fixed Capital sections that get dedicated tabs and previews
  const fixedSectionKeys = [
    'hero',
    'stats',
    'about',
    'areas-of-interest',
    'what-we-look-for',
    'portfolio',
    'cta'
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
      const output = await pagesService.getBySlug('refex-capital');
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
      _section: section // Store section object for handleSubmit
    };

    if (item.contentType === 'json' && typeof item.contentValue === 'string') {
      try {
        formDataToSet.contentValue = JSON.parse(item.contentValue);
      } catch (e) { }
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

      // Find section
      let section = sections.find(s => s.sectionKey === sectionKey);

      // If not found, create it
      if (!section) {
        section = await sectionsService.create({
          pageId: page.id,
          sectionKey: sectionKey,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        // Refresh sections locally or fetch
        const updatedSections = await sectionsService.getByPageId(page.id);
        setSections(updatedSections);
        section = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      }

      if (!section) return;

      // Prepare form data
      const formData: any = {
        sectionId: section.id,
        _section: section
      };

      // Populate form data from content
      if (section.content && section.content.length > 0) {
        section.content.forEach((item: any) => {
          // If it's JSON content, parse it
          if (item.contentType === 'json') {
            try {
              formData[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            formData[item.contentKey] = item.contentValue;
          }

          // Handle media IDs - map to field if needed
          if (item.mediaId) {
            formData[item.contentKey] = item.mediaId;
          }
        });
      }

      setEditingItem(section);
      setFormData(formData);
      setModalType('edit');
      // Use Capital-specific entity types
      const entityTypeMap: Record<string, string> = {
        'hero': 'section-content-hero-capital',
        'stats': 'section-content-stats-capital',
        'about': 'section-content-about-capital',
        'areas-of-interest': 'section-content-areas-of-interest',
        'what-we-look-for': 'section-content-what-we-look-for',
        'portfolio': 'section-content-portfolio',
        'cta': 'section-content-cta-capital'
      };
      setCurrentEntityType(entityTypeMap[sectionKey] || `section-content-${sectionKey}`);
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
        <h2 className="text-2xl font-bold text-gray-800">Refex Capital Page Management</h2>
        <button
          onClick={() => window.open('/refex-capital', '_blank')}
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
          {/* Hero */}
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

          {/* Stats */}
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

          {/* About */}
          <button
            onClick={() => setActiveSection('about')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'about'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-information-line text-base"></i>
            <span className="font-medium">Know About Us</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'about'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Areas of Interest */}
          <button
            onClick={() => setActiveSection('areas-of-interest')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'areas-of-interest'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-focus-2-line text-base"></i>
            <span className="font-medium">Areas of Interest</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'areas-of-interest'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* What We Look For */}
          <button
            onClick={() => setActiveSection('what-we-look-for')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'what-we-look-for'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-search-eye-line text-base"></i>
            <span className="font-medium">What We Look For</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'what-we-look-for'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Portfolio */}
          <button
            onClick={() => setActiveSection('portfolio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'portfolio'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-briefcase-line text-base"></i>
            <span className="font-medium">Portfolio</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'portfolio'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA */}
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

      {/* Hero Preview */}
      {activeSection === 'hero' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
              <p className="text-gray-500 mt-1">Manage the main banner content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('hero')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'hero');
            const badge = section?.content?.find((c: any) => c.contentKey === 'badge')?.contentValue;
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const subtitle = section?.content?.find((c: any) => c.contentKey === 'subtitle')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;

            return (
              <div className="border rounded-lg p-6 bg-gray-50">
                {badge && <p className="text-xs font-semibold text-blue-600 uppercase mb-2">{badge}</p>}
                {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
                {subtitle && <p className="text-sm font-medium text-gray-700 mb-2">{subtitle}</p>}
                {description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{description}</p>}
              </div>
            );
          })()}
        </div>
      )}

      {/* Stats Preview */}
      {activeSection === 'stats' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Stats Section</h3>
              <p className="text-gray-500 mt-1">Manage key statistics</p>
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

            let stats: Array<{ value: string; label: string }> = [];
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
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stats.length > 0 ? (
                  stats.map((stat, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                      <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    No stats configured yet. Click edit to add Capital stats.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* About Preview */}
      {activeSection === 'about' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Know About Us</h3>
              <p className="text-gray-500 mt-1">Manage about section content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('about')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'about');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const logoItem = section?.content?.find((c: any) => c.contentKey === 'logo');
            const imageItem = section?.content?.find((c: any) => c.contentKey === 'image');

            return (
              <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                  {description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{description}</p>}
                </div>
                <div className="space-y-3">
                  {logoItem && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Logo</p>
                      <img
                        src={getAssetPath(logoItem.contentValue || logoItem.media?.filePath || '')}
                        alt="Logo"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                  {imageItem && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Image</p>
                      <img
                        src={getAssetPath(imageItem.contentValue || imageItem.media?.filePath || '')}
                        alt="About"
                        className="w-full max-w-md rounded-lg border border-gray-200 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Areas of Interest Preview */}
      {activeSection === 'areas-of-interest' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Areas of Interest</h3>
              <p className="text-gray-500 mt-1">Manage focus areas</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('areas-of-interest')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'areas-of-interest');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const bgImageItem = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');
            const areasItem = section?.content?.find((c: any) => c.contentKey === 'areas');

            let areas: Array<{ name: string; icon: string }> = [];
            if (areasItem) {
              try {
                areas = Array.isArray(areasItem.contentValue)
                  ? areasItem.contentValue
                  : JSON.parse(areasItem.contentValue || '[]');
              } catch {
                areas = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                {description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{description}</p>}
                {bgImageItem && (
                  <p className="text-xs text-gray-500">
                    Background image: {bgImageItem.contentValue || bgImageItem.media?.filePath}
                  </p>
                )}
                {areas.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {areas.map((area, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2">
                        <i className={`${area.icon || 'ri-checkbox-blank-circle-line'} text-blue-600`}></i>
                        <span className="text-sm text-gray-800">{area.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No areas configured yet. Click edit to manage them.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* What We Look For Preview */}
      {activeSection === 'what-we-look-for' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">What We Look For</h3>
              <p className="text-gray-500 mt-1">Manage evaluation criteria</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('what-we-look-for')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'what-we-look-for');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const subtitle = section?.content?.find((c: any) => c.contentKey === 'subtitle')?.contentValue;
            const factorsItem = section?.content?.find((c: any) => c.contentKey === 'factors');

            let factors: Array<{ icon: string; title: string }> = [];
            if (factorsItem) {
              try {
                factors = Array.isArray(factorsItem.contentValue)
                  ? factorsItem.contentValue
                  : JSON.parse(factorsItem.contentValue || '[]');
              } catch {
                factors = [];
              }
            }

            return (
              <div className="space-y-4">
                {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                {description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{description}</p>}
                {subtitle && <p className="text-sm font-medium text-gray-700">{subtitle}</p>}
                {factors.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {factors.map((factor, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2">
                        <img src={getAssetPath(factor.icon)} alt="" className="w-6 h-6 object-contain" />
                        <span className="text-sm text-gray-800">{factor.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No factors configured yet. Click edit to manage them.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Portfolio Preview */}
      {activeSection === 'portfolio' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Portfolio</h3>
              <p className="text-gray-500 mt-1">Manage portfolio companies</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('portfolio')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'portfolio');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const subtitle = section?.content?.find((c: any) => c.contentKey === 'subtitle')?.contentValue;
            const logosItem = section?.content?.find((c: any) => c.contentKey === 'portfolioLogos');

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
                {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm font-medium text-gray-700">{subtitle}</p>}
                {logos.length > 0 ? (
                  <p className="text-sm text-gray-600">
                    {logos.length} portfolio logos configured. Edit to update the list.
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    No portfolio logos configured yet. Click edit to manage them.\n                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* CTA Preview */}
      {activeSection === 'cta' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
              <p className="text-gray-500 mt-1">Manage call to action</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('cta')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'cta');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const buttonText = section?.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
            const buttonLink = section?.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;

            return (
              <div className="border rounded-lg p-6 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {title && <p className="text-sm text-gray-800">{title}</p>}
                  {buttonLink && (
                    <p className="text-xs text-gray-500 mt-1">
                      Link: {buttonLink}
                    </p>
                  )}
                </div>
                {buttonText && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    {buttonText}
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Dynamic Sections Table */}
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
                                  'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\"%3E%3Crect fill=\"%23ddd\" width=\"64\" height=\"64\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\" font-size=\"10\"%3ENo Image%3C/text%3E%3C/svg%3E';
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
