import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import CategoryCards from './components/CategoryCards';
import BenefitsSection from './components/BenefitsSection';
import FeaturedProjects from './components/FeaturedProjects';
import CTASection from './components/CTASection';
import { getApiBaseUrl } from '../../config/env';

export default function RefexRenewablesPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
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
      if (imageData.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${imageData}`;
      }
      // If it's already a full URL, return as-is
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
    
    if (contentItem.media || contentItem.mediaId) {
      return {
        path: getImagePath(contentItem.media)
      };
    }
    
    return contentItem.contentValue;
  };

  useEffect(() => {
    const fetchRenewablesData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-renewables');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Category Cards
          const categoryCardsSection = sections.find((s: any) => s.sectionKey === 'category-cards');
          if (categoryCardsSection?.content) {
            const categoriesContent = categoryCardsSection.content.find((c: any) => c.contentKey === 'categories');
            if (categoriesContent && categoriesContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(categoriesContent.contentValue);
                setCategories(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing categories:', e);
              }
            }
          }

          // Parse Benefits
          const benefitsSection = sections.find((s: any) => s.sectionKey === 'benefits');
          if (benefitsSection?.content) {
            const benefitsContent = benefitsSection.content.find((c: any) => c.contentKey === 'benefits');
            if (benefitsContent && benefitsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(benefitsContent.contentValue);
                setBenefits(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing benefits:', e);
              }
            }
          }

          // Parse Featured Projects
          const projectsSection = sections.find((s: any) => s.sectionKey === 'featured-projects');
          if (projectsSection?.content) {
            const projectsContent = projectsSection.content.find((c: any) => c.contentKey === 'projects');
            if (projectsContent && projectsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(projectsContent.contentValue);
                const projectsArray = Array.isArray(parsed) ? parsed : [];
                // Process images in each project to resolve paths
                const processedProjects = await Promise.all(projectsArray.map(async (project: any) => {
                  if (project.images && Array.isArray(project.images)) {
                    const processedImages = await Promise.all(project.images.map(async (image: any) => {
                      // If image is already a string path, use getImagePath to resolve it
                      if (typeof image === 'string') {
                        // Skip old /assets/ paths
                        if (image.startsWith('/assets/')) {
                          return '';
                        }
                        // If it's already a full path like /uploads/images/..., use it
                        if (image.startsWith('/uploads/')) {
                          const apiBase = getApiBaseUrl();
                          return `${apiBase}${image}`;
                        }
                        // If it's already a full URL, return as-is
                        if (image.startsWith('http://') || image.startsWith('https://')) {
                          return image;
                        }
                        return getImagePath(image);
                      }
                      // If image is an object, use getImagePath to resolve it
                      if (typeof image === 'object' && image !== null) {
                        return getImagePath(image);
                      }
                      // If image is a number (media ID), fetch the actual filePath from media record
                      if (typeof image === 'number' && image > 0) {
                        try {
                          const { mediaService } = await import('../../services/apiService');
                          const media = await mediaService.getById(image);
                          if (media?.filePath) {
                            // Use the actual file path instead of /uploads/media/{id}
                            const apiBase = getApiBaseUrl();
                            return `${apiBase}${media.filePath}`;
                          } else if (media?.data?.filePath) {
                            const apiBase = getApiBaseUrl();
                            return `${apiBase}${media.data.filePath}`;
                          } else {
                            // Fallback to /uploads/media/{id} if filePath not available
                            const apiBase = getApiBaseUrl();
                            return `${apiBase}/uploads/media/${image}`;
                          }
                        } catch (error) {
                          console.warn(`Could not fetch media filePath for ID ${image}, using fallback:`, error);
                          // Fallback to /uploads/media/{id} if fetch fails
                          const apiBase = getApiBaseUrl();
                          return `${apiBase}/uploads/media/${image}`;
                        }
                      }
                      return '';
                    }));
                    // Filter out empty images
                    const validImages = processedImages.filter((img: string) => img && img.trim() !== '');
                    return {
                      ...project,
                      images: validImages
                    };
                  }
                  return project;
                }));
                setProjects(processedProjects);
              } catch (e) {
                console.error('Error parsing projects:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching renewables data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenewablesData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
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

  const heroSection = pageSections['hero'];
  const categoryCardsSection = pageSections['category-cards'];
  const benefitsSection = pageSections['benefits'];
  const projectsSection = pageSections['featured-projects'];
  const ctaSection = pageSections['cta'];

  return (
    <MainLayout>
      <HeroSection 
        section={heroSection}
        getSectionContent={getSectionContent}
        getImagePath={getImagePath}
      />
      <CategoryCards 
        section={categoryCardsSection}
        categories={categories}
        getImagePath={getImagePath}
      />
      <BenefitsSection 
        section={benefitsSection}
        benefits={benefits}
        getImagePath={getImagePath}
      />
      <FeaturedProjects 
        section={projectsSection}
        projects={projects}
        getImagePath={getImagePath}
      />
      <CTASection 
        section={ctaSection}
        getSectionContent={getSectionContent}
        getImagePath={getImagePath}
      />
      <Footer />
    </MainLayout>
  );
}
