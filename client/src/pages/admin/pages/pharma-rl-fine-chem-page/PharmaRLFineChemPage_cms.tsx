import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface PharmaRLFineChemPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function PharmaRLFineChemPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: PharmaRLFineChemPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  const fixedSectionKeys = [
    'hero',
    'logo-cards',
    'about',
    'rd-capability',
    'plant-capability',
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
      const output = await pagesService.getBySlug('pharma-rl-fine-chem');
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
        'hero': 'section-content-hero-pharma',
        'logo-cards': 'section-content-logo-cards',
        'about': 'section-content-about-pharma',
        'rd-capability': 'section-content-rd-capability',
        'plant-capability': 'section-content-plant-capability',
        'cta': 'section-content-cta-pharma'
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
        <h2 className="text-2xl font-bold text-gray-800">Pharma RL Fine Chem Page Management</h2>
        <button
          onClick={() => window.open('/pharma-rl-fine-chem', '_blank')}
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
            onClick={() => setActiveSection('logo-cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'logo-cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-shapes-line text-base"></i>
            <span className="font-medium">Group Logos</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'logo-cards'
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
            onClick={() => setActiveSection('rd-capability')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'rd-capability'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-flask-line text-base"></i>
            <span className="font-medium">R&D Capability</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'rd-capability'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('plant-capability')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'plant-capability'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-building-2-line text-base"></i>
            <span className="font-medium">Plant Capability</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'plant-capability'
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
              <p className="text-gray-500 mt-1">Manage hero title, description, stats and background</p>
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
            const stats = getContentJson('hero', 'stats');
            const bgMedia = getContentMedia('hero', 'backgroundImage');

            return (
              <div className="border rounded-2xl overflow-hidden relative bg-gray-900 text-white">
                {bgMedia && (
                  <img
                    src={getAssetPath(bgMedia.url || bgMedia.filePath)}
                    alt="Hero Background"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#50b848]/40 via-[#3d7c5f]/50 to-black/70"></div>
                <div className="relative z-10 p-8 grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                      {title || 'A Global API Partner from Refex'}
                    </h2>
                    <p className="text-sm md:text-base text-white/90">
                      {description ||
                        'A leading pharmaceutical platform with 40+ years of API excellence, global partnerships in advanced intermediates, and CRDMO expertise in speciality formulations and antibiotics.'}
                    </p>
                  </div>
                  <div className="space-y-4 text-right">
                    {stats.length > 0 ? (
                      stats.map((s: any, index: number) => (
                        <div key={index}>
                          <div className="text-3xl md:text-4xl font-bold">
                            {s.value}
                            {s.suffix}
                          </div>
                          <div className="text-sm md:text-base text-white/90">{s.label}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/80 italic">
                        No stats configured yet. Click edit to manage hero counters.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Logo Cards Preview */}
      {activeSection === 'logo-cards' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Group Logos Section</h3>
              <p className="text-gray-500 mt-1">Manage Modepro / RLFC / Extrovis logos</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('logo-cards')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const logos = getContentJson('logo-cards', 'logos');

            return (
              <div className="grid md:grid-cols-3 gap-6">
                {logos.length > 0 ? (
                  logos.map((logo: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex items-center justify-center h-32">
                      {logo.image ? (
                        <img
                          src={getAssetPath(logo.image)}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic col-span-3 text-center">
                    No logos configured yet. Click edit to add logo cards.
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
              <h3 className="text-xl font-semibold text-gray-800">About Section</h3>
              <p className="text-gray-500 mt-1">Manage heading and about paragraphs</p>
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
            const heading = getContentValue('about', 'heading');
            const paragraphs = getContentJson('about', 'paragraphs');

            return (
              <div className="max-w-3xl mx-auto space-y-4 text-center">
                {heading && <h3 className="text-lg font-bold text-[#7cb342]">{heading}</h3>}
                {paragraphs.length > 0 ? (
                  paragraphs.map((p: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700 leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    No about text configured yet. Click edit to add paragraphs.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* R&D Capability Preview */}
      {activeSection === 'rd-capability' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">R&D Capability Section</h3>
              <p className="text-gray-500 mt-1">Manage R&D heading, description and capability list</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('rd-capability')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('rd-capability', 'heading');
            const description = getContentValue('rd-capability', 'description');
            const capabilities = getContentJson('rd-capability', 'capabilities');

            return (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  {description && (
                    <p className="text-sm text-gray-700 max-w-3xl mx-auto">
                      {description}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {capabilities.length > 0 ? (
                    capabilities.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 border border-gray-200 rounded-2xl p-3 bg-gray-50">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          <i className={`${item.icon || 'ri-flask-line'} text-xl text-[#50b848]`}></i>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">
                          {item.title || `Capability ${index + 1}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic col-span-3 text-center">
                      No capabilities configured yet. Click edit to manage capability items.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Plant Capability Preview */}
      {activeSection === 'plant-capability' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Plant Capability Section</h3>
              <p className="text-gray-500 mt-1">Manage manufacturing plants and regulatory approvals</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('plant-capability')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const heading = getContentValue('plant-capability', 'heading');
            const description = getContentValue('plant-capability', 'description');
            const formulations = getContentJson('plant-capability', 'formulationsFacilities');
            const rlfcPlants = getContentJson('plant-capability', 'rlfcCapabilities');
            const expansionNote = getContentValue('plant-capability', 'expansionNote');
            const oncology = getContentJson('plant-capability', 'oncologyFacilities');
            const approvalsHeading = getContentValue('plant-capability', 'approvalsHeading');
            const approvalsDescription = getContentValue('plant-capability', 'approvalsDescription');
            const approvals = getContentJson('plant-capability', 'approvals');

            return (
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  {heading && <h3 className="text-lg font-bold text-gray-900">{heading}</h3>}
                  {description && (
                    <p className="text-sm text-gray-700 max-w-3xl mx-auto">
                      {description}
                    </p>
                  )}
                </div>

                {/* Formulations Facilities */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 text-center">
                    Formulations & Complex Generics
                  </h4>
                  <div className="grid lg:grid-cols-3 gap-4">
                    {formulations.length > 0 ? (
                      formulations.map((f: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50 h-56 flex flex-col">
                          <div className="h-32 bg-gray-100">
                            {f.image ? (
                              <img
                                src={getAssetPath(f.image)}
                                alt={f.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-end">
                            <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                            <p className="text-xs text-gray-600">{f.location}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic col-span-3 text-center">
                        No formulations facilities configured.
                      </p>
                    )}
                  </div>
                </div>

                {/* RLFC Capabilities */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 text-center">
                    Refex Life Sciences Capabilities
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {rlfcPlants.length > 0 ? (
                      rlfcPlants.map((f: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50 h-56 flex flex-col">
                          <div className="h-32 bg-gray-100">
                            {f.image ? (
                              <img
                                src={getAssetPath(f.image)}
                                alt={f.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-end">
                            <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <i className="ri-map-pin-line"></i>
                              {f.location}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic col-span-2 text-center">
                        No RLFC capability plants configured.
                      </p>
                    )}
                  </div>
                  {expansionNote && (
                    <div className="mt-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 text-center border border-teal-100">
                      <p className="text-xs text-gray-800">
                        {expansionNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Oncology Facilities */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 text-center">
                    Oncology & Speciality Intermediates
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {oncology.length > 0 ? (
                      oncology.map((f: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50 h-56 flex flex-col">
                          <div className="h-32 bg-gray-100">
                            {f.image ? (
                              <img
                                src={getAssetPath(f.image)}
                                alt={f.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-end">
                            <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <i className="ri-map-pin-line"></i>
                              {f.location}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic col-span-2 text-center">
                        No oncology facilities configured.
                      </p>
                    )}
                  </div>
                </div>

                {/* Approvals */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    {approvalsHeading && (
                      <h4 className="text-lg font-bold text-gray-900">
                        {approvalsHeading}
                      </h4>
                    )}
                    {approvalsDescription && (
                      <p className="text-sm text-gray-700 max-w-3xl mx-auto">
                        {approvalsDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {approvals.length > 0 ? (
                      approvals.map((ap: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200 flex items-center gap-2 text-xs min-w-[120px] justify-center"
                        >
                          <i className={`${ap.icon || 'ri-shield-check-line'} text-base`} style={{ color: ap.color || '#7DC244' }}></i>
                          <span className="font-semibold text-gray-900">{ap.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs italic text-center w-full">
                        No approvals configured yet.
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#50b848]/80 via-[#3d7c5f]/70 to-[#1a1a1a]/85"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    {title || 'Redefining Excellence in API Development'}
                  </h3>
                  <p className="text-sm md:text-base text-white/90">
                    {description ||
                      'Experience a new era at RLFC, redefining API development with unwavering commitment to cutting-edge solutions. Setting pioneering standards, we drive transformative advancements in global healthcare.'}
                  </p>
                  {buttonText && (
                    <a
                      href={buttonLink || 'https://refexlifesciences.com/'}
                      className="inline-flex items-center gap-2 bg-white text-[#3b9dd6] px-8 py-3 rounded-full font-semibold hover:bg-[#3b9dd6] hover:text-white transition-all duration-300 whitespace-nowrap border-2 border-white text-sm md:text-base"
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
