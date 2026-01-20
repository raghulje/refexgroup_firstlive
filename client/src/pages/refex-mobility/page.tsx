
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SolutionsSection } from './components/SolutionsSection';
import { AdvantagesSection } from './components/AdvantagesSection';
import { ElectricFleetSection } from './components/ElectricFleetSection';
import { CTASection } from './components/CTASection';
import { getApiBaseUrl } from '../../config/env';

export default function RefexMobilityPage() {
  const [pageSections, setPageSections] = useState<any>({});
  const [solutions, setSolutions] = useState<any[]>([]);
  const [leftCards, setLeftCards] = useState<any[]>([]);
  const [rightCards, setRightCards] = useState<any[]>([]);
  const [advantages, setAdvantages] = useState<any[]>([]);
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
    const fetchMobilityData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-mobility');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Solutions
          const solutionsSection = sections.find((s: any) => s.sectionKey === 'solutions');
          if (solutionsSection?.content) {
            const solutionsContent = solutionsSection.content.find((c: any) => c.contentKey === 'solutions');
            if (solutionsContent && solutionsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(solutionsContent.contentValue);
                setSolutions(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing solutions:', e);
              }
            }
          }

          // Parse Advantages
          const advantagesSection = sections.find((s: any) => s.sectionKey === 'advantages');
          if (advantagesSection?.content) {
            const leftCardsContent = advantagesSection.content.find((c: any) => c.contentKey === 'leftCards');
            const rightCardsContent = advantagesSection.content.find((c: any) => c.contentKey === 'rightCards');
            
            if (leftCardsContent && leftCardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(leftCardsContent.contentValue);
                setLeftCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing leftCards:', e);
              }
            }
            
            if (rightCardsContent && rightCardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(rightCardsContent.contentValue);
                setRightCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing rightCards:', e);
              }
            }
          }

          // Parse Electric Fleet Advantages
          const electricFleetSection = sections.find((s: any) => s.sectionKey === 'electric-fleet');
          if (electricFleetSection?.content) {
            const advantagesContent = electricFleetSection.content.find((c: any) => c.contentKey === 'advantages');
            if (advantagesContent && advantagesContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(advantagesContent.contentValue);
                setAdvantages(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing advantages:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching mobility data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMobilityData();
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
      <HeroSection sectionData={pageSections['hero']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <AboutSection sectionData={pageSections['about']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <SolutionsSection sectionData={pageSections['solutions']} solutions={solutions} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <AdvantagesSection sectionData={pageSections['advantages']} leftCards={leftCards} rightCards={rightCards} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <ElectricFleetSection sectionData={pageSections['electric-fleet']} advantages={advantages} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <CTASection sectionData={pageSections['cta']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      <Footer />
    </MainLayout>
  );
}
