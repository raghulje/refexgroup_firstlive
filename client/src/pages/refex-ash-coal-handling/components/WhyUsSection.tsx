
// Import SVG icons
import InnovativeSolutions from '../../svg/coalandash/innovativesolutions.svg?react';
import SynergyWithCement from '../../svg/coalandash/synergywithcement.svg?react';
import Compliance100 from '../../svg/coalandash/100compliance.svg?react';
import ExperiencedAgileTeam from '../../svg/coalandash/experiencedagileteam.svg?react';
import LargeScale from '../../svg/coalandash/largescale.svg?react';

interface WhyUsSectionProps {
  sectionData?: any;
  features?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function WhyUsSection({ sectionData, features = [], getImagePath, getSectionContent }: WhyUsSectionProps) {
  // Fallback values
  const fallbackHeading = 'Why us';
  const fallbackDescription = 'At Refex, we take immense pride in our commitment to excellence, sustainability and environmental responsibility. We work closely with each individual client to understand their specific needs and deliver customized solutions. Whether you\'re looking for a reliable source of high-quality coal or need a partner to handle your ash transportation and disposal needs, we have the expertise and experience to deliver results as per the standards set by MoEF (Ministry of Environment, Forest and Climate Change of India) and the pollution control boards.';
  // No fallback image - must come from CMS

  const fallbackFeatures = [
    {
      icon: InnovativeSolutions,
      title: 'Innovative Solutions',
      description: 'Refex is at the forefront in adopting innovative technologies in the utilization of ash in various environmental-friendly and new generation methods of ash usage / disposal. Constantly on the lookout for opportunities for recycling and reuse to minimize waste and reduce our clients\' environmental footprint.',
    },
    {
      icon: SynergyWithCement,
      title: 'Synergy with Cement Companies',
      description: 'Cordial relationships with all leading cement plants across the country, catering fly ash to them via multiple modes of transport, namely bulkers, rakes etc.',
    },
    {
      icon: Compliance100,
      title: '100% Compliance to environmental norms',
      description: 'Refex adheres to statutory guidelines from all relevant organizations MoEF (Ministry of Environment, Forest & Climate Change), CPCB, and SPCB, with a commitment to create sustainable and compliant utilization or disposal methods.',
    },
    {
      icon: ExperiencedAgileTeam,
      title: 'Experienced and Agile team',
      description: 'Refex\'s team of experienced engineers, project managers, and technicians work closely with clients to understand their specific needs and develop customized solutions that meet their requirements. Highly focused on data-driven decision making and adoption of immediate corrective actions.',
    },
    {
      icon: LargeScale,
      title: 'Large Scale Operations',
      description: 'Refex handles all aspects of the ash dyke, right from loading at the pond to the appropriate disposal and closure at landfills with complete documentation and compliance to statutory norms, while prioritizing safety on all accounts. Expertise in handling large scale MW projects and high ash volumes on a daily basis, with the extensive fleet of hyvas and trailers owned by Refex.',
    }
  ];

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || '';

  // Map features - use CMS features if available, otherwise fallback
  const iconMap: any = {
    'Innovative Solutions': InnovativeSolutions,
    'Synergy with Cement Companies': SynergyWithCement,
    '100% Compliance to environmental norms': Compliance100,
    'Experienced and Agile team': ExperiencedAgileTeam,
    'Large Scale Operations': LargeScale,
  };

  const featuresToShow = features.length > 0 ? features.map((feature: any, index: number) => {
    const fallbackFeature = fallbackFeatures[index];
    const iconPath = feature.iconPath ? (getImagePath ? getImagePath(feature.iconPath) : feature.iconPath) : null;
    const IconComponent = iconPath ? null : (iconMap[feature.title] || fallbackFeature?.icon);

    return {
      ...feature,
      icon: IconComponent,
      iconPath: iconPath,
    };
  }) : fallbackFeatures;

  return (
    <section id="explore" className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Why us text + Image */}
          <div className="flex flex-col h-full" data-aos="fade-right">
            {/* Why us text at top */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {heading}
              </h2>
              <div className="flex gap-6">
                {/* Vertical Green Bar */}
                <div className="w-1.5 bg-[#50b848] flex-shrink-0"></div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Image at bottom left */}
            <div className="mt-auto w-full bg-gray-200" data-aos="fade-up" data-aos-delay="500" style={{ height: '450px', borderRadius: '0px 190px 0px 0px' }}>
              {image ? (
                <img
                  src={image}
                  alt="Refex Coal Handling Operations"
                  loading="lazy"
                  className="w-full object-cover shadow-xl"
                  style={{
                    height: '450px',
                    borderRadius: '0px 190px 0px 0px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Features List */}
          <div>
            <div className="space-y-0">
              {featuresToShow.map((feature: any, index: number) => {
                const IconComponent = feature.icon;
                const iconPath = feature.iconPath;
                return (
                  <div key={index}>
                    {/* Mobile: Centered Stacked Layout */}
                    <div
                      className="lg:hidden flex flex-col items-center text-center py-8"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      {/* Icon - Centered Above */}
                      <div className="mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto">
                          {iconPath ? (
                            <img src={iconPath} alt={feature.title || 'Icon'} className="w-12 h-12 object-contain" onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }} />
                          ) : IconComponent && typeof IconComponent === 'function' ? (
                            <IconComponent className="w-12 h-12" />
                          ) : null}
                        </div>
                      </div>
                      {/* Title - Centered */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      {/* Description - Centered */}
                      <p className="text-gray-600 text-sm leading-relaxed px-4">
                        {feature.description}
                      </p>
                    </div>

                    {/* Desktop: Side-by-side Layout */}
                    <div
                      className="hidden lg:flex gap-6 py-8"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 flex items-center justify-center">
                          {iconPath ? (
                            <img src={iconPath} alt={feature.title || 'Icon'} className="w-12 h-12 object-contain" onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }} />
                          ) : IconComponent && typeof IconComponent === 'function' ? (
                            <IconComponent className="w-12 h-12" />
                          ) : null}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {/* Horizontal Line Separator */}
                    {index < featuresToShow.length - 1 && (
                      <div className="border-t border-[#50b848] opacity-30"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
