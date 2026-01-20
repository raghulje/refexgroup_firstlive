import React from 'react';

interface AboutSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ sectionData, getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackBadge = 'About Us';
  const fallbackHeading = 'Most Trusted, Sustainable Mobility Partner in India';
  const fallbackParagraphs = [
    'Experience Refex Mobility, a hub of innovation and sustainability in India\'s mobility landscape. As the flagship venture of Refex Green Mobility Limited, we\'re dedicated to revolutionizing urban commuting. Under the esteemed Refex Group, a recognized leader and Great Place To Work certified organization, Refex Mobility pioneers India\'s sustainable mobility revolution.',
    'We provide exceptional commuting solutions with a 100% cleaner-fuelled fleet. Our commitment extends to a comprehensive charging infrastructure and dedicated charging hub in the cities we operate.'
  ];
  const fallbackButtonText = 'Explore our Solutions';
  const fallbackButtonLink = '#solutions';
  // Get CMS values
  const badge = getSectionContent?.(sectionData, 'badge') || fallbackBadge;
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const paragraphsData = getSectionContent?.(sectionData, 'paragraphs');
  const paragraphs = Array.isArray(paragraphsData) ? paragraphsData : (paragraphsData ? JSON.parse(paragraphsData) : fallbackParagraphs);
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || '';

  return (
    <section id="discover" className="pt-0 pb-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image - Mobile: Top, Desktop: Left */}
          <div className="order-1 lg:order-1" data-aos="fade-right">
            {image ? (
              <img
                src={image}
                alt="Reliable Electric Vehicle"
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

          {/* Text Content - Mobile: Below Image, Desktop: Right */}
          <div className="order-2 lg:order-2" data-aos="fade-left">
            <div className="mb-6">
              <span 
                className="font-bold text-2xl" 
                data-aos="fade-in" 
                data-aos-delay="100"
                style={{
                  background: 'linear-gradient(92deg, #FF7837 -14.27%, #2DAECC 115.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {badge}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" data-aos="fade-up" data-aos-delay="200">
              {heading}
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg" data-aos="fade-up" data-aos-delay="300">
              {paragraphs.map((para: string, index: number) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {/* Button hidden per user request */}
            {/* <button
              className="mt-8 bg-white border-2 border-[#7dc144] text-gray-900 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg group whitespace-nowrap"
              data-aos="fade-up"
              data-aos-delay="400"
              onClick={() => {
                if (buttonLink.startsWith('#')) {
                  document.getElementById(buttonLink.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = buttonLink;
                }
              }}
            >
              {buttonText}
              <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};
