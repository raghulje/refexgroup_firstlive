import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/feature/MainLayout';
// All images must come from CMS - no static imports
import { pagesService, sectionsService, businessCardsService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';
import { trackBusinessInteraction, trackButtonClick, trackLinkClick } from '../../utils/ga4';

// No fallback businesses - all must come from CMS
const fallbackBusinesses: any[] = [];

export default function BusinessPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [pageSections, setPageSections] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    if (typeof imageData === 'string' && imageData.trim()) {
      // Filter out old /assets/ paths
      if (imageData.startsWith('/assets/')) {
        return '';
      }
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      return imageData;
    }

    if (imageData.filePath) {
      // Filter out old /assets/ paths
      if (imageData.filePath.startsWith('/assets/')) {
        return '';
      }
      if (imageData.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData.filePath}`;
      }
      return imageData.filePath;
    }

    if (imageData.url) {
      return imageData.url;
    }

    return '';
  };

  // Helper function to get section content value
  const getSectionContent = (section: any, contentKey: string): any => {
    if (!section?.content) return null;
    const contentItem = section.content.find((c: any) => c.contentKey === contentKey);
    if (!contentItem) return null;

    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }

    if (contentItem.media || contentItem.mediaId) {
      return {
        path: getImagePath(contentItem.media)
      };
    }

    return contentItem.contentValue;
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('business');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);
        }

        // Fetch business cards
        try {
          const cards = await businessCardsService.getAll();
          if (cards && cards.length > 0) {
            const activeCards = cards
              .filter((card: any) => card.isActive !== false)
              .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

            const transformedBusinesses = activeCards.map((card: any) => {
              let imagePath = '';
              if (card.image?.filePath) {
                imagePath = getImagePath(card.image);
              } else if (typeof card.image === 'string' && card.image.trim()) {
                imagePath = getImagePath(card.image);
              }

              return {
                id: card.id || card.title?.toLowerCase().replace(/\s+/g, '-'),
                title: card.title || '',
                description: card.description || '',
                image: imagePath || '', // No fallback - must come from CMS
                link: card.linkUrl || '#'
              };
            });

            // Filter out businesses without valid images (only /uploads/ paths are valid)
            const validBusinesses = transformedBusinesses.filter(b => b.image && b.image.startsWith('http'));
            
            if (validBusinesses.length > 0) {
              setBusinesses(validBusinesses);
            } else {
              setBusinesses([]);
            }
          }
        } catch (error) {
          console.error('Error fetching business cards:', error);
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {(() => {
          const heroSection = pageSections.hero;
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : '');
          const tagline = getSectionContent(heroSection, 'tagline') || '';
          const title = getSectionContent(heroSection, 'title') || 'Our Business Verticals';
          const description = getSectionContent(heroSection, 'description') || 'Diversified excellence across multiple industries, driving innovation and sustainable growth';

          return (
            <>
              <div className="absolute inset-0">
                {bgImagePath ? (
                <img
                  src={bgImagePath}
                  alt="Business Operations"
                  className="w-full h-full object-cover"
                />
                ) : (
                  <div className="w-full h-full bg-gray-800"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
              </div>
              <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
                {tagline && (
                  <p className="text-white/90 text-sm mb-4 tracking-wide" data-aos="fade-up" data-aos-duration="800">
                    {tagline}
                  </p>
                )}
                <h1
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                  data-aos="fade-up"
                  data-aos-duration="800"
                >
                  {title}
                </h1>
                <p
                  className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                >
                  {description}
                </p>
              </div>
            </>
          );
        })()}
      </section>

      {/* Image Accordion Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-[500px] gap-2 overflow-hidden rounded-xl">
            {businesses.slice(0, 6).map((business, index) => (
              <div
                key={business.id}
                className={`relative cursor-pointer transition-all duration-500 ease-in-out overflow-hidden rounded-lg ${activeIndex === index ? 'flex-[3]' : 'flex-1'
                  }`}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  trackBusinessInteraction(business.title, 'hover', 'business-page-accordion');
                }}
                onClick={() => trackBusinessInteraction(business.title, 'click', 'business-page-accordion')}
                style={{
                  backgroundImage: business.image ? `url(${business.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: business.image ? 'transparent' : '#e5e7eb',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3
                    className={`font-bold transition-all duration-300 ${activeIndex === index ? 'text-2xl mb-2' : 'text-lg writing-mode-vertical'
                      }`}
                    style={activeIndex !== index ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : {}}
                  >
                    {business.title.replace('Refex ', '')}
                  </h3>
                  {activeIndex === index && (
                    <div className="animate-fadeIn">
                      <p className="text-gray-200 text-sm mb-4">{business.description}</p>
                      <Link
                        to={business.link}
                        onClick={() => {
                          trackBusinessInteraction(business.title, 'explore', 'business-page-accordion');
                          trackLinkClick(`Learn More - ${business.title}`, business.link, 'internal');
                        }}
                        className="inline-flex items-center text-[#50b848] hover:text-[#3d8c36] font-medium"
                        data-ga-track="link"
                        data-ga-label={`Learn More - ${business.title}`}
                      >
                        Learn More <i className="ri-arrow-right-line ml-2"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          {(() => {
            const gridSection = pageSections['business-grid'] || pageSections.grid;
            const heading = getSectionContent(gridSection, 'heading') || 'Our Business Verticals';
            const description = getSectionContent(gridSection, 'description') || 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.';

            return (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              </div>
            );
          })()}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business, index) => (
              <Link
                key={business.id}
                to={business.link}
                onClick={() => {
                  trackBusinessInteraction(business.title, 'click', 'business-page-grid');
                  trackLinkClick(business.title, business.link, 'internal');
                }}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
                data-ga-track="link"
                data-ga-label={business.title}
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {business.image ? (
                  <img
                    src={business.image}
                    alt={business.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                  />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{business.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{business.description}</p>
                  <span className="inline-flex items-center text-[#50b848] font-medium group-hover:text-[#3d8c36]">
                    Explore <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#50b848] to-[#3d8c36]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          {(() => {
            const ctaSection = pageSections.cta;
            const title = getSectionContent(ctaSection, 'title') || 'Partner with Refex';
            const description = getSectionContent(ctaSection, 'description') || 'Explore opportunities to collaborate with one of India\'s leading diversified business groups.';
            const buttonText = getSectionContent(ctaSection, 'buttonText') || 'Get in Touch';
            const buttonLink = getSectionContent(ctaSection, 'buttonLink') || '/contact';

            return (
              <>
                <h2 className="text-3xl font-bold text-white mb-4" data-aos="fade-up" data-aos-duration="800">{title}</h2>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
                  {description}
                </p>
                <Link
                  to={buttonLink}
                  onClick={() => trackButtonClick(buttonText, 'business-page-cta', buttonLink)}
                  className="inline-block bg-white text-[#50b848] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                  data-ga-track="button"
                  data-ga-label={buttonText}
                  data-ga-location="business-page-cta"
                >
                  {buttonText}
                </Link>
              </>
            );
          })()}
        </div>
      </section>
    </MainLayout>
  );
}
