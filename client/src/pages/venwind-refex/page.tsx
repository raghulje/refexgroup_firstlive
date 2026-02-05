import { useEffect, useState } from 'react';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import UniqueSection from './components/UniqueSection';
import TechnicalSpecsSection from './components/TechnicalSpecsSection';
import CTASection from './components/CTASection';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getApiBaseUrl } from '../../config/env';

const VenwindRefexPage = () => {
  const [pageSections, setPageSections] = useState<any>({});
  const [stats, setStats] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);
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
    const fetchVenwindData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('venwind-refex');
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
            const statsContent = statsSection.content.find((c: any) => c.contentKey === 'stats');
            if (statsContent && statsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(statsContent.contentValue);
                setStats(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing stats:', e);
              }
            }
          }

          // Parse Features
          const uniqueSection = sections.find((s: any) => s.sectionKey === 'unique');
          if (uniqueSection?.content) {
            const featuresContent = uniqueSection.content.find((c: any) => c.contentKey === 'features');
            if (featuresContent && featuresContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(featuresContent.contentValue);
                setFeatures(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing features:', e);
              }
            }
          }

          // Parse Technical Specs
          const specsSection = sections.find((s: any) => s.sectionKey === 'technical-specs');
          if (specsSection?.content) {
            const specsContent = specsSection.content.find((c: any) => c.contentKey === 'specs');
            if (specsContent && specsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(specsContent.contentValue);
                setSpecs(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing specs:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching venwind data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenwindData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  if (loading) {
    return (
      <MainLayout disableOverflowX={true}>
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
    <>
      <style>{`
        /* Override overflow-x-hidden for venwind page */
        .venwind-page-wrapper {
          overflow-x: visible !important;
        }
        /* Hide green scrollbar on venwind page */
        .venwind-page-wrapper ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .venwind-page-wrapper ::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .venwind-page-wrapper ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    <MainLayout disableOverflowX={true}>
      <div className="venwind-page-wrapper">
        <HeroSection sectionData={pageSections['hero']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <StatsSection sectionData={pageSections['stats']} stats={stats} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <UniqueSection sectionData={pageSections['unique']} features={features} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <TechnicalSpecsSection sectionData={pageSections['technical-specs']} specs={specs} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <CTASection sectionData={pageSections['cta']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      </div>
    </MainLayout>
      <Footer />
    </>
  );
};

export default VenwindRefexPage;
