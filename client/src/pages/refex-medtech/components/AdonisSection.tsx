import { useEffect, useRef } from 'react';

import MediaHeroBanner from '../../../wp-content/uploads/2023/02/Medtech-Hero-Banner.jpg';

interface AdonisSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const AdonisSection = ({ sectionData, getImagePath, getSectionContent }: AdonisSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Adonis & 3i MedTech together makes Refex MedTech stronger.';
  const fallbackDescription = 'Offering superior patented products and exceptional customer service, we are a trusted solution provider.';
  const fallbackButton1Text = 'Adonis Website';
  const fallbackButton1Link = 'https://adonis.com';
  const fallbackButton2Text = '3imedtech Website';
  const fallbackButton2Link = 'https://3imedtech.com';
  const fallbackBgImage = MediaHeroBanner;

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const button1Text = getSectionContent?.(sectionData, 'button1Text') || fallbackButton1Text;
  const button1Link = getSectionContent?.(sectionData, 'button1Link') || fallbackButton1Link;
  const button2Text = getSectionContent?.(sectionData, 'button2Text') || fallbackButton2Text;
  const button2Link = getSectionContent?.(sectionData, 'button2Link') || fallbackButton2Link;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImagePath = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null);
  const backgroundImage = backgroundImagePath && backgroundImagePath.trim() !== '' ? backgroundImagePath : fallbackBgImage;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('[data-aos]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative py-7 lg:py-10 overflow-hidden"
    >
      {/* Background Image with Blur */}
      {backgroundImage && backgroundImage.trim() !== '' && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)'
          }}
        />
      )}

      {/* Reversed Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(40, 121, 182, 0.86) 100%)'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-white text-[1.265rem] lg:text-[1.419rem] xl:text-[1.898rem] font-bold mb-6 leading-tight"
            data-aos="fade-up"
          >
            {title}
          </h2>
          <p
            className="text-white text-base lg:text-lg mb-8 leading-relaxed max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {description}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <a
              href={button1Link}
              target={button1Link.startsWith('http') ? '_blank' : undefined}
              rel={button1Link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer hover:bg-gray-100 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
            >
              {button1Text}
              <i className="ri-arrow-right-line ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
            <a
              href={button2Link}
              target={button2Link.startsWith('http') ? '_blank' : undefined}
              rel={button2Link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer hover:bg-gray-100 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
            >
              {button2Text}
              <i className="ri-arrow-right-line ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdonisSection;

