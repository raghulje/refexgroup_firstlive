import React from 'react';

// Import SVG icons
import SustainabilityRedefinedIcon from '../../svg/mobility/Sustainability_Redefined.svg?react';
import CompleteInHouseFleetIcon from '../../svg/mobility/Complete_In_house_Fleet.svg?react';
import ExclusiveFleetIcon from '../../svg/mobility/exclusive_fleet.svg?react';
import TechBackedFleetIcon from '../../svg/mobility/tech_backed_fleet.svg?react';
import TransparentFleetIcon from '../../svg/mobility/Transparent_Fleet.svg?react';
import DedicatedHubsIcon from '../../svg/mobility/Dedicated_Hubs.svg?react';
import CentralizedCommandIcon from '../../svg/mobility/Centralized_Command.svg?react';

interface AdvantagesSectionProps {
  sectionData?: any;
  leftCards?: any[];
  rightCards?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const iconMap: any = {
  'Sustainability Redefined': SustainabilityRedefinedIcon,
  'Complete In-house Fleet': CompleteInHouseFleetIcon,
  'Exclusive Fleet Ownership': ExclusiveFleetIcon,
  'Tech-Backed Fleet Management': TechBackedFleetIcon,
  'Transparent Fleet Management': TransparentFleetIcon,
  'Dedicated Hubs & Charging Infrastructure': DedicatedHubsIcon,
  'Centralized Command Center': CentralizedCommandIcon,
};

export const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({ sectionData, leftCards = [], rightCards = [], getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackHeading = 'Why Opt for Refex\nMobility?';
  const fallbackDescription = 'At Refex Mobility, we\'re not just offering transportation solutions; we\'re inviting you to be a part of a movement that\'s reshaping the way we move. Elevate your journey with us and experience a future where sustainability meets innovation at every turn.';
  // No fallback image - must come from CMS
  const fallbackLeftCards = [
    { title: 'Sustainability Redefined', description: 'Immerse your business in a commitment to sustainability, significantly reducing your carbon footprint with our electric fleet.' },
    { title: 'Complete In-house Fleet', description: 'Trust in the reliability of our services with a 100% company-owned fleet of 1400+ cars ensuring consistency and quality in every ride.' }
  ];

  const fallbackRightCards = [
    { title: 'Exclusive Fleet Ownership', description: 'Trust in the reliability of our services with a 100% company-owned electric vehicle fleet, ensuring consistency and quality in every ride.' },
    { title: 'Tech-Backed Fleet Management', description: 'Experience transparency at every level with our technology-integrated fleet management, providing real-time insights and control to our valued clients.' },
    { title: 'Transparent Fleet Management', description: 'Experience transparency at every level with our technology-integrated fleet management, providing real-time insights and control to our valued clients.' },
  ];

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || '';
  const leftCardsToShow = leftCards.length > 0 ? leftCards : fallbackLeftCards;
  const rightCardsToShow = rightCards.length > 0 ? rightCards : fallbackRightCards;

  // Separate the last card from the rest
  const regularRightCards = rightCardsToShow.slice(0, -1);
  const lastRightCard = rightCardsToShow[rightCardsToShow.length - 1];
  const isLastCardFullWidth = rightCardsToShow.length > 0;

  // Helper function to get icon for a card
  const getCardIcon = (card: any, fallbackIcon: any) => {
    // Check if card has icon from CMS
    if (card.icon) {
      // If icon is a string (icon class like "ri-shield-check-line")
      if (typeof card.icon === 'string' && card.icon.startsWith('ri-')) {
        return { type: 'icon-class', value: card.icon };
      }
      // If icon is a string path (like "/uploads/..." or image file)
      if (typeof card.icon === 'string' && (card.icon.startsWith('/uploads/') || card.icon.startsWith('http') || card.icon.match(/\.(svg|png|jpg|jpeg|gif|webp)$/i))) {
        const iconPath = getImagePath ? getImagePath(card.icon) : card.icon;
        if (iconPath && iconPath.trim() !== '') {
          return { type: 'image', value: iconPath };
        }
      }
      // If icon is a number (mediaId) or object, try to get image path
      if (typeof card.icon === 'number' || (typeof card.icon === 'object' && card.icon !== null)) {
        const iconPath = getImagePath ? getImagePath(card.icon) : '';
        if (iconPath && iconPath.trim() !== '') {
          return { type: 'image', value: iconPath };
        }
      }
    }
    // Fall back to iconMap based on title
    const IconComponent = iconMap[card.title] || fallbackIcon;
    if (!IconComponent) {
      console.warn(`No icon found for card: ${card.title}`);
    }
    return { type: 'component', value: IconComponent };
  };

  // Helper to render icon
  const renderIcon = (iconData: any) => {
    if (!iconData) {
      console.warn('renderIcon: iconData is null or undefined');
      return null;
    }
    
    if (iconData.type === 'icon-class') {
      return <i className={`${iconData.value} text-4xl text-[#50b848]`} style={{ display: 'block', visibility: 'visible', lineHeight: '1' }} />;
    } else if (iconData.type === 'image') {
      return (
        <img
          src={iconData.value}
          alt="Icon"
          className="w-12 h-12 object-contain"
          style={{ display: 'block', visibility: 'visible', maxWidth: '100%', height: 'auto' }}
          onError={(e) => {
            console.error('Icon image failed to load:', iconData.value);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    } else if (iconData.type === 'component') {
      const IconComponent = iconData.value;
      if (!IconComponent) {
        console.warn('renderIcon: IconComponent is null/undefined for type component');
        return null;
      }
      // Render SVG component - same as mobile version
      try {
        return <IconComponent className="w-12 h-12 text-[#50b848]" style={{ display: 'block', visibility: 'visible', flexShrink: 0 }} />;
      } catch (error) {
        console.error('Error rendering IconComponent:', error, IconComponent);
        return null;
      }
    }
    
    console.warn('Unknown iconData type:', iconData);
    return null;
  };

  return (
    <section className="py-16 lg:py-9 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col order-2 lg:order-1">
            {/* Header Content */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight whitespace-pre-line">
                {heading}
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Car Image */}
            <div className="mb-6 relative bg-gray-100 rounded-lg">
              {image ? (
                <img
                  src={image}
                  alt="Refex Green Mobility Car"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Left Cards Stack */}
            <div className="space-y-6">
              {leftCardsToShow.map((card: any, index: number) => {
                const iconData = getCardIcon(card, SustainabilityRedefinedIcon);
                return (
                  <div key={index}>
                    {/* Mobile: Centered Icon at Top */}
                    <div className="lg:hidden bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
                      <div className="mb-4">
                        {iconData.type === 'icon-class' ? (
                          <i className={`${iconData.value} text-4xl text-[#50b848] mx-auto`} />
                        ) : iconData.type === 'image' ? (
                          <img
                            src={iconData.value}
                            alt="Icon"
                            className="w-12 h-12 object-contain mx-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          (() => {
                            const IconComponent = iconData.value;
                            return <IconComponent className="w-12 h-12 text-[#50b848] mx-auto" />;
                          })()
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {card.description}
                      </p>
                    </div>
                    {/* Desktop: Original Layout */}
                    <div className="hidden lg:flex bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 items-start gap-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex-shrink-0 min-w-[3rem] w-12 h-12 flex items-center justify-center overflow-visible" style={{ minHeight: '3rem' }}>
                        {renderIcon(iconData)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Regular Cards */}
          <div className="space-y-6 order-3 lg:order-2">
            {regularRightCards.map((card: any, index: number) => {
              const iconData = getCardIcon(card, ExclusiveFleetIcon);
              return (
                <div key={index}>
                  {/* Mobile: Centered Icon at Top */}
                  <div className="lg:hidden bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
                    <div className="mb-4">
                      {iconData.type === 'icon-class' ? (
                        <i className={`${iconData.value} text-4xl text-[#50b848] mx-auto`} />
                      ) : iconData.type === 'image' ? (
                        <img
                          src={iconData.value}
                          alt="Icon"
                          className="w-12 h-12 object-contain mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        (() => {
                          const IconComponent = iconData.value;
                          return <IconComponent className="w-12 h-12 text-[#50b848] mx-auto" />;
                        })()
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {card.description}
                    </p>
                  </div>
                  {/* Desktop: Original Layout */}
                  <div className="hidden lg:flex bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 items-start gap-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex-shrink-0 min-w-[3rem] w-12 h-12 flex items-center justify-center overflow-visible" style={{ minHeight: '3rem' }}>
                      {renderIcon(iconData)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Last Card - Full Width */}
        {isLastCardFullWidth && lastRightCard && (
          <div className="mt-8 lg:mt-12 order-4 lg:order-3">
            {(() => {
              const iconData = getCardIcon(lastRightCard, ExclusiveFleetIcon);
              return (
                <>
                  {/* Mobile: Centered Icon at Top */}
                  <div className="lg:hidden bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
                    <div className="mb-4">
                      {iconData.type === 'icon-class' ? (
                        <i className={`${iconData.value} text-4xl text-[#50b848] mx-auto`} />
                      ) : iconData.type === 'image' ? (
                        <img
                          src={iconData.value}
                          alt="Icon"
                          className="w-12 h-12 object-contain mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        (() => {
                          const IconComponent = iconData.value;
                          return <IconComponent className="w-12 h-12 text-[#50b848] mx-auto" />;
                        })()
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{lastRightCard.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {lastRightCard.description}
                    </p>
                  </div>
                  {/* Desktop: Original Layout */}
                  <div className="hidden lg:flex bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 items-start gap-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex-shrink-0 min-w-[3rem] w-12 h-12 flex items-center justify-center overflow-visible" style={{ minHeight: '3rem' }}>
                      {renderIcon(iconData)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{lastRightCard.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {lastRightCard.description}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};