import VenwindBanner from '../../../wp-content/uploads/2025/03/venwind-banner.jpg';

interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const HeroSection = ({ sectionData, getImagePath, getSectionContent }: HeroSectionProps) => {
  // Fallback values
  const fallbackSubtitle = 'Venwind Refex';
  const fallbackTitle = 'Harnessing and Powering the Future with Sustainable Wind Technology';
  const fallbackDescription = 'Venwind Refex has an exclusive license from Vensys Energy AG, Germany, to manufacture <strong>5.3 MW</strong> wind turbines featuring a permanent magnet generator and hybrid drivetrain technology. More than <strong>120 GW</strong> of wind turbine generators using Vensys technology are in operation across five continents and multiple countries. Currently, we have been licensed to manufacture the state-of-the-art wind turbine technology in India.';
  const fallbackButtonText = 'Explore';
  const fallbackButtonLink = '#explore';
  const fallbackBgImage = VenwindBanner;

  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || getSectionContent?.(sectionData, 'subtitle') || fallbackSubtitle;
  const subtitle = getSectionContent?.(sectionData, 'subtitle') || fallbackSubtitle;
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  let description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const linkType = getSectionContent?.(sectionData, 'linkType') || 'anchor';
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;

  // Ensure "5.3 MW" and "120 GW" are always bold
  if (description && typeof description === 'string') {
    // Replace "5.3 MW" with bold version if not already wrapped in strong tags
    if (!description.match(/<strong>.*?5\.3\s*MW.*?<\/strong>/i)) {
      description = description.replace(/5\.3\s*MW/gi, '<strong>$&</strong>');
    }
    // Replace "120 GW" with bold version if not already wrapped in strong tags
    if (!description.match(/<strong>.*?120\s*GW.*?<\/strong>/i)) {
      description = description.replace(/120\s*GW/gi, '<strong>$&</strong>');
    }
  }

  // Handle link based on type
  const getButtonLink = () => {
    if (linkType === 'internal' && buttonLink) {
      return buttonLink.startsWith('/') ? buttonLink : `/${buttonLink}`;
    }
    return buttonLink || fallbackButtonLink;
  };

  return (
    <section className="relative min-h-[220px] flex items-center overflow-hidden pt-40">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Venwind Background"
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackBgImage;
          }}
        />
        {/* Light green shadow overlay on right side */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#1f6f2d]/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="text-white space-y-3">
                {tagline && (
                  <div data-aos="fade-up">
                    <h3 className="text-xl font-medium mb-1">{tagline}</h3>
                  </div>
                )}

            <div data-aos="fade-up" data-aos-delay="100">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {title}
              </h1>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <p className="text-sm leading-normal" dangerouslySetInnerHTML={{ __html: description }} />
            </div>

            {/* Explore button - commented out for future use */}
            {/* <div data-aos="fade-up" data-aos-delay="300">
              {linkType === 'internal' ? (
                <a
                  href={getButtonLink()}
                  className="inline-flex items-center gap-2 bg-white text-[#2d5234] px-4 md:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer text-sm md:text-base"
                >
                  <span>{buttonText}</span>
                  <i className="ri-arrow-down-line text-lg group-hover:translate-y-1 transition-transform duration-300"></i>
                </a>
              ) : (
                <a
                  href={getButtonLink()}
                  target={linkType === 'external' ? '_blank' : undefined}
                  rel={linkType === 'external' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 bg-white text-[#2d5234] px-4 md:px-8 py-3 rounded-full font-semibold hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer text-sm md:text-base"
                >
                  <span>{buttonText}</span>
                  <i className="ri-arrow-down-line text-lg group-hover:translate-y-1 transition-transform duration-300"></i>
                </a>
              )}
            </div> */}
          </div>

          {/* Right Image */}
          <div className="relative" data-aos="fade-left">
            {/* Right Side - Empty for spacing */}
            {/* Spacer removed on mobile, content flows naturally */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
