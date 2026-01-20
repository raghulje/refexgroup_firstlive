import CTABg from '../../../wp-content/uploads/2024/01/CTA-BG.jpg';

interface CTASectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function CTASection({ sectionData, getImagePath, getSectionContent }: CTASectionProps) {
  const fallbackTitle = 'Redefining Excellence in API Development';
  const fallbackDescription = 'Experience a new era at RLFC, redefining API development with unwavering commitment to cutting-edge solutions. Setting pioneering standards, we drive transformative advancements in global healthcare.';
  const fallbackButtonText = 'Visit Website';
  const fallbackButtonLink = 'https://refexlifesciences.com/';
  const fallbackBgImage = CTABg;

  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;

  return (
    <div className="py-12 px-6 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          alt="CTA Background"
          className="w-full h-full object-cover object-top"
          src={backgroundImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackBgImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#50b848]/80 via-[#3d7c5f]/70 to-[#1a1a1a]/85"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <h2
          className="text-2xl md:text-3xl font-bold text-white leading-tight"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {title}
        </h2>
        <p
          className="text-sm lg:text-base text-gray-200 leading-relaxed max-w-3xl mx-auto opacity-95"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          {description}
        </p>
        <div
          className="pt-4"
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          <a
            href={buttonLink}
            target={buttonLink.startsWith('http') ? '_blank' : undefined}
            rel={buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="cta-button-fluid inline-flex items-center gap-2 bg-white text-[#3b9dd6] px-8 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer border-2 border-white text-sm relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
            {buttonText}
            <i className="ri-arrow-right-line"></i>
            </span>
          </a>
        </div>
        <style>{`
          .cta-button-fluid {
            position: relative;
          }
          
          .cta-button-fluid::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background: #3b9dd6;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1;
            border-radius: 9999px;
          }
          
          .cta-button-fluid:hover::before {
            width: 100%;
          }
          
          .cta-button-fluid:hover {
            color: white;
            border-color: #3b9dd6;
          }
          
          .cta-button-fluid .ri-arrow-right-line {
            transition: transform 0.3s ease;
          }
          
          .cta-button-fluid:hover .ri-arrow-right-line {
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
}
