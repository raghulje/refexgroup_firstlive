interface RDCapabilitySectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function RDCapabilitySection({ sectionData, getImagePath, getSectionContent }: RDCapabilitySectionProps) {
  const fallbackTitle = 'Research & Development Excellence';
  const fallbackDescription = 'At Refex Life Sciences, innovation is our engine of growth. With world-class R&D centres and a team of over 200 scientists, we are advancing the frontiers of both API development and complex finished dosage formulations (FDFs). Our research is focused on creating differentiated, sustainable, and patient-centric solutions that address unmet needs across global healthcare.';
  const fallbackCapabilities = [
    { title: 'Sustainable Process Development', icon: 'ri-recycle-line' },
    { title: 'Chiral Chemistry Expertise', icon: 'ri-contrast-2-line' },
    { title: 'Complex Chemistry Capabilities', icon: 'ri-flask-line' },
    { title: 'Impurity & Genotoxic Control', icon: 'ri-shield-check-line' },
    { title: 'Technology Transfer', icon: 'ri-exchange-line' },
    { title: 'Green Chemistry Principles', icon: 'ri-leaf-line' },
    { title: 'Regulatory Support', icon: 'ri-file-shield-line' },
    { title: 'Over 200 scientists', icon: 'ri-team-line' },
    { title: 'Collaboration + Specialization', icon: 'ri-group-line' },
    { title: 'Cross-functional Approach', icon: 'ri-links-line' },
    { title: 'Passion and Professionalism', icon: 'ri-star-line' },
  ];

  const heading = getSectionContent?.(sectionData, 'heading') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const capabilitiesData = getSectionContent?.(sectionData, 'capabilities');
  const capabilities = Array.isArray(capabilitiesData) ? capabilitiesData : (capabilitiesData ? JSON.parse(capabilitiesData) : fallbackCapabilities);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1156.67px] mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {heading}
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-5xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {capabilities.map((item: any, index: number) => {
            const isIconClass = typeof item.icon === 'string' && item.icon.startsWith('ri-');
            const isUploadedImage = typeof item.icon === 'number';

            let iconSrc = '';
            if (isUploadedImage && getImagePath) {
              iconSrc = getImagePath(item.icon);
            } else if (!isIconClass && item.icon) {
              iconSrc = item.icon;
            }

            return (
              <div key={index}>
                {/* Mobile: Center-aligned Layout */}
                <div className="md:hidden flex flex-col items-center text-center group cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center mb-3">
                    {isIconClass ? (
                      <i className={`${item.icon} text-4xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6 shadow-sm rounded-lg p-1`} style={{ color: '#7cb342' }}></i>
                    ) : iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={item.title}
                        className="w-10 h-10 object-contain transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6"
                        onError={(e) => {
                          // Fallback to default icon if image fails
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <i className="ri-flask-line text-4xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6 shadow-sm rounded-lg p-1" style={{ color: '#7cb342' }}></i>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#7cb342]">{item.title}</h3>
                  </div>
                </div>

                {/* Desktop: Original Left-aligned Layout */}
                <div className="hidden md:flex items-start gap-4 group cursor-pointer">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {isIconClass ? (
                    <i className={`${item.icon} text-4xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6 shadow-sm rounded-lg p-1`} style={{ color: '#7cb342' }}></i>
                  ) : iconSrc ? (
                    <img
                      src={iconSrc}
                      alt={item.title}
                      className="w-10 h-10 object-contain transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6"
                      onError={(e) => {
                        // Fallback to default icon if image fails
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <i className="ri-flask-line text-4xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.5] group-hover:-rotate-6 shadow-sm rounded-lg p-1" style={{ color: '#7cb342' }}></i>
                  )}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 pt-1.5 transition-colors duration-300 group-hover:text-[#7cb342]">{item.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
