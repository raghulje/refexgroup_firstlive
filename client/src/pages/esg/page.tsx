import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import UnsSdgsSection from './components/UnsSdgsSection';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService, sdgCardsService } from '../../services/apiService';
import PrincipledExcellenceIcon from '../svg/about/principledexcellence.svg';
import AuthenticityIcon from '../svg/about/Authenticity.svg';
import CustomerValueIcon from '../svg/about/CustomerValue.svg';
import EsteemCultureIcon from '../svg/about/EsteemCulture.svg';
import DownloadFileIcon from '../svg/esg/downloadfile.svg';
import SustainabilityReportIcon from '../svg/esg/sustainabilityreport.svg';
import ESGBanner from '../../wp-content/uploads/2023/02/ESG-Banner.jpg';
import ESGIntro from '../../wp-content/uploads/2023/02/ESG-Images-REFEX-9.jpg';
import RefexLogo from '../../wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png';
import SDGHero from '../../wp-content/uploads/2023/02/SDG-Image-Hero-Large1.jpeg';
import CoreValuesPattern from '../../wp-content/uploads/2023/02/About_CoreValues_Dot-Pattern.png';
import { getApiBaseUrl } from '../../config/env';

const ESG_POLICY_DISPLAY_CONFIGS = [
  { systemKey: 'quality', group: 'primary' },
  { systemKey: 'ehs', group: 'primary' },
  { systemKey: 'sustainability', group: 'primary' },
  { systemKey: 'grievance', group: 'other' },
  { systemKey: 'abac', group: 'other' },
  { systemKey: 'vendor-code', group: 'other' },
] as const;



