import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessCardsService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';
import CMSImage from '../../../components/common/CMSImage';

// CSS for smooth hover effect without flickering - premium animation
const businessCardButtonStyles = `
  .business-button-inner {
    transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1), 
                padding-left 400ms cubic-bezier(0.4, 0, 0.2, 1),
                padding-right 400ms cubic-bezier(0.4, 0, 0.2, 1),
                padding-top 400ms cubic-bezier(0.4, 0, 0.2, 1),
                padding-bottom 400ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: width, padding;
  }
  .business-button-inner:hover {
    width: auto !important;
    min-width: 160px !important;
    padding-left: 1.25rem !important;
    padding-right: 2.75rem !important;
    padding-top: 0.625rem !important;
    padding-bottom: 0.625rem !important;
  }
  .business-button-arrow {
    transition: left 400ms cubic-bezier(0.4, 0, 0.2, 1),
                right 400ms cubic-bezier(0.4, 0, 0.2, 1),
                transform 400ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: left, right, transform, opacity;
  }
  .business-button-inner:hover .business-button-arrow {
    left: auto !important;
    right: 0.75rem !important;
    transform: translateY(-50%) !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  .business-button-text {
    transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1),
                width 400ms cubic-bezier(0.4, 0, 0.2, 1),
                margin-right 400ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, width, margin-right;
  }
  .business-button-inner:hover .business-button-text {
    opacity: 1 !important;
    width: auto !important;
    max-width: 110px !important;
    margin-right: 0.75rem !important;
    display: inline-block !important;
  }
`;

// No fallback businesses - all must come from CMS
const fallbackBusinesses: Business[] = [];

interface Business {
  id: number;
  title: string;
  description: string;
  image: any; // Can be string, object, or null - CMSImage will handle it
  imageId?: number | string | null; // Store imageId for fallback
  link: string;
}

export default function BusinessGrid() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const cards = await businessCardsService.getAll();

        if (cards && cards.length > 0) {
          // Filter active cards and sort by orderIndex
          const activeCards = cards
            .filter((card: any) => card.isActive !== false)
            .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

          // Debug: Log image data structure for troubleshooting
          if (process.env.NODE_ENV === 'development') {
            console.log('Business Cards Image Data:', activeCards.map((card: any) => {
              const image = card.image;
              return {
                title: card.title,
                imageId: card.imageId,
                image: image,
                imageType: typeof image,
                isNull: image === null,
                isUndefined: image === undefined,
                hasFilePath: !!(image?.filePath || image?.dataValues?.filePath),
                hasUrl: !!(image?.url || image?.dataValues?.url),
                hasDataValues: !!image?.dataValues,
                filePath: image?.filePath || image?.dataValues?.filePath,
                url: image?.url || image?.dataValues?.url,
                fullImageObject: image
              };
            }));
          }

          // Transform API cards to match component format
          // Keep the original image object so CMSImage can properly resolve it
          const transformedBusinesses: Business[] = activeCards.map((card: any) => {
            // Handle image data - check multiple possible structures
            let imageData = null;
            
            // If imageId exists but image object is null, try to construct URL from imageId
            if (card.imageId && !card.image) {
              const apiBase = getApiBaseUrl();
              imageData = `${apiBase}/uploads/media/${card.imageId}`;
            } else if (card.image) {
              // Use the image object/data structure
              imageData = card.image;
            }
            
            // If imageId is null/undefined, imageData should remain null

            return {
              id: card.id,
              title: card.title || '',
              description: card.description || '',
              image: imageData, // Pass the original image object/data structure or constructed URL
              imageId: card.imageId || null, // Store imageId for fallback
              link: card.linkUrl || '#'
            };
          });

          // Don't filter out businesses - let CMSImage handle missing images gracefully
          // It will show a placeholder if image is invalid
          setBusinesses(transformedBusinesses);
        } else {
          setBusinesses([]);
        }
      } catch (error) {
        console.error('Error fetching business cards:', error);
        setError('Failed to load business cards');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessCards();
    
    // Listen for CMS refresh events to refetch data when business cards are updated
    const handleRefresh = () => {
      fetchBusinessCards();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section id="our-businesses" className="py-10 bg-white">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="our-businesses" className="py-10 bg-white">
      <style>{businessCardButtonStyles}</style>
      <div className="container mx-auto px-4 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Businesses</h2>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No business cards available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((business, index) => (
              <div
                key={business.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out flex flex-col"
                style={{ willChange: 'box-shadow' }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative h-64 overflow-hidden bg-transparent">
                  {/* Always render CMSImage - it handles null/undefined gracefully */}
                  <div className="w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out" style={{ willChange: 'transform' }}>
                    <CMSImage
                      imageData={business.image}
                      imageId={business.imageId} // Pass imageId as fallback
                      alt={business.title}
                      width={400}
                      height={256}
                      priority={index < 4} // Prioritize first 4 images
                      placeholder="empty"
                      quality={85}
                      objectFit="cover"
                      className="w-full h-full"
                      onError={(e) => {
                        // Error handling is built into CMSImage
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Business card image failed to load:', {
                            title: business.title,
                            imageData: business.image,
                            imageId: business.imageId
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="p-6 flex flex-col h-full">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#7DC144] transition-colors duration-300">
                      {business.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {business.description}
                    </p>
                  </div>
                  <div className="mt-0.75 flex justify-center">
                    <Link
                      to={business.link}
                      className="business-card-button inline-flex items-center justify-center cursor-pointer"
                      data-ga-track="button"
                      data-ga-label="Explore More"
                      data-ga-location={`Business Card: ${business.title}`}
                      data-ga-destination={business.link}
                    >
                      <div
                        style={{
                          marginTop: '-45px'
                        }}
                        className="business-button-inner relative inline-flex items-center justify-start gap-2 bg-[#7DC144] text-white font-semibold rounded-full w-12 h-12 overflow-hidden">
                        {/* Text - shown on hover */}
                        <span
                          className="business-button-text opacity-0 w-0 overflow-hidden whitespace-nowrap"
                        >
                          Explore More
                        </span>
                        {/* Arrow icon - centered initially, moves to right on hover */}
                        <i
                          className="business-button-arrow ri-arrow-right-line text-lg flex-shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{
                            pointerEvents: 'none',
                            zIndex: 2
                          }}
                          aria-hidden="true"
                        ></i>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
