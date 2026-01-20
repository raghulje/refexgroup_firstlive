import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import InvestmentsHero from '../../wp-content/uploads/2023/02/Investments-e1677567598400.jpg';
import RefexLogo from '../../wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png';
import AnilBg from '../../wp-content/uploads/2023/02/Anil.png';
import DownIcon from '../../wp-content/uploads/2025/03/down.png';
import { pagesService, sectionsService, stockService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';
import { trackLinkClick, trackButtonClick } from '../../utils/ga4';

export default function InvestmentsPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [listedCompanies, setListedCompanies] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any>({});
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
    const fetchInvestmentsData = async () => {
      try {
        setLoading(true);

        // Fetch stock data
        const symbols = ['REFEX.NS', 'REFEX.BO', 'REFEXRENEW.BO'];
        const stockResults: any = {};

        await Promise.all(symbols.map(async (symbol) => {
          const data = await stockService.getCurrentPrice(symbol);
          if (data && data.status) {
            stockResults[symbol] = data;
          }
        }));

        setStockData(stockResults);

        // Fetch page and sections
        const page = await pagesService.getBySlug('investments');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Listed Companies
          const listedCompaniesSection = sections.find((s: any) => s.sectionKey === 'listed-companies');
          if (listedCompaniesSection?.content) {
            const companiesContent = listedCompaniesSection.content.find((c: any) => c.contentKey === 'companies');
            if (companiesContent && companiesContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(companiesContent.contentValue);
                setListedCompanies(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing listed companies:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching investments data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentsData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {(() => {
          const heroSection = pageSections.hero;
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : InvestmentsHero);
          const tagline = getSectionContent(heroSection, 'tagline') || '';
          const title = getSectionContent(heroSection, 'title') || 'Investments';
          const description = getSectionContent(heroSection, 'description') || 'Unlock Your Financial Potential: Explore Our Diverse Range of Investment Opportunities and Discover a World of Possibilities';

          return (
            <section
              className="relative py-14 md:py-16 bg-cover bg-center"
              style={{
                backgroundImage: `url(${bgImagePath})`,
              }}
            >
              {/* Fixed Gradient Overlay - Prefixed (applied before black overlay) */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)',
                }}
              />
              
              {/* Black Background Overlay */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                }}
              />

              <div className="container mx-auto px-6 lg:px-12 pt-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                  <div data-aos="fade-right" data-aos-duration="1000" data-aos-easing="ease-out-cubic">
                    {tagline && (
                      <p className="text-white/90 text-sm mb-4 tracking-wide">{tagline}</p>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-0">
                      {title}
                    </h1>
                  </div>
                  <div data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                    <p className="text-sm md:text-base text-white leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Intro Section with Logo */}
        {(() => {
          const introSection = pageSections.intro;
          const heading = getSectionContent(introSection, 'title') || getSectionContent(introSection, 'heading') || 'Grow your finances into success by investing in Refex Group through multiple stakeholder options';
          const logo = getSectionContent(introSection, 'logo');
          const logoPath = logo?.path || (logo ? getImagePath(logo) : RefexLogo);

          return (
            <section className="pt-6 md:pt-8 pb-8 md:pb-10 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-6" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
                    {heading}
                  </h2>
                  <div className="flex justify-center mb-6" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                    <img
                      src={logoPath}
                      alt="Refex Logo"
                      className="h-12 md:h-16"
                    />
                  </div>
                </div>

                {/* Message from Anil Jain */}
                {(() => {
                  const messageSection = pageSections['message-anil-jain'];
                  const title = getSectionContent(messageSection, 'title') || 'Message from Anil Jain';
                  const subtitle = getSectionContent(messageSection, 'position') || getSectionContent(messageSection, 'subtitle') || 'Chairman & Managing Director';

                  // Parse content array from CMS
                  let contentArray: string[] = [];
                  const contentData = getSectionContent(messageSection, 'content');
                  if (Array.isArray(contentData)) {
                    contentArray = contentData;
                  } else if (typeof contentData === 'string' && contentData) {
                    try {
                      contentArray = JSON.parse(contentData);
                    } catch {
                      contentArray = [contentData];
                    }
                  }

                  // Fallback to default paragraphs if no CMS content
                  const paragraph1 = contentArray[0] || getSectionContent(messageSection, 'paragraph1') || 'Proud to say that our success is a result of our strong risk-taking ability and our dedicated team who follow best practices in risk mitigation. We are committed to continuously adapting to the changing business environment and staying ahead of the curve through our focus on macro-trends and innovation.';
                  const paragraph2 = contentArray[1] || getSectionContent(messageSection, 'paragraph2') || 'Our commitment to being environmentally, socially, and governance (ESG) compliant is at the forefront of all our business decisions and will continue to drive our success in the future.';

                  const backgroundImage = getSectionContent(messageSection, 'image') || getSectionContent(messageSection, 'backgroundImage');
                  const bgImagePath = backgroundImage?.path || (backgroundImage ? getImagePath(backgroundImage) : AnilBg);
                  const bgPosition = getSectionContent(messageSection, 'backgroundPosition') || 'bottom right';
                  const bgSize = getSectionContent(messageSection, 'backgroundSize') || '32% auto';

                  return (
                    <>
                      <style>{`
                        .message-container-mobile {
                          background-image: none;
                        }
                        @media (min-width: 768px) {
                          .message-container-mobile {
                            background-image: url(${bgImagePath});
                          }
                        }
                      `}</style>
                    <div className="flex justify-center w-full">
                      <div
                          className="flex flex-col bg-white md:bg-gray-50 rounded-2xl md:rounded-[60px] shadow-[0px_24px_94px_1px_rgba(0,0,0,0.06)] w-full md:w-[80%] relative message-container-mobile p-4 sm:p-6 md:p-12"
                        style={{
                          backgroundPosition: bgPosition,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: bgSize
                        }}
                        data-aos="fade-up"
                        data-aos-duration="900"
                        data-aos-delay="100"
                        data-aos-easing="ease-out-cubic"
                      >
                          {/* Mobile: Full width content, Desktop: Constrained */}
                          <div className="space-y-4 sm:space-y-6 w-full md:max-w-[65%] md:pr-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                            {/* Quotation Mark Icon */}
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-start md:justify-center" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="400">
                              <i className="ri-double-quotes-l text-4xl sm:text-5xl md:text-6xl text-[#7cb342]"></i>
                          </div>

                            {/* Title and Subtitle */}
                          <div>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                              {title}
                            </h3>
                              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
                              {subtitle}
                            </p>
                          </div>

                            {/* Message Content */}
                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            {contentArray.length > 0 ? (
                              contentArray.map((para: string, index: number) => (
                                <p key={index} data-aos="fade-up" data-aos-duration="600" data-aos-delay={(index + 3) * 100}>
                                  {para}
                                </p>
                              ))
                            ) : (
                              <>
                                <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                                  {paragraph1}
                                </p>
                                <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                                  {paragraph2}
                                </p>
                              </>
                            )}
                            </div>
                          </div>

                          {/* Mobile: Anil Jain Image at Bottom Right */}
                          <div className="md:hidden mt-6 flex justify-end">
                            <div className="relative w-32 h-40 sm:w-40 sm:h-48">
                              <img
                                src={bgImagePath}
                                alt="Anil Jain"
                                className="w-full h-full object-cover object-center rounded-lg"
                                style={{
                                  objectPosition: 'center top'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </section>
          );
        })()}

        {/* Our Listed Companies */}
        {(() => {
          const listedCompaniesSection = pageSections['listed-companies'];
          const heading = getSectionContent(listedCompaniesSection, 'title') || getSectionContent(listedCompaniesSection, 'heading') || 'Our Listed Companies';
          const description = getSectionContent(listedCompaniesSection, 'description') || 'Stay on top of the game with the up-to-date listings of our leading companies listed on India\'s renowned BSE and NSE stock exchanges.';
          const disclaimer = getSectionContent(listedCompaniesSection, 'disclaimer') || 'The live stock price information on this website is provided by a third-party vendor, and we are not responsible for any delays or inaccuracies in the data provided. Please use this information at your own risk.';

          // Parse companies from CMS and transform to match frontend format
          const cmsCompanies = getSectionContent(listedCompaniesSection, 'companies');
          let parsedCompanies: any[] = [];
          if (Array.isArray(cmsCompanies)) {
            parsedCompanies = cmsCompanies;
          } else if (typeof cmsCompanies === 'string' && cmsCompanies) {
            try {
              parsedCompanies = JSON.parse(cmsCompanies);
            } catch (e) {
              console.error('Error parsing companies:', e);
            }
          }

          // Transform CMS companies format to frontend format
          const transformedCompanies = parsedCompanies.map((company: any) => {
            const name = company.name || '';
            const lowerName = name.toLowerCase();
            const isRefexRenewables = lowerName.includes('renewables') || lowerName.includes('refexrenew');
            const isRefexIndustries = !isRefexRenewables && (lowerName.includes('industries') || lowerName.includes('refex'));

            const exchanges: any[] = [];

            // BSE Logic
            if (company.bse || isRefexIndustries || isRefexRenewables) {
              let price = company.bse?.price || '';
              let change = company.bse?.change || '';
              let isPositive = company.bse?.trend === 'up';

              // Override with API data
              if (isRefexIndustries && stockData['REFEX.BO']) {
                const data = stockData['REFEX.BO'];
                price = `₹ ${data.current_price}`;
                change = `${data.overall_index}%`;
                isPositive = parseFloat(data.index) >= 0;
              } else if (isRefexRenewables && stockData['REFEXRENEW.BO']) {
                const data = stockData['REFEXRENEW.BO'];
                price = `₹ ${data.current_price}`;
                change = `${data.overall_index}%`;
                isPositive = parseFloat(data.index) >= 0;
              }

              if (price) {
                exchanges.push({
                  name: 'BSE',
                  price,
                  change,
                  isPositive
                });
              }
            }

            // NSE Logic
            if (company.nse || isRefexIndustries) {
              let price = company.nse?.price || '';
              let change = company.nse?.change || '';
              let isPositive = company.nse?.trend === 'up';

              // Override with API data
              if (isRefexIndustries && stockData['REFEX.NS']) {
                const data = stockData['REFEX.NS'];
                price = `₹ ${data.current_price}`;
                change = `${data.overall_index}%`;
                isPositive = parseFloat(data.index) >= 0;
              }

              if (price) {
                exchanges.push({
                  name: 'NSE',
                  price,
                  change,
                  isPositive
                });
              }
            }

            return {
              name: company.name || '',
              color: company.color || '#2b89ce',
              exchanges
            };
          });

          const fallbackCompanies = [
            {
              name: 'Refex Industries Limited', // Updated name to match check
              color: '#2b89ce',
              exchanges: [
                {
                  name: 'BSE',
                  price: stockData['REFEX.BO'] ? `₹ ${stockData['REFEX.BO'].current_price}` : '₹ 324.45',
                  change: stockData['REFEX.BO'] ? `${stockData['REFEX.BO'].overall_index}%` : '-0.23%',
                  isPositive: stockData['REFEX.BO'] ? parseFloat(stockData['REFEX.BO'].index) >= 0 : false
                },
                {
                  name: 'NSE',
                  price: stockData['REFEX.NS'] ? `₹ ${stockData['REFEX.NS'].current_price}` : '₹ 323.35',
                  change: stockData['REFEX.NS'] ? `${stockData['REFEX.NS'].overall_index}%` : '-0.51%',
                  isPositive: stockData['REFEX.NS'] ? parseFloat(stockData['REFEX.NS'].index) >= 0 : false
                }
              ]
            },
            {
              name: 'Refex Renewables & Infrastructure Ltd', // Updated name
              color: '#2b89ce',
              exchanges: [
                {
                  name: 'BSE',
                  price: stockData['REFEXRENEW.BO'] ? `₹ ${stockData['REFEXRENEW.BO'].current_price}` : '₹ 390.85',
                  change: stockData['REFEXRENEW.BO'] ? `${stockData['REFEXRENEW.BO'].overall_index}%` : '+4.99%',
                  isPositive: stockData['REFEXRENEW.BO'] ? parseFloat(stockData['REFEXRENEW.BO'].index) >= 0 : true
                }
              ]
            }
          ];
          const companiesToShow = transformedCompanies.length > 0 ? transformedCompanies : (listedCompanies.length > 0 ? listedCompanies : fallbackCompanies);

          return (
            <section className="pt-6 md:pt-8 pb-8 md:pb-10 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-8" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {heading}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
                    {description}
                  </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
                  {companiesToShow.map((company: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-lg p-6"
                      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                      data-aos-duration="800"
                      data-aos-delay={(index + 1) * 100}
                      data-aos-easing="ease-out-cubic"
                    >
                      <h3 className="text-xl md:text-2xl font-bold" style={{ color: company.color || '#2b89ce' }}>
                        {company.name}
                      </h3>
                      <div className="space-y-3">
                        {company.exchanges && company.exchanges.map((exchange: any, exIndex: number) => (
                          <div key={exIndex} className="flex items-center gap-2" data-aos="fade-up" data-aos-duration="600" data-aos-delay={(exIndex + 3) * 100}>
                            <span className="text-gray-700">{exchange.name}</span>
                            {exchange.isPositive ? (
                              <i className="ri-arrow-up-line text-green-600 text-lg"></i>
                            ) : (
                              <img
                                src={DownIcon}
                                alt="Down"
                                className="w-4 h-4"
                              />
                            )}
                            <span className={`font-semibold ${exchange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {exchange.price}
                            </span>
                            <span className={exchange.isPositive ? 'text-green-600' : 'text-red-600'}>
                              ({exchange.change})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div
                  className="max-w-5xl mx-auto text-sm text-gray-600"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="500"
                  data-aos-easing="ease-out-cubic"
                >
                  <p className="text-left">
                    <strong className="text-gray-900">Disclaimer:</strong> {disclaimer}
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Contact Info */}
        {(() => {
          const contactInfoSection = pageSections['contact-info'];
          const text = getSectionContent(contactInfoSection, 'text') || 'For any other information related to investing, get in touch with us at';
          const email = getSectionContent(contactInfoSection, 'email') || 'info@refex.co.in';

          return (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-easing="ease-out-cubic"
                >
                  <p className="text-base text-gray-700">
                    {text}{' '}
                    <a
                      href={`mailto:${email}`}
                      onClick={() => trackLinkClick(`Email: ${email}`, `mailto:${email}`, 'external')}
                      className="text-gray-900 hover:text-gray-700 font-semibold underline"
                      data-ga-track="link"
                      data-ga-label={`Email: ${email}`}
                    >
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        {/* CTA Section */}
        {(() => {
          const ctaSection = pageSections.cta;
          const bgColor = getSectionContent(ctaSection, 'backgroundColor') || '#3b9dd6';

          // Parse cards array from CMS
          const cardsData = getSectionContent(ctaSection, 'cards');
          let cardsArray: any[] = [];
          if (Array.isArray(cardsData)) {
            cardsArray = cardsData;
          } else if (typeof cardsData === 'string' && cardsData) {
            try {
              cardsArray = JSON.parse(cardsData);
            } catch (e) {
              console.error('Error parsing CTA cards:', e);
            }
          }

          // Fallback to individual card fields if cards array not available
          if (cardsArray.length === 0) {
            cardsArray = [
              {
                title: getSectionContent(ctaSection, 'card1Title') || 'Got a question?',
                buttonText: getSectionContent(ctaSection, 'card1ButtonText') || 'Get in touch',
                buttonLink: getSectionContent(ctaSection, 'card1ButtonLink') || '/contact'
              },
              {
                title: getSectionContent(ctaSection, 'card2Title') || 'See our latest news',
                buttonText: getSectionContent(ctaSection, 'card2ButtonText') || 'Refex Newsroom',
                buttonLink: getSectionContent(ctaSection, 'card2ButtonLink') || '/newsroom'
              },
              {
                title: getSectionContent(ctaSection, 'card3Title') || 'Work at Refex',
                buttonText: getSectionContent(ctaSection, 'card3ButtonText') || 'Careers',
                buttonLink: getSectionContent(ctaSection, 'card3ButtonLink') || '/careers'
              }
            ].filter(card => card.title); // Remove empty cards
          }

          return (
            <section className="py-[27px] md:py-[34px] bg-green-50">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]" style={{ backgroundColor: bgColor }}>
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {cardsArray.map((card: any, index: number) => (
                      <div key={index} className="text-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay={(index + 1) * 100} data-aos-easing="ease-out-cubic">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-[13.6px]">{card.title}</h3>
                        <a
                          href={card.buttonLink || '#'}
                          onClick={() => trackButtonClick(card.buttonText, 'investments-page-cta', card.buttonLink)}
                          className="inline-block border-2 border-white bg-transparent text-white px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-nowrap cursor-pointer text-sm md:text-base"
                          data-ga-track="button"
                          data-ga-label={card.buttonText}
                          data-ga-location="investments-page-cta"
                        >
                          {card.buttonText}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
      </div>

      <style>{`
        [data-aos] {
          transition-property: opacity, transform;
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity, transform;
        }
        
        [data-aos].aos-animate {
          opacity: 1 !important;
          transform: translate(0, 0) scale(1) rotate(0deg) !important;
        }
        
        [data-aos="fade-up"] {
          opacity: 0;
          transform: translateY(50px);
        }
        
        [data-aos="fade-down"] {
          opacity: 0;
          transform: translateY(-50px);
        }
        
        [data-aos="fade-left"] {
          opacity: 0;
          transform: translateX(50px);
        }
        
        [data-aos="fade-right"] {
          opacity: 0;
          transform: translateX(-50px);
        }
        
        [data-aos="fade-in"] {
          opacity: 0;
        }
        
        [data-aos="zoom-in"] {
          opacity: 0;
          transform: scale(0.8);
        }
        
        [data-aos="zoom-out"] {
          opacity: 0;
          transform: scale(1.2);
        }
        
        [data-aos="flip-left"] {
          opacity: 0;
          transform: perspective(1000px) rotateY(-20deg);
        }
        
        [data-aos="flip-right"] {
          opacity: 0;
          transform: perspective(1000px) rotateY(20deg);
        }
        
        [data-aos-easing="ease-out-cubic"] {
          transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }
      `}</style>
      <Footer />
    </MainLayout>
  );
}
