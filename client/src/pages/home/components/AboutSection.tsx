import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollRevealSection from '../../../components/base/ScrollRevealSection';
import { homeAboutSectionService } from '../../../services/apiService';
import AboutBgCurve from '../../../wp-content/uploads/2023/02/About-BG-Curve.png';
import { getApiBaseUrl } from '../../../config/env';

// Fallback content if CMS fails (text only, no images)
const fallbackContent = {
  title: 'About',
  tagline: 'Choosing green,<br />Chasing growth',
  paragraphs: [
    'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment-friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.',
    'At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited.',
    'Refex Holding Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.',
    'Refex\'s values, including integrity, diversity, dedication, commitment, and competitiveness have been central to its success, allowing the company to respond to shifting market trends with a "growth mindset." Refex is dedicated to improving the customer experience, constantly innovating, and upholding transparency and honesty. These values have positioned Refex as a key industry player, setting the standard for others to follow.'
  ],
  buttonText: 'Know More',
  buttonLink: '/about-refex',
  logoImage: '', // No fallback - must come from CMS
  mainImage: '' // No fallback - must come from CMS
};

export default function AboutSection() {
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutSection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await homeAboutSectionService.get();
        
        if (data) {
          // Get image URLs - only from CMS, no fallbacks
          let logoImagePath = '';
          let mainImagePath = '';

          if (data.logoImage?.filePath) {
            if (data.logoImage.filePath.startsWith('/uploads/')) {
              const apiBase = getApiBaseUrl();
              logoImagePath = `${apiBase}${data.logoImage.filePath}`;
            } else if (data.logoImage.filePath.startsWith('http://') || data.logoImage.filePath.startsWith('https://')) {
              logoImagePath = data.logoImage.filePath;
            } else if (data.logoImage.filePath.startsWith('/')) {
              const apiBase = getApiBaseUrl();
              logoImagePath = `${apiBase}${data.logoImage.filePath}`;
            } else {
              logoImagePath = data.logoImage.filePath;
            }
          } else if (data.logoImage?.url) {
            logoImagePath = data.logoImage.url;
          }

          if (data.mainImage?.filePath) {
            if (data.mainImage.filePath.startsWith('/uploads/')) {
              const apiBase = getApiBaseUrl();
              mainImagePath = `${apiBase}${data.mainImage.filePath}`;
            } else if (data.mainImage.filePath.startsWith('http://') || data.mainImage.filePath.startsWith('https://')) {
              mainImagePath = data.mainImage.filePath;
            } else if (data.mainImage.filePath.startsWith('/')) {
              const apiBase = getApiBaseUrl();
              mainImagePath = `${apiBase}${data.mainImage.filePath}`;
            } else {
              mainImagePath = data.mainImage.filePath;
            }
          } else if (data.mainImage?.url) {
            mainImagePath = data.mainImage.url;
          }

          // Build paragraphs array from content fields
          const paragraphs = [
            data.content_paragraph_1,
            data.content_paragraph_2,
            data.content_paragraph_3,
            data.content_paragraph_4
          ].filter(p => p && p.trim());

          setContent({
            title: data.title || fallbackContent.title,
            tagline: data.tagline || fallbackContent.tagline,
            paragraphs: paragraphs.length > 0 ? paragraphs : fallbackContent.paragraphs,
            buttonText: data.button_text || fallbackContent.buttonText,
            buttonLink: data.button_link || fallbackContent.buttonLink,
            logoImage: logoImagePath,
            mainImage: mainImagePath
          });
        }
      } catch (error) {
        console.error('Error fetching about section:', error);
        setError('Failed to load about section');
        // Use fallback content on error (text only, no images)
        setContent({
          ...fallbackContent,
          logoImage: '',
          mainImage: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSection();
  }, []);

  if (loading) {
    return (
      <section id="content" className="py-10 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="content" className="py-8 sm:py-10 md:py-12 bg-white relative overflow-hidden">
      {/* Background Curve Design - Right Corner (Hidden on mobile, shown on desktop) */}
      <div
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-full max-w-2xl pointer-events-none"
        style={{
          backgroundImage: `url(${AboutBgCurve})`,
          backgroundPosition: 'right top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          zIndex: 0
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <ScrollRevealSection animation="fade-right">
            <div className="space-y-4 sm:space-y-6">
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              
              {/* About Title - Centered on mobile, left-aligned on desktop */}
              <p className="text-black font-extrabold text-base md:text-lg text-center lg:text-left">{content.title}</p>
              
              {/* Logo and Tagline - Stacked on mobile, side-by-side on desktop */}
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-3 lg:gap-0">
                {content.logoImage && (
                <img
                  src={content.logoImage}
                  alt="Refex Logo"
                  width="174"
                  height="54"
                    className="w-auto h-auto"
                    style={{ maxWidth: '174px', height: 'auto' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                />
                )}
                <p
                  className="text-gray-900 text-center lg:text-left lg:ml-4"
                  style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: '1.2em',
                    color: '#000000'
                  }}
                  dangerouslySetInnerHTML={{ __html: content.tagline }}
                />
              </div>
              
              {/* Paragraphs - Better mobile spacing */}
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-left">{paragraph}</p>
                ))}
              </div>
              
              {/* Know More Button - Centered on mobile, left-aligned on desktop */}
              {content.buttonLink && (
                <div className="flex justify-center lg:justify-start pt-2">
                <Link
                  to={content.buttonLink}
                    className="relative inline-block px-6 sm:px-8 py-2.5 sm:py-2 border border-slate-600 text-slate-700 rounded-full overflow-hidden text-sm sm:text-base group/btn"
                >
                  <span className="relative z-10">{content.buttonText}</span>
                  <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
                  <span className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
                    {content.buttonText}
                  </span>
                </Link>
                </div>
              )}
            </div>
          </ScrollRevealSection>

          {/* Main Image - Below content on mobile, right side on desktop */}
          <ScrollRevealSection animation="fade-left">
            <div className="relative z-10 mt-6 lg:mt-0">
              {content.mainImage && (
              <img
                src={content.mainImage}
                alt="Refex Team"
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              )}
            </div>
          </ScrollRevealSection>
        </div>
      </div>
    </section>
  );
}
