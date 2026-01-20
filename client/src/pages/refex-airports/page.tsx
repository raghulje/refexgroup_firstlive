import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import ScrollRevealSection from '../../components/base/ScrollRevealSection';
import { pagesService, sectionsService } from '../../services/apiService';

// Import SVG icons
import DedicatedOnsiteIcon from '../svg/airports/dedicated_onsite.svg?react';
import ExclusiveEleganceIcon from '../svg/airports/exclusiveelegence.svg?react';
import OptimalInvestmentsIcon from '../svg/airports/optimalinvestments.svg?react';
import BrandBrillianceIcon from '../svg/airports/brandbrilliance.svg?react';
import HolisticTransportIcon from '../svg/airports/holistictransportation.svg?react';
import RetailManagementIcon from '../svg/airports/retailmanagement.svg?react';
import CustomerCentricIcon from '../svg/airports/customer_centric_retail.svg?react';
import SeamlessTechIcon from '../svg/airports/seamless_tech_driven.svg?react';

import RefexDifferenceBg from '../../wp-content/uploads/2024/01/Refex-Difference-02-1.png';
import { getApiBaseUrl } from '../../config/env';

export default function RefexAirportsPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [retailPartnersFeatures, setRetailPartnersFeatures] = useState<any[]>([]);
  const [retailAdvantageBullets, setRetailAdvantageBullets] = useState<string[]>([]);
  const [transportCards, setTransportCards] = useState<any[]>([]);
  const [techCards, setTechCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    if (typeof imageData === 'string' && imageData.trim()) {
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      return imageData;
    }

    if (imageData.filePath) {
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

    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }

    if (contentItem.media || contentItem.mediaId) {
      return {
        path: getImagePath(contentItem.media)
      };
    }

    return contentItem.contentValue;
  };

  useEffect(() => {
    const fetchAirportsData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-airports');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Retail Partners Features
          const retailPartnersSection = sections.find((s: any) => s.sectionKey === 'for-retail-partners');
          if (retailPartnersSection?.content) {
            const featuresContent = retailPartnersSection.content.find((c: any) => c.contentKey === 'features');
            if (featuresContent && featuresContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(featuresContent.contentValue);
                setRetailPartnersFeatures(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing retail partners features:', e);
              }
            }
          }

          // Parse Retail Advantage Bullets
          const retailAdvantageSection = sections.find((s: any) => s.sectionKey === 'refex-retail-advantage');
          if (retailAdvantageSection?.content) {
            const bulletsContent = retailAdvantageSection.content.find((c: any) => c.contentKey === 'bullets');
            if (bulletsContent && bulletsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(bulletsContent.contentValue);
                setRetailAdvantageBullets(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing retail advantage bullets:', e);
              }
            }
          }

          // Parse Transport Cards
          const transportSection = sections.find((s: any) => s.sectionKey === 'transportation-enhancement');
          if (transportSection?.content) {
            const cardsContent = transportSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsContent && cardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsContent.contentValue);
                setTransportCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing transport cards:', e);
              }
            }
          }

          // Parse Tech Cards
          const techSection = sections.find((s: any) => s.sectionKey === 'tech-integration');
          if (techSection?.content) {
            const cardsContent = techSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsContent && cardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsContent.contentValue);
                setTechCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing tech cards:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching airports data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirportsData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
    window.scrollTo(0, 0);
  }, []);

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

  // Get CMS values for Hero
  const heroSection = pageSections['hero'] || pageSections['hero-section'];
  const heroTagline = getSectionContent?.(heroSection, 'tagline') || getSectionContent?.(heroSection, 'label') || 'Airports and Transportation';
  const heroTitle = getSectionContent?.(heroSection, 'title') || 'Transforming Travel with Superior Retail Experiences.';
  const heroDescription = getSectionContent?.(heroSection, 'description') || 'Elevate your travel with our retail revolution. Refex Airports brings you the best in shopping, from global brands to unique finds, making every trip more than just a journey.';
  const heroButtonText = getSectionContent?.(heroSection, 'buttonText') || 'Explore More';
  const heroButtonLink = getSectionContent?.(heroSection, 'buttonLink') || '#explore';
  const heroLogoData = getSectionContent?.(heroSection, 'logoImage');
  const heroLogo = heroLogoData?.path || (getImagePath && heroLogoData ? getImagePath(heroLogoData) : null) || '';
  const heroBgData = getSectionContent?.(heroSection, 'backgroundImage');
  const heroBg = heroBgData?.path || (getImagePath && heroBgData ? getImagePath(heroBgData) : null) || '';

  return (
    <MainLayout>
      {/* Hero Section – Desktop (Elementor accurate) */}
      <section
        className="hidden md:flex w-full justify-end overflow-hidden relative"
        style={{
          paddingTop: '10rem',
          paddingBottom: '4.2em',
          minHeight: '100vh',
        }}
      >
        {/* Background Image - Positioned to be fully visible */}
        {heroBg && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundPosition: 'top right',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              right: '0px',
              top: '80px',
              height: '490px',
     
             
            }}
          />
        )}
        
        {/* Elementor-style max width wrapper */}
        <div className="w-full max-w-[1440px] mx-auto pl-0 pr-6 flex justify-start relative z-10">
          {/* Gradient panel – FIXED SCALE */}
          <div
            className="
          
              text-white
              pl-8
              pr-8
              py-7
              flex flex-col
            "
            style={{
              height: '290px',
              width: '790px',
              position: 'relative',
              flexDirection: 'column',
              borderRadius: '0px 34px 34px 0px',
              paddingTop: '4vw',
              paddingBottom: '4vw',
              paddingLeft: '5vw',
              paddingRight: '2vw',
              background: 'linear-gradient(90deg, rgb(28, 108, 142) 0%, rgb(61, 165, 122) 55%, rgb(102, 204, 102) 100%)',
             
            }}
            data-aos="fade-up"
          >
            {/* Logo - Hidden */}

            {/* Tagline */}
            {heroTagline && (
              <p className="text-white/90 text-[18px] mb-3 tracking-wide">
                {heroTagline}
              </p>
            )}

            {/* Heading */}
            <h2 className="text-[24px] leading-tight font-semibold mb-3">
              {heroTitle}
            </h2>

            {/* Description */}
            <p className="text-sm text-white/90 leading-relaxed max-w-[650px] mb-5">
              {heroDescription}
            </p>

            {/* Explore button - commented out for future use */}
            {/* <a
              href={heroButtonLink}
              className="
                inline-flex
                items-center
                gap-2
                bg-white
                text-gray-900
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                w-fit
                hover:bg-gray-100
                transition
              "
            >
              <span>{heroButtonText}</span>
              <svg
                className="w-2.5 h-2.5"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
              </svg>
            </a> */}
          </div>
        </div>
      </section>

      {/* Hero Section - Mobile */}
      <section className="md:hidden relative flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Image Section - First on Mobile */}
        <div className="relative flex justify-center items-center py-6 px-4">
          <div className="relative w-full max-w-sm">
            <img
              src={heroBg}
              alt="Refex Airports"
              className="w-full h-auto object-contain drop-shadow-xl"
              style={{
                filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.12))'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/heroes/airports-hero.png';
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative px-6 py-6">
          {/* Tagline Badge */}
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-1.5 rounded-full text-[18px] font-semibold tracking-wide shadow-lg">
              {heroTagline}
            </span>
          </div>

            {/* Logo */}
          {heroLogo && (
            <div className="mb-4">
              <img
                src={heroLogo}
                alt="Refex Airports Logo"
                className="h-14 mb-3 drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Headline */}
          <h1 className="text-lg font-bold text-gray-900 mb-3 leading-tight tracking-tight">
              {heroTitle}
            </h1>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              {heroDescription}
            </p>

          {/* Explore button - commented out for future use */}
          {/* <a
              href={heroButtonLink}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-teal-600 relative overflow-hidden"
            >
            <span className="relative z-10 flex items-center gap-2">
              {heroButtonText}
              <i className="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          </a> */}
        </div>
      </section>

      {/* Anchor Point */}
      <div id="explore" className="h-1"></div>

      {/* About Us Section */}
      <ScrollRevealSection>
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {(() => {
                  const aboutSection = pageSections['about-us'];
                  const aboutBadge = getSectionContent?.(aboutSection, 'badge') || 'About Us';
                  const aboutHeading = getSectionContent?.(aboutSection, 'heading') || 'Revolutionizing retail experiences in air travel, Refex Airports brings a new dimension to your journey.';
                  const aboutDescription = getSectionContent?.(aboutSection, 'description') || 'Refex Airports, at the forefront of transport innovation, is dedicated to revolutionizing the consumer journey across airports, railways, and more. We champion delightful travel experiences, operational excellence, and robust partnerships, underpinned by our core values: initiative, progress, unity, and transparency. Join us in redefining global travel.';
                  return (
                    <>
                      <div
                        className="text-3xl lg:text-4xl font-bold mb-6"
                        style={{
                          background: 'linear-gradient(135deg, #2d7a8a 0%, #3a8d7a 50%, #4a9d6d 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {aboutBadge}
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                        {aboutHeading}
                      </h2>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {aboutDescription}
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Right Image Carousel */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {(() => {
                  const aboutSection = pageSections['about-us'];
                  const aboutImageData = getSectionContent?.(aboutSection, 'image');
                  const aboutImage = aboutImageData?.path || (getImagePath && aboutImageData ? getImagePath(aboutImageData) : null) || '';
                  const aboutCaption = getSectionContent?.(aboutSection, 'imageCaption') || 'Premier Retail Concessions at Pune and Srinagar Airports';
                  return (
                    <>
                      {aboutImage ? (
                        <img
                          src={aboutImage}
                          alt="Airport Terminal"
                          className="w-full h-96 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image available</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white text-sm font-medium">
                          {aboutCaption}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* For Retail Partners Section */}
      <ScrollRevealSection>
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12 text-center mb-10">
            {(() => {
              const retailPartnersSection = pageSections['for-retail-partners'];
              const retailPartnersTitle = getSectionContent?.(retailPartnersSection, 'title') || 'FOR RETAIL PARTNERS';
              const retailPartnersGradientTitle = getSectionContent?.(retailPartnersSection, 'gradientTitle') || 'The Refex Difference in Travel Retail';
              const retailPartnersDescription = getSectionContent?.(retailPartnersSection, 'description') || 'Experience a new era of airport retail with Refex Airports. Our unique approach combines the latest in retail innovation with a deep understanding of traveler needs, setting new standards in your journey\'s retail experience.';
              return (
                <>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
                    {retailPartnersTitle}
                  </h2>
                  <h3
                    className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #2d7a8a 0%, #3a8d7a 50%, #4a9d6d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {retailPartnersGradientTitle}
                  </h3>
                  <p className="text-gray-600 text-base max-w-3xl mx-auto">
                    {retailPartnersDescription}
                  </p>
                </>
              );
            })()}
          </div>

          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Features */}
              <div className="space-y-4">
                {(() => {
                  const fallbackFeatures = [
                    { title: 'Dedicated Onsite Management', description: 'Experience seamless operations with our dedicated Refex staff, prioritizing your success and bringing expertise to every detail of your retail venture.', icon: DedicatedOnsiteIcon },
                    { title: 'Exclusive Elegance in Retail', description: 'Elevate your brand with an exclusive collection, making your offerings an integral part of passengers\' premium journey.', icon: ExclusiveEleganceIcon },
                    { title: 'Optimal Investment Returns', description: 'Maximize returns with our strategically placed, high-traffic retail spaces designed for optimal profitability and investment efficiency.', icon: OptimalInvestmentsIcon },
                    { title: 'Brand Brilliance on Display', description: 'Illuminate your brand globally, enjoying unparalleled visibility that captivates diverse travelers. Join us, and let your brand shine.', icon: BrandBrillianceIcon },
                  ];
                  const iconMap: any = {
                    'Dedicated Onsite Management': DedicatedOnsiteIcon,
                    'Exclusive Elegance in Retail': ExclusiveEleganceIcon,
                    'Optimal Investment Returns': OptimalInvestmentsIcon,
                    'Brand Brilliance on Display': BrandBrillianceIcon,
                  };
                  const featuresToShow = retailPartnersFeatures.length > 0 ? retailPartnersFeatures : fallbackFeatures;
                  return featuresToShow.map((feature: any, index: number) => {
                    // Handle icon from CMS - can be iconPath, icon (media ID/path), or React component
                    let iconPath = null;
                    let IconComponent = null;
                    
                    // Check for iconPath first (common CMS field name)
                    if (feature.iconPath) {
                      iconPath = getImagePath ? getImagePath(feature.iconPath) : null;
                    }
                    // Check for icon field - could be string path, number (media ID), object, or React component
                    else if (feature.icon) {
                      // If it's a string path or number (media ID)
                      if (typeof feature.icon === 'string' || typeof feature.icon === 'number') {
                        iconPath = getImagePath ? getImagePath(feature.icon) : null;
                      }
                      // If it's an object (media object)
                      else if (typeof feature.icon === 'object' && feature.icon !== null) {
                        iconPath = getImagePath ? getImagePath(feature.icon) : null;
                      }
                      // If it's a React component (function)
                      else if (typeof feature.icon === 'function') {
                        IconComponent = feature.icon;
                      }
                    }
                    
                    // Fallback to iconMap if no iconPath and no IconComponent
                    if (!iconPath && !IconComponent) {
                      IconComponent = iconMap[feature.title] || DedicatedOnsiteIcon;
                    }

                    return (
                      <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex gap-4 items-start">
                          <div className="flex-shrink-0">
                          {iconPath ? (
                            <img
                              src={iconPath}
                              alt={feature.title}
                                className="w-12 h-12 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : IconComponent && typeof IconComponent === 'function' ? (
                              <IconComponent className="w-12 h-12 text-gray-700" />
                          ) : (
                              <i className={`${feature.icon || 'ri-check-line'} text-3xl text-gray-700`}></i>
                          )}
                        </div>
                          <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Right - Image */}
              <div className="flex justify-center">
                {(() => {
                  const retailPartnersSection = pageSections['for-retail-partners'];
                  const retailPartnersImageData = getSectionContent?.(retailPartnersSection, 'image');
                  const retailPartnersImage = retailPartnersImageData?.path || (getImagePath && retailPartnersImageData ? getImagePath(retailPartnersImageData) : null) || '';
                  return (
                    <img
                      src={retailPartnersImage}
                      alt="Refex Airport Retail"
                      className="w-full max-w-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* Refex Retail Advantage Section */}
      <ScrollRevealSection animation="fade-left">
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-5 lg:gap-6 items-stretch">
              {/* Left - Image */}
              <div className="flex">
                <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl w-full">
                  {(() => {
                    const retailAdvantageSection = pageSections['refex-retail-advantage'];
                    const retailAdvantageImageData = getSectionContent?.(retailAdvantageSection, 'image');
                    const retailAdvantageImage = retailAdvantageImageData?.path || (getImagePath && retailAdvantageImageData ? getImagePath(retailAdvantageImageData) : null) || '';
                    return (
                      <img
                        src={retailAdvantageImage}
                        alt="Refex Advantage"
                        className="w-full h-full object-cover"
                        style={{
                          minHeight: '300px',
                          height: '100%'
                        }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Right - Content */}
              <div className="flex">
                <div
                  className="relative bg-gradient-to-br from-blue-900 via-teal-700 to-green-500 text-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] w-full flex flex-col shadow-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1a5a7a 0%, #2d7a8a 25%, #3a8d7a 50%, #4a9d6d 75%, #5fb85a 100%)',
                    minHeight: '300px'
                  }}
                >
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col h-full justify-center">
                    {/* Headline */}
                    {(() => {
                      const retailAdvantageSection = pageSections['refex-retail-advantage'];
                      const retailAdvantageTitle = getSectionContent?.(retailAdvantageSection, 'title') || 'Discover the Refex Retail Advantage';
                      const retailAdvantageDescription = getSectionContent?.(retailAdvantageSection, 'description') || 'Redefine retail excellence with streamlined operations, a rich variety of stores, and a customer-centric approach for an unmatched shopping journey.';
                      const fallbackBullets = ['Diverse Store Options', 'Seamless Business Operations', 'Strategic Layout for Visibility', 'Exciting Shopping Experience'];
                      const bulletsToShow = retailAdvantageBullets.length > 0 ? retailAdvantageBullets : fallbackBullets;
                      return (
                        <>
                          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight">
                            {retailAdvantageTitle}
                          </h2>

                          {/* Description */}
                          <p className="text-base lg:text-lg mb-6 text-white/95 leading-relaxed">
                            {retailAdvantageDescription}
                          </p>

                          {/* Features List */}
                          <ul className="space-y-3">
                            {bulletsToShow.map((bullet: string, index: number) => (
                              <li key={index} className="flex items-center gap-3">
                                <i className="ri-check-line text-xl text-white flex-shrink-0"></i>
                                <span className="text-white text-base lg:text-lg">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* Transportation Enhancement Section */}
      <ScrollRevealSection>
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Left - Image */}
              <div className="flex-1 p-6 flex">
  {(() => {
    const transportSection = pageSections['transportation-enhancement'];
    const transportImageData = getSectionContent?.(transportSection, 'image');
    const transportImage =
      transportImageData?.path ||
      (getImagePath && transportImageData ? getImagePath(transportImageData) : '');

    return (
      <img
        src={transportImage}
        alt="Transportation Enhancement"
        className="w-full h-full object-cover rounded-2xl"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  })()}
</div>

              {/* Right - Content */}
              <div className="flex-1  p-6 ">
                {(() => {
                  const transportSection = pageSections['transportation-enhancement'];
                  const transportTitle = getSectionContent?.(transportSection, 'title') || 'Comprehensive Transportation Enhancement Initiatives';
                  const transportDescription = getSectionContent?.(transportSection, 'description') || 'Enhance consumer journeys across transportation platforms (airports, railways, metro systems, bus stations, heliports). Currently managing end-to-end design, finance, operation, and maintenance of Pune Airport outlets (May 2023) and Srinagar Airport (Oct 2023).';
                  const fallbackCards = [
                    { title: 'Holistic Transportation\nSolutions', icon: HolisticTransportIcon },
                    { title: 'Airport Retail Management\nExpertise', icon: RetailManagementIcon },
                  ];
                  const iconMap: any = {
                    'Holistic Transportation\nSolutions': HolisticTransportIcon,
                    'Holistic Transportation Solutions': HolisticTransportIcon,
                    'Airport Retail Management\nExpertise': RetailManagementIcon,
                    'Airport Retail Management Expertise': RetailManagementIcon,
                  };
                  const cardsToShow = transportCards.length > 0 ? transportCards : fallbackCards;
                  return (
                    <>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                        {transportTitle}
                      </h2>
                      <p className="text-gray-600 text-base mb-8 leading-relaxed">
                        {transportDescription}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {cardsToShow.map((card: any, index: number) => {
                          const IconComponent = card.icon || iconMap[card.title] || HolisticTransportIcon;
                          return (
                            <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-zoom overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4a9d6d] to-[#5fb85a]"></div>
                              <div className="flex gap-4 items-center pl-2">
                                <div className="flex-shrink-0">
                                  <IconComponent
                                    className="w-12 h-12 card-icon-gradient"
                                    style={{
                                      fill: 'url(#iconGradient)'
                                    }}
                                  />
                                  {index === 0 && (
                                    <svg width="0" height="0">
                                      <defs>
                                        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#4a9d6d" />
                                          <stop offset="50%" stopColor="#5fb85a" />
                                          <stop offset="100%" stopColor="#6bc4a8" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-black text-base leading-tight whitespace-pre-line">{card.title}</h3>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* Tech Integration Section */}
      <ScrollRevealSection>
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                {(() => {
                  const techSection = pageSections['tech-integration'];
                  const techTitle = getSectionContent?.(techSection, 'title') || 'Elevating Airport Retail Experience with Seamless Tech Integration';
                  const techDescription = getSectionContent?.(techSection, 'description') || 'Our commitment to enhancing customer experiences at airports extends to providing a future-forward, seamless retail and shopping journey for air travelers. Leveraging advanced technology, including the convenient pick-up of gifts and shopping items directly from our outlets, we ensure a modern and efficient shopping experience.';
                  const fallbackCards = [
                    { title: 'Customer-Centric Retail\nEnhancement', icon: CustomerCentricIcon },
                    { title: 'Seamless Tech-Driven\nShopping Experience', icon: SeamlessTechIcon },
                  ];
                  const iconMap: any = {
                    'Customer-Centric Retail\nEnhancement': CustomerCentricIcon,
                    'Customer-Centric Retail Enhancement': CustomerCentricIcon,
                    'Seamless Tech-Driven\nShopping Experience': SeamlessTechIcon,
                    'Seamless Tech-Driven Shopping Experience': SeamlessTechIcon,
                  };
                  const cardsToShow = techCards.length > 0 ? techCards : fallbackCards;
                  return (
                    <>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                        {techTitle}
                      </h2>
                      <p className="text-gray-600 text-base mb-8 leading-relaxed">
                        {techDescription}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {cardsToShow.map((card: any, index: number) => {
                          const IconComponent = card.icon || iconMap[card.title] || CustomerCentricIcon;
                          return (
                            <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-zoom overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4a9d6d] to-[#5fb85a]"></div>
                              <div className="flex gap-4 items-center pl-2">
                                <div className="flex-shrink-0">
                                  <IconComponent className="w-12 h-12" style={{ fill: 'url(#iconGradient)' }} />
                                  {index === 0 && (
                                    <svg width="0" height="0">
                                      <defs>
                                        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#4a9d6d" />
                                          <stop offset="50%" stopColor="#5fb85a" />
                                          <stop offset="100%" stopColor="#6bc4a8" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-black text-base leading-tight whitespace-pre-line">{card.title}</h3>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Right - Image */}
              <div>
                {(() => {
                  const techSection = pageSections['tech-integration'];
                  const techImageData = getSectionContent?.(techSection, 'image');
                  const techImage = techImageData?.path || (getImagePath && techImageData ? getImagePath(techImageData) : null) || '';
                  return (
                    <img
                      src={techImage}
                      alt="Tech Integration"
                      className="w-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* CTA Section */}
      <ScrollRevealSection>
        <section className="py-12 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${(() => {
                const ctaSection = pageSections['cta'];
                const ctaBgData = getSectionContent?.(ctaSection, 'backgroundImage');
                const ctaBg = ctaBgData?.path || (getImagePath && ctaBgData ? getImagePath(ctaBgData) : null) || RefexDifferenceBg;
                return ctaBg;
              })()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'linear-gradient(185deg, rgba(42, 120, 178, 0.47) 0%, rgba(20, 150, 130, 0.8) 71%)'
            }}
          ></div>

          <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
            {(() => {
              const ctaSection = pageSections['cta'];
              const ctaTitle = getSectionContent?.(ctaSection, 'title') || 'Revolutionizing Airport Retail';
              const ctaDescription = getSectionContent?.(ctaSection, 'description') || 'Discover how Refex Airports is pioneering a new era of retail in the airport environment, blending convenience with luxury.';
              const ctaButtonText = getSectionContent?.(ctaSection, 'buttonText') || 'Visit Website';
              const ctaButtonLink = getSectionContent?.(ctaSection, 'buttonLink') || 'https://refexairports.com/';
              return (
                <>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    {ctaTitle}
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                    {ctaDescription}
                  </p>
                  <a
                    href={ctaButtonLink}
                    target={ctaButtonLink.startsWith('http') ? '_blank' : undefined}
                    rel={ctaButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-block bg-white text-green-600 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 whitespace-normal sm:whitespace-nowrap text-sm sm:text-base"
                  >
                    {ctaButtonText}
                  </a>
                </>
              );
            })()}
          </div>
        </section>
      </ScrollRevealSection>
      <Footer />

      <style>{`
        .logo-zoom {
          animation: logoZoom 3s ease-in-out infinite;
        }
        
        @keyframes logoZoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        .card-zoom {
          animation: cardZoom 4s ease-in-out infinite;
        }
        
        @keyframes cardZoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .card-icon-gradient {
          animation: iconZoom 3.5s ease-in-out infinite;
        }
        
        @keyframes iconZoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </MainLayout>
  );
}
