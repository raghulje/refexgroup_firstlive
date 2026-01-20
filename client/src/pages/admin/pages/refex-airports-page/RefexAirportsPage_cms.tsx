import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexAirportsPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexAirportsPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexAirportsPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  const fixedSectionKeys = [
    'hero',
    'about-us',
    'for-retail-partners',
    'refex-retail-advantage',
    'transportation-enhancement',
    'tech-integration',
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
      const output = await pagesService.getBySlug('refex-airports');
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
        'hero': 'section-content-hero-airports',
        'about-us': 'section-content-about-us-airports',
        'for-retail-partners': 'section-content-for-retail-partners',
        'refex-retail-advantage': 'section-content-refex-retail-advantage',
        'transportation-enhancement': 'section-content-transportation-enhancement',
        'tech-integration': 'section-content-tech-integration',
        'cta': 'section-content-cta-airports'
      };

      setCurrentEntityType(entityTypeMap[sectionKey] || `section-content-${sectionKey}`);
      setShowModal(true);

    } catch (error) {
      console.error('Error handling fixed section:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (key: string) =>
    sections.find(s => s.sectionKey === key);

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
        <h2 className="text-2xl font-bold text-gray-800">Refex Airports Page Management</h2>
        <button
          onClick={() => window.open('/refex-airports', '_blank')}
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
            onClick={() => setActiveSection('about-us')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'about-us'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-information-line text-base"></i>
            <span className="font-medium">About Us</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'about-us'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('for-retail-partners')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'for-retail-partners'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-store-2-line text-base"></i>
            <span className="font-medium">For Retail Partners</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'for-retail-partners'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('refex-retail-advantage')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'refex-retail-advantage'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Refex Retail Advantage</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'refex-retail-advantage'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('transportation-enhancement')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'transportation-enhancement'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-roadster-line text-base"></i>
            <span className="font-medium">Transportation Enhancement</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'transportation-enhancement'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('tech-integration')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'tech-integration'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-cpu-line text-base"></i>
            <span className="font-medium">Tech Integration</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'tech-integration'
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
            const title = getContentValue('hero', 'title');
            const description = getContentValue('hero', 'description');
            const buttonText = getContentValue('hero', 'buttonText');
            const buttonLink = getContentValue('hero', 'buttonLink');
            const logoMedia = getContentMedia('hero', 'logoImage');
            const bgMedia = getContentMedia('hero', 'backgroundImage');

            return (
              <div className="border rounded-lg overflow-hidden">
                <div className="relative bg-gradient-to-br from-sky-900 via-teal-700 to-green-500 p-6 lg:p-8 text-white flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    {logoMedia && (
                      <img
                        src={getAssetPath(logoMedia.url || logoMedia.filePath)}
                        alt="Airports Logo"
                        className="h-12 mb-2 object-contain"
                      />
                    )}
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {title || 'Transforming Travel with Superior Retail Experiences.'}
                    </h2>
                    <p className="text-sm lg:text-base text-white/90">
                      {description ||
                        'Elevate your travel with our retail revolution. Refex Airports brings you the best in shopping, from global brands to unique finds, making every trip more than just a journey.'}
                    </p>
                    {buttonText && (
                      <p className="mt-2 text-sm">
                        Button: <span className="font-semibold">{buttonText}</span> ({buttonLink || '#explore'})
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 h-48 md:h-64">
                      {bgMedia ? (
                        <img
                          src={getAssetPath(bgMedia.url || bgMedia.filePath)}
                          alt="Hero Background"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No hero image configured
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* About Us Preview */}
      {activeSection === 'about-us' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">About Us Section</h3>
              <p className="text-gray-500 mt-1">Manage About Us content and image</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('about-us')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const badge = getContentValue('about-us', 'badge');
            const heading = getContentValue('about-us', 'heading');
            const description = getContentValue('about-us', 'description');
            const caption = getContentValue('about-us', 'imageCaption');
            const imageMedia = getContentMedia('about-us', 'image');

            return (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  {badge && (
                    <span className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full text-xs font-semibold">
                      {badge}
                    </span>
                  )}
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  {description && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {description}
                    </p>
                  )}
                </div>
                <div>
                  {imageMedia ? (
                    <div className="rounded-2xl overflow-hidden shadow-xl relative">
                      <img
                        src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                        alt="About Us"
                        className="w-full h-56 md:h-72 object-cover"
                      />
                      {caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2">
                          <p className="text-xs text-white">{caption}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-56 md:h-72 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                      No image configured yet
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* For Retail Partners Preview */}
      {activeSection === 'for-retail-partners' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">For Retail Partners Section</h3>
              <p className="text-gray-500 mt-1">Manage heading, description and feature cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('for-retail-partners')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const title = getContentValue('for-retail-partners', 'title');
            const gradientTitle = getContentValue('for-retail-partners', 'gradientTitle');
            const description = getContentValue('for-retail-partners', 'description');
            const imageMedia = getContentMedia('for-retail-partners', 'image');
            const features = getContentJson('for-retail-partners', 'features');

            return (
              <div className="space-y-6">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  {title && <h4 className="text-sm font-semibold tracking-wide text-gray-700">{title}</h4>}
                  {gradientTitle && (
                    <h3 className="text-2xl font-bold text-gray-900">
                      {gradientTitle}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    {features.length > 0 ? (
                      features.map((feature: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                            <i className="ri-store-2-line"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm mb-1">
                              {feature.title || `Feature ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No features configured yet. Click edit to add partner benefits.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {imageMedia ? (
                      <img
                        src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                        alt="Retail Partners"
                        className="w-full max-w-md rounded-2xl shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-full max-w-md h-64 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                        No image configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Refex Retail Advantage Preview */}
      {activeSection === 'refex-retail-advantage' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Refex Retail Advantage Section</h3>
              <p className="text-gray-500 mt-1">Manage advantage content, image and bullet list</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('refex-retail-advantage')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const title = getContentValue('refex-retail-advantage', 'title');
            const description = getContentValue('refex-retail-advantage', 'description');
            const bullets = getContentJson('refex-retail-advantage', 'bullets');
            const imageMedia = getContentMedia('refex-retail-advantage', 'image');

            return (
              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="Retail Advantage"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm">
                      No image configured
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-sky-900 via-teal-700 to-green-500 text-white rounded-2xl p-6 flex flex-col shadow-xl">
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide text-white/80 mb-1">
                      Airports and Transportation
                    </p>
                    <h3 className="text-lg font-bold mb-2">
                      {title || 'Discover the Refex Retail Advantage'}
                    </h3>
                    <p className="text-xs text-white/90">
                      {description ||
                        'Redefine retail excellence with streamlined operations, a rich variety of stores, and a customer-centric approach for an unmatched shopping journey.'}
                    </p>
                  </div>
                  <ul className="space-y-2 mt-auto pt-4">
                    {bullets.length > 0 ? (
                      bullets.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <i className="ri-check-line text-white"></i>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-white/70 text-xs italic">
                        No bullet points configured. Click edit to manage benefits list.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Transportation Enhancement Preview */}
      {activeSection === 'transportation-enhancement' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Transportation Enhancement Section</h3>
              <p className="text-gray-500 mt-1">Manage heading, description, image and cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('transportation-enhancement')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const title = getContentValue('transportation-enhancement', 'title');
            const description = getContentValue('transportation-enhancement', 'description');
            const imageMedia = getContentMedia('transportation-enhancement', 'image');
            const cards = getContentJson('transportation-enhancement', 'cards');

            return (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="Transportation Enhancement"
                      className="w-full rounded-2xl shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                      No image configured
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                  {description && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {description}
                    </p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {cards.length > 0 ? (
                      cards.map((card: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                            <i className="ri-roadster-line"></i>
                          </div>
                          <p className="text-xs font-semibold text-gray-900">
                            {card.title || `Card ${index + 1}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No cards configured yet. Click edit to manage key initiatives.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tech Integration Preview */}
      {activeSection === 'tech-integration' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Tech Integration Section</h3>
              <p className="text-gray-500 mt-1">Manage heading, description, image and tech cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('tech-integration')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const title = getContentValue('tech-integration', 'title');
            const description = getContentValue('tech-integration', 'description');
            const imageMedia = getContentMedia('tech-integration', 'image');
            const cards = getContentJson('tech-integration', 'cards');

            return (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                  {description && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {description}
                    </p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {cards.length > 0 ? (
                      cards.map((card: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
                            <i className="ri-cpu-line"></i>
                          </div>
                          <p className="text-xs font-semibold text-gray-900">
                            {card.title || `Card ${index + 1}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No cards configured yet. Click edit to manage tech highlights.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="Tech Integration"
                      className="w-full rounded-2xl shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                      No image configured
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
              <p className="text-gray-500 mt-1">Manage call to action headline and button</p>
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
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/70 to-teal-700/80"></div>
                <div className="relative z-10 px-6 py-10 text-center text-white space-y-4">
                  <h3 className="text-2xl font-bold">
                    {title || 'Revolutionizing Airport Retail'}
                  </h3>
                  <p className="text-sm max-w-2xl mx-auto text-white/90">
                    {description ||
                      'Discover how Refex Airports is pioneering a new era of retail in the airport environment, blending convenience with luxury.'}
                  </p>
                  {buttonText && (
                    <a
                      href={buttonLink || 'https://refexairports.com/'}
                      className="inline-block bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {buttonText}
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
