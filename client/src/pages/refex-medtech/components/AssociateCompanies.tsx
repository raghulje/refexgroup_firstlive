import { useEffect, useRef } from 'react';

import ThreeIMedTechLogo from '../../../wp-content/uploads/2023/03/3i-MedTech-new-Logo-e1679395253850-858x1024.png';
import AdonisLogo from '../../../wp-content/uploads/2023/03/Adonis-logo-1024x666.png';
import { getApiBaseUrl } from '../../../config/env';

interface AssociateCompaniesProps {
  sectionData?: any;
  companies?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const AssociateCompanies = ({ sectionData, companies = [], getImagePath, getSectionContent }: AssociateCompaniesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Exploring Innovative Healthcare Solutions with Our Associate Companies.';
  const fallbackCompanies = [
    {
      name: '3i MedTech',
      logo: ThreeIMedTechLogo,
      description: '3i MedTech offers affordable diagnostic imaging solutions including X-rays, C-Arms, Mammography, pre-owned MRI and more, with a focus on reliability and global standards.'
    },
    {
      name: 'Adonis',
      logo: AdonisLogo,
      description: 'ADONIS provides quality medical imaging solutions with ergonomically designed machines utilizing the latest image processing techniques to the medical fraternity at affordable costs.'
    }
  ];

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const companiesToShow = companies.length > 0 ? companies : fallbackCompanies;

  const getImage = (img: any): string => {
    if (typeof img === 'string') {
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      return img;
    }
    if (img?.path) {
      return getImagePath ? getImagePath(img) : img.path;
    }
    return '';
  };

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
    <div ref={sectionRef} className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div id="explore" className="mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold text-gray-800 text-center"
            data-aos="fade-up"
          >
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 container mx-auto items-start">
          {companiesToShow.map((company: any, index: number) => (
            <div key={index} className="flex flex-col items-center text-center space-y-6">
              <div data-aos="fade-in" className="flex items-center justify-center h-48 w-full">
                {(() => {
                  const logoPath = getImage(company.logo || company.image);
                  if (!logoPath || logoPath.trim() === '') {
                    return fallbackCompanies[index] ? (
                      <img
                        src={fallbackCompanies[index].logo}
                        alt={company.name || `Company ${index + 1}`}
                        className="h-40 w-auto object-contain"
                      />
                    ) : null;
                  }
                  return (
                    <img
                      src={logoPath}
                      alt={company.name || `Company ${index + 1}`}
                      className="h-40 w-auto object-contain"
                      onError={(e) => {
                        if (fallbackCompanies[index]) {
                          (e.target as HTMLImageElement).src = fallbackCompanies[index].logo;
                        } else {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }
                      }}
                    />
                  );
                })()}
              </div>
              <p
                className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-md"
                data-aos="fade-up"
              >
                {company.description || company.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociateCompanies;
