import { useEffect, useState, useRef } from 'react';
import HeroBg from '../../../wp-content/uploads/2024/01/Hero-section-BG.jpg';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">
      {count}{suffix}
    </div>
  );
}

interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function HeroSection({ sectionData, getImagePath, getSectionContent }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  // Fallback values
  const fallbackTitle = 'A Global API Partner from Refex';
  const fallbackDescription = 'A leading pharmaceutical platform with 40+ years of API excellence, global partnerships in advanced intermediates, and CRDMO expertise in speciality formulations and antibiotics.';
  const fallbackStats = [
    { value: 550, suffix: '+', label: 'Customers' },
    { value: 100, suffix: '+', label: 'Innovative Products' },
    { value: 80, suffix: '+', label: 'Countries' }
  ];
  const fallbackBgImage = HeroBg;

  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || '';
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const statsData = getSectionContent?.(sectionData, 'stats');
  const stats = Array.isArray(statsData) ? statsData : (statsData ? JSON.parse(statsData) : fallbackStats);
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden min-h-[400px] sm:min-h-[450px] md:h-[508px] flex items-center pt-28 sm:pt-32 lg:pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          alt="Hero Background"
          className="w-full h-full object-cover object-top"
          src={backgroundImage}
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackBgImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#50b848]/40 via-[#3d7c5f]/50 to-[#1a1a1a]/60"></div>
      </div>

      <div className="max-w-[1156.67px] mx-auto w-full relative z-10 px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content - Text */}
          <div className="text-white space-y-4 lg:space-y-6">
            {tagline && (
              <p className="text-base sm:text-[18px] font-medium tracking-wide" data-aos="fade-up" data-aos-duration="1000">
                {tagline}
              </p>
            )}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {title}
            </h1>
            <p
              className="text-sm sm:text-base lg:text-base leading-relaxed text-gray-200"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              {description}
            </p>
          </div>

          {/* Right Content - Stats */}
          {/* Mobile: Horizontal Grid Layout */}
          <div className="lg:hidden">
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat: any, index: number) => (
                <div 
                  key={index} 
                  className="text-center"
                  data-aos="fade-up" 
                  data-aos-delay={300 + index * 100}
                >
                  <Counter end={stat.value || 0} suffix={stat.suffix || ''} />
                  <div className="text-white/90 text-xs sm:text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Vertical Stacked Layout */}
          <div className="hidden lg:block space-y-8 text-right lg:pl-12">
            {stats.map((stat: any, index: number) => (
              <div key={index} data-aos="fade-left" data-aos-delay={400 + index * 200}>
                <Counter end={stat.value || 0} suffix={stat.suffix || ''} />
                <div className="text-white/90 text-sm lg:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
