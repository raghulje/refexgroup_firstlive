import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessCardsService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';

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
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                {business.image ? (
                  <img
                    src={business.image}
                    alt={business.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
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
                    className="inline-flex items-center justify-center cursor-pointer"
                    style={{ marginTop: '-45px' }}
                  >
                    <div className="explore-button-container">
                      <div className="explore-button-bg"></div>
                      <div className="explore-button-content">
                        <span className="explore-button-text">
                          Explore More
                        </span>
                        <i className="explore-button-icon ri-arrow-right-line"></i>
                      </div>
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
