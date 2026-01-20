interface CTASectionProps {
  section?: any;
  getSectionContent?: (section: any, contentKey: string) => any;
  getImagePath?: (imageData: any) => string;
}

export default function CTASection({ section, getSectionContent, getImagePath }: CTASectionProps) {
  // Get CMS data with fallback to hardcoded values
  const title = section && getSectionContent ? getSectionContent(section, 'title') : 'Refex Renewables & Infrastructure Limited';
  const description = section && getSectionContent ? getSectionContent(section, 'description') : 'Building a better world with clean energy and sustainable infrastructure.';
  const buttonText = section && getSectionContent ? getSectionContent(section, 'buttonText') : 'Visit Website';
  const buttonLink = section && getSectionContent ? getSectionContent(section, 'buttonLink') : 'https://www.refex.group/refex-renewables/';
  
  // Get background image
  let backgroundImage = '';
  if (section && getSectionContent) {
    const bgImageData = getSectionContent(section, 'backgroundImage');
    if (bgImageData && bgImageData.path && !bgImageData.path.startsWith('/assets/')) {
      backgroundImage = bgImageData.path;
    } else if (typeof bgImageData === 'string' && bgImageData && !bgImageData.startsWith('/assets/')) {
      backgroundImage = bgImageData;
    }
  }

  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gray-800"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
        }}
      ></div>

      {/* White Overlay */}
      <div className="absolute inset-0 bg-white/80"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 lg:px-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-black mb-4"
          data-aos="fade-up"
        >
          {title}
        </h2>
        <p
          className="text-black text-lg mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {description}
        </p>
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button-fill-renewables inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer relative overflow-hidden group"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="relative z-10 flex items-center gap-2">
            {buttonText}
            <i className="ri-arrow-right-line"></i>
          </span>
        </a>
      </div>
      <style>{`
        .cta-button-fill-renewables {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .cta-button-fill-renewables::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: #f9d342;
          transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill-renewables:hover::before {
          height: 100%;
        }
        
        .cta-button-fill-renewables:hover {
          color: black;
        }
        
        .cta-button-fill-renewables span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </div>
  );
}
