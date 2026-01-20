import React, { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import LogoCardsSection from './components/LogoCardsSection';
import RDCapabilitySection from './components/RDCapabilitySection';
import PlantCapabilitySection from './components/PlantCapabilitySection';
import CTASection from './components/CTASection';
import { getApiBaseUrl } from '../../config/env';

const PharmaRLFineChemPage: React.FC = () => {
  const [pageSections, setPageSections] = useState<any>({});
  const [logoCards, setLogoCards] = useState<any[]>([]);
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
    
    if (contentItem.media || contentItem.mediaId) {
      return {
        path: getImagePath(contentItem.media)
      };
    }
    
    return contentItem.contentValue;
  };

  useEffect(() => {
    const fetchPharmaData = async () => {
      try {
        setLoading(true);
        
        // Fetch page and sections
        const page = await pagesService.getBySlug('pharma-rl-fine-chem');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Logo Cards
          const logoCardsSection = sections.find((s: any) => s.sectionKey === 'logo-cards');
          if (logoCardsSection?.content) {
            const cardsItem = logoCardsSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsItem && cardsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsItem.contentValue);
                setLogoCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing logo cards:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching pharma data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmaData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection sectionData={pageSections['hero']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <LogoCardsSection sectionData={pageSections['logo-cards']} cards={logoCards} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <AboutSection sectionData={pageSections['about']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <RDCapabilitySection sectionData={pageSections['rd-capability']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <PlantCapabilitySection sectionData={pageSections['plant-capability']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <CTASection sectionData={pageSections['cta']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      </main>
      <Footer />
    </div>
  );
};

export default PharmaRLFineChemPage;
