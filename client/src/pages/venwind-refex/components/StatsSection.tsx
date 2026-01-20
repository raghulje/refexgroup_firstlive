import { useEffect, useState, useRef } from 'react';
import StatsImage from '../../../wp-content/uploads/2025/03/about-usbg-630x630-1.jpg';

interface StatCardProps {
  value: string;
  suffix: string;
  description: string;
  delay?: number;
}

interface StatsSectionProps {
  sectionData?: any;
  stats?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const StatCard = ({ value, suffix, description, delay = 0 }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const targetValue = parseFloat(value);
          const duration = 2000;
          const steps = 60;
          const increment = targetValue / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
              setCount(targetValue);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div
      ref={cardRef}
      className="space-y-3"
      data-aos="fade-left"
      data-aos-delay={delay}
    >
      <div className="text-4xl font-bold text-gray-900">
        {value.includes('.') ? count.toFixed(1) : Math.floor(count)}
        <span className="text-gray-900">{suffix}</span>
      </div>
      <h3 className="text-xs text-gray-600 leading-relaxed min-h-[60px]">
        {description}
      </h3>
    </div>
  );
};

const StatsSection = ({ sectionData, stats = [], getImagePath, getSectionContent }: StatsSectionProps) => {
  // Fallback stats
  const fallbackStats = [
    { value: '128', suffix: '+ GW', description: 'Operational Worldwide based on Vensys technology' },
    { value: '38', suffix: '+', description: 'Countries Operating globally utilizing wind turbine technology by Vensys' },
    { value: '5.3', suffix: ' MW', description: 'Permanent Magnet Generator with Medium-Speed Gearbox Hybrid Technology – Best in Class' },
    { value: '183.4', suffix: 'm', description: 'Rotor Diameter and 130m Tower Height – Capturing Optimal Wind Energy' }
  ];

  const fallbackImage = StatsImage;

  // Get CMS values
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || fallbackImage;

  const statsToShow = stats.length > 0 ? stats : fallbackStats;

  return (
    <>
      {/* Anchor for scroll */}
      <div id="explore" className="h-0"></div>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Stats Grid */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {statsToShow.slice(0, 2).map((stat: any, index: number) => (
                  <StatCard
                    key={index}
                    value={stat.value || ''}
                    suffix={stat.suffix || ''}
                    description={stat.description || ''}
                    delay={index * 100}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {statsToShow.slice(2, 4).map((stat: any, index: number) => (
                  <StatCard
                    key={index + 2}
                    value={stat.value || ''}
                    suffix={stat.suffix || ''}
                    description={stat.description || ''}
                    delay={(index + 2) * 100}
                  />
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center" data-aos="fade-in">
              <div className="w-[401.2px] h-[401.2px] rounded-full overflow-hidden shadow-2xl">
                <img
                  src={image}
                  alt="Venwind Refex Technology"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StatsSection;
