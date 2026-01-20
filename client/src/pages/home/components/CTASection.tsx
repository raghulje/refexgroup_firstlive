import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homeCTASectionService } from '../../../services/apiService';

// Fallback CTAs if CMS fails
const fallbackCTAs = [
  { id: 1, title: 'Got a question?', linkText: 'Get in touch', linkUrl: '/contact' },
  { id: 2, title: 'See our latest news', linkText: 'Refex Newsroom', linkUrl: '/newsroom' },
  { id: 3, title: 'Work at Refex', linkText: 'Careers', linkUrl: '/careers' }
];

interface CTA {
  id: number;
  title: string;
  linkText: string;
  linkUrl: string;
}

export default function CTASection() {
  const [ctas, setCtas] = useState<CTA[]>(fallbackCTAs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCTAs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const items = await homeCTASectionService.getAll();
        
        if (items && items.length > 0) {
          // Filter active CTAs and sort by orderIndex
          const activeCTAs = items
            .filter((item: any) => item.isActive !== false)
            .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((item: any) => ({
              id: item.id,
              title: item.title || '',
              linkText: item.linkText || 'Learn More',
              linkUrl: item.linkUrl || '#'
            }));

          if (activeCTAs.length > 0) {
            setCtas(activeCTAs);
          } else {
            setCtas(fallbackCTAs);
          }
        } else {
          setCtas(fallbackCTAs);
        }
      } catch (error) {
        console.error('Error fetching CTA sections:', error);
        setError('Failed to load CTA sections');
        setCtas(fallbackCTAs);
      } finally {
        setLoading(false);
      }
    };

    fetchCTAs();
  }, []);

  if (loading) {
    return (
      <section className="py-[27px] md:py-[34px] bg-green-50">
        <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
          <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px] bg-blue-500">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-6 bg-white/30 rounded mb-4 mx-auto w-32"></div>
                  <div className="h-10 bg-white/30 rounded w-40 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[27px] md:py-[34px] bg-green-50">
      <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
        <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]" style={{ backgroundColor: '#3b9dd6' }}>
          {error && (
            <p className="text-sm text-white text-center mb-4">{error}</p>
          )}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {ctas.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-white">No CTA sections available</p>
              </div>
            ) : (
              ctas.map((cta, index) => (
                <div 
                  key={cta.id} 
                  className="text-center" 
                  data-aos="fade-up" 
                  data-aos-duration="700" 
                  data-aos-delay={(index + 1) * 100} 
                  data-aos-easing="ease-out-cubic"
                >
                  <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{cta.title}</h3>
                  <Link
                    to={cta.linkUrl}
                    className="inline-block border-2 border-white bg-transparent text-white px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-nowrap cursor-pointer text-sm md:text-base"
                  >
                    {cta.linkText}
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
