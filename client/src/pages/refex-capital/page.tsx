import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';

// Import SVG icons
import HealthcareIcon from '../svg/refex_capital/healthcare.svg?react';
import ConsumerTechIcon from '../svg/refex_capital/consumertech.svg?react';
import CleanTechIcon from '../svg/refex_capital/cleantech.svg?react';
import EnterpriseTechIcon from '../svg/refex_capital/enterprisetech.svg?react';
import FinTechIcon from '../svg/refex_capital/fintech.svg?react';
import DeepTechIcon from '../svg/refex_capital/deeptech.svg?react';

import AttractiveIcon from '../../wp-content/uploads/2023/02/Attractive.svg';
import TeamCapitalIcon from '../../wp-content/uploads/2023/02/Team-Capital.svg';
import UseOfTechIcon from '../../wp-content/uploads/2023/02/Use-of-Tech.svg';

import ArtwallyResult from '../../wp-content/uploads/2023/02/Artwally.png';
import BLUResult from '../../wp-content/uploads/2023/02/BLU.png';
import ChaloResult from '../../wp-content/uploads/2023/02/chalo.png';
import DRResult from '../../wp-content/uploads/2023/02/DR.png';
import EasyPolicyResult from '../../wp-content/uploads/2023/02/Easy-policy.png';
import FabHeadsResult from '../../wp-content/uploads/2023/02/Fab-heads.png';
import FibSolResult from '../../wp-content/uploads/2023/02/FIB-SOL.png';
import HappyEmiResult from '../../wp-content/uploads/2023/02/Happy-EMI.png';
import ILoveDiamondsResult from '../../wp-content/uploads/2023/02/i-love-Diamonds.png';
import IntugineResult from '../../wp-content/uploads/2023/02/Intugine.png';
import KyvorResult from '../../wp-content/uploads/2023/02/Kyvor.png';
import MentisResult from '../../wp-content/uploads/2023/02/Mentis.png';
import MunothResult from '../../wp-content/uploads/2023/02/Munoth-industries-LTD.png';
import NResult from '../../wp-content/uploads/2023/02/N.png';
import NanoLifeResult from '../../wp-content/uploads/2023/02/NanOlife.png';
import OrboResult from '../../wp-content/uploads/2023/02/ORBO.png';
import OvenFreshResult from '../../wp-content/uploads/2023/02/Ovenfresh.png';
import RaceCoffeeResult from '../../wp-content/uploads/2023/02/Race-coffee.png';
import S3VResult from '../../wp-content/uploads/2023/02/S3V.png';
import SunTelematicsResult from '../../wp-content/uploads/2023/02/Sun-telematics.png';
import TochResult from '../../wp-content/uploads/2023/02/Toch.png';
import TomaGeneticsResult from '../../wp-content/uploads/2023/02/Tomaganetics.png';
import TrillbitResult from '../../wp-content/uploads/2023/02/Trillbit.png';
import VenrankResult from '../../wp-content/uploads/2023/02/Venrank.png';
import WassupResult from '../../wp-content/uploads/2023/02/Wassup.png';
import ZenithResult from '../../wp-content/uploads/2023/02/Zenlth.png';
import { getApiBaseUrl } from '../../config/env';

