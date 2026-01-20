import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface VenwindRefexPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function VenwindRefexPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: VenwindRefexPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  const fixedSectionKeys = ['hero', 'stats', 'unique', 'technical-specs', 'cta'];

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
      const output = await pagesService.getBySlug('venwind-refex');
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

      const entityTypeMap: Record<string, string> = {
        'hero': 'section-content-hero-venwind',
        'stats': 'section-content-stats-venwind',
        'unique': 'section-content-unique-venwind',
        'technical-specs': 'section-content-technical-specs',
        'cta': 'section-content-cta-venwind'
      };

      setCurrentEntityType(entityTypeMap[sectionKey] || `section-content-${sectionKey}`);
      setShowModal(true);

    } catch (error) {
      console.error('Error handling fixed section:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (key: string) => sections.find(s => s.sectionKey === key);

  const getContentValue = (sectionKey: string, contentKey: string) => {
    const section = getSection(sectionKey);
    return section?.content?.find((c: any) => c.contentKey === contentKey)?.contentValue;
  };

  const getContentJson = (sectionKey: string, contentKey: string) => {
    const raw = getContentValue(sectionKey, contentKey);
    if (!raw) return [];
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return [];
    }
  };

  const getContentMedia = (sectionKey: string, contentKey: string) => {
    const section = getSection(sectionKey);
    return section?.content?.find((c: any) => c.contentKey === contentKey)?.media;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Venwind Refex Page Management</h2>
        <button
          onClick={() => window.open('/venwind-refex', '_blank')}
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
            onClick={() => setActiveSection('unique')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'unique'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Unique</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'unique'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('technical-specs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'technical-specs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-tools-line text-base"></i>
            <span className="font-medium">Technical Specs</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'technical-specs'
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

          {/* Dynamic sections */}
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
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'page-section' && activePageSection === section.sectionKey
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                    }`}
                >
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
              <p className="text-gray-500 mt-1">Manage hero subtitle, title, description and background</p>
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
            const subtitle = getContentValue('hero', 'subtitle');
            const title = getContentValue('hero', 'title');
            const description = getContentValue('hero', 'description');
            const bgMedia = getContentMedia('hero', 'backgroundImage');

            return (
              <div className="relative rounded-2xl overflow-hidden h-56 md:h-72">
                {bgMedia && (
                  <img
                    src={getAssetPath(bgMedia.url || bgMedia.filePath)}
                    alt="Hero Background"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-l from-[#1f6f2d]/60 to-black/60"></div>
                <div className="relative z-10 h-full flex items-center px-6 lg:px-10 text-white">
                  <div className="max-w-2xl space-y-3">
                    <p className="text-sm font-medium">{subtitle || 'Venwind Refex'}</p>
                    <h2 className="text-xl md:text-2xl font-bold leading-tight">
                      {title || 'Harnessing and Powering the Future with Sustainable Wind Technology'}
                    </h2>
                    <p className="text-xs md:text-sm text-white/90">
                      {description ||
                        'Venwind Refex has an exclusive license from Vensys Energy AG, Germany, to manufacture 5.3 MW wind turbines featuring a permanent magnet generator and hybrid drivetrain technology.'}
                    </p>
                  </div>
                </div>
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
              <p className="text-gray-500 mt-1">Manage key Venwind stats and image</p>
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
            const stats = getContentJson('stats', 'stats');
            const imageMedia = getContentMedia('stats', 'image');

            return (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {stats.length > 0 ? (
                      stats.map((s: any, index: number) => (
                        <div key={index} className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
                          <p className="text-xs text-gray-600 min-h-[40px]">
                            {s.description}
                          </p>
                          <div className="text-2xl font-bold text-gray-900">
                            {s.value}
                            <span className="text-[#50b848] ml-1">{s.suffix}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic col-span-2">
                        No stats configured yet. Click edit to manage stats cards.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  {imageMedia ? (
                    <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl">
                      <img
                        src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                        alt="Stat Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-64 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                      No stats image configured
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Unique Preview */}
      {activeSection === 'unique' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Unique Section</h3>
              <p className="text-gray-500 mt-1">Manage what makes Venwind unique and the feature list</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('unique')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('unique', 'heading');
            const description = getContentValue('unique', 'description');
            const features = getContentJson('unique', 'features');
            const imageMedia = getContentMedia('unique', 'image');

            return (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  {description && (
                    <p className="text-sm text-gray-700 max-w-md">
                      {description}
                    </p>
                  )}
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="Unique"
                      className="w-full max-w-md rounded-xl shadow-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full max-w-md h-64 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                      No image configured
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {features.length > 0 ? (
                    features.map((feature: any, index: number) => {
                      const featureText = typeof feature === 'string' ? feature : feature.text;
                      // Only try to use icon if it's an object and has an icon property
                      const featureIcon = typeof feature !== 'string' && feature.icon ? feature.icon : null;

                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-l-4 border-[#50b848]">
                          <div className="w-8 h-8 flex items-center justify-center text-[#50b848] text-lg">
                            {featureIcon ? (
                              <img
                                src={typeof featureIcon === 'number' ? `/uploads/media/${featureIcon}` : getAssetPath(featureIcon)}
                                alt=""
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <i className={`ri-windy-line ${featureIcon ? 'hidden' : ''}`}></i>
                          </div>
                          <p className="text-xs text-gray-800">
                            {featureText}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No features configured yet. Click edit to manage unique selling points.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Technical Specs Preview */}
      {activeSection === 'technical-specs' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Technical Specs Section</h3>
              <p className="text-gray-500 mt-1">Manage specifications cards and technical image</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('technical-specs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('technical-specs', 'heading');
            const specs = getContentJson('technical-specs', 'specs');
            const imageMedia = getContentMedia('technical-specs', 'image');

            return (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  <div className="space-y-4">
                    {specs.length > 0 ? (
                      specs.map((s: any, index: number) => (
                        <div key={index} className="bg-black text-white p-4 rounded-lg text-center space-y-2">
                          <h4 className="text-xl font-bold">{s.value}</h4>
                          <p className="text-xs text-gray-300">{s.label}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No specs configured yet. Click edit to manage technical spec cards.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="Technical Specs"
                      className="w-full max-w-lg h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full max-w-lg h-64 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                      No specs image configured
                    </div>
                  )}
                </div>
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
              <p className="text-gray-500 mt-1">Manage CTA title, description, button and background</p>
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
            const title = getContentValue('cta', 'title');
            const description = getContentValue('cta', 'description');
            const buttonText = getContentValue('cta', 'buttonText');
            const buttonLink = getContentValue('cta', 'buttonLink');
            const bgMedia = getContentMedia('cta', 'backgroundImage');

            return (
              <div className="relative overflow-hidden rounded-2xl">
                {bgMedia && (
                  <img
                    src={getAssetPath(bgMedia.url || bgMedia.filePath)}
                    alt="CTA Background"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'transparent',
                    backgroundImage: 'linear-gradient(185deg, #2A78B247 0%, #005F11D9 71%)'
                  }}
                ></div>
                <div className="relative z-10 container mx-auto px-6 lg:px-12 py-10 text-center text-white space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-bold">
                    {title || 'Venwind Refex'}
                  </h3>
                  <p className="text-sm lg:text-base max-w-2xl mx-auto">
                    {description || 'Curious to know more about sustainable wind energy manufacturing technology?'}
                  </p>
                  {buttonText && (
                    <a
                      href={buttonLink || 'https://venwind.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-[#50b848] px-8 py-4 rounded-full font-semibold hover:bg-[#50b848] hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
                    >
                      {buttonText}
                      <i className="ri-arrow-right-line"></i>
                    </a>
                  )}
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
                      Type:{' '}
                      <span className="capitalize">{selectedSection.sectionType}</span>
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
                            return (
                              <span className="text-gray-600 text-sm">
                                {JSON.stringify(parsed).substring(0, 50)}...
                              </span>
                            );
                          } catch {
                            return (
                              <span className="text-gray-600 text-sm">
                                {String(value || '').substring(0, 50)}...
                              </span>
                            );
                          }
                        }
                        return (
                          <span className="text-gray-600 text-sm">
                            {String(value || '').substring(0, 100)}
                          </span>
                        );
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
