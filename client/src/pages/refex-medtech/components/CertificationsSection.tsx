import { useEffect, useRef } from 'react';

import AERBCert from '../../../wp-content/uploads/2025/04/images.jpg';
import CDSCOCert from '../../../wp-content/uploads/2025/04/1536257006-9131.jpg-removebg-preview.png';
import BISCert from '../../../wp-content/uploads/2025/04/bis-certification-services.jpg';
import ISOCert from '../../../wp-content/uploads/2025/04/b136d1c0df779785_400x400ar.jpg';
import { getApiBaseUrl } from '../../../config/env';

interface CertificationsSectionProps {
  sectionData?: any;
  certifications?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const CertificationsSection = ({ sectionData, certifications = [], getImagePath, getSectionContent }: CertificationsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Certifications';
  const fallbackCertifications = [
    { image: AERBCert, title: 'AERB' },
    { image: CDSCOCert, title: 'CDSCO' },
    { image: BISCert, title: 'BIS' },
    { image: ISOCert, title: 'ISO 13485' }
  ];

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const certificationsToShow = certifications.length > 0 ? certifications : fallbackCertifications;

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
    if (img?.path) {
      const path = getImagePath ? getImagePath(img) : img.path;
      if (path && path.trim() !== '' && !path.startsWith('/assets/')) {
        return path;
      }
    }
    return '';
  };

  return (
    <div ref={sectionRef} className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12"
          data-aos="fade-up"
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {certificationsToShow.map((cert: any, index: number) => {
            const certImagePath = getImage(cert.image || cert);
            const finalImagePath = certImagePath && certImagePath.trim() !== '' 
              ? certImagePath 
              : (fallbackCertifications[index]?.image || '');
            
            if (!finalImagePath) return null;
            
            return (
              <div
                key={index}
                className="text-center space-y-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center items-center h-32">
                  <img
                    src={finalImagePath}
                    alt={cert.title || `Certification ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      if (fallbackCertifications[index]) {
                        (e.target as HTMLImageElement).src = fallbackCertifications[index].image;
                      } else {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{cert.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CertificationsSection;
