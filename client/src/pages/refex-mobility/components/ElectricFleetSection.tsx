import React from 'react';

// Import SVG icons
import CostEffectiveIcon from '../../svg/mobility/Cost_Effective_EV_Solutions.svg?react';
import EcoRevolutionaryIcon from '../../svg/mobility/Eco_Revolutionary_Fleet_Choices.svg?react';
import EmissionFreeIcon from '../../svg/mobility/Emission_Free_EV_Journeys.svg?react';

interface ElectricFleetSectionProps {
  sectionData?: any;
  advantages?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const iconMap: any = {
  'Cost-Effective EV Solutions': CostEffectiveIcon,
  'Eco-Revolutionary Fleet Choices': EcoRevolutionaryIcon,
  'Emission-Free EV Journeys': EmissionFreeIcon,
};

export const ElectricFleetSection: React.FC<ElectricFleetSectionProps> = ({ sectionData, advantages = [], getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackHeading = 'Strategic Advantages of\nElectric Fleets';
  const fallbackDescription = 'Explore the multifaceted benefits of integrating electric fleets into your corporate strategy and witness the transformative impact on your bottom line, environmental stewardship, and brand reputation. Discover the strategic advantages that position your business at the forefront of sustainable innovation.';
  // No fallback images - all must come from CMS
  const fallbackAdvantages = [
    { title: 'Cost-Effective EV Solutions', description: 'EVs have lower operating costs than traditional gasoline-powered vehicles, which can result in significant savings for corporations.' },
    { title: 'Eco-Revolutionary Fleet Choices', description: 'By adopting electric fleets, companies can demonstrate their commitment to environmental responsibility & social sustainability, improving their reputation & brand image.' },
    { title: 'Emission-Free EV Journeys', description: 'EVs emit less greenhouse gas and other pollutants than traditional vehicles, helping companies to reduce their carbon footprint and meet sustainability goals.' }
  ];

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const image1Data = getSectionContent?.(sectionData, 'image1');
  const image1 = image1Data?.path || (getImagePath && image1Data ? getImagePath(image1Data) : null) || '';
  const image2Data = getSectionContent?.(sectionData, 'image2');
  const image2 = image2Data?.path || (getImagePath && image2Data ? getImagePath(image2Data) : null) || '';
  const imageBottomData = getSectionContent?.(sectionData, 'imageBottom');
  const imageBottom = imageBottomData?.path || (getImagePath && imageBottomData ? getImagePath(imageBottomData) : null) || '';
  const advantagesToShow = advantages.length > 0 ? advantages : fallbackAdvantages;

  // Helper function to get icon for an advantage card
  const getCardIcon = (advantage: any, fallbackIcon: any) => {
    // Check if advantage has icon from CMS
    if (advantage.icon) {
      // If icon is a string (icon class like "ri-shield-check-line")
      if (typeof advantage.icon === 'string' && advantage.icon.startsWith('ri-')) {
        return { type: 'icon-class', value: advantage.icon };
      }
      // If icon is a string path (like "/uploads/..." or image file)
      if (typeof advantage.icon === 'string' && (advantage.icon.startsWith('/uploads/') || advantage.icon.startsWith('http') || advantage.icon.match(/\.(svg|png|jpg|jpeg|gif|webp)$/i))) {
        const iconPath = getImagePath ? getImagePath(advantage.icon) : advantage.icon;
        if (iconPath && iconPath.trim() !== '') {
          return { type: 'image', value: iconPath };
        }
      }
      // If icon is a number (mediaId) or object, try to get image path
      if (typeof advantage.icon === 'number' || (typeof advantage.icon === 'object' && advantage.icon !== null)) {
        const iconPath = getImagePath ? getImagePath(advantage.icon) : '';
        if (iconPath && iconPath.trim() !== '') {
          return { type: 'image', value: iconPath };
        }
      }
    }
    // Fall back to iconMap based on title
    const IconComponent = iconMap[advantage.title] || fallbackIcon;
    return { type: 'component', value: IconComponent };
  };

  // Helper to render icon
  const renderIcon = (iconData: any) => {
    if (!iconData) return null;
    
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
    } else if (iconData.type === 'component' && iconData.value) {
      const IconComponent = iconData.value;
      return <IconComponent className="w-12 h-12 text-[#50b848]" style={{ display: 'block', visibility: 'visible', flexShrink: 0 }} />;
    }
    
    return null;
  };

  return (
    <section
      className="py-20 lg:py-9"
      style={{
        background: 'linear-gradient(259deg, #7EC24350 0%, #F0F0F050 90%)'
      }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Column Content */}
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line" data-aos="fade-up">
              {heading}
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-10" data-aos="fade-up" data-aos-delay="100">
              {description}
            </p>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="rounded-[2rem] overflow-hidden shadow-lg h-40 lg:h-48 bg-gray-100">
                {image1 ? (
                  <img
                    src={image1}
                    alt="EV Charging Stations"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>
              <div className="rounded-[2rem] overflow-hidden shadow-lg h-40 lg:h-48 bg-gray-100">
                {image2 ? (
                  <img
                    src={image2}
                    alt="Wall Charger"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>
            </div>

            {/* Large Bottom Image */}
            <div className="rounded-[2rem] overflow-hidden shadow-lg flex-grow bg-gray-100" data-aos="fade-up" data-aos-delay="300">
              {imageBottom ? (
                <img
                  src={imageBottom}
                  alt="Electric Fleet with Plane"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
              )}
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="flex flex-col justify-between h-full gap-6">
            {advantagesToShow.map((advantage: any, index: number) => {
              const iconData = getCardIcon(advantage, CostEffectiveIcon);
              return (
                <div key={index}>
                  {/* Mobile: Centered Icon at Top */}
                  <div
                    className="lg:hidden bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
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
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {advantage.description}
                    </p>
                  </div>
                  {/* Desktop: Original Layout */}
                  <div
                    className="hidden lg:flex bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow duration-300 items-start gap-6"
                    data-aos="fade-left"
                    data-aos-delay={index * 200}
                  >
                    <div className="flex-shrink-0 min-w-[3rem] w-12 h-12 flex items-center justify-center overflow-visible" style={{ minHeight: '3rem' }}>
                      {renderIcon(iconData)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};