import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, jobsService, testimonialsService } from '../../../../services/apiService';

interface CareersPageProps extends Partial<CMSComponentProps> {
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

export default function CareersPage_cms({
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
}: CareersPageProps) {
  const [careersPage, setCareersPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'main-content', 'video', 'life-refexian', 'why-choose', 'application-form', 'testimonials', 'testimonial-slider', 'know-more', 'cta'];

  useEffect(() => {
    fetchCareersData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchCareersData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchCareersData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('careers');
      setCareersPage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);

      const jobsData = await jobsService.getAll();
      setJobs(jobsData);

      const testimonialsData = await testimonialsService.getAll();
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error fetching careers data:', error);
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

    // Ensure positioning fields are loaded (they are separate content items)
    const posXItem = targetSection.content?.find((c: any) => c.contentKey === 'coverImagePositionX');
    if (posXItem) {
      contentData.coverImagePositionX = posXItem.contentValue || '50';
    } else {
      // Set default if not found
      contentData.coverImagePositionX = '50';
    }
    
    const posYItem = targetSection.content?.find((c: any) => c.contentKey === 'coverImagePositionY');
    if (posYItem) {
      contentData.coverImagePositionY = posYItem.contentValue || '50';
    } else {
      // Set default if not found
      contentData.coverImagePositionY = '50';
    }
    
    console.log('Loaded positioning values:', {
      coverImagePositionX: contentData.coverImagePositionX,
      coverImagePositionY: contentData.coverImagePositionY,
      posXItem: posXItem?.contentValue,
      posYItem: posYItem?.contentValue
    });

    setEditingItem(targetSection);
    setFormData(contentData);
    setModalType('edit');

    // Set entity type based on section key
    if (targetSection.sectionKey === 'hero') {
      setCurrentEntityType('section-content-hero-careers');
    } else if (targetSection.sectionKey === 'cta') {
      setCurrentEntityType('section-content-cta-careers');
    } else {
      setCurrentEntityType(`section-content-${targetSection.sectionKey}`);
    }

    setShowModal(true);
  };

  const handleAddJob = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      jobType: 'full-time',
      description: '',
      requirements: '',
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('job');
    setShowModal(true);
  };

  const handleEditJob = (job: any) => {
    setEditingItem(job);
    setFormData(job);
    setModalType('edit');
    setCurrentEntityType('job');
    setShowModal(true);
  };

