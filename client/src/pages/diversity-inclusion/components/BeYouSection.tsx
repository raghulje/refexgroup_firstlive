import { useEffect, useRef, useState } from 'react';
import DiversityBeYou from '../../../assets/diversity/Diversity-Inclusion-v2.jpg';

interface BeYouSectionProps {
  sectionData?: any;
  content?: string[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function BeYouSection({ sectionData, content = [], getImagePath, getSectionContent }: BeYouSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Be YOU at work';
  const fallbackImage = DiversityBeYou;
  const fallbackContent = [
    'Refex provides equal and fair employment opportunities to all eligible applicants for employment across the Group companies, in compliance with all applicable laws, thereby prohibiting any form of discrimination or harassment against any applicant or employee. This includes, and is not limited to discrimination based on age, race, color, gender, national origin, religion, creed, disability, sexual orientation, ancestry, gender identity, marital status, pregnancy, citizenship status, political view or activity and/or any other ground or reason whatsoever. This is applicable to all employee actions, including but not limited to recruitment, hiring, placement, promotion, transfer, separation, compensation, benefits, training, education. Refex makes hiring decisions based solely on qualifications, merit and business requirements/needs only.',
    'At Refex, we create a work environment where all employees learn and grow in their career journey and put their maximum efforts to achieve their fullest potential. We are an equal opportunity employer and are committed to diversity and inclusion at workplace and also maintaining respect and dignity for all.'
  ];

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || fallbackImage;
  const contentToShow = content.length > 0 ? content : fallbackContent;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Image */}
          <div
            className={`w-full max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
          >
            <img
              src={image}
              alt="Be YOU at work"
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>

          {/* Title */}
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
          >
            {title}
          </h2>

          {/* Description */}
          <div
            className={`max-w-4xl text-gray-700 leading-relaxed space-y-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
          >
            {contentToShow.map((para: string, index: number) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
