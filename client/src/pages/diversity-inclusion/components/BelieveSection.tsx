import { useEffect, useRef, useState } from 'react';
import EqualOpportunitiesIcon from '../../svg/diversityinclusion/equalopportunities.svg';
import DiversityInclusionIcon from '../../svg/diversityinclusion/diversityinclusion.svg';
import RespectIcon from '../../svg/diversityinclusion/respect.svg';
import { getApiBaseUrl } from '../../../config/env';

interface BelieveSectionProps {
  sectionData?: any;
  beliefs?: any[];
  getSectionContent?: (section: any, contentKey: string) => any;
}

const fallbackBeliefs = [
  {
    title: 'Equal Opportunities',
    description: 'Providing equal employment opportunities without discrimination or bias.',
    icon: EqualOpportunitiesIcon
  },
  {
    title: 'Diversity and Inclusion',
    description: 'Maintaining a workplace culture that values diversity and inclusiveness.',
    icon: DiversityInclusionIcon
  },
  {
    title: 'Respect',
    description: 'Treating all employees fairly and with respect, regardless of personal characteristics.',
    icon: RespectIcon
  },
];

export default function BelieveSection({ sectionData, beliefs = [], getSectionContent }: BelieveSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Fallback values
  const fallbackTitle = 'What we believe in!';

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;

  // Map beliefs - use iconPath from CMS if available, otherwise fallback to hardcoded icons
  const iconMap: any = {
    'Equal Opportunities': EqualOpportunitiesIcon,
    'Diversity and Inclusion': DiversityInclusionIcon,
    'Respect': RespectIcon,
  };

  const beliefsToShow = beliefs.length > 0
    ? beliefs.map((belief: any, index: number) => {
      const fallbackBelief = fallbackBeliefs[index];

      // Use iconPath from CMS if available, otherwise use hardcoded icon mapping
      let iconSrc = belief.iconPath;
      
      // If iconPath is already a resolved URL (starts with http), use it directly
      if (iconSrc && (iconSrc.startsWith('http://') || iconSrc.startsWith('https://'))) {
        // Already a full URL, use as is
      } else if (iconSrc && typeof iconSrc === 'string' && iconSrc.startsWith('/uploads/')) {
        // If it's a path that hasn't been resolved yet, add API base URL
        const apiBase = getApiBaseUrl();
        iconSrc = `${apiBase}${iconSrc}`;
      } else if (!iconSrc || iconSrc === '' || iconSrc === null) {
        // Fallback to hardcoded icon if no iconPath in CMS
        iconSrc = iconMap[belief.title] || fallbackBelief?.icon || EqualOpportunitiesIcon;
      }
      // If iconSrc is already resolved (from page.tsx), use it as is

      return {
        ...belief,
        icon: iconSrc
      };
    })
    : fallbackBeliefs;

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        backgroundImage: 'linear-gradient(133deg, #258685 0%, #7DC144 100%)',
        backgroundColor: 'transparent',
        paddingTop: '4%',
        paddingBottom: '4%'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            {title}
          </h2>
        </div>

        {/* Belief Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {beliefsToShow.map((belief, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Icon */}
                <div className="w-20 h-20 flex items-center justify-center mb-2">
                  <img
                    src={belief.icon}
                    alt={belief.title}
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">{belief.title}</h3>

                {/* Description */}
                <p className="text-white/90 leading-relaxed">{belief.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
