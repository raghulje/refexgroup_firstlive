import ScrollRevealSection from '../../../components/base/ScrollRevealSection';

// Import SVG icons
import ExpertTeam from '../../svg/renewables/expertteam.svg?react';
import HolisticSolutions from '../../svg/renewables/holisticsolutions.svg?react';
import SustainableEnergy from '../../svg/renewables/sustainableenergy.svg?react';
import ExtensiveCoverage from '../../svg/renewables/extensivecoverage.svg?react';
import RecordExcellence from '../../svg/renewables/recordexcellence.svg?react';
import InnovativeStrategist from '../../svg/renewables/innovativestrategist.svg?react';
import { getApiBaseUrl } from '../../../config/env';

interface BenefitsSectionProps {
  section?: any;
  benefits?: any[];
  getImagePath?: (imageData: any) => string;
}

export default function BenefitsSection({ section, benefits = [], getImagePath }: BenefitsSectionProps) {
  // Fallback to hardcoded benefits if CMS data not available
  const defaultBenefits = [
    {
      icon: ExpertTeam,
      title: 'Expert Team',
      description: 'Our expert team excels in the solar industry, with proven success and unparalleled knowledge. We offer clients tailored, efficient solutions.'
    },
    {
      icon: HolisticSolutions,
      title: 'Holistic Solutions',
      description: 'We provide a holistic approach to our services, including design, installation, and maintenance, making the process simple and straightforward for our clients.'
    },
    {
      icon: SustainableEnergy,
      title: 'Sustainable Energy',
      description: 'Refex Renewables provides eco-friendly energy solutions for a better future. Our goal is to promote renewable sources of energy for a cleaner planet.'
    },
    {
      icon: ExtensiveCoverage,
      title: 'Extensive Coverage',
      description: 'Refex Renewables has successfully executed projects across multiple regions, showcasing our capacity to serve a diverse population.'
    },
    {
      icon: RecordExcellence,
      title: 'Record of Excellence',
      description: 'Our reputation precedes us, thanks to a portfolio that includes prestigious government agencies and top-notch private organizations'
    },
    {
      icon: InnovativeStrategist,
      title: 'Innovative Strategies',
      description: 'Refex Renewables is renowned for our groundbreaking methods in solar power systems, such as the canal top solar venture, making us stand out among the competition.'
    }
  ];

  // Get title from CMS
  const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue ||
    'Discover the numerous benefits that set us apart from the competition';

  // Helper to get icon path from CMS
  const getIconPath = (iconData: any): string | null => {
    if (!iconData) return null;

    if (typeof iconData === 'string' && iconData.trim()) {
      if (iconData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${iconData}`;
      }
      return iconData;
    }

    if (iconData.filePath) {
      if (iconData.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${iconData.filePath}`;
      }
      return iconData.filePath;
    }

    if (iconData.url) {
      return iconData.url;
    }

    return null;
  };

  // Use CMS benefits if available, otherwise use default
  const displayBenefits = benefits.length > 0 ? benefits.map((benefit, index) => {
    // Try to get icon from CMS
    const iconUrl = getIconPath(benefit.icon);

    // If no CMS icon, try to use default SVG icon
    let IconComponent = defaultBenefits[index]?.icon;

    return {
      ...benefit,
      iconUrl: iconUrl || null,
      icon: iconUrl ? null : IconComponent // Use SVG component only if no URL icon
    };
  }) : defaultBenefits;

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center max-w-4xl mx-auto"
          data-aos="fade-up"
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
          {displayBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <ScrollRevealSection key={index} animation="fade-up" delay={index * 100}>
                <div className="text-center">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 flex items-center justify-center">
                      {benefit.iconUrl ? (
                        <img
                          src={benefit.iconUrl}
                          alt={benefit.title}
                          className="w-16 h-16"
                          onError={(e) => {
                            // Fallback to default icon if image fails to load
                            if (defaultBenefits[index]?.icon) {
                              const DefaultIcon = defaultBenefits[index].icon;
                              (e.target as HTMLElement).parentElement!.innerHTML = '';
                              // Render SVG component instead
                            }
                          }}
                        />
                      ) : IconComponent ? (
                        <IconComponent className="w-16 h-16" />
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollRevealSection>
            );
          })}
        </div>
      </div>
    </div>
  );
}
