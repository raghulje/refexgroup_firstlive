import { useState, useEffect } from 'react';
import { newsroomService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';

// Fallback data if CMS fails
const fallbackPressReleases = [
  {
    id: 1,
    title: 'Dinesh Agarwal, CEO of Refex Group, on ET Now',
    date: 'November 11, 2025',
    source: 'ET NOW',
    image: '/assets/newsroom/newsroom-thumbnail-video.jpg',
    link: 'https://www.youtube.com/watch?v=vyiEp-hzhqU',
    isVideo: true,
  },
  {
    id: 2,
    title: 'Refex reports PBT at 30 crore in Q1 FY24',
    date: 'August 4, 2023',
    source: 'The Times of India',
    image: '/assets/newsroom/readdy-1.jpeg',
    link: 'https://timesofindia.indiatimes.com/city/chennai/refex-reports-pbt-at-30-crore-in-q1-fy24/articleshow/102408182.cms?from=mdr',
  },
  {
    id: 3,
    title: 'Refex Mobility expands operations to Delhi NCR',
    date: 'November 11, 2025',
    source: 'ET AUTO',
    image: '/assets/newsroom/readdy-2.jpeg',
    link: 'https://auto.economictimes.indiatimes.com/news/aftermarket/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/123237339',
  },
  {
    id: 4,
    title: 'Refex eVeelz rebrands as Refex Mobility; to consolidate focus on existing Tier-1 market',
    date: 'March 27, 2025',
    source: 'ANI',
    image: '/assets/newsroom/readdy-3.jpeg',
    link: 'https://www.aninews.in/news/business/refex-group-is-the-official-sponsor-of-chennai-super-kings20250327190124/',
  },
  {
    id: 5,
    title: 'Refex Group is the Official Sponsor of Chennai Super Kings',
    date: 'March 11, 2025',
    source: 'The Hindu',
    image: '/assets/newsroom/press-release02.jpg',
    link: 'https://www.thehindu.com/sci-tech/technology/uber-partners-with-chennai-based-refex-green-mobility-to-deploy-1000-evs-across-cities/article69316319.ece',
  },
  {
    id: 6,
    title: 'Refex Group Strengthens Leadership in Sustainability at UNGCNI Annual Convention 2025',
    date: 'February 15, 2025',
    source: 'ANI',
    image: '/assets/newsroom/press-release04.jpg',
    link: 'https://www.aninews.in/news/business/refex-group-strengthens-leadership-in-sustainability-at-ungcni-annual-convention-202520250215101613/',
  },
  {
    id: 7,
    title: 'Refex Group wins Excellence in Sustainability Award 2024',
    date: 'December 15, 2024',
    source: 'Economic Times',
    image: '/assets/newsroom/press-release02.jpg',
    link: '#',
  },
  {
    id: 8,
    title: 'Refex Group wins Excellence in Sustainability Award 2024',
    date: 'December 15, 2024',
    source: 'Economic Times',
    image: '/assets/newsroom/press-release02.jpg',
    link: '#',
  },
  {
    id: 9,
    title: 'Refex expands green mobility operations to 5 new cities',
    date: 'November 28, 2024',
    source: 'The Hindu',
    image: '/assets/newsroom/Refex-Mobility-expands.jpg',
    link: '#',
  },
  {
    id: 10,
    title: 'Refex Industries reports 45% growth in Q3 revenue',
    date: 'November 10, 2024',
    source: 'Financial Express',
    image: '/assets/newsroom/press-release04.jpg',
    link: '#',
  },
  {
    id: 11,
    title: 'Refex Group launches new renewable energy initiative',
    date: 'October 22, 2024',
    source: 'Business Today',
    image: '/assets/newsroom/readdy-2.jpeg',
    link: '#',
  },
  {
    id: 12,
    title: 'Refex partners with government for clean energy project',
    date: 'September 18, 2024',
    source: 'Times of India',
    image: '/assets/newsroom/readdy-3.jpeg',
    link: '#',
  },
  {
    id: 13,
    title: 'Refex Industries achieves carbon neutrality milestone',
    date: 'August 30, 2024',
    source: 'Mint',
    image: '/assets/newsroom/press-release02.jpg',
    link: '#',
  },
];

const fallbackEvents = [
  {
    id: 1,
    title: "Refex Gheun Tak – A Women's Ultimate Frisbee Tournament",
    date: 'January 25, 2023',
    source: 'Times of India',
    image: '/assets/newsroom/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg',
    link: 'https://businessnewsthisweek.com/business/team-meraki-wins-refex-gheun-tak-a-womens-ultimate-frisbee-tournament/',
    category: 'Frisbee Tournament',
  },
  {
    id: 2,
    title: 'Refex Group Road Safety Awareness event',
    date: 'January 11, 2023',
    source: 'Events',
    image: '/assets/newsroom/Refex-Group-Road-Safety-Awareness-event.jpg',
    link: 'https://navjeevanexpress.com/csr-initiative-refex-group-kick-starts-road-safety-campaign-on-anna-salai-in-chennai/',
    category: 'Awareness event',
  },
];

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

export default function NewsroomSection() {
  const [activeTab, setActiveTab] = useState<'press' | 'events'>('press');
  const [pressReleases, setPressReleases] = useState<NewsroomItem[]>(fallbackPressReleases);
  const [events, setEvents] = useState<NewsroomItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsroomItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const items = await newsroomService.getAll();
        
        if (items && items.length > 0) {
          // Filter active items
          const activeItems = items.filter((item: any) => item.isActive !== false);
          
          // Separate by type
          const pressItems = activeItems
            .filter((item: any) => item.type === 'press' || !item.type)
            .slice(0, 13)
            .map((item: any) => {
              let imagePath = '';
              let logoPath = '';
              if (item.featuredImage?.filePath) {
                const filePath = item.featuredImage.filePath as string;
                if (filePath.startsWith('/uploads/')) {
                  const apiBase = getApiBaseUrl();
                  imagePath = `${apiBase}${filePath}`;
                } else {
                  // Already an absolute/asset path – use as-is
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
                image: imagePath || '', // No fallback - must come from CMS
                link: item.link || '#',
                isVideo: item.link?.includes('youtube') || item.link?.includes('youtu.be'),
                logo: logoPath || undefined,
              };
            });

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
                source: item.badge || item.category || 'Events',
                image: imagePath || '', // No fallback - must come from CMS
                link: item.link || '#',
                category: item.category || 'Event'
              };
            });

          // Filter out items without valid images (must have http/https URL)
          const validPressItems = pressItems.filter((item: any) => item.image && (item.image.startsWith('http://') || item.image.startsWith('https://')));
          const validEventItems = eventItems.filter((item: any) => item.image && (item.image.startsWith('http://') || item.image.startsWith('https://')));

          // Even if there are zero items for a tab, override the fallback so CMS truly controls content
          setPressReleases(validPressItems);
          setEvents(validEventItems);
        }
      } catch (error) {
        console.error('Error fetching newsroom items:', error);
        setError('Failed to load newsroom items');
        // No fallback data - show empty state if CMS fails
        setPressReleases([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsroomItems();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Newsroom</h2>
          <p className="text-xs md:text-sm text-gray-600 max-w-3xl mx-auto">
            Get the latest news and updates from our newsroom and stay informed on all things Refex.
          </p>
          {error && (
            <p className="text-[0.7rem] md:text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('press')}
            className={`relative px-8 py-3 rounded-full font-semibold whitespace-nowrap overflow-hidden group/btn ${
              activeTab === 'press'
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
            className={`relative px-8 py-3 rounded-full font-semibold whitespace-nowrap overflow-hidden group/btn ${
              activeTab === 'events'
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
                    <p className="text-gray-500">No press releases available</p>
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
                        <div className="relative overflow-hidden rounded-lg aspect-[4/4] bg-black">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <p className="text-gray-400 text-sm">No image</p>
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
                                    (e.target as HTMLImageElement).style.display = 'none';
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
                    <p className="text-gray-500">No events available</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="group cursor-pointer w-full">
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="block">
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-lg aspect-[4/4] bg-black">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <p className="text-gray-400 text-sm">No image</p>
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/newsroom"
            className="relative inline-flex items-center justify-center gap-2 px-8 py-3 border border-slate-600 text-slate-700 rounded-full font-semibold overflow-hidden whitespace-nowrap cursor-pointer group/btn"
          >
            <span className="relative z-10 flex items-center">
              Visit our Newsroom
              <i className="ri-arrow-right-line ml-2"></i>
            </span>
            <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
            <span className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
              Visit our Newsroom
              <i className="ri-arrow-right-line ml-2"></i>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
