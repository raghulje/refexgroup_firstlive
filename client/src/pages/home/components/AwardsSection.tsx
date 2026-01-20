import { useState, useEffect, useRef } from 'react';
import AwardCard from './AwardCard';
import LaurelAwardCard from './LaurelAwardCard';
import CertificationCard from './CertificationCard';
import { awardsService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';

// No fallback awards - all must come from CMS
const fallbackAwards: Award[] = [];

interface Award {
  id: number;
  image: string;
  title: string;
  year?: string | number;
  recipient?: string;
  awardType?: string;
  showAwardName?: boolean;
}

export default function AwardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiAwards = await awardsService.getAll();
        
        if (apiAwards && apiAwards.length > 0) {
          // Filter active awards and sort by orderIndex
          const activeAwards = apiAwards
            .filter((award: any) => award.isActive !== false)
            .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

          // Transform API awards to match component format
          const transformedAwards: Award[] = activeAwards.map((award: any) => {
            let imagePath = '';

            // 1) If image is a related Media object
            if (award.image?.filePath) {
              imagePath = award.image.filePath;
            } else if (award.image?.url) {
              imagePath = award.image.url;
            }

            // 2) If image is stored directly as a string path on the entity
            if (!imagePath && typeof award.image === 'string' && award.image.trim()) {
              imagePath = award.image.trim();
            }

            // 3) If we have a relative path, decide how to prefix it
            if (imagePath && imagePath.startsWith('/')) {
              // New uploads: /uploads/... should be served from the backend domain
              if (imagePath.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                imagePath = `${apiBase}${imagePath}`;
              } else if (imagePath.startsWith('/assets/')) {
                // Filter out old /assets/ paths - they should not be displayed
                imagePath = '';
              }
            }

            return {
              id: award.id,
              image: imagePath || '', // No fallback - must come from CMS
              title: award.title || '',
              year: award.year ? String(award.year) : undefined,
              recipient: award.recipient || undefined,
              awardType: award.awardType || 'standard',
              showAwardName: award.showAwardName !== undefined ? award.showAwardName : true
            };
          });

          // Filter out awards without valid images (only /uploads/ paths are valid)
          const validAwards = transformedAwards.filter(a => a.image && a.image.startsWith('http'));
          
          if (validAwards.length > 0) {
            setAwards(validAwards);
          } else {
            setAwards([]);
          }
        } else {
          setAwards([]);
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
        setError('Failed to load awards');
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Separate awards by type
  // Standard awards (first 12 or awards without year/recipient)
  const standardAwards = awards.filter(a => !a.year && !a.recipient && a.awardType !== 'certification').slice(0, 12);
  // Laurel awards (with year and recipient)
  const laurelAwards = awards.filter(a => a.year && a.recipient);
  // Certification awards
  const certificationAwards = awards.filter(a => a.awardType === 'certification' || (!a.year && !a.recipient && awards.indexOf(a) >= 12));

  // Helper to get grid columns for certification awards based on count
  const getCertificationGridClasses = (count: number) => {
    if (count <= 1) {
      return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1';
    }
    if (count === 2) {
      // 2 awards: 6,6 layout (2 per row)
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    }
    if (count === 3) {
      // 3 awards: 4,4,4 layout (3 per row)
      return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3';
    }
    // 4 or more: 4 per row (3,3,3,3 etc. in tailwind's 12-col sense)
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
          <div className="text-center mb-20">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 bg-gray-50 reveal-fade-up">
      <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
        <div className="text-center mb-9" data-aos="fade-up">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Awards &amp; Accolades</h2>
          <p className="text-xs md:text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our excellence is celebrated with diverse awards and accolades recognizing our achievements in quality and innovation.
          </p>
          {error && (
            <p className="text-[0.7rem] md:text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>

        {awards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No awards available</p>
          </div>
        ) : (
          <>

            {/* Standard Awards - 4 columns grid */}
            {standardAwards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 sm:gap-y-3 md:gap-y-4 mb-2 sm:mb-3 md:mb-4">
                {standardAwards.map((award, index) => (
                  <AwardCard
                    key={award.id}
                    image={award.image}
                    title={award.title}
                    year={award.year}
                    recipient={award.recipient}
                    showAwardName={award.showAwardName !== undefined ? award.showAwardName : true}
                    delay={index * 50}
                  />
                ))}
              </div>
            )}

            {/* Laurel Awards with year and recipient */}
            {laurelAwards.length > 0 && (
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 sm:gap-y-3 md:gap-y-4">
                  {laurelAwards.map((award, index) => (
                    <LaurelAwardCard
                      key={award.id}
                      image={award.image}
                      title={award.title}
                      year={award.year || ''}
                      recipient={award.recipient || ''}
                      showAwardName={award.showAwardName !== undefined ? award.showAwardName : true}
                      delay={(standardAwards.length + index) * 50}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Certification Awards */}
            {certificationAwards.length > 0 && (
              <div className="mt-2 sm:mt-3 md:mt-4">
                <div
                  className={`grid gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 sm:gap-y-3 md:gap-y-4 ${getCertificationGridClasses(
                    certificationAwards.length
                  )}`}
                >
                  {certificationAwards.map((award, index) => (
                    <CertificationCard
                      key={award.id}
                      image={award.image}
                      title={award.title}
                      showAwardName={award.showAwardName !== undefined ? award.showAwardName : true}
                      delay={(standardAwards.length + laurelAwards.length + index) * 50}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
