import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeCareersSectionService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';

// Fallback content if CMS fails (text only, no images)
const fallbackContent = {
  tagline: 'Join Refex',
  title: 'Resilient by <span className="text-[#ff6b35]">Nature.</span><br />Robust by <span className="text-[#ff6b35]">People.</span>',
  description: 'Refex prioritizes inclusivity, encouraging employee growth and learning opportunities in a diverse and welcoming work environment.',
  primaryButtonText: 'Explore careers at Refex',
  primaryButtonLink: '/careers#apply',
  secondaryButtonText: 'Diversity at Refex',
  secondaryButtonLink: '/diversity-inclusion',
  image: '' // No fallback - must come from CMS
};

export default function CareersSection() {
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareersSection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await homeCareersSectionService.get();
        
        if (data) {
          // Get image URL - only from CMS, no fallbacks
          let imagePath = '';
          if (data.image?.filePath) {
            if (data.image.filePath.startsWith('/uploads/')) {
              const apiBase = getApiBaseUrl();
              imagePath = `${apiBase}${data.image.filePath}`;
            } else if (data.image.filePath.startsWith('http://') || data.image.filePath.startsWith('https://')) {
              imagePath = data.image.filePath;
            } else if (data.image.filePath.startsWith('/')) {
              const apiBase = getApiBaseUrl();
              imagePath = `${apiBase}${data.image.filePath}`;
            } else {
              imagePath = data.image.filePath;
            }
          } else if (data.image?.url) {
            imagePath = data.image.url;
          }

          setContent({
            tagline: data.tagline || fallbackContent.tagline,
            title: data.title || fallbackContent.title,
            description: data.description || fallbackContent.description,
            primaryButtonText: data.primaryButtonText || fallbackContent.primaryButtonText,
            primaryButtonLink: data.primaryButtonLink || fallbackContent.primaryButtonLink,
            secondaryButtonText: data.secondaryButtonText || fallbackContent.secondaryButtonText,
            secondaryButtonLink: data.secondaryButtonLink || fallbackContent.secondaryButtonLink,
            image: imagePath
          });
        }
      } catch (error) {
        console.error('Error fetching careers section:', error);
        setError('Failed to load careers section');
        setContent({
          ...fallbackContent,
          image: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCareersSection();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6" data-aos="fade-up">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <p className="text-[0.7rem] md:text-xs font-semibold tracking-wider uppercase text-gray-600">{content.tagline}</p>
            <h2 
              className="text-2xl lg:text-3xl font-bold leading-tight text-gray-900"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
            <p className="text-sm leading-relaxed text-gray-600">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {content.primaryButtonLink && (
                <Link
                  to={content.primaryButtonLink}
                  className="relative inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-slate-700 rounded-full font-semibold overflow-hidden whitespace-nowrap group/btn"
                >
                  <span className="relative z-10 flex items-center">
                    {content.primaryButtonText}
                    <i className="ri-arrow-right-line ml-2"></i>
                  </span>
                  <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
                  <span className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
                    {content.primaryButtonText}
                    <i className="ri-arrow-right-line ml-2"></i>
                  </span>
                </Link>
              )}
              {content.secondaryButtonLink && (
                <Link
                  to={content.secondaryButtonLink}
                  className="relative inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-slate-700 rounded-full font-semibold overflow-hidden whitespace-nowrap group/btn"
                >
                  <span className="relative z-10">{content.secondaryButtonText}</span>
                  <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
                  <span className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
                    {content.secondaryButtonText}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative" data-aos="fade-left">
            <img
              src={content.image}
              alt="Refex Team Collaboration"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
