// All logos must come from CMS - no static imports
import { getApiBaseUrl } from '../../../config/env';

interface LogoCardsSectionProps {
  sectionData?: any;
  cards?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function LogoCardsSection({ sectionData, cards = [], getImagePath, getSectionContent }: LogoCardsSectionProps) {
  // No fallback logos - all must come from CMS
  const fallbackLogos: any[] = [];

  const logos = cards.length > 0 ? cards : fallbackLogos;

  const getImage = (img: any): string => {
    if (typeof img === 'string') {
      // Filter out old /assets/ paths
      if (img.startsWith('/assets/')) {
        return '';
      }
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      return img;
    }
    if (img?.path) {
      const path = getImagePath ? getImagePath(img) : img.path;
      return path && !path.startsWith('/assets/') ? path : '';
    }
    return '';
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1156.67px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {logos.map((logo, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="1000"
              className="group cursor-pointer logo-card"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] p-10 flex items-center justify-center h-48 overflow-hidden hover:scale-105 hover:-translate-y-2 border border-gray-100">
                <img
                  src={getImage(logo.image || logo)}
                  alt={logo.name || 'Logo'}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
