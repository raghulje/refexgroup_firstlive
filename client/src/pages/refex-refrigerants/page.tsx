import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import { trackTabSwitch, trackButtonClick } from '../../utils/ga4';

// Import SVG icons
import StateOfArtIcon from '../svg/refrigerants/state_of_art.svg?react';
import WellNetworkIcon from '../svg/refrigerants/wellnetwork.svg?react';
import HighQualityIcon from '../svg/refrigerants/highquality.svg?react';
import ReliableShippingIcon from '../svg/refrigerants/reliableshipping.svg?react';
import SkilledEmployeesIcon from '../svg/refrigerants/skilledemployees.svg?react';
import { getApiBaseUrl } from '../../config/env';

export default function RefexRefrigerantsPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [whyChooseCards, setWhyChooseCards] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
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
      // For other strings, try to treat as path
      const apiBase = getApiBaseUrl();
      return `${apiBase}${imageData.startsWith('/') ? imageData : '/' + imageData}`;
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

    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }

    // Handle image/media content with positioning
    if (contentItem.media || contentItem.mediaId) {
      // Try to get positioning from separate content items in the same section
      let positionX = '50';
      let positionY = '50';

      if (section?.content) {
        // Look for backgroundPositionX or backgroundImagePositionX
        const posXItem = section.content.find((c: any) =>
          c.contentKey === 'backgroundPositionX' ||
          c.contentKey === 'backgroundImagePositionX' ||
          c.contentKey === `${contentKey}PositionX`
        );
        if (posXItem && posXItem.contentValue) {
          positionX = posXItem.contentValue;
        }

        // Look for backgroundPositionY or backgroundImagePositionY
        const posYItem = section.content.find((c: any) =>
          c.contentKey === 'backgroundPositionY' ||
          c.contentKey === 'backgroundImagePositionY' ||
          c.contentKey === `${contentKey}PositionY`
        );
        if (posYItem && posYItem.contentValue) {
          positionY = posYItem.contentValue;
        }
      }

      return {
        path: getImagePath(contentItem.media),
        positionX: positionX,
        positionY: positionY
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
    const fetchRefrigerantsData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-refrigerants');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Why Choose Cards
          const whyChooseSection = sections.find((s: any) => s.sectionKey === 'why-choose-us');
          if (whyChooseSection?.content) {
            const cardsContent = whyChooseSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsContent && cardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsContent.contentValue);
                // Process cards to ensure iconPath is properly formatted
                const processedCards = Array.isArray(parsed) ? parsed.map((card: any) => {
                  // Log for debugging
                  if (card.iconPath) {
                    console.log('Card iconPath before processing:', card.iconPath, 'Type:', typeof card.iconPath);
                  }
                  return card;
                }) : [];
                console.log('Processed why choose cards:', processedCards);
                setWhyChooseCards(processedCards);
              } catch (e) {
                console.error('Error parsing why choose cards:', e);
              }
            }
          }

          // Parse Products
          const productsSection = sections.find((s: any) => s.sectionKey === 'products');
          if (productsSection?.content) {
            const productsContent = productsSection.content.find((c: any) => c.contentKey === 'products');
            if (productsContent && productsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(productsContent.contentValue);
                setProducts(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing products:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching refrigerants data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefrigerantsData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
    window.scrollTo(0, 0);
    
    // Ensure first tab is visible on desktop by default (restore original behavior)
    const productQualityTab = document.getElementById('product-quality');
    if (productQualityTab && window.innerWidth >= 768) {
      productQualityTab.style.display = 'block';
    }
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      {(() => {
        const heroSection = pageSections['hero-section'];
        const tagline = getSectionContent(heroSection, 'tagline') || 'Refex Refrigerants';
        const title = getSectionContent(heroSection, 'title') || 'Pioneers and Conscious Innovators in the Refrigerant gas Industry.';
        const description = getSectionContent(heroSection, 'description') || 'Since the inception in 2002, Refex has established itself as a formidable leader and competitor in the refrigerant gas industry. In the last twenty years of our quest towards climate-friendly alternatives, we have successfully developed and expanded our product lines to include innovative and environmental-friendly options. We are also proactively addressing and tackling sourcing and environmental policy changes. Our focus is on sustainability and we are dedicated to creating a better future!';
        const buttonText = getSectionContent(heroSection, 'buttonText') || 'Explore';
        const buttonLink = getSectionContent(heroSection, 'buttonLink') || '#explore';
        const backgroundColor = getSectionContent(heroSection, 'backgroundColor') || '#1e5a8e';
        const backgroundImage = getSectionContent(heroSection, 'backgroundImage');
        const bgImagePath = backgroundImage?.path || (typeof backgroundImage === 'string' ? backgroundImage : (backgroundImage ? getImagePath(backgroundImage) : ''));
        const bgPosition = backgroundImage?.positionX && backgroundImage?.positionY
          ? getBackgroundPosition(backgroundImage.positionX, backgroundImage.positionY)
          : 'center';

        return (
          <section className="relative py-16 lg:py-20" style={{ backgroundColor }}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(${bgImagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: bgPosition,
                backgroundRepeat: 'no-repeat'
              }}
            >
            </div>
            <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-20">
              <div className="max-w-2xl">
                <p className="text-[18px] font-semibold tracking-wider mb-4 text-white/80" data-aos="fade-up">
                  {tagline}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white" data-aos="fade-up" data-aos-delay="100">
                  {title}
                </h1>
                <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
                  {description}
                </p>
                {/* Explore button - commented out for future use */}
                {/* <a
                  href={buttonLink}
                  className="cta-button-fill-refrigerants inline-flex items-center gap-2 bg-white text-black border-2 border-black px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer relative overflow-hidden group"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonText}
                    <i className="ri-arrow-down-line"></i>
                  </span>
                </a> */}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Anchor */}
      <div id="explore"></div>

      {/* Why Choose Us Section */}
      {(() => {
        const whyChooseSection = pageSections['why-choose-us'];
        const heading = getSectionContent(whyChooseSection, 'heading') || 'Why Choose Us';
        const fallbackCards = [
          { icon: StateOfArtIcon, title: 'State of the Art Automated Filling Equipment', description: 'Experience unparalleled convenience and precision at our refilling factory, featuring automated and dedicated filling lines suitable for all products and sizes of cylinders, tonners, and cans.' },
          { icon: WellNetworkIcon, title: 'Well Networked Logistics', description: 'Our expert logistics network guarantees prompt and reliable shipping, backed by our extensive experience in streamlining orders and ensuring timely supply.' },
          { icon: HighQualityIcon, title: 'Highest Quality Standards', description: 'Our comprehensive product testing capabilities uphold the highest quality standards in each and every process to ensure maximum efficiency, precision and quality control..' },
          { icon: ReliableShippingIcon, title: 'Reliable Shipping', description: 'Exclusive partnerships with trusted forwarders to guarantee secure and expedited shipping.' },
          { icon: SkilledEmployeesIcon, title: 'Skilled Employees', description: 'Dedicated employees with excellent engineering expertise providing exceptional service and high-quality products to our valued business partners and consumers.' },
        ];
        const cardsToShow = whyChooseCards.length > 0 ? whyChooseCards : fallbackCards;

        return (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-16" data-aos="fade-up">
                {heading}
              </h2>

              <div className="flex flex-wrap justify-center gap-y-12 gap-x-8 lg:gap-x-12">
                {cardsToShow.map((card: any, index: number) => {
                  // Handle icon from CMS - can be iconPath (mediaId or path) or icon (SVG component)
                  let iconPath = null;
                  if (card.iconPath) {
                    // iconPath might be /uploads/media/{id}, a number (media ID), or a direct path
                    // getImagePath will handle all cases
                    const resolvedPath = getImagePath(card.iconPath);
                    console.log(`Card ${index} (${card.title}): iconPath=${card.iconPath}, resolvedPath=${resolvedPath}`);
                    // Only use if it's a valid non-empty path
                    if (resolvedPath && resolvedPath.trim() !== '') {
                      iconPath = resolvedPath;
                    }
                  } else if (card.icon && typeof card.icon !== 'function') {
                    const resolvedPath = getImagePath(card.icon);
                    if (resolvedPath && resolvedPath.trim() !== '') {
                      iconPath = resolvedPath;
                    }
                  }

                  const IconComponent = (!iconPath && card.icon && typeof card.icon === 'function') ? card.icon : (fallbackCards[index]?.icon);

                  return (
                    <div key={index} className="text-center group w-full md:w-[45%] lg:w-[30%]" data-aos="fade-up" data-aos-delay={index * 150}>
                      <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        {iconPath ? (
                          <img
                            src={iconPath}
                            alt={card.title || 'Icon'}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              // Fallback to SVG if image fails
                              console.warn('Failed to load icon image:', iconPath, 'for card:', card.title);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : IconComponent && typeof IconComponent === 'function' ? (
                          <IconComponent className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
                        ) : null}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{card.title || 'Card'}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{card.description || ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Breaking New Grounds Section */}
      {(() => {
        const breakingGroundsSection = pageSections['breaking-grounds'];
        const title = getSectionContent(breakingGroundsSection, 'title') || 'Breaking new grounds with innovative and sustainable solutions in Refrigerant gas refilling.';
        const backgroundColor = getSectionContent(breakingGroundsSection, 'backgroundColor') || '#1e5a8e';

        return (
          <section className="py-20" style={{ backgroundColor }}>
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white" data-aos="fade-in">
                {title}
              </h2>
            </div>
          </section>
        );
      })()}

      {/* Our Products Section */}
      {(() => {
        const productsSection = pageSections.products;
        const heading = getSectionContent(productsSection, 'heading') || 'Our Products';
        const description = getSectionContent(productsSection, 'description') || 'Discover our innovative and eco-friendly products that are produced to meet your needs while making a positive impact on the environment.';
        const backgroundColor = getSectionContent(productsSection, 'backgroundColor') || '#f5f5f5';
        const cardBackgroundColor = getSectionContent(productsSection, 'cardBackgroundColor') || '#1e5a8e';
        // No fallback products - all must come from CMS
        const productsToShow = products;

        return (
          <section className="py-20" style={{ backgroundColor }}>
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                  {heading}
                </h2>
                <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-12" data-aos="fade-up">
                  {description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {productsToShow.map((product: any, index: number) => {
                  // Handle product image from CMS - can be mediaId or image object
                  let productImage = '';
                  if (product.image) {
                    if (typeof product.image === 'string') {
                      // Could be a mediaId or URL
                      productImage = getImagePath(product.image);
                    } else if (product.image.path) {
                      productImage = getImagePath(product.image);
                    } else {
                      productImage = getImagePath(product.image);
                    }
                  }

                  // No fallback - image must come from CMS

                  return (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay={index % 3 === 0 ? 0 : index % 3 === 1 ? 300 : 600}>
                      <div className="bg-white p-8 flex items-center justify-center h-64">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={product.name || 'Product'}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              // Hide image if it fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div className="text-white text-center py-4" style={{ backgroundColor: cardBackgroundColor }}>
                        <h3 className="text-xl font-bold">{product.name || 'Product'}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Quality Assurance & Safety Section */}
      {(() => {
        const qualitySection = pageSections['quality-assurance'];
        const heading = getSectionContent(qualitySection, 'heading') || 'Quality Assurance & Safety';
        const description = getSectionContent(qualitySection, 'description') || 'Our commitment to excellence and attention to detail has established our products as a benchmark in the industry. You can trust Refex to provide you with the highest quality and safest products for all your refrigerant gas needs.';
        const backgroundGradient = getSectionContent(qualitySection, 'backgroundGradient') || 'linear-gradient(360deg, rgba(42, 120, 178, 0.14) 68%, rgba(30, 90, 142, 0.05) 100%)';
        const tab1Label = getSectionContent(qualitySection, 'tab1Label') || 'Product Quality';
        const tab2Label = getSectionContent(qualitySection, 'tab2Label') || 'Product Safety';
        const tab1Icon = getSectionContent(qualitySection, 'tab1Icon');
        const tab1IconPath = tab1Icon?.path || (tab1Icon ? getImagePath(tab1Icon) : '');
        const tab1Image = getSectionContent(qualitySection, 'tab1Image');
        const tab1ImagePath = tab1Image?.path || (tab1Image ? getImagePath(tab1Image) : '');
        const tab1Items = getSectionContent(qualitySection, 'tab1Items') || [
          'We provide each customer with a Certificate of Analysis that conforms to the highest quality standards, we test and analyze all products before and after filling in our state-of-the-art laboratory to ensure consistency.',
          'Keeping in pace with the market revolution, we have fully committed ourselves to continuous improvement, innovation, and implementation in all our processes , right from filling to customer service. Our focus on quality, timely delivery, and customer satisfaction is reflected in our success.',
          'Our dedication to quality is ingrained in every aspect of our business. We pride ourselves on building long-lasting relationships with our customers by providing quality products and services that exceed expectations.'
        ];
        const tab2Icon = getSectionContent(qualitySection, 'tab2Icon');
        const tab2IconPath = tab2Icon?.path || (tab2Icon ? getImagePath(tab2Icon) : '');
        const tab2Image = getSectionContent(qualitySection, 'tab2Image');
        const tab2ImagePath = tab2Image?.path || (tab2Image ? getImagePath(tab2Image) : '');
        const tab2Items = getSectionContent(qualitySection, 'tab2Items') || [
          'At Refex, we take the security and safety of our products very seriously. Each product is provided with a dedicated storage facility, approved and licensed by PESO, PCB, and other relevant authorities. We ensure 100% compliance with all regulations and use the best fabricators in the industry.',
          'Quality and safety are our top priorities at Refex. We are certified with ISO 14001:2015, and our in-house laboratory tests and analyzes every product for purity of gas and moisture content before and after filling. We take great care to ensure the quality of all cylinders before filling with gases.'
        ];
        const tabButtonColor = getSectionContent(qualitySection, 'tabButtonColor') || '#1e5a8e';

        return (
          <section className="py-20" style={{ background: backgroundGradient }}>
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
                  {heading}
                </h2>
                <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto" data-aos="fade-up">
                  {description}
                </p>
              </div>

              {/* Desktop Tabs - Original behavior preserved */}
              <div className="hidden md:flex justify-center mb-8" data-aos="fade-up">
                <div className="inline-flex flex-wrap justify-center gap-3 sm:gap-4">
                  <button
                    className="tab-button-refrigerants tab-button-active flex items-center gap-2 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all whitespace-normal sm:whitespace-nowrap cursor-pointer shadow-md relative overflow-hidden group"
                    style={{ backgroundColor: tabButtonColor }}
                    onClick={(e) => {
                      trackTabSwitch(tab1Label || 'Product Quality', 'refrigerants-page');
                      // Hide all tab contents on desktop
                      document.querySelectorAll('.tab-content').forEach(el => {
                        if (window.innerWidth >= 768) {
                          el.style.display = 'none';
                        } else {
                          el.classList.add('hidden');
                        }
                      });
                      // Show selected tab content on desktop
                      const qualityTab = document.getElementById('product-quality');
                      if (qualityTab) {
                        if (window.innerWidth >= 768) {
                          qualityTab.style.display = 'block';
                        } else {
                          qualityTab.classList.remove('hidden');
                        }
                      }
                      // Update button styles
                      document.querySelectorAll('.tab-button-refrigerants').forEach(btn => {
                        btn.classList.remove('tab-button-active');
                        btn.classList.add('tab-button-inactive');
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                      });
                      e.currentTarget.classList.remove('tab-button-inactive');
                      e.currentTarget.classList.add('tab-button-active');
                      e.currentTarget.style.backgroundColor = tabButtonColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    data-ga-track="button"
                    data-ga-label={`${tab1Label} Tab`}
                    data-ga-location="refrigerants-page"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {tab1IconPath ? (
                        <img 
                          src={tab1IconPath} 
                          alt={tab1Label}
                          className="w-5 h-5 flex-shrink-0"
                          onError={(e) => {
                            // Hide SVG and show fallback icon if it fails to load
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallbackIcon = parent.querySelector('.fallback-icon') as HTMLElement;
                              if (fallbackIcon) fallbackIcon.style.display = 'inline';
                            }
                          }}
                        />
                      ) : null}
                      <i className={`ri-shield-check-line text-xl flex-shrink-0 ${tab1IconPath ? 'hidden fallback-icon' : ''}`}></i>
                      {tab1Label}
                    </span>
                  </button>
                  <button
                    className="tab-button-refrigerants tab-button-inactive flex items-center gap-2 bg-white text-[#2a78b2] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all whitespace-normal sm:whitespace-nowrap cursor-pointer shadow-sm relative overflow-hidden group"
                    onClick={(e) => {
                      trackTabSwitch(tab2Label || 'Product Safety', 'refrigerants-page');
                      // Hide all tab contents on desktop
                      document.querySelectorAll('.tab-content').forEach(el => {
                        if (window.innerWidth >= 768) {
                          el.style.display = 'none';
                        } else {
                          el.classList.add('hidden');
                        }
                      });
                      // Show selected tab content on desktop
                      const safetyTab = document.getElementById('product-safety');
                      if (safetyTab) {
                        if (window.innerWidth >= 768) {
                          safetyTab.style.display = 'block';
                        } else {
                          safetyTab.classList.remove('hidden');
                        }
                      }
                      // Update button styles
                      document.querySelectorAll('.tab-button-refrigerants').forEach(btn => {
                        btn.classList.remove('tab-button-active');
                        btn.classList.add('tab-button-inactive');
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                      });
                      e.currentTarget.classList.remove('tab-button-inactive');
                      e.currentTarget.classList.add('tab-button-active');
                      e.currentTarget.style.backgroundColor = tabButtonColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    data-ga-track="button"
                    data-ga-label={`${tab2Label} Tab`}
                    data-ga-location="refrigerants-page"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {tab2IconPath ? (
                        <img 
                          src={tab2IconPath} 
                          alt={tab2Label}
                          className="w-5 h-5 flex-shrink-0"
                          onError={(e) => {
                            // Hide SVG and show fallback icon if it fails to load
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallbackIcon = parent.querySelector('.fallback-icon') as HTMLElement;
                              if (fallbackIcon) fallbackIcon.style.display = 'inline';
                            }
                          }}
                        />
                      ) : null}
                      <i className={`ri-shield-line text-xl flex-shrink-0 ${tab2IconPath ? 'hidden fallback-icon' : ''}`}></i>
                      {tab2Label}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mobile Stacked Layout - Always Visible */}
              <div className="md:hidden space-y-4 mb-6" data-aos="fade-up">
                {/* Product Quality Section */}
                <div className="space-y-3">
                  {/* Product Quality Button/Label */}
                  <div 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full shadow-sm"
                    style={{
                      backgroundColor: tabButtonColor,
                      color: 'white'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'white',
                        color: tabButtonColor
                      }}
                    >
                      {tab1IconPath ? (
                        <img 
                          src={tab1IconPath} 
                          alt={tab1Label}
                          className="w-4 h-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <i className="ri-shield-check-line text-sm"></i>
                      )}
                    </div>
                    <span className="flex-1 font-medium text-sm sm:text-base text-white">{tab1Label}</span>
                  </div>

                  {/* Product Quality Content - Always Visible */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="space-y-4">
                      {tab1ImagePath && tab1ImagePath.trim() !== '' ? (
                        <div className="mb-4">
                          <img
                            src={tab1ImagePath}
                            alt="Quality Check"
                            className="rounded-lg w-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : null}
                      <ul className="space-y-3 sm:space-y-4">
                        {Array.isArray(tab1Items) ? tab1Items.map((item: string, index: number) => (
                          <li key={index} className="flex gap-3">
                            <i className="ri-checkbox-circle-fill text-[#50b848] text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-1"></i>
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Product Safety Section */}
                <div className="space-y-3">
                  {/* Product Safety Button/Label */}
                  <div 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-full shadow-sm"
                    style={{
                      backgroundColor: tabButtonColor,
                      color: 'white'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'white',
                        color: tabButtonColor
                      }}
                    >
                      {tab2IconPath ? (
                        <img 
                          src={tab2IconPath} 
                          alt={tab2Label}
                          className="w-4 h-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <i className="ri-shield-line text-sm"></i>
                      )}
                    </div>
                    <span className="flex-1 font-medium text-sm sm:text-base text-white">{tab2Label}</span>
                  </div>

                  {/* Product Safety Content - Always Visible */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="space-y-4">
                      {tab2ImagePath && tab2ImagePath.trim() !== '' ? (
                        <div className="mb-4">
                          <img
                            src={tab2ImagePath}
                            alt="Safety Check"
                            className="rounded-lg w-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : null}
                      <ul className="space-y-3 sm:space-y-4">
                        {Array.isArray(tab2Items) ? tab2Items.map((item: string, index: number) => (
                          <li key={index} className="flex gap-3">
                            <i className="ri-checkbox-circle-fill text-[#50b848] text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-1"></i>
                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Quality Tab - Desktop (Original behavior, visible by default) */}
              <div id="product-quality" className="tab-content bg-white rounded-lg p-8 hidden md:block" data-aos="fade-in">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    {tab1ImagePath && tab1ImagePath.trim() !== '' ? (
                      <img
                        src={tab1ImagePath}
                        alt="Quality Check"
                        className="rounded-lg w-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  <div>
                    <ul className="space-y-4">
                      {Array.isArray(tab1Items) ? tab1Items.map((item: string, index: number) => (
                        <li key={index} className="flex gap-3">
                          <i className="ri-checkbox-circle-fill text-[#50b848] text-xl flex-shrink-0 mt-1"></i>
                          <span className="text-sm md:text-base text-gray-700">{item}</span>
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </div>
              </div>


              {/* Product Safety Tab - Desktop (Original behavior) */}
              <div id="product-safety" className="tab-content bg-white rounded-lg p-8 hidden" data-aos="fade-in">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    {tab2ImagePath && tab2ImagePath.trim() !== '' ? (
                      <img
                        src={tab2ImagePath}
                        alt="Safety Check"
                        className="rounded-lg w-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  <div>
                    <ul className="space-y-4">
                      {Array.isArray(tab2Items) ? tab2Items.map((item: string, index: number) => (
                        <li key={index} className="flex gap-3">
                          <i className="ri-checkbox-circle-fill text-[#50b848] text-xl flex-shrink-0 mt-1"></i>
                          <span className="text-sm md:text-base text-gray-700">{item}</span>
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </section>
        );
      })()}

      {/* Refex Industries Limited Section */}
      {(() => {
        const industriesSection = pageSections['refex-industries'];
        const title = getSectionContent(industriesSection, 'title') || 'Refex Industries Limited';
        const description = getSectionContent(industriesSection, 'description') || 'A market leader in the refrigerant gas industry. Discover our eco-friendly alternatives and pave your way towards a greener tomorrow.';
        const buttonText = getSectionContent(industriesSection, 'buttonText') || 'Visit Website';
        const buttonLink = getSectionContent(industriesSection, 'buttonLink') || 'https://www.refex.co.in/';
        const backgroundImage = getSectionContent(industriesSection, 'backgroundImage');
        const bgImagePath = backgroundImage?.path || (backgroundImage ? getImagePath(backgroundImage) : '');
        const gradientOverlay = getSectionContent(industriesSection, 'gradientOverlay') || 'linear-gradient(185deg, #2A78B247 0%, #1e5a8e 71%)';

        return (
          <section className="relative py-14 overflow-hidden" data-aos="fade-up">
            {/* Background Image */}
            <div className="absolute inset-0">
              {bgImagePath && bgImagePath.trim() !== '' ? (
                <img
                  src={bgImagePath}
                  alt="Refex Industries Background"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}
              {/* Custom Gradient Overlay */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: gradientOverlay,
                  transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'
                }}
              ></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-aos="fade-up">
                {title}
              </h2>
              <p className="text-sm md:text-base text-white/90 mb-8 max-w-2xl mx-auto" data-aos="fade-up">
                {description}
              </p>
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackButtonClick(buttonText, 'refrigerants-page-cta', buttonLink)}
                className="cta-button-fill-refrigerants inline-flex items-center justify-center bg-white text-[#0066cc] border-2 border-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 whitespace-normal sm:whitespace-nowrap cursor-pointer relative overflow-hidden group text-sm sm:text-base"
                data-aos="zoom-in"
                data-ga-track="button"
                data-ga-label={buttonText}
                data-ga-location="refrigerants-page-cta"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {buttonText}
                  <i className="ri-arrow-right-line ml-2"></i>
                </span>
              </a>
            </div>
          </section>
        );
      })()}
      <Footer />
      <style>{`
        .cta-button-fill-refrigerants {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .cta-button-fill-refrigerants::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background: linear-gradient(135deg, #20B2AA 0%, #F5F5DC 100%);
          transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill-refrigerants:hover::before {
          height: 100%;
        }
        
        .cta-button-fill-refrigerants:hover {
          color: #1e5a8e;
          border-color: #20B2AA;
        }
        
        .cta-button-fill-refrigerants span {
          transition: color 0.3s ease 0.1s;
        }
        
        .tab-button-refrigerants {
          position: relative;
        }
        
        .tab-button-refrigerants.tab-button-inactive::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, #20B2AA 0%, #F5F5DC 100%);
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .tab-button-refrigerants.tab-button-inactive:hover::before {
          width: 100%;
        }
        
        .tab-button-refrigerants.tab-button-inactive:hover {
          color: #1e5a8e;
        }
        
        .tab-button-refrigerants.tab-button-active {
          background-color: #2a78b2 !important;
          color: white !important;
        }
        
        .tab-button-refrigerants.tab-button-inactive {
          background-color: white !important;
          color: #2a78b2 !important;
        }
        
        .tab-button-refrigerants span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </MainLayout>
  );
}
