import { useEffect, useRef, useState } from 'react';
import DiversityBgWomenFace from '../../../wp-content/uploads/2023/02/Diversity-Bg-Women-Face.png';
import VamikaLogo from '../../../wp-content/uploads/2023/02/Vamika-Logo.png';
import KravMagaLogo from '../../../wp-content/uploads/2023/02/Kravamaga.png';

import Vamika1 from '../../../wp-content/uploads/2023/02/Vamika-Wellness-REFEX-1.jpg';
import Vamika2 from '../../../wp-content/uploads/2023/02/Vamika-Wellness-REFEX-2.jpg';
import Vamika3 from '../../../wp-content/uploads/2023/02/Vamika-Wellness-REFEX-3.jpg';
import Vamika4 from '../../../wp-content/uploads/2023/02/Vamika-Wellness-REFEX-4.jpg';

import KravMaga1 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-1.jpg';
import KravMaga2 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-2.jpg';
import KravMaga4 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-4.jpg';
import KravMaga6 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-6.jpg';
import KravMaga7 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-7.jpg';
import KravMaga10 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-10.jpg';
import KravMaga11 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-11.jpg';
import KravMaga12 from '../../../wp-content/uploads/2023/02/Krav-Maga-REFEX-12.jpg';
import { getApiBaseUrl } from '../../../config/env';

interface InitiativesSectionProps {
  sectionData?: any;
  initiatives?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const fallbackVamikaImages = [Vamika1, Vamika2, Vamika3, Vamika4];
const fallbackKravMagaImages = [KravMaga1, KravMaga2, KravMaga4, KravMaga6, KravMaga7, KravMaga10, KravMaga11, KravMaga12];
const fallbackMainSlideImages = [Vamika3, KravMaga2, KravMaga12, Vamika4, KravMaga11];

// Fallback initiatives for backward compatibility
const fallbackInitiatives = [
  {
    name: 'Vamika',
    logo: VamikaLogo,
    description: 'Refex has created an internal networking forum called \'Vamika\' that prioritizes the career, physical, and mental wellness support of women. The initiative emphasizes the well-being of women and aims to promote their health.',
    images: fallbackVamikaImages,
    coverImage: Vamika1,
    orderIndex: 0
  },
  {
    name: 'Krav Maga',
    logo: KravMagaLogo,
    description: 'Refex has taken a proactive step towards addressing women\'s safety by organizing a self-defense workshop called \'Krav Maga.\' The workshop, which was available to all women, aimed to equip them with the necessary skills to protect themselves.',
    images: fallbackKravMagaImages,
    coverImage: KravMaga1,
    orderIndex: 1
  }
];

export default function InitiativesSection({ sectionData, initiatives = {}, getImagePath, getSectionContent }: InitiativesSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Initiatives\nat Refex Group';
  const fallbackDescription = 'We are dedicated to creating a positive impact on the lives of our employees, customers, and the communities we serve, and will continue to strive towards this goal.';

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const sliderImages = initiatives.sliderImages || fallbackMainSlideImages;
  
  // Parse initiatives array - support both old format (vamika/kravMaga) and new format (initiatives array)
  let initiativesList: any[] = [];
  if (initiatives.initiatives && Array.isArray(initiatives.initiatives)) {
    // New format: array of initiatives
    initiativesList = initiatives.initiatives;
  } else if (initiatives.vamika || initiatives.kravMaga) {
    // Old format: convert to array
    if (initiatives.vamika) {
      initiativesList.push({
        name: 'Vamika',
        ...initiatives.vamika,
        orderIndex: 0
      });
    }
    if (initiatives.kravMaga) {
      initiativesList.push({
        name: 'Krav Maga',
        ...initiatives.kravMaga,
        orderIndex: 1
      });
    }
  }
  
  // If no initiatives from CMS, use fallback
  if (initiativesList.length === 0) {
    initiativesList = fallbackInitiatives;
  }
  
  // Sort by orderIndex
  initiativesList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  // Helper to get image path
  const getImage = (img: any): string => {
    if (typeof img === 'string') {
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      return img;
    }
    if (img?.path) {
      return getImagePath ? getImagePath(img) : img.path;
    }
    if (img?.filePath) {
      if (img.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img.filePath}`;
      }
      return img.filePath;
    }
    return '';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [sliderImages]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div ref={sectionRef} className="bg-[#f5f5f5] relative overflow-hidden">
      {/* Header Section with Decorative PNG */}
      <div className="py-16 md:py-20 bg-white relative z-10">
        {/* Decorative PNG Image on Left Corner - moved to header section */}
        <div className="absolute left-0 top-0 w-72 md:w-96 lg:w-[500px] h-full pointer-events-none z-0">
          <img
            src={DiversityBgWomenFace}
            alt="Diversity Background"
            className="w-full h-full object-contain object-left-top"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Title and Description */}
            <div
              className={`transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 whitespace-pre-line">
                {title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Right - Image Slider */}
            <div
              className={`relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                {sliderImages.length > 0 && (
                  <img
                    src={getImage(sliderImages[currentSlide])}
                    alt="Initiative"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (fallbackMainSlideImages[currentSlide]) {
                        (e.target as HTMLImageElement).src = fallbackMainSlideImages[currentSlide];
                      }
                    }}
                  />
                )}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer"
                  aria-label="Previous slide"
                >
                  <i className="ri-arrow-left-s-line text-xl text-gray-800"></i>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer"
                  aria-label="Next slide"
                >
                  <i className="ri-arrow-right-s-line text-xl text-gray-800"></i>
                </button>
              </div>

              {/* Thumbnail Navigation */}
              {sliderImages.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {sliderImages.slice(0, 5).map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`flex-1 aspect-[4/3] rounded overflow-hidden cursor-pointer transition-all ${currentSlide === index ? 'ring-2 ring-[#7cb342]' : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img 
                        src={getImage(img)} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (fallbackMainSlideImages[index]) {
                            (e.target as HTMLImageElement).src = fallbackMainSlideImages[index];
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Initiatives Sections */}
      {initiativesList.map((initiative, initiativeIndex) => {
        const initiativeImages = initiative.images || [];
        const fallbackImages = initiativeIndex === 0 ? fallbackVamikaImages : fallbackKravMagaImages;
        
        return (
          <div 
            key={initiativeIndex} 
            className={initiativeIndex === 0 ? "py-16 md:py-20" : "pb-16 md:pb-20"}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div
                className={`bg-white rounded-lg shadow-lg p-8 md:p-12 transition-all duration-1000 ${initiativeIndex > 0 ? 'delay-200' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
              >
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  {/* Left - Logo and Description */}
                  <div className="space-y-6">
                    <img
                      src={getImage(initiative.logo)}
                      alt={`${initiative.name} Logo`}
                      className="h-16 w-auto"
                      onError={(e) => {
                        // Fallback to hardcoded logos
                        if (initiativeIndex === 0) {
                          (e.target as HTMLImageElement).src = VamikaLogo;
                        } else {
                          (e.target as HTMLImageElement).src = KravMagaLogo;
                        }
                      }}
                    />
                    <p className="text-gray-700 leading-relaxed">
                      {initiative.description || ''}
                    </p>
                  </div>

                  {/* Right - Image Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {(initiativeImages.length > 0 ? initiativeImages : fallbackImages).map((img: any, imgIndex: number) => (
                      <div
                        key={imgIndex}
                        className="aspect-[4/3] rounded overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <img 
                          src={getImage(img)} 
                          alt={`${initiative.name} ${imgIndex + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (fallbackImages[imgIndex]) {
                              (e.target as HTMLImageElement).src = fallbackImages[imgIndex];
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