export default function RefexCapitalPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [areas, setAreas] = useState<any[]>([]);
  const [whatWeLookFor, setWhatWeLookFor] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    // Handle number (media ID)
    if (typeof imageData === 'number' && imageData > 0) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}/uploads/media/${imageData}`;
    }

    if (typeof imageData === 'string' && imageData.trim()) {
      // Filter out old /assets/ paths
      if (imageData.startsWith('/assets/')) {
        return '';
      }
      // Handle /uploads/media/{id} or /uploads/ paths
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      // Handle full URLs
      if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
        return imageData;
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

    if (imageData.path) {
      // Handle path property
      if (typeof imageData.path === 'string') {
        if (imageData.path.startsWith('/uploads/')) {
          const apiBase = getApiBaseUrl();
          return `${apiBase}${imageData.path}`;
        }
        return imageData.path;
      }
    }

    return '';
  };

  // Helper function to get section content value
  const getSectionContent = (section: any, contentKey: string): any => {
    if (!section?.content) return null;
    const contentItem = section.content.find((c: any) => c.contentKey === contentKey);
    if (!contentItem) return null;

    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }

    // Handle image/media content
    // Priority 1: Check if media relationship exists with filePath
    if (contentItem.media?.filePath) {
      const imagePath = getImagePath(contentItem.media);
      if (imagePath) {
      return {
          path: imagePath
        };
      }
    }

    // Priority 2: Check if media relationship exists (without filePath, use getImagePath)
    if (contentItem.media) {
      const imagePath = getImagePath(contentItem.media);
      if (imagePath) {
        return {
          path: imagePath
        };
      }
    }

    // Priority 3: Check if mediaId exists and contentValue might be a path
    if (contentItem.mediaId) {
      // If contentValue is a direct path, use it
      if (contentItem.contentValue && typeof contentItem.contentValue === 'string') {
        const contentValue = contentItem.contentValue.trim();
        if (contentValue && (contentValue.startsWith('/uploads/') || contentValue.startsWith('http://') || contentValue.startsWith('https://'))) {
          return {
            path: getImagePath(contentValue) || contentValue
          };
        }
      }
      // Otherwise, try to construct path from mediaId
      const imagePath = getImagePath(contentItem.mediaId);
      if (imagePath) {
        return {
          path: imagePath
        };
      }
    }

    // Priority 4: Use contentValue if it's a valid path
    if (contentItem.contentValue && typeof contentItem.contentValue === 'string') {
      const contentValue = contentItem.contentValue.trim();
      if (contentValue && (contentValue.startsWith('/uploads/') || contentValue.startsWith('http://') || contentValue.startsWith('https://'))) {
        return {
          path: getImagePath(contentValue) || contentValue
        };
      }
    }

    return contentItem.contentValue;
  };

  useEffect(() => {
    const fetchCapitalData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-capital');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Stats
          const statsSection = sections.find((s: any) => s.sectionKey === 'stats');
          if (statsSection?.content) {
            const statsItem = statsSection.content.find((c: any) => c.contentKey === 'stats');
            if (statsItem && statsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(statsItem.contentValue);
                const statsArray = Array.isArray(parsed) ? parsed : [];
                setStats(statsArray.length > 0 ? statsArray : [
                  { label: 'Investee Companies', value: '26' },
                  { label: 'Exits', value: '3' }
                ]);
              } catch (e) {
                console.error('Error parsing stats:', e);
                setStats([
                  { label: 'Investee Companies', value: '26' },
                  { label: 'Exits', value: '3' }
                ]);
              }
            } else {
              setStats([
                { label: 'Investee Companies', value: '26' },
                { label: 'Exits', value: '3' }
              ]);
            }
          } else {
            setStats([
              { label: 'Investee Companies', value: '26' },
              { label: 'Exits', value: '3' }
            ]);
          }

          // Parse Areas of Interest
          const areasSection = sections.find((s: any) => s.sectionKey === 'areas-of-interest');
          if (areasSection?.content) {
            const areasItem = areasSection.content.find((c: any) => c.contentKey === 'areas');
            if (areasItem && areasItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(areasItem.contentValue);
                setAreas(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing areas:', e);
              }
            }
          }

          // Parse What We Look For
          const whatWeLookForSection = sections.find((s: any) => s.sectionKey === 'what-we-look-for');
          if (whatWeLookForSection?.content) {
            const factorsItem = whatWeLookForSection.content.find((c: any) => c.contentKey === 'factors');
            if (factorsItem && factorsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(factorsItem.contentValue);
                setWhatWeLookFor(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing factors:', e);
              }
            }
          }

          // Parse Portfolio
          const portfolioSection = sections.find((s: any) => s.sectionKey === 'portfolio');
          if (portfolioSection?.content) {
            const portfolioItem = portfolioSection.content.find((c: any) => c.contentKey === 'portfolioLogos');
            if (portfolioItem && portfolioItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(portfolioItem.contentValue);
                setPortfolio(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing portfolio:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching capital data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapitalData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

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

    document.querySelectorAll('[data-aos]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach((counter) => {
      // Reset to 0 initially
      counter.textContent = '0';

      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      let isAnimating = false;

      const updateCounter = () => {
        if (isAnimating) return;
        isAnimating = true;

        const animate = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current).toString();
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target.toString();
            isAnimating = false;
          }
        };

        animate();
      };

      // Check if element is already visible
      const rect = counter.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Small delay to ensure DOM is ready
        setTimeout(updateCounter, 300);
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !isAnimating) {
                updateCounter();
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(counter);
      }
    });
  }, [stats]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </MainLayout>
    );
  }

  // Fallback values
  const fallbackHeroBadge = 'WE ADD';
  const fallbackHeroTitle = 'GRIT AND GUMPTION TO YOUR GREAT IDEAS';
  const fallbackHeroSubtitle = 'Empowering Visionaries';
  const fallbackHeroDescription = 'When dreamers and doers get together, clever ideas turn into revolutionary businesses.';
  // No fallback image - must come from CMS

  // Get CMS values for Hero
  const heroSection = pageSections['hero'];
  const heroTagline = getSectionContent?.(heroSection, 'tagline') || '';
  const heroBadge = getSectionContent?.(heroSection, 'badge') || fallbackHeroBadge;
  const heroTitle = getSectionContent?.(heroSection, 'title') || fallbackHeroTitle;
  const heroSubtitle = getSectionContent?.(heroSection, 'subtitle') || fallbackHeroSubtitle;
  const heroDescription = getSectionContent?.(heroSection, 'description') || fallbackHeroDescription;
  const heroBgData = getSectionContent?.(heroSection, 'backgroundImage');
  const heroBg = heroBgData?.path || (getImagePath && heroBgData ? getImagePath(heroBgData) : null) || '';

  return (
    <MainLayout>
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden bg-gray-800"
        style={{
          backgroundImage: heroBg ? `url(${heroBg})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid md:grid-cols-2 gap-12 items-start pt-20">
            {/* Left Content */}
            <div data-aos="fade-up" className="aos-init">
              <div className="mb-6">
                {heroTagline && (
                  <p className="text-gray-900 text-[18px] mb-4 tracking-wide">{heroTagline}</p>
                )}
                <h2 className="text-[#7dc144] text-2xl mb-2" style={{ fontWeight: 660 }}>{heroBadge}</h2>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {heroTitle}
                </h1>
              </div>
            </div>

            {/* Right Content */}
            <div data-aos="fade-up" data-aos-delay="200" className="aos-init">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{heroSubtitle}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {heroDescription}
                </p>
              </div>

              {/* Stats Boxes - Offset positioning */}
              <div className="flex flex-wrap gap-4 mt-8">
                {stats.length > 0 ? stats.map((stat, index) => (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={300 + (index * 100)}
                    className="bg-black rounded-xl px-4 sm:px-6 py-4 sm:py-5 text-center aos-init min-w-[120px] sm:min-w-[140px]"
                  >
                    <div className="text-white text-sm font-medium mb-2">{stat.label}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      <span className="counter-number" data-target={parseInt(stat.value) || 0}>0</span>
                    </div>
                  </div>
                )) : (
                  // Fallback if array is empty (though defaults are set in fetch)
                  <>
                    <div data-aos="fade-up" data-aos-delay="300" className="bg-black rounded-xl px-6 py-5 text-center aos-init">
                      <div className="text-white text-sm font-medium mb-2">Investee Companies</div>
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        <span className="counter-number" data-target="26">0</span>
                      </div>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="400" className="bg-black rounded-xl px-6 py-5 text-center aos-init">
                      <div className="text-white text-sm font-medium mb-2">Exits</div>
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        <span className="counter-number" data-target="3">0</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Know About Us Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Logo and Text */}
            <div>
              <div data-aos="fade-up" className="aos-init mb-8">
                {(() => {
                  const aboutSection = pageSections['about'];
                  const logoData = getSectionContent?.(aboutSection, 'logo');
                  const logoPath = logoData?.path || (getImagePath && logoData ? getImagePath(logoData) : null) || '/assets/logos/refex-logo.png';
                  return (
                <img
                      src={logoPath}
                  alt="Refex Logo"
                  className="h-14 mb-8"
                      onError={(e) => {
                        // Fallback to default logo if CMS logo fails
                        if ((e.target as HTMLImageElement).src !== window.location.origin + '/assets/logos/refex-logo.png') {
                          (e.target as HTMLImageElement).src = '/assets/logos/refex-logo.png';
                        }
                      }}
                    />
                  );
                })()}
              </div>
              <div data-aos="fade-up" className="aos-init">
                {(() => {
                  const aboutSection = pageSections['about'];
                  const aboutTitle1 = getSectionContent?.(aboutSection, 'title1') || 'Know';
                  const aboutTitle2 = getSectionContent?.(aboutSection, 'title2') || 'About Us';
                  const aboutDescription = getSectionContent?.(aboutSection, 'description') || 'At Refex Capital Fund, we believe in the potential of India to become a leading technology powerhouse in the near future. This conviction drives us to search for visionary entrepreneurs who are harnessing technology to create innovative products and services, disrupt the status quo, and forge new markets. Join us in our mission to support the next tech giant in India.';
                  return (
                    <>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#7dc144] mb-2">{aboutTitle1}</h2>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#7dc144] mb-6">{aboutTitle2}</h2>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {aboutDescription}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right - Image */}
            <div data-aos="fade-up" className="aos-init">
              {(() => {
                const aboutSection = pageSections['about'];
                const aboutImageData = getSectionContent?.(aboutSection, 'image');
                const aboutImage = aboutImageData?.path || (getImagePath && aboutImageData ? getImagePath(aboutImageData) : null) || '';
                return (
                  aboutImage ? (
                    <img
                      src={aboutImage}
                      alt="Refex Capital About"
                      className="rounded-lg shadow-xl w-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="rounded-lg shadow-xl w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image available</span>
                    </div>
                  )
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Our Areas of Interest Section */}
      <section className="relative py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          {(() => {
            const areasSection = pageSections['areas-of-interest'];
            const areasBgData = getSectionContent?.(areasSection, 'backgroundImage');
            const areasBg = areasBgData?.path || (getImagePath && areasBgData ? getImagePath(areasBgData) : null) || '';
            return (
              areasBg ? (
                <img
                  src={areasBg}
                  alt="Areas of Interest Background"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-800"></div>
              )
            );
          })()}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Title and Description */}
            <div className="mb-8 md:mb-0">
              {(() => {
                const areasSection = pageSections['areas-of-interest'];
                const areasTitle = getSectionContent?.(areasSection, 'title') || 'OUR AREAS OF\nINTEREST';
                const areasDescription = getSectionContent?.(areasSection, 'description') || 'We focus on investing in disruptive start-ups in the fields of AI, HealthTech, CleanTech, and Consumer sectors with the aim of advancing technology and defining the future.';
                return (
                  <>
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight aos-init whitespace-pre-line">
                      {areasTitle}
                    </h2>
                    <p data-aos="fade-up" className="text-white/90 text-lg leading-relaxed aos-init">
                      {areasDescription}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Right - Interest Areas Grid */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {(() => {
                const fallbackAreas = [
                  { name: 'HealthTech', icon: HealthcareIcon },
                  { name: 'ConsumerTech', icon: ConsumerTechIcon },
                  { name: 'CleanTech', icon: CleanTechIcon },
                  { name: 'EnterpriseTech', icon: EnterpriseTechIcon },
                  { name: 'FinTech', icon: FinTechIcon },
                  { name: 'DeepTech', icon: DeepTechIcon },
                ];
                const iconMap: any = {
                  'HealthTech': HealthcareIcon,
                  'ConsumerTech': ConsumerTechIcon,
                  'CleanTech': CleanTechIcon,
                  'EnterpriseTech': EnterpriseTechIcon,
                  'FinTech': FinTechIcon,
                  'DeepTech': DeepTechIcon,
                };
                const areasToShow = areas.length > 0 ? areas : fallbackAreas;
                return areasToShow.map((area: any, index: number) => {
                  const areaIcon = area.icon || iconMap[area.name] || HealthcareIcon;
                  // Check if icon is a string path (from CMS), number (media ID), or a React component
                  const isIconPath = typeof areaIcon === 'string' || typeof areaIcon === 'number';
                  let iconPath: string | null = null;
                  
                  if (isIconPath) {
                    // Handle string paths or media IDs
                    iconPath = getImagePath(areaIcon);
                    // If getImagePath returns empty, try treating it as a direct path
                    if (!iconPath && typeof areaIcon === 'string') {
                      iconPath = areaIcon;
                    }
                  }
                  
                  const IconComponent = isIconPath ? null : (areaIcon || HealthcareIcon);
                  
                  return (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className="group flex flex-col items-center text-center aos-init"
                      style={{ perspective: '1000px' }}
                    >
                      <div className="relative mb-3 md:mb-4">
                         <span
                         style={{
                          // transformStyle: 'preserve-3d',
                          fill: '#7dc144',
                          color: '#7dc144',
                          stroke: '#7dc144'
                        }}>
                         {isIconPath && iconPath ? (
                          <img
                            src={iconPath}
                            alt={area.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 block object-contain"
                            // className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 block transition-all duration-500 ease-out icon-tilt object-contain"
                            style={{
                              
                              // transformStyle: 'preserve-3d',
                              // Removed filter - CSS filters cannot perfectly match exact hex colors
                              // Original filter was: 'brightness(0) saturate(100%) invert(75%) sepia(95%) saturate(500%) hue-rotate(75deg) brightness(105%) contrast(90%)'
                              // If image needs to be colored, it should be uploaded with the correct color or use SVG format
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : IconComponent ? (
                        <IconComponent
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 block"
                          // className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 block transition-all duration-500 ease-out icon-tilt"
                          style={{
                            // transformStyle: 'preserve-3d',
                            fill: '#7dc144',
                            color: '#7dc144',
                            stroke: '#7dc144'
                          }}
                        />
                        ) : null}
                         </span>
                     
                      </div>
                      <h3 className="text-white font-semibold text-base md:text-lg lg:text-xl">{area.name}</h3>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* What We Look For Section */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {(() => {
              const whatWeLookForSection = pageSections['what-we-look-for'];
              const whatWeLookForTitle = getSectionContent?.(whatWeLookForSection, 'title') || 'What we look for?';
              const whatWeLookForDescription1 = getSectionContent?.(whatWeLookForSection, 'description1') || 'Our mission is to provide funding for Indian startups that are developing innovative products or services for the domestic market and have the potential to expand globally. We are particularly interested in companies that have a sustainable competitive advantage over the long term and a clear path to profitability.';
              const whatWeLookForDescription2 = getSectionContent?.(whatWeLookForSection, 'description2') || 'When evaluating a startup, we look for the following key factors:';
              return (
                <>
                  <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 aos-init">
                    {whatWeLookForTitle}
                  </h2>
                  <p data-aos="fade-up" className="text-gray-600 text-base text-center leading-relaxed mb-6 aos-init">
                    {whatWeLookForDescription1}
                  </p>
                  <p data-aos="fade-up" className="text-gray-600 text-base text-center leading-relaxed aos-init">
                    {whatWeLookForDescription2}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Key Factors Section */}
      <section className="bg-[#6bba29] py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {(() => {
              const fallbackFactors = [
                {
                  icon: AttractiveIcon,
                  title: 'Attractiveness of opportunity & addressable market',
                },
                {
                  icon: TeamCapitalIcon,
                  title: 'Team with passion, perseverance, relevant experience',
                },
                {
                  icon: UseOfTechIcon,
                  title: 'Use of technology to create an economic moat',
                },
              ];
              const iconMap: any = {
                'Attractiveness of opportunity & addressable market': AttractiveIcon,
                'Team with passion, perseverance, relevant experience': TeamCapitalIcon,
                'Use of technology to create an economic moat': UseOfTechIcon,
              };
              const factorsToShow = whatWeLookFor.length > 0 ? whatWeLookFor : fallbackFactors;
              return factorsToShow.map((factor: any, index: number) => {
                const factorIcon = factor.icon || iconMap[factor.title] || AttractiveIcon;
                const factorIconPath = typeof factorIcon === 'string' ? factorIcon : null;
                return (
                  <div
                    key={index}
                    data-aos="fade-up"
                    className="text-center aos-init"
                  >
                    <div className="mb-6">
                      {factorIconPath && (getImagePath({ path: factorIconPath }) || factorIconPath) ? (
                        <img src={getImagePath({ path: factorIconPath }) || factorIconPath} alt="" className="w-16 h-16 mx-auto" />
                      ) : (
                        factorIcon && typeof factorIcon !== 'string' ? (
                          <img src={factorIcon} alt="" className="w-16 h-16 mx-auto" />
                        ) : null
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg leading-relaxed">
                      {factor.title}
                    </h3>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Our Portfolio Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Center Aligned Header */}
          <div className="text-center mb-10 md:mb-12">
            {(() => {
              const portfolioSection = pageSections['portfolio'];
              const portfolioTitle = getSectionContent?.(portfolioSection, 'title') || 'Our\nPortfolio';
              const portfolioSubtitle = getSectionContent?.(portfolioSection, 'subtitle') || 'We give start-ups an unfair advantage';
              return (
                <>
                  <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-[#6bba29] mb-3 aos-init whitespace-pre-line">
                    {portfolioTitle}
                  </h2>
                  <h3 data-aos="fade-up" className="text-xl md:text-2xl font-bold text-gray-900 aos-init">
                    {portfolioSubtitle}
                  </h3>
                </>
              );
            })()}
          </div>

          {/* Portfolio Grid */}
          <div data-aos="fade-up" className="aos-init">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {(() => {
                const fallbackPortfolio = [
                  ArtwallyResult, BLUResult, ChaloResult, DRResult, EasyPolicyResult,
                  FabHeadsResult, FibSolResult, HappyEmiResult, ILoveDiamondsResult, IntugineResult,
                  KyvorResult, MentisResult, MunothResult, NResult, NanoLifeResult,
                  OrboResult, OvenFreshResult, RaceCoffeeResult, S3VResult, SunTelematicsResult,
                  TochResult, TomaGeneticsResult, TrillbitResult, VenrankResult, WassupResult,
                  ZenithResult
                ];
                const portfolioToShow = portfolio.length > 0 ? portfolio : fallbackPortfolio;
                return portfolioToShow.map((logo: any, index: number) => {
                  const logoPath = typeof logo === 'string' ? logo : (logo.image || logo.path || logo);
                  const logoUrl = getImagePath({ path: logoPath }) || logoPath;

                  if (!logoUrl) return null;

                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 lg:p-8 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:border-gray-300 min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
                      <img
                        src={logoUrl}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full max-w-[95%] max-h-[95%] object-contain"
                        onError={(e) => {
                          if (fallbackPortfolio[index]) {
                            (e.target as HTMLImageElement).src = fallbackPortfolio[index];
                          }
                        }}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-up" className="aos-init">
              {(() => {
                const ctaSection = pageSections['cta'];
                const ctaTitle = getSectionContent?.(ctaSection, 'title') || 'Want to know more about how Refex Capital can help your business succeed?';
                const ctaButtonText = getSectionContent?.(ctaSection, 'buttonText') || 'Visit Website';
                const ctaButtonLinkData = getSectionContent?.(ctaSection, 'buttonLink');
                // Ensure ctaButtonLink is a string
                const ctaButtonLink = typeof ctaButtonLinkData === 'string' 
                  ? ctaButtonLinkData 
                  : (ctaButtonLinkData?.path || ctaButtonLinkData?.contentValue || 'https://refexcapital.com/');
                const isExternalLink = typeof ctaButtonLink === 'string' && (ctaButtonLink.startsWith('http://') || ctaButtonLink.startsWith('https://'));
                return (
                  <>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      {ctaTitle}
                    </h2>
                    <a
                      href={ctaButtonLink}
                      target={isExternalLink ? '_blank' : undefined}
                      rel={isExternalLink ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center bg-[#7dc144] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-[#6fb03a] transition-all duration-300 whitespace-normal sm:whitespace-nowrap cursor-pointer text-sm sm:text-base"
                    >
                      {ctaButtonText}
                      <i className="ri-arrow-right-line ml-2 text-white"></i>
                    </a>
                  </>
                );
              })()}
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="aos-init flex items-center justify-center">
              {(() => {
                const ctaSection = pageSections['cta'];
                // Try multiple possible content keys for the image
                const ctaImageData = getSectionContent?.(ctaSection, 'image') || 
                                   getSectionContent?.(ctaSection, 'backgroundImage') || 
                                   getSectionContent?.(ctaSection, 'logo');
                
                let ctaImage = '';
                if (ctaImageData) {
                  // Handle object with path property
                  if (ctaImageData.path) {
                    ctaImage = getImagePath(ctaImageData.path) || ctaImageData.path;
                  }
                  // Handle direct string path
                  else if (typeof ctaImageData === 'string') {
                    ctaImage = getImagePath(ctaImageData) || ctaImageData;
                  }
                  // Handle media object
                  else if (ctaImageData.filePath || ctaImageData.url) {
                    ctaImage = getImagePath(ctaImageData);
                  }
                  // Try getImagePath on the whole object
                  else {
                    ctaImage = getImagePath(ctaImageData);
                  }
                }
                
                return (
                  ctaImage ? (
                    <img
                      src={ctaImage}
                      alt="Refex Capital CTA"
                      className="h-auto max-w-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        [data-aos] {
          opacity: 0;
          transition-property: opacity, transform;
          transition-duration: 0.8s;
          transition-timing-function: ease-out;
        }

        [data-aos].aos-animate {
          opacity: 1;
        }

        [data-aos="fade-up"] {
          transform: translateY(50px);
        }

        [data-aos="fade-up"].aos-animate {
          transform: translateY(0);
        }

        [data-aos="fade-down"] {
          transform: translateY(-50px);
        }

        [data-aos="fade-down"].aos-animate {
          transform: translateY(0);
        }

        [data-aos="fade-right"] {
          transform: translateX(-50px);
        }

        [data-aos="fade-right"].aos-animate {
          transform: translateX(0);
        }

        [data-aos][data-aos-delay="200"] {
          transition-delay: 0.2s;
        }

        [data-aos][data-aos-delay="300"] {
          transition-delay: 0.3s;
        }

        [data-aos][data-aos-delay="600"] {
          transition-delay: 0.6s;
        }

        /* .icon-tilt {
          transform-origin: center;
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0% {
            transform: rotateY(-8deg) scale(1);
          }
          50% {
            transform: rotateY(8deg) scale(1.1);
          }
          100% {
            transform: rotateY(-8deg) scale(1);
          }
        } */
      `}</style>
      <Footer />
    </MainLayout>
  );
}
