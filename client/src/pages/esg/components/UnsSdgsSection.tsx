import { useEffect, useRef, useState } from 'react';

interface SDGCard {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  bgColor: string;
  banner: string;
  badge: string;
  actionIconColor?: string;
  order?: number;
  isActive?: boolean;
  // Gradient overlay properties
  gradientColor?: string;
  gradientStartPosition?: number;
  gradientEndPosition?: number;
  gradientDirection?: number;
}

import ESGBanner2 from '../../../wp-content/uploads/2023/02/ESG-Images-2.jpg';
import ESGBanner6 from '../../../wp-content/uploads/2023/02/ESG-Images-6-e1677562505898.jpg';
import ESGBanner1 from '../../../wp-content/uploads/2023/02/ESG-Images-1-e1677562642274.jpg';
import ESGBanner7 from '../../../wp-content/uploads/2023/02/ESG-Images-7.jpg';
import ESGBanner5 from '../../../wp-content/uploads/2023/02/ESG-Images-5.jpg';
import ESGBanner8 from '../../../wp-content/uploads/2023/02/ESG-Images-8.jpg';
import ESGBanner4 from '../../../wp-content/uploads/2023/02/ESG-Images-4.jpg';
import ESGBanner3 from '../../../wp-content/uploads/2023/02/ESG-Images-3.jpg';

import HealthBadge from '../../../wp-content/uploads/2023/02/Good-Health-and-Well-being-1024x1024.png';
import EducationBadge from '../../../wp-content/uploads/2023/02/Quality-Education-1024x1024.png';
import WaterBadge from '../../../wp-content/uploads/2023/02/Clean-water-and-Sanitation.png-1024x1024.png';
import ClimateBadge from '../../../wp-content/uploads/2023/02/Climate-Action-1024x1024.png';
import EnergyBadge from '../../../wp-content/uploads/2023/02/Affordable-and-Clean-Energy-Climate-Action-1024x1024.png';
import ConsumptionBadge from '../../../wp-content/uploads/2023/02/Responsible-Consumption-and-Prod-1024x1024.png';
import LifeBadge from '../../../wp-content/uploads/2023/02/Life-on-land-1024x1024.png';
import PartnershipBadge from '../../../wp-content/uploads/2023/02/Partnership-for-the-Goals-1024x1024.png';
import { getApiBaseUrl } from '../../../config/env';

interface UnsSdgsSectionData {
  heading: string;
  description: string;
  cards: SDGCard[];
}

