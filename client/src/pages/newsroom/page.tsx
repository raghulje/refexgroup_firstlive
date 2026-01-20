import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { newsroomService, pagesService, sectionsService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';

interface NewsroomItem {
  id: number;
  title: string;
  date?: string;
  source?: string;
  image: string;
  link: string;
  isVideo?: boolean;
  category?: string;
  logo?: string;
}

const NewsroomPage = () => {
  const [activeTab, setActiveTab] = useState<'press' | 'events'>('press');
  const [pressReleases, setPressReleases] = useState<NewsroomItem[]>([]);
  const [events, setEvents] = useState<NewsroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSections, setPageSections] = useState<any>({});

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    if (typeof imageData === 'string' && imageData.trim()) {
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      if (imageData.startsWith('/wp-content/')) {
        return imageData;
      }
      return imageData;
    }

    if (imageData.filePath) {
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

    // Handle image/media content with positioning
    if (contentItem.media || contentItem.mediaId) {
      // Try to get positioning from the content item itself first
      let positionX = contentItem.backgroundPositionX || contentItem.positionX;
      let positionY = contentItem.backgroundPositionY || contentItem.positionY;

      // If not found, try to find separate positioning content items in the same section
      if ((!positionX || positionX === '50') && section?.content) {
        const posXItem = section.content.find((c: any) => c.contentKey === `${contentKey}PositionX`);
        if (posXItem && posXItem.contentValue) {
          positionX = posXItem.contentValue;
        }
      }

      if ((!positionY || positionY === '50') && section?.content) {
        const posYItem = section.content.find((c: any) => c.contentKey === `${contentKey}PositionY`);
        if (posYItem && posYItem.contentValue) {
          positionY = posYItem.contentValue;
        }
      }

      const imagePath = getImagePath(contentItem.media);
      if (imagePath) {
        return {
          path: imagePath,
          positionX: positionX || '50',
          positionY: positionY || '50'
        };
      }
      // If getImagePath returns empty, try contentValue as fallback
      if (contentItem.contentValue) {
        return {
          path: contentItem.contentValue,
          positionX: positionX || '50',
          positionY: positionY || '50'
        };
      }
      return null;
    }

    // For non-image fields, return contentValue directly
    return contentItem.contentValue || null;
  };

  // Helper function to get background position style
  const getBackgroundPosition = (positionX?: string, positionY?: string): string => {
    const x = positionX || '50';
    const y = positionY || '50';
    return `${x}% ${y}%`;
  };

  useEffect(() => {
    const fetchNewsroomItems = async () => {
      try {
        setLoading(true);

        const items = await newsroomService.getAll();

        if (items && items.length > 0) {
          // Filter active items
          const activeItems = items.filter((item: any) => item.isActive !== false);

          // Separate by type - Press Releases
          const pressItems = activeItems
            .filter((item: any) => item.type === 'press' || !item.type)
            .map((item: any) => {
              let imagePath = '';
              let logoPath = '';
              if (item.featuredImage?.filePath) {
                const filePath = item.featuredImage.filePath as string;
                if (filePath.startsWith('/uploads/')) {
                  const apiBase = getApiBaseUrl();
                  imagePath = `${apiBase}${filePath}`;
                } else {
                  imagePath = filePath;
                }
              } else if (item.featuredImage?.url) {
                imagePath = item.featuredImage.url as string;
              }

              // Logo: can be a direct path string (from seeder) or stored in logo field
              if (typeof item.logo === 'string' && item.logo.trim()) {
                logoPath = item.logo.trim();
                if (logoPath.startsWith('/uploads/')) {
                  const apiBase = getApiBaseUrl();
                  logoPath = `${apiBase}${logoPath}`;
                }
              }

              return {
                id: item.id,
                title: item.title || '',
                date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
                source: item.badge || item.category || 'Press Release',
                image: imagePath || '',
                link: item.link || '#',
                isVideo: item.link?.includes('youtube') || item.link?.includes('youtu.be'),
                logo: logoPath || undefined,
              };
            });

          // Events
          const eventItems = activeItems
            .filter((item: any) => item.type === 'event')
            .map((item: any) => {
              let imagePath = '';
              if (item.featuredImage?.filePath) {
                const filePath = item.featuredImage.filePath as string;
                if (filePath.startsWith('/uploads/')) {
                  const apiBase = getApiBaseUrl();
                  imagePath = `${apiBase}${filePath}`;
                } else {
                  imagePath = filePath;
                }
              } else if (item.featuredImage?.url) {
                imagePath = item.featuredImage.url as string;
              }

              return {
                id: item.id,
                title: item.title || '',
                date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
                source: item.badge || item.category || 'Event',
                image: imagePath || '',
                link: item.link || '#',
                category: item.category || 'Event'
              };
            });

          setPressReleases(pressItems);
          setEvents(eventItems);
        } else {
          // No items from CMS
          setPressReleases([]);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching newsroom items:', error);
        setPressReleases([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsroomItems();
  }, []);

  useEffect(() => {
    const fetchPageSections = async () => {
      try {
        const page = await pagesService.getBySlug('newsroom');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);
        }
      } catch (error) {
        console.error('Error fetching page sections:', error);
      }
    };

    fetchPageSections();
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
      <div className="min-h-screen bg-white">
        {(() => {
          const heroSection = pageSections.hero;
          const heroTitle = getSectionContent(heroSection, 'title') || 'Newsroom';
          const heroDescription = getSectionContent(heroSection, 'description') || 'Get hyped for the latest buzz on our businesses and community initiatives, as well as inspiring stories about the amazing people behind them!';
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const overlayOpacity = getSectionContent(heroSection, 'overlayOpacity') || 0;
          const blurOverlay = getSectionContent(heroSection, 'blurOverlay') || 0;
          const gradientOverlay = getSectionContent(heroSection, 'gradientOverlay') || '';
          const overlayColor = getSectionContent(heroSection, 'overlayColor') || '#000000';

          // Build image path and positioning
          let imagePath = '';
          let bgPosition = 'center';
          if (bgImage) {
            if (typeof bgImage === 'string') {
              imagePath = bgImage.startsWith('/wp-content/') ? bgImage : getImagePath({ filePath: bgImage });
            } else if (typeof bgImage === 'object' && bgImage.path) {
              imagePath = bgImage.path;
              bgPosition = getBackgroundPosition(bgImage.positionX, bgImage.positionY);
            } else {
              imagePath = getImagePath(bgImage);
            }
          }

          // Build overlay styles
          const overlayStyle: React.CSSProperties = {};
          if (gradientOverlay) {
            overlayStyle.background = gradientOverlay;
          } else if (overlayOpacity > 0) {
            const opacity = overlayOpacity / 100;
            const color = overlayColor || '#000000';
            overlayStyle.backgroundColor = color;
            overlayStyle.opacity = opacity;
          }

          const backgroundStyle: React.CSSProperties = {};
          if (imagePath) {
            backgroundStyle.backgroundImage = `url(${imagePath})`;
            backgroundStyle.backgroundSize = 'cover';
            backgroundStyle.backgroundPosition = bgPosition;
            backgroundStyle.backgroundRepeat = 'no-repeat';
          }
          if (blurOverlay > 0) {
            backgroundStyle.filter = `blur(${blurOverlay}px)`;
          }

          return (
            <section className="relative h-[216px] flex items-center justify-center overflow-hidden pt-20">
              <div className="absolute inset-0">
                {imagePath ? (
                  <div
                    className="w-full h-full"
                    style={backgroundStyle}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800"></div>
                )}
                {(overlayOpacity > 0 || gradientOverlay) && (
                  <div className="absolute inset-0" style={overlayStyle}></div>
                )}
              </div>
              <div className="relative z-10 container mx-auto px-6 lg:px-12 w-full">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left - Newsroom Title */}
                  <div className="flex items-center">
                    <h1
                      className="text-3xl md:text-4xl font-bold text-white"
                      data-aos="fade-up"
                      data-aos-duration="800"
                    >
                      {heroTitle}
                    </h1>
                  </div>

                  {/* Right - Description with Green Separator */}
                  <div className="flex items-center gap-6">
                    {/* Green Vertical Line */}
                    <div className="w-1 h-20 bg-[#50b848] flex-shrink-0"></div>

                    {/* Description Text */}
                    <p
                      className="text-sm md:text-base text-white leading-relaxed"
                      data-aos="fade-up"
                      data-aos-delay="200"
                      data-aos-duration="800"
                    >
                      {heroDescription}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Tabs Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveTab('press')}
                className={`relative px-8 py-3 rounded-full font-semibold whitespace-nowrap overflow-hidden group/btn ${activeTab === 'press'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-black'
                  }`}
              >
                <span className={`relative z-10 ${activeTab === 'press' ? '' : 'group-hover/btn:text-white transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]'}`}>
                  Press Releases
                </span>
                {activeTab !== 'press' && (
                  <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`relative px-8 py-3 rounded-full font-semibold whitespace-nowrap overflow-hidden group/btn ${activeTab === 'events'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-black'
                  }`}
              >
                <span className={`relative z-10 ${activeTab === 'events' ? '' : 'group-hover/btn:text-white transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]'}`}>
                  Events
                </span>
                {activeTab !== 'events' && (
                  <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
                )}
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {activeTab === 'press' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pressReleases.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No press releases available. Add them from the Home Page CMS.</p>
                      </div>
                    ) : (
                      pressReleases.map((item, index) => (
                        <div
                          key={item.id}
                          className="group cursor-pointer w-full"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                        >
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                            {/* Card with background image and softer bottom gradient overlay */}
                            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-black">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                              )}
                              {/* Bottom gradient overlay so image stays visible */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

                              {/* Media logo badge (top-left) - only show if a logo is provided */}
                              {item.logo && (
                                <div className="absolute top-4 left-4">
                                  <div className="bg-white rounded-md shadow-md flex items-center justify-center w-[160px] h-[56px]">
                                    <img
                                      src={item.logo}
                                      alt={item.source || item.title}
                                      className="max-w-full max-h-full w-auto h-auto object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Content overlay (bottom) */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                <div className="mb-2">
                                  <span className="inline-block bg-white/10 border border-white/40 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-100">
                                    Press Release
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3">
                                  {item.title}
                                </h3>
                                <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#7DC144] hover:text-[#63a335] transition-colors duration-300">
                                  Continue Reading
                                  <i className="ri-arrow-right-line ml-1"></i>
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No events available. Add them from the Home Page CMS.</p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className="group cursor-pointer w-full">
                          <a href={event.link} target="_blank" rel="noopener noreferrer" className="block">
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-black">
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                              )}

                              {/* Dark gradient overlay for text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>

                              {/* EVENT Badge, Title and Continue Reading - Bottom Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                                {/* EVENT Badge - Above Title */}
                                <div className="mb-3">
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#7DC144] text-white text-[10px] font-bold uppercase tracking-[0.15em] shadow-md">
                                    {event.badge || event.category || 'EVENT'}
                                  </span>
                              </div>

                                {/* Title */}
                                <h5 className="text-base sm:text-lg md:text-xl text-white font-bold mb-3">
                                  {event.title}
                                </h5>
                                
                                {/* Continue Reading */}
                                <span className="inline-block text-[#7DC144] text-sm sm:text-base font-semibold hover:underline">
                                  Continue Reading
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {(() => {
          const ctaSection = pageSections.cta;
          const bgGradientFrom = getSectionContent(ctaSection, 'bgGradientFrom') || '#3b9dd6';
          const bgGradientTo = getSectionContent(ctaSection, 'bgGradientTo') || '#4db3e8';

          // Parse cards array from CMS
          let cardsArray: any[] = [];
          const cardsData = getSectionContent(ctaSection, 'cards');
          if (Array.isArray(cardsData)) {
            cardsArray = cardsData;
          } else if (typeof cardsData === 'string' && cardsData) {
            try {
              cardsArray = JSON.parse(cardsData);
            } catch (e) {
              console.error('Error parsing CTA cards:', e);
            }
          }

          // Fallback to individual card fields if cards array not available
          if (cardsArray.length === 0) {
            const card1Title = getSectionContent(ctaSection, 'card1Title');
            const card1ButtonText = getSectionContent(ctaSection, 'card1ButtonText');
            const card1ButtonLink = getSectionContent(ctaSection, 'card1ButtonLink');
            const card2Title = getSectionContent(ctaSection, 'card2Title');
            const card2ButtonText = getSectionContent(ctaSection, 'card2ButtonText');
            const card2ButtonLink = getSectionContent(ctaSection, 'card2ButtonLink');

            if (card1Title) {
              cardsArray.push({
                title: card1Title,
                buttonText: card1ButtonText || 'Get in touch',
                buttonLink: card1ButtonLink || '/contact'
              });
            }
            if (card2Title) {
              cardsArray.push({
                title: card2Title,
                buttonText: card2ButtonText || 'Careers',
                buttonLink: card2ButtonLink || '/careers'
              });
            }
          }

          // Default cards if none found
          if (cardsArray.length === 0) {
            cardsArray = [
              { title: 'Got a question?', buttonText: 'Get in touch', buttonLink: '/contact' },
              { title: 'Work at Refex', buttonText: 'Careers', buttonLink: '/careers' }
            ];
          }

          return (
            <section className="py-8 animate-[fadeInUp_0.8s_ease-in-out]">
              <div className="container mx-auto px-6 lg:px-12">
                <div
                  className="rounded-2xl p-8 md:p-10"
                  style={{
                    background: `linear-gradient(to right, ${bgGradientFrom}, ${bgGradientTo})`
                  }}
                >
                  <div className={`grid ${cardsArray.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-8 text-center`}>
                    {cardsArray.map((card: any, index: number) => (
                      <div key={index}>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                          {card.title}
                        </h2>
                        <Link
                          to={card.buttonLink || '#'}
                          className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#3b9dd6] transition-all duration-300 cursor-pointer whitespace-nowrap"
                        >
                          {card.buttonText}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Footer */}
        <Footer />
      </div>
    </MainLayout>
  );
};

export default NewsroomPage;
