interface CTASectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function CTASection({ sectionData, getImagePath, getSectionContent }: CTASectionProps) {
  // Fallback values
  const fallbackTitle = 'Refex Industries Limited';
  const fallbackDescription = 'Reliable and Trusted partner for Ash & Coal handling';
  const fallbackButtonText = 'Visit Website';
  const fallbackButtonLink = 'https://www.refex.co.in/';
  // No fallback image - must come from CMS

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const linkType = getSectionContent?.(sectionData, 'linkType') || 'external';
  const overlayColor = getSectionContent?.(sectionData, 'overlayColor') || 'linear-gradient(197deg, rgba(158, 158, 158, 0.75) 1%, rgba(158, 158, 158, 0.9) 100%)';
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
      className="relative py-14 bg-cover bg-center bg-no-repeat bg-gray-800"
      style={{ backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none' }}
    >
      {/* Ash Color Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: overlayColor.includes('gradient') ? overlayColor : overlayColor
        }}
      ></div>

      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-xl mb-8" data-aos="fade-up" data-aos-delay="100">
            {description}
          </p>
        )}
        {linkType === 'internal' ? (
          <a
            href={getButtonLink()}
            className="cta-button-fill-ash-coal inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <i className="ri-arrow-right-line text-lg"></i>
            </span>
          </a>
        ) : (
          <a
            href={getButtonLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button-fill-ash-coal inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <i className="ri-arrow-right-line text-lg"></i>
            </span>
          </a>
        )}
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
          background-color: #000000;
          transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill-ash-coal:hover::before {
          height: 100%;
        }
        
        .cta-button-fill-ash-coal:hover {
          color: white;
        }
        
        .cta-button-fill-ash-coal span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </section>
  );
}