// Hardcoded SDG Data
const SDG_DATA: UnsSdgsSectionData = {
  heading: 'UN SDGs and our Actions',
  description: "As a member of the UNGC, we're excited to join hands with other partners to achieve its ten principles and contribute towards the UN's Sustainable Development Goals. Some of our aligned SDGs and actions include…",
  cards: [
    {
      id: 1,
      title: 'GOOD HEALTH AND WELL-BEING',
      subtitle: 'Our Action',
      description: '3i MedTech, a Refex group company, revolutionizes India\'s medical diagnostic industry with sustainable and affordable products. Our portable Dual-energy X-ray detector ensures accurate screening.',
      bgColor: '#4c9f38',
      banner: ESGBanner2,
      badge: HealthBadge,
      actionIconColor: '#8CE28A',
      order: 1,
      isActive: true,
    },
    {
      id: 2,
      title: 'QUALITY EDUCATION',
      subtitle: 'Our Action',
      description: 'Empowering young minds! We collaborate with local government schools to provide computer literacy programs for high school students, preparing them for a brighter future. #EducationForAll #Empowerment',
      bgColor: '#39965E',
      banner: ESGBanner6,
      badge: EducationBadge,
      actionIconColor: '#8CE28A',
      order: 2,
      isActive: true,
    },
    {
      id: 3,
      title: 'CLEAN WATER & SANITATION',
      subtitle: 'Our Action',
      description: '#NirmalJal mission is bringing safe drinking water to the Chengalpattu community in Tamil Nadu. Join us in promoting clean water and sanitation for all. #CleanWaterForAll #SanitationForAll',
      bgColor: '#2C496F',
      banner: ESGBanner1,
      badge: WaterBadge,
      actionIconColor: '#8CE28A',
      order: 3,
      isActive: true,
    },
    {
      id: 4,
      title: 'CLIMATE ACTION',
      subtitle: 'Our Action',
      description: 'We take pride in being eco-warriors! at Refex, By offering top-notch coal and ash handling services to thermal power plants, we are actively reducing the impact of climate change. We\'ve established a robust business network that maximizes the utilization and recycling of fly ash in an environment-friendly way. This is our way of contributing towards a more sustainable future, and we are committed to continuing this work.',
      bgColor: '#4a5d23',
      banner: ESGBanner7,
      badge: ClimateBadge,
      actionIconColor: '#8CE28A',
      order: 4,
      isActive: true,
    },
    {
      id: 5,
      title: 'AFFORDABLE & CLEAN ENERGY',
      subtitle: 'Our Action',
      description: 'At RRIL, our renewable energy business is revolutionizing the industry with affordable solar power solutions for private and government agencies. We\'re proud to be a trusted partner of the Indian Railways in their energy transition mission and even have our solar footprint at the highest peak of the Himalayas. #ClimateAction #CleanEnergy',
      bgColor: '#4c9f38',
      banner: ESGBanner5,
      badge: EnergyBadge,
      actionIconColor: '#8CE28A',
      order: 5,
      isActive: true,
    },
    {
      id: 6,
      title: 'RESPONSIBLE CONSUMPTION & PRODUCTION',
      subtitle: 'Our Action',
      description: 'Refex\'s coal and ash handling business embodies responsible consumption and production. By promoting eco-friendly disposal and management, we ensure circularity and reduce emissions. Through partnerships in the cement, brick, and block industries and with local governments.',
      bgColor: '#19486a',
      banner: ESGBanner8,
      badge: ConsumptionBadge,
      actionIconColor: '#8CE28A',
      order: 6,
      isActive: true,
    },
    {
      id: 7,
      title: 'LIFE ON LAND',
      subtitle: 'Our Action',
      description: 'Refex\'s initiatives create a better life on land!! "Plant for Future" will see 1,00,000 trees planted, while our coal and ash handling business rehabilitates abandoned mines. And we are supporting sustainable agriculture by offering land to local farmers for free. Let\'s make a better world together!',
      bgColor: '#bf8b2e',
      banner: ESGBanner4,
      badge: LifeBadge,
      actionIconColor: '#8CE28A',
      order: 7,
      isActive: true,
    },
    {
      id: 8,
      title: 'PARTNERSHIPS FOR THE GOALS',
      subtitle: 'Our Action',
      description: 'Refex is proud to be part of the United Nations Global Compact (UNGC)! By joining forces with other partners, we\'re committed to ethical business practices and addressing the most pressing social and environmental issues. We\'ve built a strong network of partners in the cement, brick, and block industries, as well as with abandoned mine owners, local governments, concrete producers, and road contractors, to promote the eco-friendly utilization and recycling of fly ash. Let\'s make a difference together!',
      bgColor: '#19486a',
      banner: ESGBanner3,
      badge: PartnershipBadge,
      actionIconColor: '#8CE28A',
      order: 8,
      isActive: true,
    },
  ],
};

// Scroll Reveal Hook
const useScrollReveal = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return { ref, isVisible };
};

