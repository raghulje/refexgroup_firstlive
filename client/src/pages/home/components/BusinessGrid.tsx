import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessCardsService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';

// CSS for smooth hover effect without flickering - using direct :hover instead of group-hover
const businessCardButtonStyles = `
  .business-button-inner:hover {
    width: auto !important;
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 0.625rem !important;
    padding-bottom: 0.625rem !important;
  }
  .business-button-inner:hover .business-button-arrow {
    opacity: 0 !important;
    visibility: hidden !important;
  }
  .business-button-inner:hover .business-button-text {
    opacity: 1 !important;
    width: 110px !important;
    margin-right: 0.5rem !important;
    display: inline-block !important;
  }
`;

// No fallback businesses - all must come from CMS
const fallbackBusinesses: Business[] = [];

interface Business {
  id: number;
  title: string;
  description: string;
  image: string;
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

          // Transform API cards to match component format
          const transformedBusinesses: Business[] = activeCards.map((card: any) => {
            let imagePath = '';

            // 1) If image is a related Media object
            if (card.image?.filePath) {
              imagePath = card.image.filePath;
            } else if (card.image?.url) {
              imagePath = card.image.url;
            }

            // 2) If image is stored directly as a string path on the entity (most likely with new uploads)
            if (!imagePath && typeof card.image === 'string' && card.image.trim()) {
              imagePath = card.image.trim();
            }

            // 3) If we have a relative path, decide how to prefix it
            if (imagePath && imagePath.startsWith('/')) {
              // New uploads: /uploads/... should be served from the backend domain
              if (imagePath.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                imagePath = `${apiBase}${imagePath}`;
              } else if (imagePath.startsWith('/assets/')) {
                // Filter out old /assets/ paths - they should not be displayed
                imagePath = '';
              }
            }

            return {
              id: card.id,
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
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  {business.image ? (
                    <img
                      src={business.image}
                      alt={business.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500 ease-out"
                      style={{ willChange: 'transform' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
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
                          marginTop: '-45px',
                          transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), padding 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                          willChange: 'width, padding, height'
                        }}
                        className="business-button-inner relative inline-flex items-center justify-center gap-2 bg-[#7DC144] text-white font-semibold rounded-full w-12 h-12 overflow-hidden">
                        {/* Arrow icon - always positioned, hidden on hover */}
                        <i
                          className="business-button-arrow ri-arrow-right-line text-lg flex-shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out"
                          style={{
                            pointerEvents: 'none',
                            zIndex: 2
                          }}
                          aria-hidden="true"
                        ></i>
                        {/* Text - shown on hover */}
                        <span
                          className="business-button-text opacity-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-out"
                          style={{
                            willChange: 'opacity, width, margin-right'
                          }}
                        >
                          Explore More
                        </span>
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
