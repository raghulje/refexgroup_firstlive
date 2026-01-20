import { useEffect, useRef } from 'react';

// Import SVG icons
import AffordableIcon from '../../svg/3imedtech/affordable.svg?react';
import ComprehensiveIcon from '../../svg/3imedtech/comprehensive.svg?react';
import UnwaveredIcon from '../../svg/3imedtech/unwavered.svg?react';
import { getApiBaseUrl } from '../../../config/env';

interface CommitmentSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const CommitmentSection = ({ sectionData, getImagePath, getSectionContent }: CommitmentSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackBadge = 'our commitment';
  const fallbackTitle = 'Redefining Healthcare Through Innovation';
  const fallbackCommitments = [
    {
      icon: AffordableIcon,
      title: 'Affordable Diagnostic Excellence',
      description: 'Delivering world-class medical technology at accessible prices'
    },
    {
      icon: ComprehensiveIcon,
      title: 'Comprehensive Imaging Solutions',
      description: 'Providing end-to-end solutions for optimal patient care'
    },
    {
      icon: UnwaveredIcon,
      title: 'Unwavering Service Support',
      description: 'Committed to customer satisfaction through exceptional service'
    }
  ];

  // Get CMS values
  const badge = getSectionContent?.(sectionData, 'badge') || fallbackBadge;
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const commitmentsData = getSectionContent?.(sectionData, 'commitments');
  const commitments = Array.isArray(commitmentsData) ? commitmentsData : (commitmentsData ? JSON.parse(commitmentsData) : fallbackCommitments);

  const iconMap: any = {
    'Affordable Diagnostic Excellence': AffordableIcon,
    'Comprehensive Imaging Solutions': ComprehensiveIcon,
    'Unwavering Service Support': UnwaveredIcon,
  };

  return (
    <div ref={sectionRef} className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12">
          <p
            className="text-[#4a90a4] text-sm font-semibold uppercase tracking-wider mb-2"
            data-aos="fade-in"
          >
            {badge}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-800"
            data-aos="fade-up"
          >
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {commitments.map((item: any, index: number) => {
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
              return '';
            };

            const renderIcon = () => {
              const iconValue = item.icon;

              // Handle URL/Image path string
              if (iconValue && typeof iconValue === 'string' && (iconValue.startsWith('/') || iconValue.startsWith('http'))) {
                const iconSrc = getImage(iconValue);
                if (!iconSrc || iconSrc.trim() === '') {
                  // If no valid image, use fallback SVG component
                  const IconComponent = iconMap[item.title] || AffordableIcon;
                  return <IconComponent className="w-10 h-10 text-white" />;
                }
                return (
                  <img
                    src={iconSrc}
                    alt={item.title}
                    className="w-10 h-10 object-contain invert brightness-0"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    onError={(e) => {
                      // Hide image on error and use fallback
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                );
              }

              // Handle Remix Icon class
              if (iconValue && typeof iconValue === 'string' && iconValue.startsWith('ri-')) {
                return <i className={`${iconValue} text-4xl text-white`} />;
              }

              // Handle SVG Component (Fallback)
              // Only use iconValue if it's a valid React component (function)
              let IconComponent: any = AffordableIcon;
              
              // Check if iconValue is a valid React component (must be a function)
              if (iconValue && typeof iconValue === 'function') {
                IconComponent = iconValue;
              } else if (iconMap[item.title] && typeof iconMap[item.title] === 'function') {
                IconComponent = iconMap[item.title];
              }
              
              // Ensure we always have a valid component
              if (!IconComponent || typeof IconComponent !== 'function') {
                IconComponent = AffordableIcon;
              }
              
              return <IconComponent className="w-10 h-10 text-white" />;
            };

            return (
              <div
                key={index}
                className="flex items-start space-x-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-[#2879B6] rounded-full flex items-center justify-center overflow-hidden">
                  {renderIcon()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommitmentSection;
