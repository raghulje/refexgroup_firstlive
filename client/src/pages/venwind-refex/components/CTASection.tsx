import { trackButtonClick } from '../../../utils/ga4';
import CTAImage from '../../../wp-content/uploads/2025/03/sustainability-banner.jpg';

interface CTASectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const CTASection = ({ sectionData, getImagePath, getSectionContent }: CTASectionProps) => {
  // Fallback values
  const fallbackTitle = 'Venwind Refex';
  const fallbackDescription = 'Curious to know more about sustainable wind energy manufacturing technology?';
  const fallbackButtonText = 'Visit Website';
  const fallbackButtonLink = 'https://venwind.in/';
  const fallbackBgImage = CTAImage;
  const fallbackOverlay = 'linear-gradient(185deg, #2A78B247 0%, #005F11D9 71%)';

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const linkType = getSectionContent?.(sectionData, 'linkType') || 'external';
  const overlayGradient = getSectionContent?.(sectionData, 'overlayGradient') || fallbackOverlay;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;

  // Handle link based on type
  const getButtonLink = () => {
    if (linkType === 'internal' && buttonLink) {
      return buttonLink.startsWith('/') ? buttonLink : `/${buttonLink}`;
    }
    return buttonLink || fallbackButtonLink;
  };

  return (
    <section
      className="relative py-11 overflow-hidden"
      data-aos="fade-up"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Sustainability Background"
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackBgImage;
          }}
        />
        {/* Gradient overlay - full background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'transparent',
            backgroundImage: overlayGradient.includes('gradient') ? overlayGradient : overlayGradient
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <div className="space-y-6">
          <div data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              {title}
            </h2>
          </div>

          {description && (
            <div data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg text-white max-w-3xl mx-auto">
                {description}
              </p>
            </div>
          )}

          <div data-aos="fade-up" data-aos-delay="200">
            {linkType === 'internal' ? (
              <a
                href={getButtonLink()}
                onClick={() => trackButtonClick(buttonText, 'venwind-page-cta', getButtonLink())}
                className="cta-button-fill inline-flex items-center gap-2 bg-white text-[#50b848] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer whitespace-nowrap relative overflow-hidden group"
                data-ga-track="button"
                data-ga-label={buttonText}
                data-ga-location="venwind-page-cta"
              >
                <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                </span>
              </a>
            ) : (
              <a
                href={getButtonLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackButtonClick(buttonText, 'venwind-page-cta', getButtonLink())}
                className="cta-button-fill inline-flex items-center gap-2 bg-white text-[#50b848] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer whitespace-nowrap relative overflow-hidden group"
                data-ga-track="button"
                data-ga-label={buttonText}
                data-ga-location="venwind-page-cta"
              >
                <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .cta-button-fill {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .cta-button-fill::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: #50b848;
          transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill:hover::before {
          height: 100%;
        }
        
        .cta-button-fill:hover {
          color: white;
        }
        
        .cta-button-fill span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