// SDG Card Component
const ESGCard = ({
  card,
  index,
}: {
  card: SDGCard;
  index: number;
}) => {
  const { ref, isVisible } = useScrollReveal(index * 100);

  // Determine background style - consistent for all cards
  const getBackgroundStyle = () => {
    return { backgroundColor: card.bgColor };
  };

  // Determine gradient overlay - use custom gradient if provided, otherwise use default
  const getGradientStyle = () => {
    // If custom gradient is provided from CMS
    if (card.gradientColor) {
      const direction = card.gradientDirection || 270;
      const startPos = card.gradientStartPosition || 64;
      const endPos = card.gradientEndPosition || 100;
      
      // Convert direction to CSS gradient direction
      // 270deg = left to right (to right)
      // 0deg = top to bottom (to bottom)
      // 90deg = right to left (to left)
      // 180deg = bottom to top (to top)
      let gradientDirection = '';
      if (direction === 270) {
        gradientDirection = 'to right';
      } else if (direction === 0) {
        gradientDirection = 'to bottom';
      } else if (direction === 90) {
        gradientDirection = 'to left';
      } else if (direction === 180) {
        gradientDirection = 'to top';
      } else {
        // Use degrees for custom angles
        gradientDirection = `${direction}deg`;
      }
      
      return {
        background: `linear-gradient(${gradientDirection}, transparent 0%, transparent ${startPos - 1}%, ${card.gradientColor} ${startPos}%, transparent ${endPos}%)`,
      };
    }
    
    // Default gradient using background color
    const gradientColor = card.bgColor;
    return {
      background: `linear-gradient(to right, transparent 0%, transparent 60%, ${gradientColor}40 80%, ${gradientColor}80 95%, ${gradientColor} 100%)`,
    };
  };

  return (
    <div
      ref={ref}
      className={`w-full flex flex-col md:flex-row rounded-[20px] overflow-hidden md:overflow-visible shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={getBackgroundStyle()}
    >
      {/* Left Image Section - 32% width */}
      <div className="w-full md:w-[32%] h-[240px] md:h-[265px] lg:h-[318px] relative rounded-tl-[20px] rounded-tr-[20px] md:rounded-tr-none md:rounded-br-none md:rounded-bl-[20px] overflow-visible">
        <div className="w-full h-full overflow-hidden rounded-tl-[20px] rounded-tr-[20px] md:rounded-tr-none md:rounded-br-none md:rounded-bl-[20px] relative">
          {/* Main Image */}
          <img
            src={card.banner}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-500"
            style={getGradientStyle()}
          />
        </div>

        {/* SDG Icon - Positioned at bottom center, overlapping image edge and extending below */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] md:translate-y-[20%] pointer-events-none z-20">
          <img
            src={card.badge}
            alt="SDG Icon"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Right Content Section - 68% width */}
      <div
        className="w-full md:w-[68%] min-h-[auto] md:h-[265px] lg:h-[318px] text-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-start md:justify-center rounded-bl-[20px] rounded-br-[20px] md:rounded-tl-none md:rounded-bl-none md:rounded-tr-[20px] md:rounded-br-[20px] pt-8 md:pt-8"
        style={getBackgroundStyle()}
      >
        {/* Title - Ensure it's always visible with proper spacing from image/badge */}
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase leading-tight tracking-wide group-hover:text-white/95 transition-colors duration-300 mb-3 md:mb-0">
          {card.title}
        </h2>

        {/* Subtitle with Icon */}
        {card.subtitle && (
          <p className="mt-2 md:mt-5 text-sm md:text-base lg:text-lg font-semibold flex items-center gap-2">
            <i
              className="ri-rocket-line text-base md:text-lg lg:text-xl group-hover:scale-110 transition-transform duration-300"
              style={{ color: card.actionIconColor || '#8CE28A' }}
            ></i>
            <span>{card.subtitle}</span>
          </p>
        )}

        {/* Description - Allow it to grow and wrap properly */}
        <p className="mt-3 md:mt-5 text-sm md:text-base leading-relaxed text-white/90 group-hover:text-white transition-colors duration-300 break-words">
          {card.description}
        </p>
      </div>
    </div>
  );
};

// Main Section Component
const UnsSdgsSection = ({ sdgCards = [] }: { sdgCards?: any[] }) => {
  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    if (typeof imageData === 'string' && imageData.trim()) {
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      return imageData;
    }

    if (imageData.filePath) {
      if (imageData.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData.filePath}`;
      }
      return imageData.filePath;
    }

    if (imageData.url) {
      return imageData.url;
    }

    return '';
  };

  // Transform CMS cards to match component format
  const transformSDGCards = (cards: any[]): SDGCard[] => {
    return cards.map((card: any) => {
      // Get banner image - check banner relationship first, then fallback to bannerId/imageId
      const bannerData = card.banner || card.bannerId || card.image || card.imageId;
      const bannerPath = getImagePath(bannerData);
      
      // Get icon/badge - check icon relationship first, then fallback to iconId
      const iconData = card.icon || card.iconId || card.badge;
      const iconPath = getImagePath(iconData);
      
      return {
        id: card.id || card.sdgNumber,
        title: card.title || '',
        subtitle: card.subtitle || card.contribution || 'Our Action',
        description: card.description || '',
        bgColor: card.color || card.bgColor || '#4c9f38',
        banner: bannerPath,
        badge: iconPath,
        actionIconColor: card.actionIconColor || '#8CE28A',
        order: card.orderIndex || card.order || 0,
        isActive: card.isActive !== false,
        // Gradient overlay properties from CMS
        gradientColor: card.gradientColor || undefined,
        gradientStartPosition: card.gradientStartPosition || undefined,
        gradientEndPosition: card.gradientEndPosition || undefined,
        gradientDirection: card.gradientDirection || undefined
      };
    });
  };

  const cmsCards = sdgCards.length > 0 ? transformSDGCards(sdgCards) : [];
  const fallbackCards = SDG_DATA.cards.filter((card) => card.isActive !== false);
  const activeCards = cmsCards.length > 0 ? cmsCards : fallbackCards;

  const heading = sdgCards.length > 0 ? 'UN SDGs and our Actions' : SDG_DATA.heading;
  const description = sdgCards.length > 0 ? "As a member of the UNGC, we're excited to join hands with other partners to achieve its ten principles and contribute towards the UN's Sustainable Development Goals. Some of our aligned SDGs and actions include…" : SDG_DATA.description;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold tracking-tight text-[#1F2120]">
            {heading}
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#777C7C] max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Cards Container - Vertical Stack */}
        <div className="space-y-12 md:space-y-16">
          {activeCards.map((card, index) => (
            <ESGCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnsSdgsSection;

