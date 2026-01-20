import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroSlidesService, pagesService } from '../../../services/apiService';
import { resolveImageUrl } from '../../../config/env';

// No fallback slides - all must come from CMS
const fallbackSlides: Slide[] = [];

interface Slide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  link: string | null;
  videoId?: string;
  buttonText?: string;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get home page
        const homePage = await pagesService.getBySlug('home');
        if (!homePage || !homePage.id) {
          throw new Error('Home page not found');
        }

        // Fetch hero slides
        const apiSlides = await heroSlidesService.getByPageId(homePage.id);

        if (apiSlides && apiSlides.length > 0) {
          // Filter active slides and sort by orderIndex
          const activeSlides = apiSlides
            .filter((slide: any) => slide.isActive !== false)
            .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

          // Transform API slides to match component format
          const transformedSlides: Slide[] = activeSlides.map((slide: any) => {
            let imagePath = '';

            // Debug logging
            console.log('Processing slide:', {
              id: slide.id,
              title: slide.title,
              backgroundImage: slide.backgroundImage,
              backgroundImageId: slide.backgroundImageId
            });

            // 1) If backgroundImage is a related Media object
            if (slide.backgroundImage?.filePath) {
              imagePath = slide.backgroundImage.filePath;
              console.log('Found image from backgroundImage.filePath:', imagePath);
            } else if (slide.backgroundImage?.url) {
              imagePath = slide.backgroundImage.url;
              console.log('Found image from backgroundImage.url:', imagePath);
            }

            // 2) If background image is stored directly as a string path on the entity
            if (!imagePath && typeof slide.backgroundImage === 'string' && slide.backgroundImage.trim()) {
              imagePath = slide.backgroundImage.trim();
              console.log('Found image from backgroundImage string:', imagePath);
            }

            // Use resolveImageUrl helper to properly resolve the image path
            const resolvedImage = resolveImageUrl(imagePath);
            console.log('Resolved image for slide', slide.id, ':', resolvedImage, '(from:', imagePath, ')');

            return {
              id: slide.id,
              image: resolvedImage, // No fallback - must come from CMS
              subtitle: slide.subtitle || '',
              title: slide.title || '',
              description: slide.description || '',
              link: (slide.buttonLink && slide.buttonLink.trim()) ? slide.buttonLink : null,
              buttonText: slide.buttonText || 'Know More',
              videoId: slide.videoId || undefined
            };
          });

          // Filter out slides without valid images (must be http/https URL)
          const validSlides = transformedSlides.filter(s => {
            if (!s.image) {
              console.warn('Slide filtered out - no image:', s.id);
              return false;
            }
            const isValid = s.image.startsWith('http://') || s.image.startsWith('https://');
            if (!isValid) {
              console.warn('Slide filtered out - invalid image URL (not http/https):', s.id, s.image);
            }
            return isValid;
          });
          
          console.log('Valid slides after filtering:', validSlides.length, 'out of', transformedSlides.length);
          console.log('Valid slide images:', validSlides.map(s => ({ id: s.id, image: s.image })));
          
          if (validSlides.length > 0) {
            setSlides(validSlides);
          } else {
            console.warn('No valid slides found - showing empty state');
            setSlides([]);
          }
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setError('Failed to load hero slides');
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const scrollToBusinessSection = () => {
    const businessSection = document.getElementById('our-businesses');
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden pt-40 bg-gray-200 animate-pulse" style={{ height: '77vh' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Ensure we have slides to display
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full overflow-hidden pt-40 bg-gray-100" style={{ height: '77vh' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">No slides available</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full overflow-hidden pt-20 sm:pt-32 md:pt-40" style={{ minHeight: '70vh', height: 'auto' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            style={{ minHeight: '70vh' }}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            <div className="relative min-h-[70vh] flex items-center py-12 sm:py-16 md:py-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left: Text Content */}
                  <div className="text-white space-y-4 sm:space-y-6 z-10">
                    <p className="text-[0.7rem] sm:text-xs font-semibold tracking-widest uppercase text-[#7DC144]">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.125rem] font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base lg:text-base leading-relaxed text-gray-200">
                      {slide.description}
                    </p>
                    {slide.link && (
                      <Link
                        to={slide.link}
                        className="inline-block mt-4 sm:mt-6 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[#7DC144] hover:bg-[#6ba838] text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-300 cursor-pointer"
                      >
                        {slide.buttonText || 'Know More'}
                      </Link>
                    )}
                  </div>

                  {/* Right: Floating Video Card (Desktop only - hidden on mobile) */}
                  <div className="hidden lg:flex justify-end items-center">
                    <div className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm p-6 animate-float">
                      {/* Play Button - Top Left */}
                      <button
                        onClick={openVideoModal}
                        className="absolute top-6 left-6 w-14 h-14 bg-[#7DC144] rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10 hover:bg-[#6ba838] hover:scale-110 hover:shadow-2xl"
                        aria-label="Play video"
                      >
                        <i className="ri-play-fill text-white text-2xl ml-1"></i>
                      </button>

                      {/* Content Inside Card */}
                      <div className="pt-20 text-white space-y-3">
                        <h3 className="text-2xl font-bold leading-tight">
                          Celebrating<br />
                          <span className="text-[#7DC144]">23 years of Excellence</span>
                        </h3>
                        <p className="text-xs leading-relaxed text-gray-300">
                          Refex's journey of excellence began over two decades ago, built on a foundation of learning, resilience, and agility. From Refrigerant Gases to Ash Utilization & Coal Handling, Renewables, MedTech, Mobility, and Pharmaceuticals, we've continually expanded our horizons.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls - Mobile: Bottom center, Desktop: Left/Right sides */}
        {slides.length > 1 && (
          <>
            {/* Previous Button - Mobile: Bottom left, Desktop: Left side */}
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-4 md:left-6 bottom-20 sm:bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-white bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 active:bg-black/80 transition-all duration-300 cursor-pointer border border-white/30 shadow-lg z-30 group touch-manipulation"
              aria-label="Previous slide"
            >
              <i className="ri-arrow-left-s-line text-xl sm:text-2xl md:text-3xl group-active:scale-90 transition-transform duration-300"></i>
            </button>
            
            {/* Next Button - Mobile: Bottom right, Desktop: Right side */}
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-4 md:right-6 bottom-20 sm:bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-white bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 active:bg-black/80 transition-all duration-300 cursor-pointer border border-white/30 shadow-lg z-30 group touch-manipulation"
              aria-label="Next slide"
            >
              <i className="ri-arrow-right-s-line text-xl sm:text-2xl md:text-3xl group-active:scale-90 transition-transform duration-300"></i>
            </button>
          </>
        )}

        {/* Mouse Scroll Icon - Mobile: Hidden, Desktop: Bottom center */}
        <button
          onClick={scrollToBusinessSection}
          className="hidden md:flex absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 items-center justify-center z-20 cursor-pointer group"
          aria-label="Scroll to Our Businesses section"
        >
          <div className="w-5 h-9 border-2 border-white rounded-full flex items-start justify-center p-1.5 group-hover:border-white/80 transition-colors duration-300">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce group-hover:bg-white/80" style={{ animationDuration: '1.5s' }}></div>
          </div>
        </button>
      </div>

      {/* Mobile: Video Card Below Hero Section */}
      <div className="lg:hidden w-full py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl w-full p-5 sm:p-6">
            {/* Play Button - Top Left */}
            <button
              onClick={openVideoModal}
              className="absolute top-5 sm:top-6 left-5 sm:left-6 w-12 h-12 sm:w-14 sm:h-14 bg-[#7DC144] rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer z-10 hover:bg-[#6ba838] active:scale-95 touch-manipulation"
              aria-label="Play video"
            >
              <i className="ri-play-fill text-white text-xl sm:text-2xl ml-1"></i>
            </button>

            {/* Content Inside Card */}
            <div className="pt-16 sm:pt-20 text-white space-y-3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                Celebrating<br />
                <span className="text-[#7DC144]">23 years of Excellence</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                Refex's journey of excellence began over two decades ago, built on a foundation of learning, resilience, and agility. From Refrigerant Gases to Ash Utilization & Coal Handling, Renewables, MedTech, Mobility, and Pharmaceuticals, we've continually expanded our horizons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full aspect-video"
            style={{ maxWidth: '42rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-lg cursor-pointer z-10"
              aria-label="Close video"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            {slides[0]?.videoId && (
              <iframe
                className="w-full h-full rounded-2xl"
                src={`https://www.youtube.com/embed/${slides[0].videoId}?autoplay=1`}
                title="Refex Group Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </>
  );
}
