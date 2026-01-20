import { useEffect, useRef, useState } from 'react';
import DiversityHero from '../../../wp-content/uploads/2023/02/Diversity-inclusion-Page-Title_.jpg';

interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function HeroSection({ sectionData, getImagePath, getSectionContent }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Diversity & Inclusion';
  const fallbackDescription = 'Where differences are celebrated and all voices are heard, that\'s our commitment to diversity and inclusion.';
  const fallbackBgImage = DiversityHero;

  // Helper function to get background position style
  const getBackgroundPosition = (positionX?: string, positionY?: string): string => {
    const x = positionX || '50';
    const y = positionY || '50';
    return `${x}% ${y}%`;
  };

  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || '';
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;
  const bgPosition = backgroundImageData?.positionX && backgroundImageData?.positionY 
    ? getBackgroundPosition(backgroundImageData.positionX, backgroundImageData.positionY)
    : 'center';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative py-16 md:py-20 bg-cover"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: bgPosition
      }}
    >
      {/* Gradient Overlay - Standard for Diversity & Inclusion page */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(141deg, #131111C0 33%, #131111A0 63%)',
          mixBlendMode: 'normal',
          opacity: 1
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Title */}
          <div>
            {tagline && (
              <p className={`text-white/90 text-sm mb-4 tracking-wide transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {tagline}
              </p>
            )}
            <h1
              className={`text-3xl md:text-4xl font-bold text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              {title}
            </h1>
          </div>

          {/* Right Column - Description */}
          <div>
            <p
              className={`text-lg text-white/90 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
