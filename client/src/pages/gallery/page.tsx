import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService, galleryAlbumsService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';

const GalleryPage = () => {
  const [pageSections, setPageSections] = useState<any>({});
  const [yearGalleries, setYearGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';
    
    if (typeof imageData === 'string' && imageData.trim()) {
      // Filter out old /assets/ and /wp-content/ paths
      if (imageData.startsWith('/assets/') || imageData.startsWith('/wp-content/')) {
        return '';
      }
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      return imageData;
    }
    
    if (imageData.filePath) {
      // Filter out old /assets/ and /wp-content/ paths
      if (imageData.filePath.startsWith('/assets/') || imageData.filePath.startsWith('/wp-content/')) {
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
    
    // Handle image/media content with positioning
    // Check if this is an image field
    const imageFields = ['image', 'backgroundImage', 'logo', 'icon', 'coverImage'];
    const isImageField = imageFields.includes(contentKey);
    
    if (isImageField) {
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
      
      // Priority 1: Check if media relationship exists
      if (contentItem.media?.filePath) {
      const imagePath = getImagePath(contentItem.media);
      if (imagePath) {
        return {
          path: imagePath,
          positionX: positionX || '50',
          positionY: positionY || '50'
        };
      }
      }
      
      // Priority 2: Check if mediaId exists and try to resolve it
      if (contentItem.mediaId) {
        // If we have mediaId but no media relationship, use contentValue as fallback
        if (contentItem.contentValue) {
          const imagePath = getImagePath({ filePath: contentItem.contentValue });
          if (imagePath) {
            return {
              path: imagePath,
              positionX: positionX || '50',
              positionY: positionY || '50'
            };
          }
        }
      }
      
      // Priority 3: Use contentValue directly (might be a path like /uploads/media/{id} or /uploads/images/...)
      if (contentItem.contentValue) {
        const imagePath = getImagePath({ filePath: contentItem.contentValue });
        if (imagePath) {
          return {
            path: imagePath,
            positionX: positionX || '50',
            positionY: positionY || '50'
          };
        }
        // If getImagePath returns empty, try contentValue as-is
        if (contentItem.contentValue.trim()) {
        return {
          path: contentItem.contentValue,
          positionX: positionX || '50',
          positionY: positionY || '50'
        };
      }
      }
      
      return null;
    }
    
    return contentItem.contentValue || null;
  };

  // Helper function to get background position style
  const getBackgroundPosition = (positionX?: string, positionY?: string): string => {
    const x = positionX || '50';
    const y = positionY || '50';
    return `${x}% ${y}%`;
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        
        // Fetch gallery page and sections
        const page = await pagesService.getBySlug('gallery');
        if (page?.id) {
          const pageSectionsData = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          
          // Process sections and resolve media if needed
          for (const section of pageSectionsData) {
            // If welcome section has image content with mediaId but no media relationship, resolve it
            if (section.sectionKey === 'welcome' && section.content) {
              const imageContent = section.content.find((c: any) => c.contentKey === 'image');
              if (imageContent && imageContent.mediaId && !imageContent.media) {
                try {
                  const { mediaService } = await import('../../services/apiService');
                  const media = await mediaService.getById(imageContent.mediaId);
                  if (media) {
                    imageContent.media = media;
                  }
                } catch (error) {
                  console.error('Error resolving welcome image media:', error);
                }
              }
            }
            
            sectionsMap[section.sectionKey] = section;
          }
          
          setPageSections(sectionsMap);
        }
        
        // Fetch year galleries (albums with albumType='year')
        const albums = await galleryAlbumsService.getAll('year', false);
        const activeYearGalleries = albums
          .filter((album: any) => album.isActive !== false && album.albumType === 'year')
          .sort((a: any, b: any) => {
            // Sort by year descending (extract year number if possible)
            const yearA = parseInt(a.name || a.slug || '0');
            const yearB = parseInt(b.name || b.slug || '0');
            if (yearA && yearB) {
              return yearB - yearA; // Descending order
            }
            return (b.name || '').localeCompare(a.name || '');
          })
          .map((album: any) => {
            // Generate link from slug or name
            const slug = album.slug || album.name?.toLowerCase().replace(/\s+/g, '-') || '';
            return {
              year: album.name || '',
              image: album.coverImage?.filePath || album.coverImage?.url || '',
              link: `/gallery-${slug}`
            };
          });
        setYearGalleries(activeYearGalleries);
      } catch (error) {
        console.error('Error fetching gallery page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);



  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {(() => {
          const heroSection = pageSections.hero;
          const heroTitle = getSectionContent(heroSection, 'title') || 'Gallery';
          const heroDescription = getSectionContent(heroSection, 'description') || 'Stay informed about the latest developments and news from Refex Industries Limited.';
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const overlayOpacity = getSectionContent(heroSection, 'overlayOpacity') || 40;
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
            <section className="relative h-[225px] flex items-center justify-center overflow-hidden pt-20">
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
                  {/* Left - Gallery Title */}
                  <div className="flex items-center">
                    <h1
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
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
                      className="text-base md:text-lg text-white leading-relaxed"
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

        {/* Welcome Section */}
        {(() => {
          const welcomeSection = pageSections.welcome;
          const welcomeTitle = getSectionContent(welcomeSection, 'title') || 'Welcome to Refex Group\'s gallery!';
          const welcomeDescription = getSectionContent(welcomeSection, 'description') || 'We take pride in showcasing our achievements, milestones, and notable events. Our state-of-the-art facilities, involvement in social and community initiatives, and collaborations with businesses and governments highlight our commitment to sustainability and innovation. Explore our gallery to learn more about our journey towards building a better future for ourselves and the planet.';
          const welcomeImage = getSectionContent(welcomeSection, 'image');
          
          let imagePath = '';
          if (welcomeImage) {
            // getSectionContent now returns an object with path, positionX, positionY for image fields
            if (typeof welcomeImage === 'object' && welcomeImage.path) {
              imagePath = welcomeImage.path;
            } else if (typeof welcomeImage === 'string') {
              // Fallback: if it's still a string, process it
              imagePath = welcomeImage.startsWith('/wp-content/') ? welcomeImage : getImagePath({ filePath: welcomeImage });
            } else {
              imagePath = getImagePath(welcomeImage);
            }
          }

          return (
            <section className="py-16 md:py-20 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left - Text Content */}
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                      {welcomeTitle}
                    </h2>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {welcomeDescription}
                    </p>
                  </div>

                  {/* Right - Main Image */}
                  {imagePath && (
                    <div className="relative">
                      <img
                        src={imagePath}
                        alt={welcomeTitle}
                        className="w-full h-auto rounded-lg shadow-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Year Gallery Cards Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : yearGalleries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No year galleries available. Create them from the Gallery CMS.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {yearGalleries.map((gallery) => (
                <Link
                  key={gallery.year}
                  to={gallery.link}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      {gallery.image ? (
                        <img
                          src={getImagePath({ filePath: gallery.image })}
                          alt={`Gallery ${gallery.year}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Year Label Below Image */}
                  <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mt-4 text-center">
                    {gallery.year.replace(/^Year\s+/i, '')}
                  </h3>
                </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {(() => {
          const ctaSection = pageSections.cta;
          const bgGradientFrom = getSectionContent(ctaSection, 'bgGradientFrom') || '#3b9dd6';
          const bgGradientTo = getSectionContent(ctaSection, 'bgGradientTo') || '#4db3e8';
          const cardsJson = getSectionContent(ctaSection, 'cards');
          
          let cardsArray: any[] = [];
          if (cardsJson) {
            if (Array.isArray(cardsJson)) {
              cardsArray = cardsJson;
            } else if (typeof cardsJson === 'string') {
              try {
                cardsArray = JSON.parse(cardsJson);
              } catch {
                cardsArray = [];
              }
            }
          }

          // Fallback to default CTAs if no cards
          if (cardsArray.length === 0) {
            cardsArray = [
              { title: 'Got a question?', buttonText: 'Get in touch', buttonLink: '/contact' },
              { title: 'See our latest news', buttonText: 'Refex Newsroom', buttonLink: '/newsroom' },
              { title: 'Work at Refex', buttonText: 'Careers', buttonLink: '/careers' }
            ];
          }

          return (
            <section className="py-[27px] md:py-[34px] bg-green-50">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div 
                  className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]"
                  style={{ 
                    background: `linear-gradient(135deg, ${bgGradientFrom} 0%, ${bgGradientTo} 100%)`
                  }}
                >
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {cardsArray.map((card: any, index: number) => (
                      <div 
                        key={index} 
                        className="text-center" 
                        data-aos="fade-up" 
                        data-aos-duration="700" 
                        data-aos-delay={(index + 1) * 100} 
                        data-aos-easing="ease-out-cubic"
                      >
                        <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{card.title}</h3>
                        <Link
                          to={card.buttonLink || '#'}
                          className="inline-block border-2 border-white bg-transparent text-white px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-nowrap cursor-pointer text-sm md:text-base"
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

export default GalleryPage;
