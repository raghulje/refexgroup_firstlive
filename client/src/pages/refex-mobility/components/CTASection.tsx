import { Link } from 'react-router-dom';
import React from 'react';
import { trackButtonClick } from '../../../utils/ga4';

interface CTASectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export const CTASection: React.FC<CTASectionProps> = ({ sectionData, getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackTitle = 'Sustainable Mobility Redefined';
  const fallbackParagraphs = [
    'With Refex Mobility, embrace a new standard in urban commuting. Our cleaner-fuelled vehicles, from comfortable sedans to premium SUVs, are tailored for corporate needs with efficiency and environmental responsibility.',
    'By choosing us, your business not only optimizes costs but also actively accelerates our collective journey toward a carbon-neutral India.'
  ];
  const fallbackButtonText = 'Visit Website';
  const fallbackButtonLink = 'https://refexmobility.com/';
  // No fallback image - must come from CMS
  const fallbackOverlay = 'linear-gradient(92deg, rgba(255, 120, 55, 0.7) -14%, rgba(45, 174, 204, 0.7) 115%)';

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const paragraphsData = getSectionContent?.(sectionData, 'paragraphs');
  const paragraphs = Array.isArray(paragraphsData) ? paragraphsData : (paragraphsData ? JSON.parse(paragraphsData) : fallbackParagraphs);
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const backgroundImageData = getSectionContent?.(sectionData, 'backgroundImage');
  const backgroundImage = backgroundImageData?.path || (getImagePath && backgroundImageData ? getImagePath(backgroundImageData) : null) || '';

  return (
    <section
      className="relative bg-cover bg-center bg-gray-800"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem'
      }}
    >
      {/* Gradient overlay with orange to blue */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: fallbackOverlay
        }}
      ></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto" data-aos="fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {title}
          </h2>

          <div className="space-y-6 text-white text-lg leading-relaxed mb-8">
            {paragraphs.map((para: string, index: number) => (
              <p key={index} data-aos="fade-in" data-aos-delay={index === 0 ? 100 : 200}>
                {para}
              </p>
            ))}
          </div>

          <a
            href={buttonLink}
            target={buttonLink.startsWith('http') ? '_blank' : undefined}
            rel={buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            onClick={() => trackButtonClick(buttonText, 'mobility-page-cta', buttonLink)}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            data-aos="fade-in"
            data-aos-delay="300"
            data-ga-track="button"
            data-ga-label={buttonText}
            data-ga-location="mobility-page-cta"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};
