import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import { pagesService, sectionsService } from '../../services/apiService';
import HeroSection from './components/HeroSection';
import AssociateCompanies from './components/AssociateCompanies';
import StatsSection from './components/StatsSection';
import CommitmentSection from './components/CommitmentSection';
import SpecialitiesSection from './components/SpecialitiesSection';
import CertificationsSection from './components/CertificationsSection';
import ClienteleSection from './components/ClienteleSection';
import ProductsSection from './components/ProductsSection';
import AdonisSection from './components/AdonisSection';
import { getApiBaseUrl } from '../../config/env';

const RefexMedTechPage = () => {
  const [pageSections, setPageSections] = useState<any>({});
  const [associateCompanies, setAssociateCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [clientele, setClientele] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
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
    const fetchMedTechData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('refex-medtech');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);

          // Parse Associate Companies
          const associateSection = sections.find((s: any) => s.sectionKey === 'associate-companies');
          if (associateSection?.content) {
            const companiesItem = associateSection.content.find((c: any) => c.contentKey === 'companies');
            if (companiesItem && companiesItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(companiesItem.contentValue);
                setAssociateCompanies(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing companies:', e);
              }
            }
          }

          // Parse Stats
          const statsSection = sections.find((s: any) => s.sectionKey === 'stats');
          if (statsSection?.content) {
            const statsItem = statsSection.content.find((c: any) => c.contentKey === 'stats');
            if (statsItem && statsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(statsItem.contentValue);
                setStats(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing stats:', e);
              }
            }
          }

          // Parse Specialities
          const specialitiesSection = sections.find((s: any) => s.sectionKey === 'specialities');
          if (specialitiesSection?.content) {
            const specialitiesItem = specialitiesSection.content.find((c: any) => c.contentKey === 'specialities');
            if (specialitiesItem && specialitiesItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(specialitiesItem.contentValue);
                setSpecialities(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing specialities:', e);
              }
            }
          }

          // Parse Certifications
          const certificationsSection = sections.find((s: any) => s.sectionKey === 'certifications');
          if (certificationsSection?.content) {
            const certificationsItem = certificationsSection.content.find((c: any) => c.contentKey === 'certifications');
            if (certificationsItem && certificationsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(certificationsItem.contentValue);
                setCertifications(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing certifications:', e);
              }
            }
          }

          // Parse Clientele
          const clienteleSection = sections.find((s: any) => s.sectionKey === 'clientele');
          if (clienteleSection?.content) {
            const clienteleItem = clienteleSection.content.find((c: any) => c.contentKey === 'clientLogos');
            if (clienteleItem && clienteleItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(clienteleItem.contentValue);
                setClientele(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing clientele:', e);
              }
            }
          }

          // Parse Products
          const productsSection = sections.find((s: any) => s.sectionKey === 'products');
          if (productsSection?.content) {
            const productsItem = productsSection.content.find((c: any) => c.contentKey === 'products');
            if (productsItem && productsItem.contentType === 'json') {
              try {
                const parsed = JSON.parse(productsItem.contentValue);
                setProducts(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing products:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching medtech data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedTechData();
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
      <div className="min-h-screen bg-white">
        <HeroSection sectionData={pageSections['hero-section']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <AssociateCompanies sectionData={pageSections['associate-companies']} companies={associateCompanies} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <StatsSection sectionData={pageSections['stats']} stats={stats} getSectionContent={getSectionContent} />
        <CommitmentSection sectionData={pageSections['commitment']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <SpecialitiesSection sectionData={pageSections['specialities']} specialities={specialities} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <CertificationsSection sectionData={pageSections['certifications']} certifications={certifications} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <ClienteleSection sectionData={pageSections['clientele']} clientele={clientele} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <ProductsSection sectionData={pageSections['products']} products={products} getImagePath={getImagePath} getSectionContent={getSectionContent} />
        <AdonisSection sectionData={pageSections['cta-section']} getImagePath={getImagePath} getSectionContent={getSectionContent} />
      </div>
      <Footer />
    </MainLayout>
  );
};

export default RefexMedTechPage;
