interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function HeroSection({ sectionData, getImagePath, getSectionContent }: HeroSectionProps) {
  // Fallback values
  const fallbackTagline = 'Refex Ash & Coal Handling';
  const fallbackTitle = 'Refex – One-stop solution for all your Ash and Coal Requirements';
  const fallbackDescription = 'Refex is the leading provider of specialized solutions for the seamless supply and transportation of coal, management of the coal yard, efficient transportation and disposal of ash generated from the incineration of coal in thermal power plants. Operational since 2018, we have built a reputation for providing out of the box and reliable solutions and high-quality services to our clients. We have come to known as the most dependable and competent service provider for a multitude of services in the thermal business spectrum.';
  const fallbackButtonText = 'Explore';
  const fallbackButtonLink = '#explore';
  const fallbackBgImage = '/assets/business/coal-heap-at-yard-7-2-Large.jpeg';

  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || fallbackTagline;
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const linkType = getSectionContent?.(sectionData, 'linkType') || 'anchor';
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || '';

  // Handle link based on type
  const getButtonLink = () => {
    if (linkType === 'internal' && buttonLink) {
      return buttonLink.startsWith('/') ? buttonLink : `/${buttonLink}`;
    }
    return buttonLink || fallbackButtonLink;
  };

  return (
    <section
      className="relative flex items-center bg-cover bg-center bg-no-repeat pt-40 bg-gray-800"
      style={{ 
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
        minHeight: '80vh'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl">
          <p className="text-white/90 text-[18px] mb-4 tracking-wide" data-aos="fade-up">{tagline}</p>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
            {title}
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            {description}
          </p>
          {/* Explore button - commented out for future use */}
          {/* {linkType === 'internal' ? (
            <a href={getButtonLink()} className="cta-button-fill-ash-coal inline-flex items-center gap-2 bg-white border-2 border-black text-black px-8 py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden group" data-aos="fade-up" data-aos-delay="300">
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <i className="ri-arrow-down-line text-lg"></i>
              </span>
            </a>
          ) : (
            <a href={getButtonLink()} target={linkType === 'external' ? '_blank' : undefined} rel={linkType === 'external' ? 'noopener noreferrer' : undefined} className="cta-button-fill-ash-coal inline-flex items-center gap-2 bg-white border-2 border-black text-black px-8 py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden group" data-aos="fade-up" data-aos-delay="300">
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <i className="ri-arrow-down-line text-lg"></i>
              </span>
            </a>
          )} */}
        </div>
      </div>
      <style>{`
        .cta-button-fill-ash-coal {
          position: relative;
        }
        
        .cta-button-fill-ash-coal::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: #3C3C3C;
          transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill-ash-coal:hover::before {
          height: 100%;
        }
        
        .cta-button-fill-ash-coal:hover {
          color: white;
          border-color: #3C3C3C;
        }
        
        .cta-button-fill-ash-coal span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </section>
  );
}
