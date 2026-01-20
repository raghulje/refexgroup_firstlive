import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import LeadershipSection from './components/LeadershipSection';
import Footer from '../../components/feature/Footer';
import { Link, useLocation } from 'react-router-dom';
import { pagesService, sectionsService, coreValuesService } from '../../services/apiService';

import AboutRefexHero from '../../wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-3.jpg';
import RefexLogo from '../../wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png';
import OfficeGroupPhoto from '../../wp-content/uploads/2023/03/Office-Group-Photo-comp-1.jpg';
import VisionMissionBg from '../../wp-content/uploads/2023/02/Vision-Mission-BG.jpg';
import MilestoneTimeline from '../../wp-content/uploads/2023/05/Milestone-Only-Year-1.png';
import CareersBg from '../../wp-content/uploads/2023/02/REFEX_home_career-BG.jpg';
import CoreValuesPattern from '../../wp-content/uploads/2023/02/About_CoreValues_Dot-Pattern.png';

// Import SVGs
import PrincipledExcellenceIcon from '../svg/about/principledexcellence.svg';
import AuthenticityIcon from '../svg/about/Authenticity.svg';
import CustomerValueIcon from '../svg/about/CustomerValue.svg';
import EsteemCultureIcon from '../svg/about/EsteemCulture.svg';
import { getApiBaseUrl } from '../../config/env';
import { trackTabSwitch, trackButtonClick } from '../../utils/ga4';

// Fallback core values
const fallbackCoreValues = [
  {
    letter: 'P',
    title: 'Principled Excellence',
    description: "Doing what's right, with integrity and intention.",
    icon: PrincipledExcellenceIcon
  },
  {
    letter: 'A',
    title: 'Authenticity',
    description: 'Bringing your true self to work, and honouring that in others.',
    icon: AuthenticityIcon
  },
  {
    letter: 'C',
    title: 'Customer Value',
    description: 'Keeping our customers at the heart of everything we do.',
    icon: CustomerValueIcon
  },
  {
    letter: 'E',
    title: 'Esteem Culture',
    description: 'Fostering a workplace where respect, dignity, and belonging are everyday experiences.',
    icon: EsteemCultureIcon
  },
];

