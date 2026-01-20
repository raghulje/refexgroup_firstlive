import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import WhyUsSection from './components/WhyUsSection';
import WhatWeDoSection from './components/WhatWeDoSection';
import CTASection from './components/CTASection';
import { getApiBaseUrl } from '../../config/env';

export default function RefexAshCoalHandlingPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchAshCoalData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-ash-coal-handling');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Features from Overview section
          const overviewSection = sections.find((s: any) => s.sectionKey === 'overview');
          if (overviewSection?.content) {
            const featuresContent = overviewSection.content.find((c: any) => c.contentKey === 'features');
            if (featuresContent && featuresContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(featuresContent.contentValue);
                setFeatures(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing features:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching ash coal handling data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAshCoalData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
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

  return (
    <MainLayout>
      <HeroSection sectionData={pageSections['hero'] || pageSections['hero-section']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <WhyUsSection sectionData={pageSections['overview']} features={features} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <WhatWeDoSection sectionData={pageSections['services']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <CTASection sectionData={pageSections['cta-section'] || pageSections['cta']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <Footer />
    </MainLayout>
  );
}
