import { useEffect, useRef } from 'react';
import MedtechHeroBanner from '../../../wp-content/uploads/2023/02/Medtech-Hero-Banner.jpg';
import MedtechImagesNew from '../../../wp-content/uploads/2025/05/medtech-images-new.png';

interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const HeroSection = ({ sectionData, getImagePath, getSectionContent }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Refex MedTech';
  const fallbackDescription = 'We are an esteemed player in the medical devices industry with a core competency in the manufacturing of sophisticated diagnostic imaging equipment solutions, such as the first \'Made in India\' MRI: Anamaya & Flat Panel Detector (FPD), ultra portable X-ray system: MINI 90, Digital Radiography and C-arms. We pledge to bring "Affordable Luxury" to our products & solutions to serve our customers with advanced technology with lower life cycle costs without compromising on performance, quality, reliability & patient safety.';
  const fallbackButtonText = 'Explore';
  const fallbackButtonLink = '#explore';
  const fallbackBgImage = MedtechHeroBanner;
  const fallbackImage = MedtechImagesNew;

  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || '';
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || fallbackBgImage;
  const imageData = getSectionContent?.(sectionData, 'image');
  const imagePath = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null);
  const image = imagePath && imagePath.trim() !== '' ? imagePath : fallbackImage;

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
      className="relative pb-14 lg:pb-24 overflow-hidden pt-40"
      style={{
        ...(backgroundImage && backgroundImage.trim() !== '' ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {
          backgroundColor: '#2879B6'
        })
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(40, 121, 182, 0.86) 53%, rgba(255, 255, 255, 1) 100%)'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {tagline && (
              <p className="text-white/90 text-[18px] mb-4 tracking-wide" data-aos="fade-up">{tagline}</p>
            )}
            <h2
              className="text-white text-3xl lg:text-4xl font-bold"
              data-aos="fade-up"
            >
              {title}
            </h2>
            <p
              className="text-white text-sm md:text-base leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {description}
            </p>
            {/* Explore button - commented out for future use */}
            {/* <a
              href={buttonLink}
              className="inline-block bg-white text-[#4a90a4] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 whitespace-nowrap cursor-pointer"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {buttonText}
            </a> */}
          </div>
          <div
            className="flex justify-center"
            data-aos="fade-up"
          >
            {image && image.trim() !== '' ? (
              <img
                src={image}
                alt="Refex MedTech Equipment"
                className="w-full max-w-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            ) : (
              <img
                src={fallbackImage}
                alt="Refex MedTech Equipment"
                className="w-full max-w-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
