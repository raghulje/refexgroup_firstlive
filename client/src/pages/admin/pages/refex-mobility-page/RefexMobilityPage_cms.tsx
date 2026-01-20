import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexMobilityPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexMobilityPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexMobilityPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  const fixedSectionKeys = [
    'hero',
    'about',
    'solutions',
    'advantages',
    'electric-fleet',
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
      const output = await pagesService.getBySlug('refex-mobility');
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
        'hero': 'section-content-hero-mobility',
        'about': 'section-content-about-mobility',
        'solutions': 'section-content-solutions-mobility',
        'advantages': 'section-content-advantages-mobility',
        'electric-fleet': 'section-content-electric-fleet',
        'cta': 'section-content-cta-mobility'
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
        <h2 className="text-2xl font-bold text-gray-800">Refex Mobility Page Management</h2>
        <button
          onClick={() => window.open('/refex-mobility', '_blank')}
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
            onClick={() => setActiveSection('about')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'about'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-information-line text-base"></i>
            <span className="font-medium">About</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'about'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('solutions')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'solutions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-route-line text-base"></i>
            <span className="font-medium">Solutions</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'solutions'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('advantages')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'advantages'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Advantages</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'advantages'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('electric-fleet')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'electric-fleet'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-bus-2-line text-base"></i>
            <span className="font-medium">Electric Fleet</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'electric-fleet'
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
              <p className="text-gray-500 mt-1">Manage main hero content</p>
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
            const highlight = getContentValue('hero', 'titleHighlight');
            const main = getContentValue('hero', 'titleMain');
            const description = getContentValue('hero', 'description');
            const buttonText = getContentValue('hero', 'buttonText');
            const buttonLink = getContentValue('hero', 'buttonLink');
            const imageMedia = getContentMedia('hero', 'image');

            return (
              <div className="border rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      <span className="text-[#e67e22] block">{highlight || 'Refex Mobility:'}</span>
                      <span className="text-gray-600 font-normal block">
                        {main || 'Where reliability meets responsibility!'}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-700">
                      {description ||
                        'Our cleaner-fuelled 4-wheeler fleet is transforming the way you commute, making every journey clean, safe and on time.'}
                    </p>
                    {buttonText && (
                      <p className="text-sm text-gray-600">
                        Button: <span className="font-semibold">{buttonText}</span> ({buttonLink || '/contact'})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {imageMedia ? (
                      <img
                        src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                        alt="Hero Image"
                        className="w-full max-w-md h-64 object-contain"
                      />
                    ) : (
                      <div className="w-full max-w-md h-64 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                        No hero image configured
                      </div>
                    )}
                  </div>
                </div>
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
              <h3 className="text-xl font-semibold text-gray-800">About Section</h3>
              <p className="text-gray-500 mt-1">Manage about content and image</p>
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
            const badge = getContentValue('about', 'badge');
            const heading = getContentValue('about', 'heading');
            const paragraphs = getContentJson('about', 'paragraphs');
            const buttonText = getContentValue('about', 'buttonText');
            const buttonLink = getContentValue('about', 'buttonLink');
            const imageMedia = getContentMedia('about', 'image');

            return (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  {imageMedia ? (
                    <img
                      src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                      alt="About Mobility"
                      className="w-full rounded-2xl shadow-lg object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                      No image configured
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {badge && (
                    <span className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full text-xs font-semibold">
                      {badge}
                    </span>
                  )}
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  {paragraphs.length > 0 ? (
                    <div className="space-y-3 text-sm text-gray-700">
                      {paragraphs.map((p: string, index: number) => (
                        <p key={index}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No paragraphs configured yet. Click edit to add about text.
                    </p>
                  )}
                  {buttonText && (
                    <p className="text-xs text-gray-600">
                      Button: <span className="font-semibold">{buttonText}</span> ({buttonLink || '#solutions'})
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Solutions Preview */}
      {activeSection === 'solutions' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Solutions Section</h3>
              <p className="text-gray-500 mt-1">Manage mobility solutions and available cities</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('solutions')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const title = getContentValue('solutions', 'title');
            const solutions = getContentJson('solutions', 'solutions');
            const citiesTitle = getContentValue('solutions', 'citiesTitle');
            const cities = getContentValue('solutions', 'cities');

            return (
              <div className="space-y-8">
                {title && (
                  <h3 className="text-lg font-bold text-gray-900 text-center">
                    {title}
                  </h3>
                )}
                <div className="space-y-6">
                  {solutions.length > 0 ? (
                    solutions.map((sol: any, index: number) => (
                      <div
                        key={index}
                        className="grid lg:grid-cols-2 gap-6 items-center border border-gray-100 rounded-2xl p-4"
                      >
                        <div className={index % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                          <h4 className="text-md font-semibold text-gray-900 mb-2">
                            {sol.title}
                          </h4>
                          <p className="text-xs text-gray-600 whitespace-pre-wrap">
                            {sol.description}
                          </p>
                        </div>
                        <div className={index % 2 === 1 ? 'order-1 lg:order-2' : ''}>
                          {sol.image ? (
                            <img
                              src={getAssetPath(sol.image)}
                              alt={sol.title}
                              className="w-full h-40 object-cover rounded-2xl shadow-md"
                            />
                          ) : (
                            <div className="w-full h-40 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No solutions configured yet. Click edit to manage the three solution blocks.
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {citiesTitle || 'Available In Major Cities'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {cities || 'Chennai | Bengaluru | Mumbai | Hyderabad | Delhi'}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Advantages Preview */}
      {activeSection === 'advantages' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Advantages Section</h3>
              <p className="text-gray-500 mt-1">Manage why-choose content, image and advantage cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('advantages')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('advantages', 'heading');
            const description = getContentValue('advantages', 'description');
            const imageMedia = getContentMedia('advantages', 'image');
            const leftCards = getContentJson('advantages', 'leftCards');
            const rightCards = getContentJson('advantages', 'rightCards');

            return (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col h-full space-y-6">
                  <div>
                    {heading && (
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {heading}
                      </h3>
                    )}
                    {description && (
                      <p className="text-sm text-gray-700">
                        {description}
                      </p>
                    )}
                  </div>
                  <div>
                    {imageMedia ? (
                      <img
                        src={getAssetPath(imageMedia.url || imageMedia.filePath)}
                        alt="Why Opt"
                        className="w-full h-48 object-contain"
                      />
                    ) : (
                      <div className="w-full h-48 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-xs">
                        No image configured
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {leftCards.length > 0 ? (
                      leftCards.map((card: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {card.title || `Card ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {card.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs italic">
                        No left side cards configured.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {rightCards.length > 0 ? (
                    rightCards.map((card: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {card.title || `Card ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {card.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs italic">
                      No right side cards configured.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Electric Fleet Preview */}
      {activeSection === 'electric-fleet' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Electric Fleet Section</h3>
              <p className="text-gray-500 mt-1">Manage electric fleet advantages and imagery</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('electric-fleet')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('electric-fleet', 'heading');
            const description = getContentValue('electric-fleet', 'description');
            const image1 = getContentMedia('electric-fleet', 'image1');
            const image2 = getContentMedia('electric-fleet', 'image2');
            const imageBottom = getContentMedia('electric-fleet', 'imageBottom');
            const advantages = getContentJson('electric-fleet', 'advantages');

            return (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                  <div className="flex flex-col space-y-4">
                    {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                    {description && (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl overflow-hidden bg-gray-100 h-32">
                        {image1 ? (
                          <img
                            src={getAssetPath(image1.url || image1.filePath)}
                            alt="Fleet image 1"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image 1
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl overflow-hidden bg-gray-100 h-32">
                        {image2 ? (
                          <img
                            src={getAssetPath(image2.url || image2.filePath)}
                            alt="Fleet image 2"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image 2
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-gray-100 h-40">
                      {imageBottom ? (
                        <img
                          src={getAssetPath(imageBottom.url || imageBottom.filePath)}
                          alt="Fleet bottom"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No bottom image
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4 flex flex-col justify-between">
                    {advantages.length > 0 ? (
                      advantages.map((adv: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {adv.title || `Advantage ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {adv.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs italic">
                        No advantages configured yet. Click edit to manage the three EV advantage cards.
                      </p>
                    )}
                  </div>
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
              <p className="text-gray-500 mt-1">Manage call to action content</p>
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
            const paragraphs = getContentJson('cta', 'paragraphs');
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
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/70 to-sky-500/70"></div>
                <div className="relative z-10 px-6 py-10 text-center text-white space-y-4 max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold">
                    {title || 'Sustainable Mobility Redefined'}
                  </h3>
                  {paragraphs.length > 0 ? (
                    <div className="space-y-3 text-sm text-white/90">
                      {paragraphs.map((p: string, index: number) => (
                        <p key={index}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/90">
                      With Refex Mobility, embrace a new standard in urban commuting. Our cleaner-fuelled vehicles, from comfortable sedans to premium SUVs, are tailored for corporate needs with efficiency and environmental responsibility.
                    </p>
                  )}
                  {buttonText && (
                    <a
                      href={buttonLink || 'https://refexmobility.com/'}
                      className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
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
