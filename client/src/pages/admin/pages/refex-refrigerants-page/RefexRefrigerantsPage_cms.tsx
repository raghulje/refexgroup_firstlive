import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, sectionContentService } from '../../../../services/apiService';
import { getApiBaseUrl } from '../../../../config/env';

interface RefexRefrigerantsPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexRefrigerantsPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexRefrigerantsPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  // Fixed Refrigerants sections that should NOT appear again as dynamic tabs
  const fixedSectionKeys = [
    'hero-section',
    'why-choose-us',
    'breaking-grounds',
    'products',
    'quality-assurance',
    'refex-industries'
  ];

  // Sections to hide from tabs
  const hiddenSectionKeys = [
    'overview',
    'applications',
    'cta-section'
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

  // Notification function
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
    notification.innerHTML = `
      <i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line text-xl"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const output = await pagesService.getBySlug('refex-refrigerants');
      setPage(output);

      const sectionsData = await sectionsService.getByPageId(output.id);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAllSections = async () => {
    if (!page?.id) {
      showNotification('Page not found. Please refresh and try again.', 'error');
      return;
    }

    try {
      setLoading(true);
      const sectionKeys = [
        'hero-section',
        'why-choose-us',
        'breaking-grounds',
        'products',
        'quality-assurance',
        'refex-industries'
      ];

      const defaultContent: Record<string, any[]> = {
        'hero-section': [
          { contentKey: 'tagline', contentType: 'text', contentValue: 'Refex Refrigerants' },
          { contentKey: 'title', contentType: 'text', contentValue: 'Pioneers and Conscious Innovators in the Refrigerant gas Industry.' },
          { contentKey: 'description', contentType: 'text', contentValue: 'Since the inception in 2002, Refex has established itself as a formidable leader and competitor in the refrigerant gas industry. In the last twenty years of our quest towards climate-friendly alternatives, we have successfully developed and expanded our product lines to include innovative and environmental-friendly options. We are also proactively addressing and tackling sourcing and environmental policy changes. Our focus is on sustainability and we are dedicated to creating a better future!' },
          { contentKey: 'buttonText', contentType: 'text', contentValue: 'Explore' },
          { contentKey: 'buttonLink', contentType: 'text', contentValue: '#explore' },
          { contentKey: 'backgroundColor', contentType: 'text', contentValue: '#1e5a8e' }
        ],
        'why-choose-us': [
          { contentKey: 'heading', contentType: 'text', contentValue: 'Why Choose Us' },
          {
            contentKey: 'cards', contentType: 'json', contentValue: JSON.stringify([
              { title: 'State of the Art Automated Filling Equipment', description: 'Experience unparalleled convenience and precision at our refilling factory, featuring automated and dedicated filling lines suitable for all products and sizes of cylinders, tonners, and cans.', iconPath: null },
              { title: 'Well Networked Logistics', description: 'Our expert logistics network guarantees prompt and reliable shipping, backed by our extensive experience in streamlining orders and ensuring timely supply.', iconPath: null },
              { title: 'Highest Quality Standards', description: 'Our comprehensive product testing capabilities uphold the highest quality standards in each and every process to ensure maximum efficiency, precision and quality control..', iconPath: null },
              { title: 'Reliable Shipping', description: 'Exclusive partnerships with trusted forwarders to guarantee secure and expedited shipping.', iconPath: null },
              { title: 'Skilled Employees', description: 'Dedicated employees with excellent engineering expertise providing exceptional service and high-quality products to our valued business partners and consumers.', iconPath: null }
            ])
          }
        ],
        'breaking-grounds': [
          { contentKey: 'title', contentType: 'text', contentValue: 'Breaking new grounds with innovative and sustainable solutions in Refrigerant gas refilling.' },
          { contentKey: 'backgroundColor', contentType: 'text', contentValue: '#1e5a8e' }
        ],
        'products': [
          { contentKey: 'heading', contentType: 'text', contentValue: 'Our Products' },
          { contentKey: 'description', contentType: 'text', contentValue: 'Discover our innovative and eco-friendly products that are produced to meet your needs while making a positive impact on the environment.' },
          { contentKey: 'backgroundColor', contentType: 'text', contentValue: '#f5f5f5' },
          { contentKey: 'cardBackgroundColor', contentType: 'text', contentValue: '#1e5a8e' },
          {
            contentKey: 'products', contentType: 'json', contentValue: JSON.stringify([
              { name: 'R-32', image: null },
              { name: 'R-134a', image: null },
              { name: 'R-404a', image: null },
              { name: 'R-407c', image: null },
              { name: 'R-410a', image: null },
              { name: 'R-22', image: null },
              { name: 'R-152a', image: null },
              { name: 'R600a', image: null }
            ])
          }
        ],
        'quality-assurance': [
          { contentKey: 'heading', contentType: 'text', contentValue: 'Quality Assurance & Safety' },
          { contentKey: 'description', contentType: 'text', contentValue: 'Our commitment to excellence and attention to detail has established our products as a benchmark in the industry. You can trust Refex to provide you with the highest quality and safest products for all your refrigerant gas needs.' },
          { contentKey: 'backgroundGradient', contentType: 'text', contentValue: 'linear-gradient(360deg, rgba(42, 120, 178, 0.14) 68%, rgba(30, 90, 142, 0.05) 100%)' },
          { contentKey: 'tab1Label', contentType: 'text', contentValue: 'Product Quality' },
          { contentKey: 'tab2Label', contentType: 'text', contentValue: 'Product Safety' },
          { contentKey: 'tabButtonColor', contentType: 'text', contentValue: '#1e5a8e' },
          {
            contentKey: 'tab1Items', contentType: 'json', contentValue: JSON.stringify([
              'We provide each customer with a Certificate of Analysis that conforms to the highest quality standards, we test and analyze all products before and after filling in our state-of-the-art laboratory to ensure consistency.',
              'Keeping in pace with the market revolution, we have fully committed ourselves to continuous improvement, innovation, and implementation in all our processes , right from filling to customer service. Our focus on quality, timely delivery, and customer satisfaction is reflected in our success.',
              'Our dedication to quality is ingrained in every aspect of our business. We pride ourselves on building long-lasting relationships with our customers by providing quality products and services that exceed expectations.'
            ])
          },
          {
            contentKey: 'tab2Items', contentType: 'json', contentValue: JSON.stringify([
              'At Refex, we take the security and safety of our products very seriously. Each product is provided with a dedicated storage facility, approved and licensed by PESO, PCB, and other relevant authorities. We ensure 100% compliance with all regulations and use the best fabricators in the industry.',
              'Quality and safety are our top priorities at Refex. We are certified with ISO 14001:2015, and our in-house laboratory tests and analyzes every product for purity of gas and moisture content before and after filling. We take great care to ensure the quality of all cylinders before filling with gases.'
            ])
          }
        ],
        'refex-industries': [
          { contentKey: 'title', contentType: 'text', contentValue: 'Refex Industries Limited' },
          { contentKey: 'description', contentType: 'text', contentValue: 'A market leader in the refrigerant gas industry. Discover our eco-friendly alternatives and pave your way towards a greener tomorrow.' },
          { contentKey: 'buttonText', contentType: 'text', contentValue: 'Visit Website' },
          { contentKey: 'buttonLink', contentType: 'text', contentValue: 'https://www.refex.co.in/' },
          { contentKey: 'gradientOverlay', contentType: 'text', contentValue: 'linear-gradient(185deg, #2A78B247 0%, #1e5a8e 71%)' }
        ]
      };

      let createdCount = 0;
      let contentCount = 0;

      for (const sectionKey of sectionKeys) {
        // Check if section exists
        let section = sections.find(s => s.sectionKey === sectionKey);

        // Create section if it doesn't exist
        if (!section) {
          section = await sectionsService.create({
            pageId: page.id,
            sectionKey: sectionKey,
            sectionType: 'content',
            isActive: true,
            orderIndex: sectionKeys.indexOf(sectionKey)
          });
          createdCount++;
        }

        // Refresh sections to get fresh data
        const allSections = await sectionsService.getByPageId(page.id);
        const freshSection = allSections.find(s => s.sectionKey === sectionKey);

        if (!freshSection) continue;

        // Get existing content keys to avoid duplicates
        const existingContentKeys = (freshSection.content || []).map((c: any) => c.contentKey);

        // Add default content items that don't already exist
        const contentItems = defaultContent[sectionKey] || [];
        const contentToCreate = contentItems
          .filter(item => !existingContentKeys.includes(item.contentKey))
          .map(item => ({
            sectionId: freshSection.id,
            ...item
          }));

        if (contentToCreate.length > 0) {
          await sectionContentService.bulkUpdate(contentToCreate);
          contentCount += contentToCreate.length;
        }
      }

      // Refresh sections
      const updatedSections = await sectionsService.getByPageId(page.id);
      setSections(updatedSections);

      showNotification(
        `Initialization complete! Created ${createdCount} sections and ${contentCount} content items.`,
        'success'
      );

      window.dispatchEvent(new Event('cms-refresh'));
    } catch (error: any) {
      console.error('Error initializing sections:', error);
      showNotification(
        error.message || 'Failed to initialize sections. Please try again.',
        'error'
      );
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

    // Parse JSON content if needed
    if (item.contentType === 'json' && typeof item.contentValue === 'string') {
      try {
        formDataToSet.contentValue = JSON.parse(item.contentValue);
      } catch (e) {
        // Keep as string if parsing fails
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
              const parsed = JSON.parse(item.contentValue);
              // For cards array, process iconPath values
              // Keep direct paths like /uploads/images/... as-is
              // Only convert /uploads/media/{id} to mediaId (number) for ImageUpload component
              if (item.contentKey === 'cards' && Array.isArray(parsed)) {
                const processedCards = parsed.map((card: any) => {
                  if (card.iconPath && typeof card.iconPath === 'string') {
                    // If it's /uploads/media/{id}, convert to mediaId for ImageUpload
                    if (card.iconPath.startsWith('/uploads/media/')) {
                      const mediaIdMatch = card.iconPath.match(/\/uploads\/media\/(\d+)/);
                      if (mediaIdMatch) {
                        return { ...card, iconPath: parseInt(mediaIdMatch[1]) };
                      }
                    }
                    // Otherwise, keep the direct path as-is (e.g., /uploads/images/general/general/...)
                  }
                  return card;
                });
                formData[item.contentKey] = processedCards;
              } else {
                formData[item.contentKey] = parsed;
              }
            } catch {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image/media fields, use mediaId if available
            if (item.mediaId) {
              formData[item.contentKey] = item.mediaId;
            } else {
              formData[item.contentKey] = item.contentValue;
            }
          }
        });
      }

      setEditingItem(section);
      setFormData(formData);
      setModalType('edit');

      // Use Refrigerants-specific entity types
      const entityTypeMap: Record<string, string> = {
        'hero-section': 'section-content-hero-section-refrigerants',
        'why-choose-us': 'section-content-why-choose-us-refrigerants',
        'breaking-grounds': 'section-content-breaking-grounds-refrigerants',
        'products': 'section-content-products-refrigerants',
        'quality-assurance': 'section-content-quality-assurance-refrigerants',
        'refex-industries': 'section-content-refex-industries-refrigerants'
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
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Refex Refrigerants Page Management</h2>
        <div className="flex gap-2">
          {/* Hidden: Initialize All Sections button */}
          {/* <button
            onClick={initializeAllSections}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Initialize all sections with default content"
          >
            <i className="ri-database-2-line"></i>
            {loading ? 'Initializing...' : 'Initialize All Sections'}
          </button> */}
          <button
            onClick={() => window.open('/refex-refrigerants', '_blank')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-eye-line"></i>
            Preview Page
          </button>
        </div>
      </div>

      {/* Single Row Tabs - All Sections */}
      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Section Tab */}
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

          {/* Why Choose Us Tab */}
          <button
            onClick={() => setActiveSection('why-choose-us')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'why-choose-us'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Why Choose Us</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'why-choose-us'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Breaking Grounds Tab */}
          <button
            onClick={() => setActiveSection('breaking-grounds')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'breaking-grounds'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-lightbulb-line text-base"></i>
            <span className="font-medium">Breaking Grounds</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'breaking-grounds'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Products Tab */}
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

          {/* Quality Assurance Tab */}
          <button
            onClick={() => setActiveSection('quality-assurance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'quality-assurance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-shield-check-line text-base"></i>
            <span className="font-medium">Quality Assurance</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'quality-assurance'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Refex Industries Tab */}
          <button
            onClick={() => setActiveSection('refex-industries')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'refex-industries'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-building-line text-base"></i>
            <span className="font-medium">Refex Industries</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'refex-industries'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic Page Sections Tabs (exclude fixed keys and hidden sections) */}
          {sections
            .filter((section) => !fixedSectionKeys.includes(section.sectionKey) && !hiddenSectionKeys.includes(section.sectionKey))
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

      {/* Hero Section */}
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
            const tagline = section?.content?.find((c: any) => c.contentKey === 'tagline')?.contentValue;
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const buttonText = section?.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
            const buttonLink = section?.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');
            const bgColor = section?.content?.find((c: any) => c.contentKey === 'backgroundColor')?.contentValue || '#1e5a8e';

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tagline</label>
                    <p className="text-gray-900">{tagline || 'Not set'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <p className="text-gray-900">{title || 'Not set'}</p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-600 text-sm">{description || 'Not set'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Button Text</label>
                    <p className="text-gray-900">{buttonText || 'Not set'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Button Link</label>
                    <p className="text-gray-600 text-sm">{buttonLink || 'Not set'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Background Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: bgColor }}
                      ></div>
                      <span className="text-gray-600">{bgColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Background Image</label>
                    {bgImage?.media ? (
                      <img
                        src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                        alt="Hero Background"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <p className="text-gray-400">No background image set</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Why Choose Us */}
      {activeSection === 'why-choose-us' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Why Choose Us Section</h3>
              <p className="text-gray-500 mt-1">Manage why choose us cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('why-choose-us')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'why-choose-us');
            const heading = section?.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
            const cardsContent = section?.content?.find((c: any) => c.contentKey === 'cards');
            let cards: any[] = [];
            if (cardsContent && cardsContent.contentType === 'json') {
              try {
                cards = JSON.parse(cardsContent.contentValue || '[]');
              } catch { }
            }

            return (
              <div className="prose max-w-none">
                {heading && <h3 className="text-lg font-bold mb-4">{heading}</h3>}
                {cards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card: any, index: number) => {
                      // Resolve icon path for preview
                      let iconPreview = null;
                      if (card.iconPath) {
                        const apiBase = getApiBaseUrl();
                        
                        if (typeof card.iconPath === 'string' && card.iconPath.startsWith('/uploads/media/')) {
                          // Already a path - just prepend API base
                          iconPreview = `${apiBase}${card.iconPath}`;
                        } else if (typeof card.iconPath === 'number') {
                          // Media ID - construct path
                          iconPreview = `${apiBase}/uploads/media/${card.iconPath}`;
                        } else if (typeof card.iconPath === 'string' && card.iconPath.startsWith('/uploads/')) {
                          // Direct path
                          iconPreview = `${apiBase}${card.iconPath}`;
                        } else if (typeof card.iconPath === 'string') {
                          // Try to use as path
                          iconPreview = `${apiBase}${card.iconPath}`;
                        }
                      }
                      
                      return (
                      <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            {iconPreview && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={iconPreview} 
                                  alt={card.title || 'Icon'} 
                                  className="w-16 h-16 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                        <h4 className="font-semibold mb-2">{card.title || `Card ${index + 1}`}</h4>
                        <p className="text-sm text-gray-600">{card.description || 'No description'}</p>
                      </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No cards configured. Click edit to add cards.</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Breaking Grounds */}
      {activeSection === 'breaking-grounds' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Breaking Grounds Section</h3>
              <p className="text-gray-500 mt-1">Manage breaking grounds content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('breaking-grounds')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'breaking-grounds');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const backgroundColor = section?.content?.find((c: any) => c.contentKey === 'backgroundColor')?.contentValue;

            return (
              <div className="prose max-w-none">
                {title ? (
                  <div className="p-4 rounded" style={{ backgroundColor: backgroundColor || '#1e5a8e' }}>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No content yet. Click edit to add content.</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Products */}
      {activeSection === 'products' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Products Section</h3>
              <p className="text-gray-500 mt-1">Manage products content</p>
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
            const heading = section?.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const productsContent = section?.content?.find((c: any) => c.contentKey === 'products');
            let products: any[] = [];
            if (productsContent && productsContent.contentType === 'json') {
              try {
                products = JSON.parse(productsContent.contentValue || '[]');
              } catch { }
            }

            return (
              <div className="prose max-w-none">
                {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}
                {description && <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>}
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 text-center">
                        <h4 className="font-semibold">{product.name || `Product ${index + 1}`}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No products configured. Click edit to add products.</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Quality Assurance */}
      {activeSection === 'quality-assurance' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Quality Assurance Section</h3>
              <p className="text-gray-500 mt-1">Manage quality assurance and safety content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('quality-assurance')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          {(() => {
            const section = sections.find(s => s.sectionKey === 'quality-assurance');
            const heading = section?.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const tab1Label = section?.content?.find((c: any) => c.contentKey === 'tab1Label')?.contentValue;
            const tab2Label = section?.content?.find((c: any) => c.contentKey === 'tab2Label')?.contentValue;
            const tab1ItemsContent = section?.content?.find((c: any) => c.contentKey === 'tab1Items');
            const tab2ItemsContent = section?.content?.find((c: any) => c.contentKey === 'tab2Items');
            let tab1Items: string[] = [];
            let tab2Items: string[] = [];
            if (tab1ItemsContent && tab1ItemsContent.contentType === 'json') {
              try {
                tab1Items = JSON.parse(tab1ItemsContent.contentValue || '[]');
              } catch { }
            }
            if (tab2ItemsContent && tab2ItemsContent.contentType === 'json') {
              try {
                tab2Items = JSON.parse(tab2ItemsContent.contentValue || '[]');
              } catch { }
            }

            return (
              <div className="prose max-w-none">
                {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}
                {description && <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{tab1Label || 'Tab 1'}</h4>
                    {tab1Items.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {tab1Items.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No items configured</p>
                    )}
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{tab2Label || 'Tab 2'}</h4>
                    {tab2Items.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {tab2Items.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No items configured</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Refex Industries */}
      {activeSection === 'refex-industries' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Refex Industries Section</h3>
              <p className="text-gray-500 mt-1">Manage Refex Industries content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('refex-industries')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          {(() => {
            const section = sections.find(s => s.sectionKey === 'refex-industries');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const buttonText = section?.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
            const buttonLink = section?.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');

            return (
              <div className="prose max-w-none">
                {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                {description && <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>}
                {buttonText && buttonLink && (
                  <div className="mt-4">
                    <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {buttonText} →
                    </a>
                  </div>
                )}
                {bgImage?.media && (
                  <div className="mt-4">
                    <img
                      src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                      alt="Background"
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}
                {!title && !description && (
                  <p className="text-gray-400 italic">No content yet. Click edit to add content.</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Page Section Content Management */}
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
                        render: (_value, item) => {
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
                    onEdit={(item) => handleEditSectionContent(item, selectedSection)}
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
      )}
    </div>
  );
}