const ESGPage = () => {
  const [pageSections, setPageSections] = useState<any>({});
  const [threePillars, setThreePillars] = useState<any[]>([]);
  const [tabsData, setTabsData] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [sdgCards, setSdgCards] = useState<any[]>([]);
  const [coreValues, setCoreValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedReports, setResolvedReports] = useState<any[]>([]);

  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string => {
    if (!imageData) return '';

    // Handle number (media ID) - construct /uploads/media/{id} path
    if (typeof imageData === 'number' && imageData > 0) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}/uploads/media/${imageData}`;
    }

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
    const fetchESGData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('esg');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Three Pillars
          const pillarsSection = sections.find((s: any) => s.sectionKey === 'three-pillars');
          if (pillarsSection?.content) {
            const pillarsContent = pillarsSection.content.find((c: any) => c.contentKey === 'pillars');
            if (pillarsContent && pillarsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(pillarsContent.contentValue);
                const pillarsArray = Array.isArray(parsed) ? parsed : [];
                
                // Process images to resolve media IDs to actual filePaths (if needed)
                const { mediaService } = await import('../../services/apiService');
                const processedPillars = await Promise.all(pillarsArray.map(async (pillar: any) => {
                  if (pillar.image) {
                    // If image is already a direct path (starts with /uploads/images/), use it as-is
                    if (typeof pillar.image === 'string' && pillar.image.startsWith('/uploads/images/')) {
                      return pillar; // Already a direct path, no need to fetch
                    }
                    // If image is a number (media ID), fetch the actual filePath
                    if (typeof pillar.image === 'number' && pillar.image > 0) {
                      try {
                        const media = await mediaService.getById(pillar.image);
                        if (media?.filePath) {
                          return { ...pillar, image: media.filePath };
                        }
                      } catch (error) {
                        console.warn(`Could not fetch media filePath for ID ${pillar.image}:`, error);
                      }
                    }
                    // If image is /uploads/media/{id}, extract ID and fetch filePath
                    else if (typeof pillar.image === 'string' && pillar.image.startsWith('/uploads/media/')) {
                      const mediaIdMatch = pillar.image.match(/\/uploads\/media\/(\d+)/);
                      if (mediaIdMatch) {
                        try {
                          const mediaId = parseInt(mediaIdMatch[1]);
                          const media = await mediaService.getById(mediaId);
                          if (media?.filePath) {
                            return { ...pillar, image: media.filePath };
                          }
                        } catch (error) {
                          console.warn(`Could not fetch media filePath for ${pillar.image}:`, error);
                        }
                      }
                    }
                  }
                  return pillar;
                }));
                
                setThreePillars(processedPillars);
              } catch (e) {
                console.error('Error parsing pillars:', e);
              }
            }
          }

          // Parse Tabs
          const tabsSection = sections.find((s: any) => s.sectionKey === 'tabs');
          if (tabsSection?.content) {
            const tabsContent = tabsSection.content.find((c: any) => c.contentKey === 'tabs');
            if (tabsContent && tabsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(tabsContent.contentValue);
                setTabsData(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing tabs:', e);
              }
            }
          }

          // Parse Policies
          const policiesSection = sections.find((s: any) => s.sectionKey === 'policies');
          if (policiesSection?.content) {
            // Helper function to resolve file path from content value
            const resolveFilePath = (contentItem: any): string | null => {
              if (!contentItem) return null;

              // Prioritize contentValue over media.filePath (contentValue is more direct)
              // Only use media.filePath if contentValue is empty AND mediaId exists
              const value = contentItem.contentValue || '';
              const hasMediaId = contentItem.mediaId && contentItem.mediaId !== null;

              // If contentValue exists and is a valid path, use it first (even if media exists)
              if (value && typeof value === 'string' && value.trim()) {
              // If it's already a full URL, return it
                if (value.startsWith('http://') || value.startsWith('https://')) {
                return value;
              }
              // If it's a file path starting with /uploads/, resolve it with API base URL
                if (value.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                return `${apiBase}${value}`;
                }
                // If it's a number (mediaId), we'll handle it below
                if (!/^\d+$/.test(value)) {
                  return value; // Return non-numeric strings as-is
                }
              }

              // Fallback: check if there's a media relationship with filePath
              // Only use media if contentValue is empty/null AND mediaId exists
              if (hasMediaId && contentItem.media?.filePath) {
                const filePath = contentItem.media.filePath;
                if (filePath.startsWith('/uploads/')) {
                  const apiBase = getApiBaseUrl();
                  return `${apiBase}${filePath}`;
                }
                return filePath;
              }

              // If contentValue is a number or numeric string (mediaId), we need to resolve it asynchronously
              if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
                // This will be handled in the async resolution below
                return null; // Return null to indicate we need async resolution
              }

              return null;
            };

            // Async function to resolve mediaId to filePath
            const resolveMediaId = async (mediaId: number | string): Promise<string | null> => {
              try {
                const { mediaService } = await import('../../services/apiService');
                const media = await mediaService.getById(typeof mediaId === 'string' ? parseInt(mediaId) : mediaId);
                if (media?.filePath) {
                  const apiBase = getApiBaseUrl();
                  if (media.filePath.startsWith('/uploads/')) {
                    return `${apiBase}${media.filePath}`;
                  }
                  return media.filePath;
                } else if (media?.url) {
                  return media.url;
                }
              } catch (error) {
                console.error(`Error resolving mediaId ${mediaId}:`, error);
              }
              return null;
            };

            // Get policy content with async mediaId resolution
            const getPolicyContent = async (key: string): Promise<string | null> => {
              const contentItem = policiesSection.content.find((c: any) => c.contentKey === key);
              if (!contentItem) return null;

              // Try synchronous resolution first
              const syncResult = resolveFilePath(contentItem);
              if (syncResult !== null) {
                return syncResult;
              }

              // If sync returned null, check if we need to resolve mediaId
              const value = contentItem.contentValue || '';
              const mediaId = contentItem.mediaId || (typeof value === 'number' ? value : (typeof value === 'string' && /^\d+$/.test(value) ? parseInt(value) : null));

              if (mediaId !== null && !isNaN(mediaId)) {
                return await resolveMediaId(mediaId);
              }

              return null;
            };

            const policiesContent = policiesSection.content.find((c: any) => c.contentKey === 'policies');
            if (policiesContent && policiesContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(policiesContent.contentValue);
                if (Array.isArray(parsed)) {
                  const normalizedPolicies = parsed
                    .map((policy: any, index: number) => ({
                      ...policy,
                      id: policy.id || (policy.systemKey ? `policy-system-${policy.systemKey}` : `policy-${index}`),
                      title: policy.title || policy.label || `Policy ${index + 1}`,
                      label: policy.label || policy.title || `Policy ${index + 1}`,
                      order: policy.order || index + 1,
                      isActive: policy.isActive !== false,
                    }))
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

                  const activePolicies = normalizedPolicies.filter((policy: any) => policy.isActive !== false);

                  const resolvedPolicies = await Promise.all(activePolicies.map(async (policy: any) => {
                    let link = policy.link || policy.url || '';

                    if ((!link || link === '') && policy.mediaId) {
                      link = (await resolveMediaId(policy.mediaId)) || '';
                    } else if (typeof link === 'number' || (typeof link === 'string' && /^\d+$/.test(link))) {
                      link = (await resolveMediaId(link)) || link;
                    } else if (typeof link === 'string' && link.startsWith('/uploads/')) {
                      const apiBase = getApiBaseUrl();
                      link = `${apiBase}${link}`;
                    }

                    return {
                      ...policy,
                      link
                    };
                  }));

                  const systemPolicyMap = new Map(
                    resolvedPolicies
                      .filter((policy: any) => policy.systemKey)
                      .map((policy: any) => [policy.systemKey, policy])
                  );

                  const managedPolicies: any[] = [];

                  ESG_POLICY_DISPLAY_CONFIGS
                    .filter((config) => config.group === 'primary')
                    .forEach((config) => {
                      const policy = systemPolicyMap.get(config.systemKey);
                      if (policy?.link) {
                        managedPolicies.push({
                          title: policy.title,
                          link: policy.link,
                          label: policy.label || policy.title
                        });
                      }
                    });

                  const otherPoliciesHeading = await getPolicyContent('otherPoliciesHeading') || 'Other Policies';
                  const otherPolicies = ESG_POLICY_DISPLAY_CONFIGS
                    .filter((config) => config.group === 'other')
                    .map((config) => systemPolicyMap.get(config.systemKey))
                    .filter((policy: any) => policy?.link)
                    .map((policy: any) => ({
                      link: policy.link,
                      label: policy.label || policy.title
                    }));

                  if (otherPolicies.length > 0) {
                    managedPolicies.push({
                      title: otherPoliciesHeading,
                      policies: otherPolicies
                    });
                  }

                  const customPolicies = resolvedPolicies
                    .filter((policy: any) => !policy.systemKey && policy.link)
                    .map((policy: any) => ({
                      title: policy.title,
                      link: policy.link,
                      label: policy.label || policy.title
                    }));

                  setPolicies([...managedPolicies, ...customPolicies]);
                  return;
                }
              } catch (e) {
                console.error('Error parsing managed policies:', e);
              }
            }

            // Fallback to legacy section-content fields when the managed JSON list doesn't exist yet.
            const fixedPolicies: any[] = [];

            const qualityTitle = await getPolicyContent('qualityPolicyTitle');
            const qualityUrl = await getPolicyContent('qualityPolicyUrl');
            if (qualityTitle && qualityUrl) {
              fixedPolicies.push({
                title: qualityTitle,
                link: qualityUrl,
                label: qualityTitle
              });
            }

            const ehsTitle = await getPolicyContent('ehsPolicyTitle');
            const ehsUrl = await getPolicyContent('ehsPolicyUrl');
            if (ehsTitle && ehsUrl) {
              fixedPolicies.push({
                title: ehsTitle,
                link: ehsUrl,
                label: ehsTitle
              });
            }

            const sustainabilityTitle = await getPolicyContent('sustainabilityPolicyTitle');
            const sustainabilityUrl = await getPolicyContent('sustainabilityPolicyUrl');
            if (sustainabilityTitle && sustainabilityUrl) {
              fixedPolicies.push({
                title: sustainabilityTitle,
                link: sustainabilityUrl,
                label: sustainabilityTitle
              });
            }

            const otherPoliciesHeading = await getPolicyContent('otherPoliciesHeading') || 'Other Policies';
            const otherPolicies: any[] = [];

            const grievanceTitle = await getPolicyContent('grievancePolicyTitle');
            const grievanceUrl = await getPolicyContent('grievancePolicyUrl');
            if (grievanceTitle && grievanceUrl) {
              otherPolicies.push({
                link: grievanceUrl,
                label: grievanceTitle
              });
            }

            const abacTitle = await getPolicyContent('abacPolicyTitle');
            const abacUrl = await getPolicyContent('abacPolicyUrl');
            if (abacTitle && abacUrl) {
              otherPolicies.push({
                link: abacUrl,
                label: abacTitle
              });
            }

            const vendorCodeTitle = await getPolicyContent('vendorCodeTitle');
            const vendorCodeUrl = await getPolicyContent('vendorCodeUrl');
            if (vendorCodeTitle && vendorCodeUrl) {
              otherPolicies.push({
                link: vendorCodeUrl,
                label: vendorCodeTitle
              });
            }

            if (otherPolicies.length > 0) {
              fixedPolicies.push({
                title: otherPoliciesHeading,
                policies: otherPolicies
              });
            }

            setPolicies(fixedPolicies);
          }

          // Parse Core Values from Governance Section
          const governanceSection = sections.find((s: any) => s.sectionKey === 'governance');
          if (governanceSection?.content) {
            const coreValuesContent = governanceSection.content.find((c: any) => c.contentKey === 'coreValues');
            if (coreValuesContent && coreValuesContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(coreValuesContent.contentValue);
                setCoreValues(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing core values:', e);
              }
            }
          }
        }

        // Fetch SDG Cards
        try {
          const cards = await sdgCardsService.getAll();
          if (Array.isArray(cards)) {
            setSdgCards(cards.filter((card: any) => card.isActive !== false).sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0)));
          } else if (cards && typeof cards === 'object') {
            const dataArray = (cards as any).data || (cards as any).cards || [];
            setSdgCards(Array.isArray(dataArray) ? dataArray.filter((card: any) => card.isActive !== false).sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0)) : []);
          }
        } catch (error) {
          console.error('Error fetching SDG cards:', error);
        }
      } catch (error) {
        console.error('Error fetching ESG data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchESGData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="bg-white ">
        {/* Hero Section */}
        {(() => {
          const heroSection = pageSections.hero;
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : ESGBanner);
          const title = getSectionContent(heroSection, 'title') || 'ESG';
          const description = getSectionContent(heroSection, 'description') || 'At Refex, we\'re constantly changing from the inside to change the world outside. Learn how our business strives to make a difference.';

          return (
            <section
              className="relative text-white py-8 md:py-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImagePath})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl relative z-10 pt-20">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div data-aos="fade-right" data-aos-duration="1000" data-aos-easing="ease-out-cubic">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
                  </div>
                  <div data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                    <p className="text-sm md:text-base">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Intro Section with Image and Logo */}
        {(() => {
          const introSection = pageSections.intro;
          const introImage = getSectionContent(introSection, 'image');
          const introImagePath = introImage?.path || (introImage ? getImagePath(introImage) : ESGIntro);
          const logo = getSectionContent(introSection, 'logo');
          const logoPath = logo?.path || (logo ? getImagePath(logo) : RefexLogo);
          const paragraph1 = getSectionContent(introSection, 'paragraph1') || 'At Refex Group, we believe in creating a better world through sustainable business practices. We prioritize People, Planet, and Profit equally and are committed to becoming an ESG champion and carbon-neutral company.';
          const paragraph2 = getSectionContent(introSection, 'paragraph2') || 'By aligning with the United Nations Sustainable Development Goals, we are taking action towards a brighter future. We invite you to join hands with Refex Group in our efforts towards sustainability and make a positive impact on the world!';

          return (
            <section className="py-8 md:py-10">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div data-aos="fade-right" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                    <img
                      src={introImagePath}
                      alt="ESG"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                    <div>
                      <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="300">
                        <img
                          src={logoPath || undefined}
                          alt="Refex"
                          className="h-12 md:h-14 mb-4"
                        />
                      </div>
                      <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-3" data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                        <strong>{paragraph1}</strong>
                      </p>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500">
                        {paragraph2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Championing for Change Section */}
        {(() => {
          const championingSection = pageSections['championing-change'];
          const title = getSectionContent(championingSection, 'title') || 'Championing for Change';
          const description = getSectionContent(championingSection, 'description') || 'We take our responsibility to the planet and society seriously, and we strive to be a force for good in everything we do. Our commitment to making a positive impact is reflected in our approach to corporate social responsibility, and we work tirelessly to create a better future for generations to come. Join us in our mission to make a meaningful difference in the world.';
          const backgroundColor = getSectionContent(championingSection, 'backgroundColor') || '#7DC144';
          const backgroundPattern = getSectionContent(championingSection, 'backgroundPattern');
          const patternPath = backgroundPattern?.path || (backgroundPattern ? getImagePath(backgroundPattern) : '/assets/esg/dot-pattern.png');

          return (
            <section className="py-8 md:py-10">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div data-aos="fade-up" data-aos-duration="900" data-aos-easing="ease-out-cubic">
                  <div className="relative w-full px-6 py-6 md:px-8 md:py-8 rounded-xl overflow-hidden" style={{ backgroundColor }}>
                    {/* Background Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-100 pointer-events-none"
                      style={{
                        backgroundImage: `url(${patternPath})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'repeat',
                        mixBlendMode: 'normal'
                      }}
                    ></div>
                    <div className="relative z-10 max-w-2xl text-white">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                        {title}
                      </h2>
                      <p className="text-sm md:text-base leading-relaxed text-white">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ESG Pillars Section - Three Cards */}
        {threePillars.length > 0 && (
          <section className="py-8 md:py-10 bg-white">
            <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
              <div className="grid md:grid-cols-3 gap-6">
                {threePillars.map((pillar: any, index: number) => {
                  // Resolve image path from CMS
                  let imagePath = '';
                  if (pillar.image) {
                    // Use getImagePath to handle all cases: string paths, media IDs, objects
                      imagePath = getImagePath(pillar.image);
                  }
                  
                  const hoverColor = pillar.hoverColor || '#7cb342';

                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={(index + 1) * 100}
                      data-aos-easing="ease-out-cubic"
                    >
                      <div className="relative h-64 overflow-hidden rounded-t-lg">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={pillar.title || 'ESG Pillar'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-400">No image available</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6 group-hover:bg-gradient-to-br group-hover:from-[#f0f9f4] group-hover:to-white transition-all duration-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#7cb342] transition-colors duration-300" style={{ '--hover-color': hoverColor } as any}>
                          {pillar.title || 'ESG Pillar'}
                        </h3>
                        <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                          {pillar.description || ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ESG Policies Section */}
        {(() => {
          const policiesSection = pageSections.policies;
          const sectionTitle = getSectionContent(policiesSection, 'heading') || getSectionContent(policiesSection, 'title') || 'ESG Policies';
          const fallbackPolicies = [
            { title: 'Quality Policy', link: 'https://www.refex.group/wp-content/uploads/2023/03/Quality-Policy.pdf', label: 'Quality Policy' },
            { title: 'EHS Policy', link: 'https://www.refex.group/wp-content/uploads/2023/03/EHS-Policy.pdf', label: 'EHS Policy' },
            { title: 'Sustainability Policy', link: 'https://www.refex.group/wp-content/uploads/2023/03/Sustainability-ESG-Policy.pdf', label: 'Sustainability Policy' },
            {
              title: 'Other Policies', policies: [
                { link: 'https://www.refex.group/wp-content/uploads/2023/02/Grievance-Policy.pdf', label: 'Grievance Policy' },
                { link: 'https://www.refex.group/wp-content/uploads/2025/06/Anti-Bribery-Anti-Corruption-ABAC-Policy.pdf', label: 'Signed ABAC Policy' },
                { link: 'https://www.refex.group/wp-content/uploads/2025/06/Vendor-Code-of-Conduct.pdf', label: 'Signed Supplier Vendor Code of Conduct' }
              ]
            }
          ];
          const policiesToShow = policies.length > 0 ? policies : fallbackPolicies;

          return (
            <section className="py-8 md:py-10 bg-white">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">{sectionTitle}</h2>
                </div>

                <div className="space-y-5">
                  {policiesToShow.map((policy: any, index: number) => (
                    <div key={index} data-aos="fade-right" data-aos-duration="700" data-aos-delay={(index + 1) * 100} data-aos-easing="ease-out-cubic">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{policy.title || 'Policy'}</h3>
                        {policy.policies ? (
                          <div className="space-y-2">
                            {policy.policies.map((subPolicy: any, subIndex: number) => (
                              <a
                                key={subIndex}
                                href={(() => {
                                  if (!subPolicy.link || subPolicy.link === '#') return '#';
                                  // If already a full URL, use as-is
                                  if (subPolicy.link.startsWith('http://') || subPolicy.link.startsWith('https://')) {
                                    return subPolicy.link;
                                  }
                                  // If it's a relative path starting with /uploads/, prepend API base
                                  if (subPolicy.link.startsWith('/uploads/')) {
                                    const apiBase = getApiBaseUrl();
                                    return `${apiBase}${subPolicy.link}`;
                                  }
                                  // Otherwise return as-is (might be a relative path or external URL)
                                  return subPolicy.link;
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  // Prevent navigation if link is invalid
                                  if (!subPolicy.link || subPolicy.link === '#' || (!subPolicy.link.startsWith('http://') && !subPolicy.link.startsWith('https://') && !subPolicy.link.startsWith('/'))) {
                                    e.preventDefault();
                                    console.warn('PDF link is missing or invalid:', subPolicy);
                                    alert('PDF link is not available. Please contact the administrator.');
                                  }
                                }}
                                className="text-gray-700 hover:text-[#50B848] flex items-center gap-3 group cursor-pointer"
                              >
                                <img src={DownloadFileIcon} alt="" className="w-5 h-5" />
                                <span>{subPolicy.label || subPolicy.title}</span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <a
                            href={(() => {
                              if (!policy.link || policy.link === '#') return '#';
                              // If already a full URL, use as-is
                              if (policy.link.startsWith('http://') || policy.link.startsWith('https://')) {
                                return policy.link;
                              }
                              // If it's a relative path starting with /uploads/, prepend API base
                              if (policy.link.startsWith('/uploads/')) {
                                const apiBase = getApiBaseUrl();
                                return `${apiBase}${policy.link}`;
                              }
                              // Otherwise return as-is (might be a relative path or external URL)
                              return policy.link;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              // Prevent navigation if link is invalid
                              if (!policy.link || policy.link === '#' || (!policy.link.startsWith('http://') && !policy.link.startsWith('https://') && !policy.link.startsWith('/'))) {
                                e.preventDefault();
                                console.warn('PDF link is missing or invalid:', policy);
                                alert('PDF link is not available. Please contact the administrator.');
                              }
                            }}
                            className="text-gray-700 hover:text-[#50B848] flex items-center gap-3 group cursor-pointer"
                          >
                            <img src={DownloadFileIcon} alt="" className="w-5 h-5" />
                            <span>{policy.label || policy.title}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Tabbed Content Section */}
        <ESGTabs tabsData={tabsData} />

        {/* Sustainability Report Section */}
        {(() => {
          const sustainabilitySection = pageSections['sustainability-report'];
          const bgImage = getSectionContent(sustainabilitySection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (bgImage ? getImagePath(bgImage) : ESGBanner);
          const bgColor = getSectionContent(sustainabilitySection, 'backgroundColor') || getSectionContent(sustainabilitySection, 'overlayColor') || '#2d5234';

          // Get background position
          const bgPositionX = getSectionContent(sustainabilitySection, 'backgroundPositionX') || getSectionContent(sustainabilitySection, 'backgroundImagePositionX') || '50';
          const bgPositionY = getSectionContent(sustainabilitySection, 'backgroundPositionY') || getSectionContent(sustainabilitySection, 'backgroundImagePositionY') || '50';

          // Parse reports array from CMS
          let reportsArray: any[] = [];
          const reportsData = getSectionContent(sustainabilitySection, 'reports');
          if (Array.isArray(reportsData)) {
            reportsArray = reportsData;
          } else if (typeof reportsData === 'string' && reportsData) {
            try {
              reportsArray = JSON.parse(reportsData);
            } catch (e) {
              console.error('Error parsing reports:', e);
            }
          }

          // Fallback to individual report fields if reports array not available
          if (reportsArray.length === 0) {
            // Try new field names first
            const report1Title = getSectionContent(sustainabilitySection, 'sustainabilityReportTitle');
            const report2Title = getSectionContent(sustainabilitySection, 'dashboardTitle');

            if (report1Title) {
              reportsArray.push({
                title: report1Title,
                buttonText: getSectionContent(sustainabilitySection, 'sustainabilityReportButtonText') || 'View Report',
                link: getSectionContent(sustainabilitySection, 'sustainabilityReportUrl') || ''
              });
            }
            if (report2Title) {
              reportsArray.push({
                title: report2Title,
                buttonText: getSectionContent(sustainabilitySection, 'dashboardButtonText') || 'View Dashboard',
                link: getSectionContent(sustainabilitySection, 'dashboardUrl') || ''
              });
            }

            // Fallback to old field names
            if (reportsArray.length === 0) {
              const report1TitleOld = getSectionContent(sustainabilitySection, 'report1Title');
              const report2TitleOld = getSectionContent(sustainabilitySection, 'report2Title');

              if (report1TitleOld) {
                reportsArray.push({
                  title: report1TitleOld,
                  buttonText: getSectionContent(sustainabilitySection, 'report1Text') || 'View Report',
                  link: getSectionContent(sustainabilitySection, 'report1Link') || ''
                });
              }
              if (report2TitleOld) {
                reportsArray.push({
                  title: report2TitleOld,
                  buttonText: getSectionContent(sustainabilitySection, 'report2Text') || 'View Dashboard',
                  link: getSectionContent(sustainabilitySection, 'report2Link') || ''
                });
              }
            }
          }

          // Default reports if none found
          if (reportsArray.length === 0) {
            reportsArray = [
              { title: 'Sustainability Report', buttonText: 'Refex Sustainability Report 2024-25', link: '/assets/esg/Sustainability-Report-Digital.pdf' },
              { title: 'ESG Performance Dashboard', buttonText: 'ESG Performance Dashboard', link: 'https://www.refex.group/wp-content/uploads/2025/01/ESG-Performance-Dashboard.pdf' }
            ];
          }

          // Resolve report links (handle mediaId) - use state and effect
          useEffect(() => {
            const resolveReports = async () => {
              if (reportsArray.length === 0) {
                setResolvedReports([]);
                return;
              }

              const resolved = await Promise.all(reportsArray.map(async (report: any) => {
                let link = report.link || '';

                // If no link but has mediaId, resolve it
                if (!link && report.mediaId) {
                  try {
                    const { mediaService } = await import('../../services/apiService');
                    const media = await mediaService.getById(report.mediaId);
                    if (media?.filePath) {
                      const apiBase = getApiBaseUrl();
                      if (media.filePath.startsWith('/uploads/')) {
                        link = `${apiBase}${media.filePath}`;
                      } else {
                        link = media.filePath;
                      }
                    } else if (media?.url) {
                      link = media.url;
                    }
                  } catch (error) {
                    console.error(`Error resolving mediaId ${report.mediaId}:`, error);
                  }
                }

                // If link is a file path, resolve it with API base URL
                if (link && typeof link === 'string') {
                  // If it's a relative path starting with /uploads/, prepend API base
                  if (link.startsWith('/uploads/')) {
                    const apiBase = getApiBaseUrl();
                    link = `${apiBase}${link}`;
                  }
                  // Ensure link is a valid URL (not empty or just '#')
                  if (!link || link === '#' || (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('/'))) {
                    console.warn(`Invalid PDF link for report "${report.title}":`, link);
                    link = '#'; // Fallback to prevent broken links
                  }
                }

                return {
                  ...report,
                  link: link || '#'
                };
              }));
              setResolvedReports(resolved);
            };

            resolveReports();
          }, [JSON.stringify(reportsArray)]);

          return (
            <section
              className="relative py-8 md:py-10 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${bgImagePath})`,
                backgroundPosition: `${bgPositionX}% ${bgPositionY}%`
              }}
            >
              <div className="absolute inset-0 opacity-80" style={{ backgroundColor: bgColor }}></div>
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl relative z-10">
                <div className={`grid gap-6 md:gap-8 ${resolvedReports.length === 1 ? 'md:grid-cols-1' : resolvedReports.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                  {resolvedReports.map((report: any, index: number) => (
                    <div key={index} className="text-center" data-aos="fade-up" data-aos-duration="800" data-aos-delay={(index + 1) * 100} data-aos-easing="ease-out-cubic">
                      <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">{report.title}</h2>
                      <a
                        href={report.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          // Prevent navigation if link is invalid
                          if (!report.link || report.link === '#' || (!report.link.startsWith('http://') && !report.link.startsWith('https://') && !report.link.startsWith('/'))) {
                            e.preventDefault();
                            console.warn('PDF link is missing or invalid:', report);
                            alert('PDF link is not available. Please contact the administrator.');
                          }
                        }}
                        className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 md:px-6 py-2.5 rounded-full font-semibold hover:bg-[#4CAF50] hover:text-white hover:border-2 hover:border-[#66BB6A] transition-all duration-300 cursor-pointer shadow-md text-xs md:text-sm lg:text-base"
                      >
                        <img src={SustainabilityReportIcon} alt="" className="w-5 h-5" />
                        {report.buttonText}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* SDG Section */}
        {(() => {
          const sdgSection = pageSections.sdg;
          const title = getSectionContent(sdgSection, 'title') || 'Sustainable Development Goals';
          const paragraph1 = getSectionContent(sdgSection, 'paragraph1') || 'We\'re all about making the world a better place! We\'re committed to working with India and the UN to achieve United Nations Sustainable Development Goals, because we know that together we can make a big difference. We\'re not just focused on making our shareholders happy – we\'re all about creating value for everyone involved, including the planet!';
          const paragraph2 = getSectionContent(sdgSection, 'paragraph2') || 'We\'re so proud to be a member of UNGC and to be working with partners around the world to make the world a better place. We\'re all about ethical business practices and doing our part to solve some of the biggest challenges of our time. Let\'s make the world a better place, together!';
          const bgColor = getSectionContent(sdgSection, 'backgroundColor') || '#7cb342';
          const image = getSectionContent(sdgSection, 'image');
          const imagePath = image?.path || (image ? getImagePath(image) : SDGHero);

          return (
            <section className="py-8 md:py-10 bg-white">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                  <div className="text-white p-8 md:p-6 rounded-lg flex flex-col justify-center" style={{ backgroundColor: bgColor }} data-aos="fade-right" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-sm md:text-base leading-relaxed mb-3" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
                      {paragraph1}
                    </p>
                    <p className="text-sm md:text-base leading-relaxed" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                      {paragraph2}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg flex items-center justify-center" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100" data-aos-easing="ease-out-cubic">
                    <img
                      src={imagePath}
                      alt="UN Sustainable Development Goals"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* UN SDGs and Actions */}
        <UnsSdgsSection sdgCards={sdgCards} />

        {/* Governance Section */}
        {(() => {
          const governanceSection = pageSections.governance;
          const title = getSectionContent(governanceSection, 'title') || 'Governance';
          const description = getSectionContent(governanceSection, 'description') || 'Our corporate governance culture is rock solid, with strong risk resilience and a value creation model that can\'t be beat. We\'re all about inclusivity, with policies and procedures that are comprehensive and robust, and we\'ve got a monitoring and grievance mechanism that really works. Join us in our mission to make the world a better place!';
          const quote = getSectionContent(governanceSection, 'quote') || '"The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share."';
          const quoteAuthor = getSectionContent(governanceSection, 'quoteAuthor') || '– Lady Bird Johnson.';
          // Get Mission and Vision - check for new field names first, then fallback to old
          const missionTitle = getSectionContent(governanceSection, 'missionTitle') || 'Our Mission';
          const missionDescription = getSectionContent(governanceSection, 'missionDescription') || getSectionContent(governanceSection, 'mission') || 'We will strive to attain our goals by exceeding the needs & expectations of our customers with continuous improvements in quality, productivity, value creation, new product & service offerings and customer satisfaction. Refex Group is dedicated to offering highest quality products & services to our customers while achieving acceptable returns on investments.';
          const visionTitle = getSectionContent(governanceSection, 'visionTitle') || 'Our Vision';
          const visionDescription = getSectionContent(governanceSection, 'visionDescription') || getSectionContent(governanceSection, 'vision') || 'To be the most preferred company; committed to seeking growth and prosperity by achieving a sustainable competitive share – globally; using innovative solutions, technology and a team of good people. It is our intent to develop quality partnerships with our shareholders, employees, suppliers, partners, customers and the community in which we operate.';
          const quoteBgColor = getSectionContent(governanceSection, 'quoteBgColor') || '#7cb342';

          // Get Core Values from CMS
          const coreValuesHeading = getSectionContent(governanceSection, 'coreValuesHeading') || 'Our Core Values';
          const coreValuesSubtitle = getSectionContent(governanceSection, 'coreValuesSubtitle') || 'Refex\'s core values have always been the foundation of our guiding principles.';

          // Get pattern image and positioning from CMS
          const patternImage = getSectionContent(governanceSection, 'patternImage');
          const patternImagePath = patternImage?.path || (patternImage ? getImagePath(patternImage) : CoreValuesPattern);
          // Default to Left (0%) Center (50%) as requested
          const patternPositionX = getSectionContent(governanceSection, 'patternPositionX') || getSectionContent(governanceSection, 'patternImagePositionX') || '0';
          const patternPositionY = getSectionContent(governanceSection, 'patternPositionY') || getSectionContent(governanceSection, 'patternImagePositionY') || '50';

          // Fallback to hardcoded core values if CMS data not available
          const fallbackCoreValues = [
            {
              letter: 'P',
              title: 'Principled Excellence',
              description: "Doing what's right, with integrity and intention.",
              icon: PrincipledExcellenceIcon,
            },
            {
              letter: 'A',
              title: 'Authenticity',
              description: 'Bringing your true self to work, and honouring that in others.',
              icon: AuthenticityIcon,
            },
            {
              letter: 'C',
              title: 'Customer Value',
              description: 'Keeping our customers at the heart of everything we do.',
              icon: CustomerValueIcon,
            },
            {
              letter: 'E',
              title: 'Esteem Culture',
              description:
                'Fostering a workplace where respect, dignity, and belonging are everyday experiences.',
              icon: EsteemCultureIcon,
            },
          ];

          // Use CMS core values if available, otherwise use fallback
          const displayCoreValues = coreValues.length > 0 ? coreValues.map((value: any, idx: number) => {
            // Extract first letter from title if letter not provided
            const letter = value.letter || (value.title ? value.title.charAt(0).toUpperCase() : '');

            // Get icon path from CMS using helper function
            let iconPath = '';
            if (value.icon) {
              iconPath = getImagePath(value.icon);
            }

            // If no icon from CMS, use fallback icon
            if (!iconPath && fallbackCoreValues[idx]?.icon) {
              iconPath = fallbackCoreValues[idx].icon;
            }

            return {
              ...value,
              letter,
              iconPath: iconPath || fallbackCoreValues[idx]?.icon || '',
            };
          }) : fallbackCoreValues;

          return (
            <section className="py-8 md:py-10 bg-gray-50">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">{title}</h2>
                <p className="text-gray-700 text-sm md:text-base mb-6 max-w-4xl mx-auto text-center" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100" data-aos-easing="ease-out-cubic">
                  {description}
                </p>

                <div className="grid md:grid-cols-3 gap-5 mb-6">
                  <div className="text-white p-6 rounded-lg flex flex-col justify-center h-full" style={{ backgroundColor: quoteBgColor }} data-aos="fade-up" data-aos-duration="700" data-aos-delay="200" data-aos-easing="ease-out-cubic">
                    <p className="text-base md:text-lg font-bold mb-3 leading-relaxed">
                      {quote}
                    </p>
                    <p className="font-bold">{quoteAuthor}</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300" data-aos-easing="ease-out-cubic">
                    <h3 className="text-xl font-bold mb-3">{missionTitle}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {missionDescription}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200" data-aos="fade-up" data-aos-duration="700" data-aos-delay="400" data-aos-easing="ease-out-cubic">
                    <h3 className="text-xl font-bold mb-3">{visionTitle}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {visionDescription}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-[50px] bg-[#247b6b] p-10 md:p-16 relative overflow-hidden"
                  data-aos="fade-up"
                >
                  {/* Background Pattern with CMS positioning - matches original website */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `url(${patternImagePath})`,
                      backgroundSize: 'contain',
                      backgroundPosition: `${patternPositionX}% ${patternPositionY}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {coreValuesHeading}
                      </h3>
                      <p className="text-white/90 text-base md:text-lg max-w-3xl mx-auto">
                        {coreValuesSubtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                      {displayCoreValues.map((value: any, index: number) => (
                        <div
                          key={value.title || index}
                          data-aos="fade-up"
                          data-aos-delay={index * 150}
                          className="flex flex-col items-center"
                        >
                          <div className="mb-6 h-16 flex items-end justify-center">
                            {(value.iconPath || value.icon) && (
                              <img
                                src={value.iconPath || value.icon}
                                alt={value.title || `Core Value ${index + 1}`}
                                className="h-14 w-auto object-contain"
                                onError={(e) => {
                                  // Fallback to default icon if image fails
                                  if (fallbackCoreValues[index]?.icon) {
                                    (e.target as HTMLImageElement).src = fallbackCoreValues[index].icon;
                                  } else {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }
                                }}
                              />
                            )}
                          </div>

                          <div className="text-4xl md:text-5xl font-bold text-white mb-3 leading-none">
                            {value.letter || (value.title ? value.title.charAt(0).toUpperCase() : '')}
                          </div>

                          <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                            {value.title}
                          </h4>

                          <p className="text-white/90 text-sm leading-relaxed max-w-[250px] mx-auto">
                            {value.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
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
          let cardsArray: any[] = [];
          const cardsData = getSectionContent(ctaSection, 'cards');
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
            // Try new field names (questionTitle, newsTitle, careersTitle)
            const questionTitle = getSectionContent(ctaSection, 'questionTitle');
            const newsTitle = getSectionContent(ctaSection, 'newsTitle');
            const careersTitle = getSectionContent(ctaSection, 'careersTitle');

            if (questionTitle) {
              cardsArray.push({
                title: questionTitle,
                buttonText: getSectionContent(ctaSection, 'questionButtonText') || 'Get in touch',
                buttonLink: getSectionContent(ctaSection, 'questionButtonLink') || '/contact'
              });
            }
            if (newsTitle) {
              cardsArray.push({
                title: newsTitle,
                buttonText: getSectionContent(ctaSection, 'newsButtonText') || 'Refex Newsroom',
                buttonLink: getSectionContent(ctaSection, 'newsButtonLink') || '/newsroom'
              });
            }
            if (careersTitle) {
              cardsArray.push({
                title: careersTitle,
                buttonText: getSectionContent(ctaSection, 'careersButtonText') || 'Careers',
                buttonLink: getSectionContent(ctaSection, 'careersButtonLink') || '/careers'
              });
            }

            // Fallback to old field names (card1Title, card2Title, card3Title)
            if (cardsArray.length === 0) {
              const card1Title = getSectionContent(ctaSection, 'card1Title');
              const card2Title = getSectionContent(ctaSection, 'card2Title');
              const card3Title = getSectionContent(ctaSection, 'card3Title');

              if (card1Title) {
                cardsArray.push({
                  title: card1Title,
                  buttonText: getSectionContent(ctaSection, 'card1ButtonText') || 'Get in touch',
                  buttonLink: getSectionContent(ctaSection, 'card1ButtonLink') || '/contact'
                });
              }
              if (card2Title) {
                cardsArray.push({
                  title: card2Title,
                  buttonText: getSectionContent(ctaSection, 'card2ButtonText') || 'Refex Newsroom',
                  buttonLink: getSectionContent(ctaSection, 'card2ButtonLink') || '/newsroom'
                });
              }
              if (card3Title) {
                cardsArray.push({
                  title: card3Title,
                  buttonText: getSectionContent(ctaSection, 'card3ButtonText') || 'Careers',
                  buttonLink: getSectionContent(ctaSection, 'card3ButtonLink') || '/careers'
                });
              }
            }
          }

          // Default cards if none found
          if (cardsArray.length === 0) {
            cardsArray = [
              { title: 'Got a question?', buttonText: 'Get in touch', buttonLink: '/contact' },
              { title: 'See our latest news', buttonText: 'Refex Newsroom', buttonLink: '/newsroom' },
              { title: 'Work at Refex', buttonText: 'Careers', buttonLink: '/careers' }
            ];
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
                          className="inline-block border-2 border-white bg-transparent text-white px-4 md:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer text-xs md:text-sm lg:text-base"
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
        
        [data-aos-easing="ease-out-cubic"] {
          transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }
      `}</style>
      <Footer />
    </MainLayout>
  );
};

// ESG Tabs Component
const ESGTabs = ({ tabsData = [] }: { tabsData?: any[] }) => {
  // Helper function to get image path from CMS data
  const getImagePath = (imageData: any): string | null => {
    if (!imageData) return null;

    // Handle number (media ID) - construct /uploads/media/{id} path
    if (typeof imageData === 'number' && imageData > 0) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}/uploads/media/${imageData}`;
    }

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

    return null; // Return null instead of empty string to prevent React warning
  };

  // No fallback tabs - only use CMS data
  const fallbackTabs: any[] = [];

  // Use only CMS data - no fallbacks
  const tabsToUse = tabsData.length > 0 ? tabsData.map((cmsTab: any) => {
    // Resolve CMS image - filter out old /assets/ fallback paths
    let cmsImage = null;
    if (cmsTab.image) {
      // If image is a string path (most common case from CMS)
      if (typeof cmsTab.image === 'string' && cmsTab.image.trim()) {
        const imagePath = cmsTab.image.trim();
        // Skip old fallback paths from /assets/
        if (!imagePath.startsWith('/assets/')) {
          cmsImage = imagePath;
        }
      } 
      // If image is a media object with filePath or url
      else if (cmsTab.image.filePath || cmsTab.image.url) {
        const path = cmsTab.image.filePath || cmsTab.image.url;
        // Skip old fallback paths from /assets/
        if (typeof path === 'string' && !path.startsWith('/assets/')) {
          cmsImage = cmsTab.image;
        }
      }
      // If image is a media object from CMS (with id, path, etc.)
      else if (cmsTab.image.id || cmsTab.image.path) {
        const path = cmsTab.image.path;
        // Skip old fallback paths from /assets/
        if (!path || (typeof path === 'string' && !path.startsWith('/assets/'))) {
          cmsImage = cmsTab.image;
        }
      }
    }
    
    return {
      ...cmsTab,
      // Use CMS image only (filtered to exclude old fallbacks)
      image: cmsImage,
      // Ensure we use CMS label if it exists
      label: cmsTab.label || cmsTab.title || '',
      key: cmsTab.key || cmsTab.tabId || ''
    };
  }) : [];

  const [activeTab, setActiveTab] = useState<string>(tabsToUse[0]?.key || '');

  const currentTab = tabsToUse.find((tab: any) => tab.key === activeTab) || tabsToUse[0];
  
  // Don't render if no tabs from CMS
  if (tabsToUse.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabsToUse.map((tab: any, index: number) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 md:px-6 py-3 font-medium transition-all duration-300 text-xs md:text-sm rounded-full cursor-pointer ${activeTab === tab.key
                ? 'bg-[#7DC144] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {currentTab && (
          <div className="grid lg:grid-cols-[45%_55%] gap-8 items-start">
            {/* Left: Image */}
            <div data-aos="fade-right" data-aos-duration="800" data-aos-easing="ease-out-cubic">
              {(() => {
                // Resolve image path
                let imageSrc: string | null = null;
                
                if (currentTab.image) {
                  // If image is a string (most common from CMS)
                  if (typeof currentTab.image === 'string') {
                    const imagePath = currentTab.image.trim();
                    if (imagePath) {
                      // If it starts with /uploads/, prepend API base URL
                      if (imagePath.startsWith('/uploads/')) {
                        imageSrc = `${getApiBaseUrl()}${imagePath}`;
                      }
                      // If it's already a full URL, use it as is
                      else if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                        imageSrc = imagePath;
                      }
                      // If it starts with /wp-content/, it's a legacy path - return as is
                      else if (imagePath.startsWith('/wp-content/')) {
                        imageSrc = imagePath;
                      }
                      // Otherwise, use as is (might be a relative path)
                      else {
                        imageSrc = imagePath;
                      }
                    }
                  }
                  // If image is an object (media object from CMS)
                  else if (currentTab.image && typeof currentTab.image === 'object') {
                    const resolvedPath = getImagePath(currentTab.image);
                    if (resolvedPath && resolvedPath.trim()) {
                      imageSrc = resolvedPath;
                    } else {
                      // Try other properties
                      if (currentTab.image.path && currentTab.image.path.trim()) {
                        const path = currentTab.image.path.trim();
                        imageSrc = path.startsWith('/uploads/') ? `${getApiBaseUrl()}${path}` : path;
                      } else if (currentTab.image.filePath && currentTab.image.filePath.trim()) {
                        const path = currentTab.image.filePath.trim();
                        imageSrc = path.startsWith('/uploads/') ? `${getApiBaseUrl()}${path}` : path;
                      } else if (currentTab.image.url && currentTab.image.url.trim()) {
                        imageSrc = currentTab.image.url.trim();
                      }
                    }
                  }
                }
                
                // Only render img if we have a valid src
                if (imageSrc && imageSrc.trim() !== '') {
                  return (
                    <img
                      src={imageSrc}
                      alt={currentTab.title || currentTab.label}
                      className={`rounded-lg ${currentTab.key === 'environment'
                        ? 'w-full max-w-[768px] mx-auto aspect-square object-cover object-center'
                        : 'w-full h-auto'
                        }`}
                      onError={(e) => {
                        // Hide image and show placeholder on error
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        // Check if placeholder already exists
                        if (!img.parentElement?.querySelector('.image-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'image-placeholder w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center';
                          placeholder.innerHTML = '<p class="text-gray-400">Image not available</p>';
                          img.parentElement?.appendChild(placeholder);
                        }
                      }}
                    />
                  );
                } else {
                  return (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Right: Content */}
            <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-easing="ease-out-cubic">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentTab.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {currentTab.description}
                </p>

                {currentTab.items && currentTab.items.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {currentTab.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} data-aos="fade-up" data-aos-duration="600" data-aos-delay={(itemIndex + 3) * 100}>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Removed unused ESGCard and SDGCard components - now using UnsSdgsSection component

export default ESGPage;