  const handleAddTestimonial = () => {
    setEditingItem(null);
    setFormData({
      authorName: '',
      authorPosition: '',
      content: '',
      authorImageId: null,
      orderIndex: testimonials.length,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('testimonial');
    setShowModal(true);
  };

  const handleEditTestimonial = (testimonial: any) => {
    setEditingItem(testimonial);
    setFormData({
      ...testimonial,
      authorImageId: testimonial.authorImageId || testimonial.authorImage?.id || null
    });
    setModalType('edit');
    setCurrentEntityType('testimonial');
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const mainContentSection = getSectionByKey('main-content');
  const videoSection = getSectionByKey('video');
  const lifeRefexianSection = getSectionByKey('life-refexian');
  const whyChooseSection = getSectionByKey('why-choose');
  const applicationFormSection = getSectionByKey('application-form');
  const testimonialsSection = getSectionByKey('testimonials');
  const testimonialSliderSection = getSectionByKey('testimonial-slider');
  const knowMoreSection = getSectionByKey('know-more');
  const ctaSection = getSectionByKey('cta');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Careers Page Management</h2>
        <button
          onClick={() => window.open('/careers', '_blank')}
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

          {/* Main Content Tab */}
          <button
            onClick={() => setActiveSection('main-content')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'main-content'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-text-line text-base"></i>
            <span className="font-medium">Main Content</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'main-content'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Video Tab */}
          <button
            onClick={() => setActiveSection('video')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'video'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-video-line text-base"></i>
            <span className="font-medium">Video</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'video'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Life as Refexian Tab */}
          <button
            onClick={() => setActiveSection('life-refexian')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'life-refexian'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-team-line text-base"></i>
            <span className="font-medium">Life as Refexian</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'life-refexian'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Why Choose Tab */}
          <button
            onClick={() => setActiveSection('why-choose')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'why-choose'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Why Choose</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'why-choose'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Application Form Tab */}
          <button
            onClick={() => setActiveSection('application-form')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'application-form'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-edit-line text-base"></i>
            <span className="font-medium">Application Form</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'application-form'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Testimonial Slider Tab */}
          <button
            onClick={() => setActiveSection('testimonial-slider')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'testimonial-slider'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-line text-base"></i>
            <span className="font-medium">Testimonial Slider</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'testimonial-slider'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Know More Tab */}
          <button
            onClick={() => setActiveSection('know-more')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'know-more'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-information-line text-base"></i>
            <span className="font-medium">Know More</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'know-more'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA Tab */}
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

      {/* Jobs Section */}
      {activeSection === 'jobs' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Job Listings</h3>
            <button
              onClick={handleAddJob}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Job
            </button>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-briefcase-line text-4xl mb-2"></i>
              <p>No jobs found</p>
            </div>
          ) : (
            <DataTable
              data={jobs}
              columns={[
                { key: 'id', header: 'ID' },
                {
                  key: 'title',
                  header: 'TITLE',
                  render: (value) => <span className="font-medium text-gray-900">{value || 'N/A'}</span>
                },
                {
                  key: 'department',
                  header: 'DEPARTMENT',
                  render: (value) => <span className="text-gray-600">{value || 'N/A'}</span>
                },
                {
                  key: 'location',
                  header: 'LOCATION',
                  render: (value) => <span className="text-gray-600">{value || 'N/A'}</span>
                },
                {
                  key: 'jobType',
                  header: 'TYPE',
                  render: (value) => (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                      {value || 'full-time'}
                    </span>
                  )
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
              onEdit={handleEditJob}
              onDelete={(item) => handleDelete(item, 'job')}
            />
          )}
        </div>
      )}

      {/* Testimonials Section */}
      {activeSection === 'testimonials' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Testimonials</h3>
            <button
              onClick={handleAddTestimonial}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Testimonial
            </button>
          </div>
          {testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-quote-text-line text-4xl mb-2"></i>
              <p>No testimonials found</p>
            </div>
          ) : (
            <DataTable
              data={testimonials}
              columns={[
                {
                  key: 'authorImage',
                  header: 'PREVIEW',
                  render: (value, item) => {
                    const imagePath = item.authorImage?.url || item.authorImage?.filePath || item.authorImage || '';
                    return (
                      <img
                        src={getAssetPath(imagePath)}
                        alt={item.authorName || 'Author'}
                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    );
                  }
                },
                {
                  key: 'authorName',
                  header: 'AUTHOR',
                  render: (value) => <span className="font-medium text-gray-900">{value || 'N/A'}</span>
                },
                {
                  key: 'authorPosition',
                  header: 'POSITION',
                  render: (value) => <span className="text-gray-600">{value || 'N/A'}</span>
                },
                {
                  key: 'content',
                  header: 'QUOTE PREVIEW',
                  render: (value) => (
                    <span className="text-gray-600 text-sm max-w-xs truncate">
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
              onEdit={handleEditTestimonial}
              onDelete={(item) => handleDelete(item, 'testimonial')}
            />
          )}
        </div>
      )}

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
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      {activeSection === 'main-content' && mainContentSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Main Content Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage main content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(mainContentSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(mainContentSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Paragraph 1</label>
              <p className="text-gray-600">{getContentValue(mainContentSection, 'paragraph1') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Paragraph 2</label>
              <p className="text-gray-600">{getContentValue(mainContentSection, 'paragraph2') || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Section */}
      {activeSection === 'video' && videoSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Video Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage video embed</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(videoSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Video URL</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(videoSection, 'videoUrl') || 'Not set'}</p>
              {getContentValue(videoSection, 'videoUrl') && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={getContentValue(videoSection, 'videoUrl')}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    title="Careers Video"
                  ></iframe>
                </div>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Cover Image</label>
              {(() => {
                const coverImage = getImagePath(videoSection, 'coverImage');
                if (coverImage) {
                  return (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={getAssetPath(coverImage)}
                        alt="Video Cover"
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x450?text=No+Image';
                        }}
                      />
                    </div>
                  );
                }
                return <p className="text-gray-400 text-sm">No cover image set</p>;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Life as Refexian Section */}
      {activeSection === 'life-refexian' && lifeRefexianSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Life as Refexian Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage Life as Refexian content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(lifeRefexianSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(lifeRefexianSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(lifeRefexianSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Content Image</label>
              {getImagePath(lifeRefexianSection, 'image') ? (
                <img
                  src={getAssetPath(getImagePath(lifeRefexianSection, 'image'))}
                  alt="Life as Refexian"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x400?text=No+Image';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(lifeRefexianSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(lifeRefexianSection, 'backgroundImage'))}
                  alt="Background"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x400?text=No+Image';
                  }}
                />
              ) : (
                <p className="text-gray-400">No background image set (using color: {getContentValue(lifeRefexianSection, 'backgroundColor') || '#ff7f50'})</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Color</label>
              <p className="text-gray-600">{getContentValue(lifeRefexianSection, 'backgroundColor') || '#ff7f50'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Section */}
      {activeSection === 'why-choose' && whyChooseSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Why Choose Refex Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage features content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(whyChooseSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(whyChooseSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Features</label>
              {(() => {
                try {
                  const features = JSON.parse(getContentValue(whyChooseSection, 'features') || '[]');
                  return (
                    <div className="space-y-3">
                      {Array.isArray(features) && features.map((feature: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{feature.title || `Feature ${idx + 1}`}</h4>
                          <p className="text-sm text-gray-600">{feature.description || 'No description'}</p>
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No features data</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Application Form Section */}
      {activeSection === 'application-form' && applicationFormSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Application Form Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage application form content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(applicationFormSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Left Title</label>
              <p className="text-gray-900">{getContentValue(applicationFormSection, 'leftTitle') || getContentValue(applicationFormSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Left Subtitle</label>
              <p className="text-gray-600">{getContentValue(applicationFormSection, 'leftSubtitle') || getContentValue(applicationFormSection, 'subtitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Form Title</label>
              <p className="text-gray-600">{getContentValue(applicationFormSection, 'formTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(applicationFormSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(applicationFormSection, 'backgroundImage'))}
                  alt="Form Background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Content Section */}
      {activeSection === 'testimonials-content' && testimonialsSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Testimonials Content Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage testimonials text content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(testimonialsSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(testimonialsSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Paragraph 1</label>
              <p className="text-gray-600">{getContentValue(testimonialsSection, 'paragraph1') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Paragraph 2</label>
              <p className="text-gray-600">{getContentValue(testimonialsSection, 'paragraph2') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Paragraph 3</label>
              <p className="text-gray-600">{getContentValue(testimonialsSection, 'paragraph3') || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Slider Section */}
      {activeSection === 'testimonial-slider' && testimonialSliderSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Testimonial Slider Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage testimonial slider images</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(testimonialSliderSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Badge Text</label>
              <p className="text-gray-900">{getContentValue(testimonialSliderSection, 'badgeText') || 'RIL ESOP Testimonials'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Slider Images</label>
              {(() => {
                try {
                  const images = JSON.parse(getContentValue(testimonialSliderSection, 'images') || '[]');
                  return (
                    <div className="grid grid-cols-4 gap-2">
                      {Array.isArray(images) && images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-[4/3] rounded overflow-hidden border border-gray-200">
                          <img
                            src={getAssetPath(img)}
                            alt={`Slider ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No images data</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Know More Section */}
      {activeSection === 'know-more' && knowMoreSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Know More Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage know more CTA</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(knowMoreSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(knowMoreSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Text</label>
              <p className="text-gray-600">{getContentValue(knowMoreSection, 'buttonText') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Link</label>
              <p className="text-gray-600">{getContentValue(knowMoreSection, 'buttonLink') || 'Not set'}</p>
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

      {/* Dynamic Page Sections */}
      {!fixedSectionKeys.includes(activeSection) && activeSection !== 'jobs' && activeSection !== 'testimonials' && (() => {
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
