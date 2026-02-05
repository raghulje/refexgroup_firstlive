import HybridDriveIcon from '../../svg/venwind/hybrid_drive.svg?react';
import ProvenTechnologyIcon from '../../svg/venwind/proventechnology.svg?react';
import RapidIcon from '../../svg/venwind/rapid.svg?react';
import ReducedOpexCostIcon from '../../svg/venwind/reducedopexcost.svg?react';
import LowerBopCostIcon from '../../svg/venwind/lowerbopcost.svg?react';
import DecreasedLCOEIcon from '../../svg/venwind/decreasedlcoe.svg?react';
import UniqueImage from '../../../wp-content/uploads/2025/03/home-image-840x968-1.jpg';
import { getApiBaseUrl } from '../../../config/env';

interface UniqueSectionProps {
  sectionData?: any;
  features?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const UniqueSection = ({ sectionData, features = [], getImagePath, getSectionContent }: UniqueSectionProps) => {
  // Fallback values
  const fallbackHeading = 'What makes us unique?';
  const fallbackDescription = 'We offer wind turbines with advanced German technology from Vensys Energy AG at competitive prices.';
  const fallbackImage = UniqueImage;

  const fallbackFeatures = [
    {
      icon: HybridDriveIcon,
      text: 'Hybrid drive-train (gearbox + medium speed PMG) for superior performance'
    },
    {
      icon: ProvenTechnologyIcon,
      text: 'Proven technology with global installations in Australia, South Africa, Brazil and the Middle East'
    },
    {
      icon: RapidIcon,
      text: 'Rapid delivery'
    },
    {
      icon: ReducedOpexCostIcon,
      text: 'Reduced Opex costs due to PMG and hybrid drive-train'
    },
    {
      icon: LowerBopCostIcon,
      text: 'Lower BOP costs with larger WTG sizes, achieving 20-25% savings'
    },
    {
      icon: DecreasedLCOEIcon,
      text: 'Decreased LCOE through technological efficiency and BOP savings'
    }
  ];

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || fallbackImage;

  // Map features - use CMS features if available, otherwise fallback
  const iconMap: any = {
    'Hybrid drive-train (gearbox + medium speed PMG) for superior performance': HybridDriveIcon,
    'Proven technology with global installations in Australia, South Africa, Brazil and the Middle East': ProvenTechnologyIcon,
    'Rapid delivery': RapidIcon,
    'Reduced Opex costs due to PMG and hybrid drive-train': ReducedOpexCostIcon,
    'Lower BOP costs with larger WTG sizes, achieving 20-25% savings': LowerBopCostIcon,
    'Decreased LCOE through technological efficiency and BOP savings': DecreasedLCOEIcon,
  };

  const featuresToShow = features.length > 0
    ? features.map((item: any, index: number) => {
      if (typeof item === 'string') {
        const fallbackFeature = fallbackFeatures[index];
        return {
          icon: iconMap[item] || fallbackFeature?.icon || HybridDriveIcon,
          text: item,
          isComponent: true
        };
      } else {
        return {
          icon: item.icon,
          text: item.text,
          isComponent: false
        };
      }
    })
    : fallbackFeatures.map(f => ({ ...f, isComponent: true }));

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content Column */}
          <div className="space-y-8">
            <div data-aos="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {heading}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                {description}
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="flex justify-start">
              <img
                src={image}
                alt="Wind Turbine Technology"
                className="w-[448.31px] h-[518.63px] rounded-xl shadow-2xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            </div>
          </div>

          {/* Right Features Column - Stacked Cards */}

          <div className="space-y-4 flex flex-col justify-center h-full">
            {featuresToShow.map((feature, index) => {
              const IconComponent = feature.icon;
              const isComponent = feature.isComponent;

              // Resolve image source for non-component icons
              let imageSrc = '';
              if (!isComponent && feature.icon) {
                if (typeof feature.icon === 'number') {
                  const apiBase = getApiBaseUrl();
                  imageSrc = `${apiBase}/uploads/media/${feature.icon}`;
                } else if (getImagePath) {
                  imageSrc = getImagePath(feature.icon);
                } else {
                  imageSrc = feature.icon;
                }
              }

              return (
                <div
                  key={index}
                  className="group flex items-center gap-6 p-6 bg-white rounded-xl border-l-4 border-[#50b848] shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  data-aos="fade-left"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                    {isComponent && IconComponent && typeof IconComponent === 'function' ? (
                      <IconComponent className="w-10 h-10 text-[#50b848]" />
                    ) : (
                      imageSrc ? (
                        <img
                          src={imageSrc}
                          alt=""
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            // Fallback to Icon if image fails, or just hide
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Try to show default icon if available? 
                            // For simplicity, we just hide broken image
                          }}
                        />
                      ) : (
                        // Default icon if no icon provided
                        <HybridDriveIcon className="w-10 h-10 text-[#50b848]" />
                      )
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-normal text-gray-800 leading-tight group-hover:text-[#50b848] transition-colors duration-300">
                      {feature.text}
                    </h5>
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

export default UniqueSection;
