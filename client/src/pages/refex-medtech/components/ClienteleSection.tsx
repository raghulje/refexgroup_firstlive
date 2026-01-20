import { useEffect, useRef } from 'react';
import { trackLinkClick } from '../../../utils/ga4';

import Logo1 from '../../../wp-content/uploads/2025/04/logo01.jpg';
import Logo2 from '../../../wp-content/uploads/2025/04/logo02.jpg';
import Logo3 from '../../../wp-content/uploads/2025/04/logo03.jpg';
import Logo4 from '../../../wp-content/uploads/2025/04/logo04.jpg';
import Logo5 from '../../../wp-content/uploads/2025/04/logo05.jpg';
import Logo6 from '../../../wp-content/uploads/2025/04/logo06.jpg';
import Logo7 from '../../../wp-content/uploads/2025/04/logo07.jpg';
import Logo8 from '../../../wp-content/uploads/2025/04/logo08.jpg';
import Logo9 from '../../../wp-content/uploads/2025/04/logo09.jpg';
import Logo10 from '../../../wp-content/uploads/2025/04/logo10.jpg';
import Logo11 from '../../../wp-content/uploads/2025/04/logo11.jpg';
import Logo12 from '../../../wp-content/uploads/2025/04/logo12.jpg';
import Logo13 from '../../../wp-content/uploads/2025/04/logo13.jpg';
import Logo14 from '../../../wp-content/uploads/2025/04/logo14.jpg';
import Logo15 from '../../../wp-content/uploads/2025/04/logo15.jpg';
import Logo16 from '../../../wp-content/uploads/2025/04/logo16.jpg';
import Logo17 from '../../../wp-content/uploads/2025/04/logo17.jpg';
import Logo18 from '../../../wp-content/uploads/2025/04/logo18.jpg';
import Logo19 from '../../../wp-content/uploads/2025/04/logo19.jpg';
import Logo20 from '../../../wp-content/uploads/2025/04/logo20.jpg';
import Logo21 from '../../../wp-content/uploads/2025/04/logo21.jpg';
import Logo22 from '../../../wp-content/uploads/2025/04/logo22.jpg';
import Logo23 from '../../../wp-content/uploads/2025/04/logo23.jpg';
import Logo24 from '../../../wp-content/uploads/2025/04/logo24.jpg';
import { getApiBaseUrl } from '../../../config/env';

interface ClienteleSectionProps {
  sectionData?: any;
  clientele?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const ClienteleSection = ({ sectionData, clientele = [], getImagePath, getSectionContent }: ClienteleSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Clientele';
  const fallbackClients = [
    Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8,
    Logo9, Logo10, Logo11, Logo12, Logo13, Logo14, Logo15, Logo16,
    Logo17, Logo18, Logo19, Logo20, Logo21, Logo22, Logo23, Logo24
  ];

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const clientsToShow = clientele.length > 0 ? clientele : fallbackClients;

  const getImage = (img: any): string => {
    if (typeof img === 'string') {
      if (img.startsWith('/assets/')) {
        return '';
      }
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      if (img.trim() !== '') {
        return img;
      }
      return '';
    }
    if (img?.path || img?.image) {
      const path = getImagePath ? getImagePath(img) : (img.path || img.image);
      if (path && path.trim() !== '' && !path.startsWith('/assets/')) {
        return path;
      }
    }
    return '';
  };

  return (
    <div ref={sectionRef} className="bg-gradient-to-br from-[#4a90a4] to-[#5ba3b8] py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
          data-aos="fade-up"
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {clientsToShow.map((logo: any, index: number) => {
            const logoPath = getImage(logo);
            const finalLogoPath = logoPath && logoPath.trim() !== '' ? logoPath : (fallbackClients[index] || '');
            if (!finalLogoPath) return null;
            
            return (
              <div
                key={index}
                onClick={() => {
                  const clientName = typeof logo === 'string' ? `Client ${index + 1}` : (logo?.name || `Client ${index + 1}`);
                  trackLinkClick(clientName, '#', 'internal');
                }}
                className="bg-white rounded-lg p-4 flex items-center justify-center h-24 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 30}
                data-ga-track="link"
                data-ga-label={`Clientele Logo ${index + 1}`}
              >
                <img
                  src={finalLogoPath}
                  alt={`Client ${index + 1}`}
                  className="max-h-20 md:max-h-24 lg:max-h-28 max-w-full object-contain"
                  onError={(e) => {
                    if (fallbackClients[index]) {
                      (e.target as HTMLImageElement).src = fallbackClients[index];
                    } else {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClienteleSection;
