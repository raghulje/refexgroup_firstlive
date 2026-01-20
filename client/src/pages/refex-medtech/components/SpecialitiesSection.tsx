import { useEffect, useRef } from 'react';

import OurSpecialities from '../../../wp-content/uploads/2025/04/our-specialities.avif';

// Import SVG icons
import Radiology from '../../svg/3imedtech/radiology.svg?react';
import Urology from '../../svg/3imedtech/urology.svg?react';
import Neurology from '../../svg/3imedtech/neurology.svg?react';
import Orthopedic from '../../svg/3imedtech/orthopedic.svg?react';
import Gastro from '../../svg/3imedtech/gastro.svg?react';
import { getApiBaseUrl } from '../../../config/env';

interface SpecialitiesSectionProps {
  sectionData?: any;
  specialities?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const SpecialitiesSection = ({ sectionData, specialities = [], getImagePath, getSectionContent }: SpecialitiesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackBadge = 'OUR SPECIALITIES';
  const fallbackDescription = 'Our expertise spans across various healthcare consulting services, providing medical professionals with innovative solutions for precision, efficiency, and reliability.';
  const fallbackImage = OurSpecialities;
  const fallbackSpecialities = [
    { name: 'Radiology', icon: Radiology },
    { name: 'Urology', icon: Urology },
    { name: 'Neurology', icon: Neurology },
    { name: 'Orthopedic', icon: Orthopedic },
    { name: 'Gastroenterology', icon: Gastro }
  ];

  // Get CMS values
  const badge = getSectionContent?.(sectionData, 'badge') || fallbackBadge;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const imageData = getSectionContent?.(sectionData, 'image');
  const imagePath = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null);
  const image = imagePath && imagePath.trim() !== '' ? imagePath : fallbackImage;
  const specialitiesToShow = specialities.length > 0 ? specialities : fallbackSpecialities;

  const iconMap: any = {
    'Radiology': Radiology,
    'Urology': Urology,
    'Neurology': Neurology,
    'Orthopedic': Orthopedic,
    'Gastroenterology': Gastro
  };

  return (
    <div ref={sectionRef} className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
          {/* Left Section - Information Panel */}
          <div className="space-y-8 bg-white lg:bg-transparent p-6 lg:p-0 rounded-lg lg:rounded-none">
            <div>
              <h2
                className="text-[#4a90a4] text-lg lg:text-xl font-bold uppercase tracking-wide mb-4"
                data-aos="fade-in"
              >
                {badge}
              </h2>
              <p
                className="text-black text-base leading-relaxed mb-8"
                data-aos="fade-up"
              >
                {description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Helper to render icons */}
              {(() => {
                const renderIcon = (item: any) => {
                  const getImage = (img: any): string => {
                    if (typeof img === 'string') {
                      if (img.startsWith('/assets/')) {
                        return '';
                      }
                      if (img.startsWith('/uploads/')) {
                        const apiBase = getApiBaseUrl();
                        return `${apiBase}${img}`;
                      }
                      if (img.trim() !== '') {
                        return img;
                      }
                      return '';
                    }
                    if (img?.path) {
                      const path = getImagePath ? getImagePath(img) : img.path;
                      if (path && path.trim() !== '' && !path.startsWith('/assets/')) {
                        return path;
                      }
                    }
                    return '';
                  };

                  const iconValue = item.icon;
                  // 1. Handle URL/Image Path
                  if (iconValue && typeof iconValue === 'string' && (iconValue.startsWith('/') || iconValue.startsWith('http'))) {
                    const iconSrc = getImage(iconValue);
                    if (!iconSrc || iconSrc.trim() === '') {
                      return null;
                    }
                    return (
                      <img
                        src={iconSrc}
                        alt={item.name}
                        className="w-10 h-10 lg:w-14 lg:h-14 object-contain"
                        style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(13%) saturate(1478%) hue-rotate(152deg) brightness(96%) contrast(86%)' }}
                      />
                    );
                  }

                  // 2. Handle Remix Icon Class
                  if (iconValue && typeof iconValue === 'string' && iconValue.startsWith('ri-')) {
                    return <i className={`${iconValue} text-3xl lg:text-4xl text-[#4a90a4]`} />;
                  }

                  // 3. Fallback SVG Component
                  const IconComponent = iconValue || iconMap[item.name] || Radiology;
                  return <IconComponent className="w-10 h-10 lg:w-14 lg:h-14" />;
                };

                return (
                  <>
                    {/* Mobile: Vertical Stacked Cards with Centered Icons */}
                    <div className="lg:hidden space-y-4">
                      {specialitiesToShow.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center gap-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          <div className="w-16 h-16 flex items-center justify-center">
                            {renderIcon(item)}
                          </div>
                          <h3 className="text-base font-semibold text-gray-800 text-center">{item.name}</h3>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: 2-Column Grid with Icons on Left */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                      {specialitiesToShow.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={`bg-white rounded-lg border border-gray-200 p-4 lg:p-6 flex flex-row items-center gap-4 hover:shadow-md transition-shadow duration-300 cursor-pointer ${index === 4 ? 'col-span-2' : ''
                            }`}
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
                            {renderIcon(item)}
                          </div>
                          <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Right Section - Medical Imaging Room Photo */}
          <div className="hidden lg:flex justify-center lg:justify-end relative z-10">
            <div className="w-full lg:w-[110%] lg:-ml-8">
              {image && image.trim() !== '' ? (
                <img
                  src={image}
                  alt="Medical Imaging Room"
                  className="w-full rounded-2xl lg:rounded-3xl shadow-xl object-cover"
                  style={{ minHeight: '500px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
              ) : (
                <img
                  src={fallbackImage}
                  alt="Medical Imaging Room"
                  className="w-full rounded-2xl lg:rounded-3xl shadow-xl object-cover"
                  style={{ minHeight: '500px' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialitiesSection;