function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#6bba29]">
      {count}{suffix}
    </div>
  );
}

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [coreValues, setCoreValues] = useState(fallbackCoreValues);
  const [pageSections, setPageSections] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    if (typeof imageData === 'string' && imageData.trim()) {
      // Filter out old /assets/ paths
      if (imageData.startsWith('/assets/')) {
        return '';
      }
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      return imageData;
    }

    if (imageData.filePath) {
      // Filter out old /assets/ paths
      if (imageData.filePath.startsWith('/assets/')) {
        return '';
      }
      if (imageData.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData.filePath}`;
      }
      return imageData.filePath;
    }

    if (imageData.url) {
      return imageData.url;
    }

    return '';
  };

  // Helper function to get section content value
  const getSectionContent = (section: any, contentKey: string): any => {
    if (!section?.content) return null;
    const contentItem = section.content.find((c: any) => c.contentKey === contentKey);
    if (!contentItem) return null;

    // Handle JSON content
    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }

    // Handle image/media content
    if (contentItem.media || contentItem.mediaId) {
      // Try to get positioning from the content item itself first
      let positionX = contentItem.backgroundPositionX || contentItem.positionX;
      let positionY = contentItem.backgroundPositionY || contentItem.positionY;

      // If not found, try to find separate positioning content items in the same section
      if ((!positionX || positionX === '50') && section?.content) {
        const posXItem = section.content.find((c: any) => c.contentKey === `${contentKey}PositionX`);
        if (posXItem && posXItem.contentValue) {
          positionX = posXItem.contentValue;
        }
      }

      if ((!positionY || positionY === '50') && section?.content) {
        const posYItem = section.content.find((c: any) => c.contentKey === `${contentKey}PositionY`);
        if (posYItem && posYItem.contentValue) {
          positionY = posYItem.contentValue;
        }
      }

      return {
        path: getImagePath(contentItem.media),
        positionX: positionX || '50',
        positionY: positionY || '50'
      };
    }

    return contentItem.contentValue;
  };

  // Helper function to get background position style
  const getBackgroundPosition = (positionX?: string, positionY?: string): string => {
    const x = positionX || '50';
    const y = positionY || '50';
    return `${x}% ${y}%`;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('about-refex');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);

          // Organize sections by sectionKey
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);
        }

        // Fetch core values
        try {
          const coreValuesData = await coreValuesService.getAll();
          if (coreValuesData && coreValuesData.length > 0) {
            const activeValues = coreValuesData
              .filter((value: any) => value.isActive !== false)
              .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((value: any) => {
                // Map icon - try to get from CMS or use fallback
                let icon = PrincipledExcellenceIcon; // default
                const letter = (value.letter || '').toUpperCase();
                if (letter === 'P') icon = PrincipledExcellenceIcon;
                else if (letter === 'A') icon = AuthenticityIcon;
                else if (letter === 'C') icon = CustomerValueIcon;
                else if (letter === 'E') icon = EsteemCultureIcon;

                // Try to get icon from CMS if available
                if (value.icon) {
                  const iconPath = getImagePath(value.icon);
                  if (iconPath) {
                    icon = iconPath;
                  }
                }

                return {
                  letter: value.letter || '',
                  title: value.title || '',
                  description: value.description || '',
                  icon: icon
                };
              });

            if (activeValues.length > 0) {
              setCoreValues(activeValues);
            }
          }
        } catch (error) {
          console.error('Error fetching core values:', error);
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    // Scroll to section if hash is present
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1).toLowerCase();
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const offset = 150; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    scrollToHash();
  }, []);

  // Listen for hash changes when already on the page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1).toLowerCase();
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const offset = 150; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Listen for hashchange event
    window.addEventListener('hashchange', handleHashChange);
    
    // Also check hash when location changes
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'corevalues', 'leadership', 'missionvision', 'ourstory'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'corevalues', label: 'Our Core Values' },
    { id: 'leadership', label: 'Leadership Team' },
    { id: 'missionvision', label: 'Mission & Vision' },
    { id: 'ourstory', label: 'Our Story' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Track tab switch
      const sectionLabel = sections.find(s => s.id === id)?.label || id;
      trackTabSwitch(sectionLabel, 'about-page');
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[350px] sm:min-h-[400px] md:h-[400px] flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {(() => {
            const heroSection = pageSections.hero;
            const bgImage = getSectionContent(heroSection, 'backgroundImage');
            const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : AboutRefexHero);
            const bgPosition = bgImage?.positionX && bgImage?.positionY
              ? getBackgroundPosition(bgImage.positionX, bgImage.positionY)
              : 'center';

            return (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${bgImagePath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: bgPosition,
                  backgroundRepeat: 'no-repeat'
                }}
              />
            );
          })()}
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(173deg, rgba(0,0,0,0.7) 33%, rgba(0,0,0,0.7) 100%)',
              transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1210px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-4 sm:gap-6 md:gap-12">
            {/* Title Section */}
            <div className="flex-1 md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide mb-3 sm:mb-4">
                {getSectionContent(pageSections.hero, 'title') || 'About REFEX'}
              </h1>
            </div>

            {/* Vertical Separator (Desktop) */}
            <div className="hidden md:block w-[3px] h-24 bg-[#50b848]"></div>

            {/* Description Section */}
            <div className="flex-1 md:text-left">
              <p className="text-white text-sm sm:text-base md:text-base font-medium leading-relaxed max-w-xl">
                {getSectionContent(pageSections.hero, 'description') || 'Refex Group, founded in 2002, diversified into ash and coal handling, power trading, refrigerant gas, medTech etc.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation - Hidden on mobile, shown on desktop */}
      <nav className="hidden md:block sticky top-[72px] bg-[#7dc144] shadow-sm z-40 border-b border-[#6db03a]">
        <div className="container mx-auto px-6 lg:px-12">
          <ul className="flex justify-center gap-2 md:gap-8 overflow-x-auto">
            {sections.map((section) => (
              <li key={section.id} className="flex-shrink-0">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`block px-4 md:px-7 py-4 text-xs md:text-sm font-semibold transition-all duration-300 border-b-2 ${activeSection === section.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:border-white/50'
                    }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Overview Section */}
      <section id="overview" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {(() => {
            const overviewSection = pageSections.overview;
            const logo = getSectionContent(overviewSection, 'logo');
            const logoPath = logo?.path || (logo ? getImagePath(logo) : RefexLogo);
            const tagline = getSectionContent(overviewSection, 'tagline') || 'We thrive on RESILIENCE';
            const yearsInBusiness = getSectionContent(overviewSection, 'yearsInBusiness') || '23';
            const peopleImpacted = getSectionContent(overviewSection, 'peopleImpacted') || '2';
            const description = getSectionContent(overviewSection, 'description') || '';
            const paragraphs = description ? description.split('\n\n').filter((p: string) => p.trim()) : [
              'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals. At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited. The company\'s excellent reputation and trust in the industry is due to its commitment to core values such as integrity, diversity, dedication, commitment, and competitiveness.',
              'Sherisha Technologies Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.',
              'Refex Group\'s growth mindset is its biggest strength, which has allowed it to stay ahead of the competition by seizing emerging opportunities. By prioritizing customer satisfaction and continuous improvement, Refex Group has been able to provide superior value to all its stakeholders.',
              'The company\'s culture of excellence has helped us to attract the best talent, and its focus on growth, learning, and adaptability will continue to drive our success in the future. Refex Group\'s commitment to leading by example and continuously improving while staying true to its values is a recipe for long-term success.'
            ];
            const image = getSectionContent(overviewSection, 'image');
            const imagePath = image?.path || (image ? getImagePath(image) : OfficeGroupPhoto);

            return (
              <>
                <div data-aos="fade-up">
                  <div className="text-center mb-10">
                    <img
                      src={logoPath}
                      alt="Refex Logo"
                      className="h-12 md:h-14 mx-auto mb-6"
                    />
                    <p className="text-gray-600 text-sm md:text-base font-light">{tagline}</p>
                  </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                  <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-14">
                    <div className="text-center">
                      <Counter end={parseInt(yearsInBusiness) || 23} suffix="+" />
                      <p className="text-gray-700 mt-3 text-sm md:text-base font-medium">Years in Business</p>
                    </div>
                    <div className="text-center">
                      <Counter end={parseInt(peopleImpacted) || 2} suffix="M" />
                      <p className="text-gray-700 mt-3 text-sm md:text-base font-medium">People Impacted</p>
                    </div>
                  </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="300">
                  <div className="max-w-5xl mx-auto space-y-5 text-gray-700 text-sm md:text-base leading-relaxed">
                    {paragraphs.map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div data-aos="zoom-in" data-aos-delay="400">
                  <div className="mt-16">
                    <img
                      src={imagePath}
                      alt="Refex Team"
                      className="w-full max-w-5xl mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Core Values Section - PACE */}
      <section id="corevalues" className="py-16 md:py-20 bg-white">
        <div className="max-w-[1210px] mx-auto px-4">
          {(() => {
            const coreValuesSection = pageSections.corevalues;
            const backgroundColor = getSectionContent(coreValuesSection, 'backgroundColor') || '#247b6b';
            const patternImage = getSectionContent(coreValuesSection, 'patternImage');
            const patternImagePath = patternImage?.path || (patternImage ? getImagePath(patternImage) : CoreValuesPattern);
            // Get pattern positioning from CMS, default to Left (0%) Center (50%)
            const patternPositionX = getSectionContent(coreValuesSection, 'patternPositionX') || getSectionContent(coreValuesSection, 'patternImagePositionX') || '0';
            const patternPositionY = getSectionContent(coreValuesSection, 'patternPositionY') || getSectionContent(coreValuesSection, 'patternImagePositionY') || '50';
            const title = getSectionContent(coreValuesSection, 'title') || 'Our Core Values';
            const subtitle = getSectionContent(coreValuesSection, 'subtitle') || 'Refex\'s core values have always been the foundation of our guiding principles.';

            return (
              <div
                className="rounded-[50px] p-8 md:p-14 relative overflow-hidden"
                style={{ backgroundColor: backgroundColor }}
                data-aos="fade-up"
              >
                {/* Background Pattern - matches ESG page styling */}
                {patternImagePath && (
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `url(${patternImagePath})`,
                      backgroundSize: 'contain',
                      backgroundPosition: `${patternPositionX}% ${patternPositionY}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  ></div>
                )}

                <div className="relative z-10">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
                    <p className="text-white/90 text-sm md:text-base max-w-3xl mx-auto">
                      {subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                    {coreValues.map((value, index) => (
                      <div key={index} data-aos="fade-up" data-aos-delay={index * 150} className="flex flex-col items-center">
                        <div className="mb-4 h-14 flex items-end justify-center">
                          <img
                            src={value.icon}
                            alt={value.title}
                            className="h-12 w-auto object-contain"
                          />
                        </div>

                        <div className="text-3xl md:text-4xl font-bold text-white mb-2 leading-none">
                          {value.letter}
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-white mb-2">
                          {value.title}
                        </h3>

                        <p className="text-white/90 text-xs md:text-sm leading-relaxed max-w-[250px] mx-auto">
                          {value.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Leadership Section */}
      <LeadershipSection />

      {/* Mission & Vision Section */}
      <section
  id="missionvision"
  className="relative overflow-hidden "
>
  {(() => {
    const missionVisionSection = pageSections['mission-vision'];

    const bgImage = getSectionContent(missionVisionSection, 'backgroundImage');
    const bgImagePath =
      bgImage?.path || (bgImage ? getImagePath(bgImage) : VisionMissionBg);

    const bgPosition =
      bgImage?.positionX && bgImage?.positionY
        ? getBackgroundPosition(bgImage.positionX, bgImage.positionY)
        : 'center';

    const missionTitle =
      getSectionContent(missionVisionSection, 'missionTitle') || 'Mission';

    const missionText =
      getSectionContent(missionVisionSection, 'missionText') ||
      'Refex shall create enduring value across industries through innovation, operational excellence, and sustainable practices, thereby empowering our customers, enriching our communities, and delivering responsible growth for all stakeholders.';

    const visionTitle =
      getSectionContent(missionVisionSection, 'visionTitle') || 'Vision';

    const visionText =
      getSectionContent(missionVisionSection, 'visionText') ||
      'Refex aims to be a globally admired conglomerate, driving long-term sustainable growth through innovation, purposeful collaborations and partnerships, and an unwavering commitment to excellence, while contributing meaningfully to societal progress.';

    const missionIconData = getSectionContent(missionVisionSection, 'missionIcon');
    const missionIconPath =
      missionIconData?.path ||
      (missionIconData ? getImagePath(missionIconData) : '');

    const visionIconData = getSectionContent(missionVisionSection, 'visionIcon');
    const visionIconPath =
      visionIconData?.path ||
      (visionIconData ? getImagePath(visionIconData) : '');

    return (
      <>
        {/* BACKGROUND IMAGE + OVERLAY */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(0,0,0,0.45),
                rgba(0,0,0,0.15)
              ),
              url(${bgImagePath})
            `,
            backgroundSize: 'cover',
            backgroundPosition: bgPosition,
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 min-h-[392px] md:min-h-[448px] py-8 md:py-0">
          <div className="max-w-[1210px] mx-auto px-4 sm:px-6 relative h-full">
            {/* Mobile: Stacked Layout */}
            <div className="flex flex-col md:hidden gap-6">
              {/* ================== MISSION CARD (Mobile) ================== */}
              <div
                className="w-full"
                data-aos="fade-up"
              >
                <div
                  className="text-white px-6 py-6 rounded-2xl w-full"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="mb-4">
                    {missionIconPath ? (
                      <img
                        src={missionIconPath}
                        alt="Mission Icon"
                        className="w-9 h-9"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(69%) sepia(77%) saturate(360%) hue-rotate(45deg)',
                        }}
                      />
                    ) : (
                      <i
                        className="ri-focus-3-line text-3xl"
                        style={{ color: '#7dc144' }}
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    {missionTitle}
                  </h3>

                  <p className="text-sm leading-relaxed text-white/90">
                    {missionText}
                  </p>
                </div>
              </div>

              {/* ================== VISION CARD (Mobile) ================== */}
              <div
                className="w-full"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div
                  className="text-white px-6 py-6 rounded-2xl w-full"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="mb-4">
                    {visionIconPath ? (
                      <img
                        src={visionIconPath}
                        alt="Vision Icon"
                        className="w-9 h-9"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(69%) sepia(77%) saturate(360%) hue-rotate(45deg)',
                        }}
                      />
                    ) : (
                      <i
                        className="ri-eye-line text-3xl"
                        style={{ color: '#7dc144' }}
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    {visionTitle}
                  </h3>

                  <p className="text-sm leading-relaxed text-white/90">
                    {visionText}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: Absolute Positioned Layout */}
            <div className="hidden md:block relative h-full">
              {/* ================== MISSION CARD (Desktop) ================== */}
            <div
              className="
                absolute
                top-12 md:top-16
                 md:left-[80px] lg:left-[80px]
                  w-[460px] lg:w-[500px]
                z-20
              "
              data-aos="fade-right"
            >
              <div
                className="text-white px-8 py-6 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div className="mb-4">
                  {missionIconPath ? (
                    <img
                      src={missionIconPath}
                      alt="Mission Icon"
                      className="w-9 h-9"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(69%) sepia(77%) saturate(360%) hue-rotate(45deg)',
                      }}
                    />
                  ) : (
                    <i
                      className="ri-focus-3-line text-3xl"
                      style={{ color: '#7dc144' }}
                    />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3">
                  {missionTitle}
                </h3>

                <p className="text-sm leading-relaxed text-white/90">
                  {missionText}
                </p>
              </div>
            </div>

              {/* ================== VISION CARD (Desktop) ================== */}
            <div
              className="
                absolute
                  top-[140px]
                 md:left-[620px] lg:left-[640px]
                  w-[460px] lg:w-[500px]
                z-20
              "
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div
                className="text-white px-8 py-6 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div className="mb-4">
                  {visionIconPath ? (
                    <img
                      src={visionIconPath}
                      alt="Vision Icon"
                      className="w-9 h-9"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(69%) sepia(77%) saturate(360%) hue-rotate(45deg)',
                      }}
                    />
                  ) : (
                    <i
                      className="ri-eye-line text-3xl"
                      style={{ color: '#7dc144' }}
                    />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3">
                  {visionTitle}
                </h3>

                <p className="text-sm leading-relaxed text-white/90">
                  {visionText}
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </>
    );
  })()}
</section>


      {/* Our Story Section */}
      <section id="ourstory" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {(() => {
            const storySection = pageSections.story || pageSections.ourstory;
            const heading = getSectionContent(storySection, 'heading') || 'Discover Our Journey';
            const description = getSectionContent(storySection, 'description') || 'A Story of Passion, Determination, and Growth';
            const timelineImage = getSectionContent(storySection, 'timelineImage');
            const timelineImagePath = timelineImage?.path || (timelineImage ? getImagePath(timelineImage) : MilestoneTimeline);

            return (
              <>
                <div data-aos="fade-up">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{heading}</h2>
                    <p className="text-gray-600 text-sm md:text-base">{description}</p>
                  </div>
                </div>

                <div data-aos="zoom-in" data-aos-delay="200">
                  <div className="max-w-6xl mx-auto">
                    <img
                      src={timelineImagePath}
                      alt="Refex Journey Timeline"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Careers CTA Section */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {(() => {
          const careersCTASection = pageSections['careers-cta'];
          const bgImage = getSectionContent(careersCTASection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : CareersBg);
          const tagline = getSectionContent(careersCTASection, 'tagline') || 'Careers';
          const title = getSectionContent(careersCTASection, 'title') || 'Join Refex Group and grow, learn, and thrive in your career.';
          const description = getSectionContent(careersCTASection, 'description') || 'Join our dynamic and driven team at Refex, where passion, self-motivation and a desire for growth are valued';
          const buttonText = getSectionContent(careersCTASection, 'buttonText') || 'Apply Now';
          const buttonLink = getSectionContent(careersCTASection, 'buttonLink') || '/careers';

          return (
            <>
              <div className="absolute inset-0">
                <img
                  src={bgImagePath}
                  alt="Careers Background"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                <div data-aos="fade-up">
                  <p className="text-gray-600 text-[0.7rem] md:text-xs uppercase tracking-wider mb-2 font-semibold">{tagline}</p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} />
                  <p className="text-gray-700 text-sm md:text-base mb-6 max-w-3xl mx-auto leading-relaxed">
                    {description}
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <Link
                      to={buttonLink}
                      onClick={() => trackButtonClick(buttonText, 'about-page-cta', buttonLink)}
                      className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-4 md:px-8 py-3.5 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 cursor-pointer text-sm md:text-base"
                      data-ga-track="button"
                      data-ga-label={buttonText}
                      data-ga-location="about-page-cta"
                    >
                      {buttonText}
                      <i className="ri-arrow-right-line text-lg"></i>
                    </Link>
                    <p className="text-gray-400 text-2xl md:text-3xl font-normal">#iamarefexian</p>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* CTA Section (ESG style) */}
      <section className="py-[27px] md:py-[34px] bg-green-50">
        <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
          <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]" style={{ backgroundColor: '#3b9dd6' }}>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100" data-aos-easing="ease-out-cubic">
                <h3 className="text-lg md:text-xl font-bold text-white mb-[13.6px]">Got a question?</h3>
                <a
                  href="/contact"
                  onClick={() => trackButtonClick('Get in touch', 'about-page-cta-section', '/contact')}
                  className="inline-block border-2 border-white bg-transparent text-white px-4 md:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer text-xs md:text-sm lg:text-base"
                  data-ga-track="button"
                  data-ga-label="Get in touch"
                  data-ga-location="about-page-cta-section"
                >
                  Get in touch
                </a>
              </div>

              <div className="text-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                <h3 className="text-lg md:text-xl font-bold text-white mb-[13.6px]">See our latest news</h3>
                <a
                  href="/newsroom"
                  onClick={() => trackButtonClick('Refex Newsroom', 'about-page-cta-section', '/newsroom')}
                  className="inline-block border-2 border-white bg-transparent text-white px-4 md:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer text-xs md:text-sm lg:text-base"
                  data-ga-track="button"
                  data-ga-label="Refex Newsroom"
                  data-ga-location="about-page-cta-section"
                >
                  Refex Newsroom
                </a>
              </div>

              <div className="text-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300" data-aos-easing="ease-out-cubic">
                <h3 className="text-lg md:text-xl font-bold text-white mb-[13.6px]">Work at Refex</h3>
                <a
                  href="/careers"
                  onClick={() => trackButtonClick('Careers', 'about-page-cta-section', '/careers')}
                  className="inline-block border-2 border-white bg-transparent text-white px-4 md:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer text-xs md:text-sm lg:text-base"
                  data-ga-track="button"
                  data-ga-label="Careers"
                  data-ga-location="about-page-cta-section"
                >
                  Careers
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </MainLayout>
  );
}
