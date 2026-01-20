import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import BeYouSection from './components/BeYouSection';
import BelieveSection from './components/BelieveSection';
import InitiativesSection from './components/InitiativesSection';
import CTASection from './components/CTASection';
import { getApiBaseUrl } from '../../config/env';

export default function DiversityInclusionPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [content, setContent] = useState<string[]>([]);
  const [beliefs, setBeliefs] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any>({});
  const [ctaCards, setCtaCards] = useState<any[]>([]);
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
    
    // Handle image/media content with positioning
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

  useEffect(() => {
    const fetchDiversityData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('diversity-inclusion');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse BeYou content
          const beYouSection = sections.find((s: any) => s.sectionKey === 'be-you');
          if (beYouSection?.content) {
            const contentItem = beYouSection.content.find((c: any) => c.contentKey === 'content');
            if (contentItem && contentItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(contentItem.contentValue);
                setContent(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing content:', e);
              }
            }
          }

          // Parse Believe beliefs
          const believeSection = sections.find((s: any) => s.sectionKey === 'believe');
          if (believeSection?.content) {
            const beliefsItem = believeSection.content.find((c: any) => c.contentKey === 'beliefs');
            if (beliefsItem && beliefsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(beliefsItem.contentValue);
                if (Array.isArray(parsed)) {
                  // Resolve icon paths for each belief
                  const resolvedBeliefs = await Promise.all(
                    parsed.map(async (belief: any) => {
                      if (!belief.iconPath) {
                        return belief;
                      }

                      let resolvedIconPath = belief.iconPath;

                      // If iconPath is a number (media ID), resolve it
                      if (typeof belief.iconPath === 'number' && belief.iconPath > 0) {
                        try {
                          const { mediaService } = await import('../../services/apiService');
                          const media = await mediaService.getById(belief.iconPath);
                          if (media?.filePath) {
                            resolvedIconPath = getImagePath(media);
                          } else if (media?.url) {
                            resolvedIconPath = media.url;
                          }
                        } catch (error) {
                          console.error(`Error resolving icon mediaId ${belief.iconPath}:`, error);
                        }
                      }
                      // If iconPath is a string like /uploads/media/{id}, extract and resolve
                      else if (typeof belief.iconPath === 'string') {
                        const iconStr = belief.iconPath.trim();
                        if (iconStr.startsWith('/uploads/media/')) {
                          const mediaIdMatch = iconStr.match(/\/uploads\/media\/(\d+)/);
                          if (mediaIdMatch) {
                            try {
                              const { mediaService } = await import('../../services/apiService');
                              const media = await mediaService.getById(parseInt(mediaIdMatch[1]));
                              if (media?.filePath) {
                                resolvedIconPath = getImagePath(media);
                              } else if (media?.url) {
                                resolvedIconPath = media.url;
                              }
                            } catch (error) {
                              console.error(`Error resolving icon path ${iconStr}:`, error);
                            }
                          }
                        } else if (iconStr.startsWith('/uploads/')) {
                          // Direct path - use getImagePath to add API base URL
                          resolvedIconPath = getImagePath(iconStr);
                        }
                        // If it's already a full URL or relative path, keep it as is
                      }

                      return {
                        ...belief,
                        iconPath: resolvedIconPath
                      };
                    })
                  );
                  setBeliefs(resolvedBeliefs);
                } else {
                  setBeliefs([]);
                }
              } catch (e) {
                console.error('Error parsing beliefs:', e);
              }
            }
          }

          // Parse Initiatives
          const initiativesSection = sections.find((s: any) => s.sectionKey === 'initiatives');
          if (initiativesSection?.content) {
            const initiativesData: any = {};
            for (const item of initiativesSection.content) {
              if (item.contentType === 'json') {
                try {
                  const parsed = JSON.parse(item.contentValue);
                  // If it's the initiatives array, resolve logo paths
                  if (item.contentKey === 'initiatives' && Array.isArray(parsed)) {
                    const resolvedInitiatives = await Promise.all(
                      parsed.map(async (initiative: any) => {
                        // Resolve logo path
                        let resolvedLogo = initiative.logo;
                        if (initiative.logo) {
                          // If logo is a number (media ID), resolve it
                          if (typeof initiative.logo === 'number' && initiative.logo > 0) {
                            try {
                              const { mediaService } = await import('../../services/apiService');
                              const media = await mediaService.getById(initiative.logo);
                              if (media?.filePath) {
                                resolvedLogo = getImagePath(media);
                              } else if (media?.url) {
                                resolvedLogo = media.url;
                              }
                            } catch (error) {
                              console.error(`Error resolving logo mediaId ${initiative.logo}:`, error);
                            }
                          }
                          // If logo is a string like /uploads/media/{id}, extract and resolve
                          else if (typeof initiative.logo === 'string') {
                            const logoStr = initiative.logo.trim();
                            if (logoStr.startsWith('/uploads/media/')) {
                              const mediaIdMatch = logoStr.match(/\/uploads\/media\/(\d+)/);
                              if (mediaIdMatch) {
                                try {
                                  const { mediaService } = await import('../../services/apiService');
                                  const media = await mediaService.getById(parseInt(mediaIdMatch[1]));
                                  if (media?.filePath) {
                                    resolvedLogo = getImagePath(media);
                                  } else if (media?.url) {
                                    resolvedLogo = media.url;
                                  }
                                } catch (error) {
                                  console.error(`Error resolving logo path ${logoStr}:`, error);
                                }
                              }
                            } else if (logoStr.startsWith('/uploads/')) {
                              // Direct path - use getImagePath to add API base URL
                              resolvedLogo = getImagePath(logoStr);
                            }
                            // If it's already a full URL or relative path, keep it as is
                          }
                        }

                        // Resolve images array if present
                        let resolvedImages = initiative.images || [];
                        if (Array.isArray(initiative.images) && initiative.images.length > 0) {
                          resolvedImages = await Promise.all(
                            initiative.images.map(async (img: any) => {
                              if (typeof img === 'number' && img > 0) {
                                try {
                                  const { mediaService } = await import('../../services/apiService');
                                  const media = await mediaService.getById(img);
                                  if (media?.filePath) {
                                    return getImagePath(media);
                                  } else if (media?.url) {
                                    return media.url;
                                  }
                                } catch (error) {
                                  console.error(`Error resolving image mediaId ${img}:`, error);
                                }
                              } else if (typeof img === 'string') {
                                const imgStr = img.trim();
                                if (imgStr.startsWith('/uploads/media/')) {
                                  const mediaIdMatch = imgStr.match(/\/uploads\/media\/(\d+)/);
                                  if (mediaIdMatch) {
                                    try {
                                      const { mediaService } = await import('../../services/apiService');
                                      const media = await mediaService.getById(parseInt(mediaIdMatch[1]));
                                      if (media?.filePath) {
                                        return getImagePath(media);
                                      } else if (media?.url) {
                                        return media.url;
                                      }
                                    } catch (error) {
                                      console.error(`Error resolving image path ${imgStr}:`, error);
                                    }
                                  }
                                } else if (imgStr.startsWith('/uploads/')) {
                                  return getImagePath(imgStr);
                                }
                                return imgStr;
                              }
                              return img;
                            })
                          );
                        }

                        // Resolve coverImage if present
                        let resolvedCoverImage = initiative.coverImage;
                        if (initiative.coverImage) {
                          if (typeof initiative.coverImage === 'number' && initiative.coverImage > 0) {
                            try {
                              const { mediaService } = await import('../../services/apiService');
                              const media = await mediaService.getById(initiative.coverImage);
                              if (media?.filePath) {
                                resolvedCoverImage = getImagePath(media);
                              } else if (media?.url) {
                                resolvedCoverImage = media.url;
                              }
                            } catch (error) {
                              console.error(`Error resolving coverImage mediaId ${initiative.coverImage}:`, error);
                            }
                          } else if (typeof initiative.coverImage === 'string') {
                            const coverStr = initiative.coverImage.trim();
                            if (coverStr.startsWith('/uploads/media/')) {
                              const mediaIdMatch = coverStr.match(/\/uploads\/media\/(\d+)/);
                              if (mediaIdMatch) {
                                try {
                                  const { mediaService } = await import('../../services/apiService');
                                  const media = await mediaService.getById(parseInt(mediaIdMatch[1]));
                                  if (media?.filePath) {
                                    resolvedCoverImage = getImagePath(media);
                                  } else if (media?.url) {
                                    resolvedCoverImage = media.url;
                                  }
                                } catch (error) {
                                  console.error(`Error resolving coverImage path ${coverStr}:`, error);
                                }
                              }
                            } else if (coverStr.startsWith('/uploads/')) {
                              resolvedCoverImage = getImagePath(coverStr);
                            }
                          }
                        }

                        return {
                          ...initiative,
                          logo: resolvedLogo,
                          images: resolvedImages,
                          coverImage: resolvedCoverImage
                        };
                      })
                    );
                    initiativesData[item.contentKey] = resolvedInitiatives;
                  } 
                  // Handle sliderImages array
                  else if (item.contentKey === 'sliderImages' && Array.isArray(parsed)) {
                    const resolvedSliderImages = await Promise.all(
                      parsed.map(async (img: any) => {
                        if (typeof img === 'number' && img > 0) {
                          try {
                            const { mediaService } = await import('../../services/apiService');
                            const media = await mediaService.getById(img);
                            if (media?.filePath) {
                              return getImagePath(media);
                            } else if (media?.url) {
                              return media.url;
                            }
                          } catch (error) {
                            console.error(`Error resolving sliderImage mediaId ${img}:`, error);
                          }
                        } else if (typeof img === 'string') {
                          const imgStr = img.trim();
                          if (imgStr.startsWith('/uploads/media/')) {
                            const mediaIdMatch = imgStr.match(/\/uploads\/media\/(\d+)/);
                            if (mediaIdMatch) {
                              try {
                                const { mediaService } = await import('../../services/apiService');
                                const media = await mediaService.getById(parseInt(mediaIdMatch[1]));
                                if (media?.filePath) {
                                  return getImagePath(media);
                                } else if (media?.url) {
                                  return media.url;
                                }
                              } catch (error) {
                                console.error(`Error resolving sliderImage path ${imgStr}:`, error);
                              }
                            }
                          } else if (imgStr.startsWith('/uploads/')) {
                            return getImagePath(imgStr);
                          }
                          return imgStr;
                        }
                        return img;
                      })
                    );
                    initiativesData[item.contentKey] = resolvedSliderImages;
                  } else {
                    initiativesData[item.contentKey] = parsed;
                  }
                } catch (e) {
                  console.error(`Error parsing ${item.contentKey}:`, e);
                }
              } else if (item.media || item.mediaId) {
                initiativesData[item.contentKey] = {
                  path: getImagePath(item.media)
                };
              } else {
                initiativesData[item.contentKey] = item.contentValue;
              }
            }
            setInitiatives(initiativesData);
          }

          // Parse CTA cards
          const ctaSection = sections.find((s: any) => s.sectionKey === 'cta');
          if (ctaSection?.content) {
            const cardsItem = ctaSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsItem && cardsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsItem.contentValue);
                setCtaCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing cards:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching diversity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiversityData();
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

  return (
    <MainLayout>
      <div className="bg-white">
        <HeroSection sectionData={pageSections['hero']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <BeYouSection sectionData={pageSections['be-you']} content={content} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <BelieveSection sectionData={pageSections['believe']} beliefs={beliefs} getSectionContent={getSectionContent} />
        <InitiativesSection sectionData={pageSections['initiatives']} initiatives={initiatives} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <CTASection sectionData={pageSections['cta']} cards={ctaCards} getSectionContent={getSectionContent} />
        <Footer />
      </div>
    </MainLayout>
  );
}
