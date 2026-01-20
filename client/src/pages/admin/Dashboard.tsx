import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomePage_cms,
  AboutPage_cms,
  ESGPage_cms,
  CareersPage_cms,
  ContactPage_cms,
  Newsroom_cms,
  Gallery_cms,
  InvestmentsPage_cms,
  DiversityInclusionPage_cms,
  Header_cms,
  Footer_cms,
  EmailSettings_cms,
  GlobalSettings_cms,
  RefexRefrigerantsPage_cms,
  RefexRenewablesPage_cms,
  RefexAshCoalHandlingPage_cms,
  RefexMedtechPage_cms,
  RefexCapitalPage_cms,
  RefexAirportsPage_cms,
  RefexMobilityPage_cms,
  PharmaRLFineChemPage_cms,
  VenwindRefexPage_cms
} from './pages/index';
import UserManagement_cms from './pages/user-management/UserManagement_cms';
import { uploadImage, uploadFile } from './shared/utils';
import { authService } from './shared/authService';
import { Modal } from './shared/Modal';
import { validateForm, validators, type ValidationErrors } from './shared/validation';

import {
  HeroSlideForm,
  BusinessCardForm,
  JobForm,
  TestimonialForm,
  NewsroomForm,
  LeaderForm,
  SDGCardForm,
  GalleryAlbumForm,
  GalleryEventForm,
  GalleryImageForm,
  SectionForm,
  ContactInfoForm,
  NavigationForm,
  FooterSectionForm,
  SocialLinkForm,
  GlobalSettingForm,
  HeroSectionContentForm,
  IntroSectionContentForm,
  ChampioningSectionContentForm,
  ThreePillarCardForm,
  SectionContentForm,
  AboutSectionContentForm,
  CareersSectionContentForm,

  BusinessCTASectionForm,
  FooterSettingsForm,
  AwardForm,
  HomeVideoSectionForm,
  HomeAboutSectionForm,
  HomeCareersSectionForm,
  HomeCTASectionForm,
  CoreValueForm,
  MissionVisionSectionForm,
  StoryTimelineSectionForm,
  OverviewSectionForm,
  CoreValuesSectionForm,
  AboutCareersCTASectionForm,
  ESGCTASectionForm,
  SustainabilityReportSectionForm,
  SDGSectionForm,
  GovernanceSectionForm,
  PoliciesSectionForm,
  PolicyForm,
  TabsSectionForm,
  MessageAnilJainForm,
  ListedCompaniesForm,
  InvestmentsCTAForm,
  InvestmentsHeroSectionForm,
  InvestmentsIntroSectionForm,
  InvestmentsContactInfoSectionForm,
  ContactHeroSectionForm,
  ContactFormSectionForm,
  ContactCTASectionForm,
  NewsroomHeroSectionForm,
  NewsroomCTASectionForm,
  GalleryHeroSectionForm,
  GalleryWelcomeSectionForm,
  GalleryCTASectionForm,
  DiversityHeroSectionForm,
  DiversityBeYouSectionForm,
  DiversityBelieveSectionForm,
  DiversityInitiativesSectionForm,
  DiversityCTASectionForm,
  CareersHeroSectionForm,
  CareersMainContentForm,
  CareersVideoSectionForm,
  CareersLifeRefexianForm,
  CareersWhyChooseForm,
  CareersApplicationFormSectionForm,
  CareersTestimonialsContentForm,
  CareersTestimonialSliderForm,
  CareersKnowMoreForm,
  CareersCTASectionForm,
  RenewablesHeroSectionForm,
  RenewablesCategoryCardsForm,
  RenewablesBenefitsForm,
  RenewablesFeaturedProjectsForm,
  RenewablesCTASectionForm,
  AshCoalHeroSectionForm,
  AshCoalOverviewSectionForm,
  AshCoalServicesSectionForm,
  AshCoalCTASectionForm,
  MedtechHeroSectionForm,
  MedtechAssociateCompaniesForm,
  MedtechStatsSectionForm,
  MedtechCommitmentSectionForm,
  MedtechSpecialitiesSectionForm,
  MedtechProductsSectionForm,
  MedtechCertificationsSectionForm,
  MedtechClienteleSectionForm,
  MedtechCTASectionForm,
  CapitalHeroSectionForm,
  CapitalStatsSectionForm,
  CapitalAboutSectionForm,
  CapitalAreasSectionForm,
  CapitalWhatWeLookForSectionForm,
  CapitalPortfolioSectionForm,
  CapitalCTASectionForm,
  AirportsHeroSectionForm,
  AirportsAboutSectionForm,
  AirportsRetailPartnersSectionForm,
  AirportsRetailAdvantageSectionForm,
  AirportsTransportSectionForm,
  AirportsTechSectionForm,
  AirportsCTASectionForm,
  VenwindHeroSectionForm,
  VenwindStatsSectionForm,
  VenwindUniqueSectionForm,
  VenwindTechnicalSpecsSectionForm,
  VenwindCTASectionForm,
  PharmaHeroSectionForm,
  PharmaLogoCardsSectionForm,
  PharmaAboutSectionForm,
  PharmaRDCapabilitySectionForm,
  PharmaPlantCapabilitySectionForm,
  PharmaCTASectionForm,
  MobilityHeroSectionForm,
  MobilityAboutSectionForm,
  MobilitySolutionsSectionForm,
  MobilityAdvantagesSectionForm,
  MobilityElectricFleetSectionForm,
  MobilityCTASectionForm,
  RefrigerantsHeroSectionForm,
  RefrigerantsWhyChooseUsSectionForm,
  RefrigerantsBreakingGroundsSectionForm,
  RefrigerantsProductsSectionForm,
  RefrigerantsQualityAssuranceSectionForm,
  RefrigerantsRefexIndustriesSectionForm
} from './shared/forms';
import {
  heroSlidesService,
  businessCardsService,
  jobsService,
  testimonialsService,
  newsroomService,
  leadersService,
  sdgCardsService,
  galleryAlbumsService,
  galleryEventsService,
  galleryImagesService,
  sectionsService,
  sectionContentService,
  contactInfoService,
  navigationService,
  footerService,
  socialLinksService,
  globalSettingsService,
  awardsService,
  homeVideoSectionService,
  homeAboutSectionService,
  homeCareersSectionService,
  homeCTASectionService,
  coreValuesService
} from '../../services/apiService';

// Define pages array outside component to avoid initialization order issues
const PAGES = [
  { id: 'home-page', label: 'Home Page', icon: 'ri-home-line', category: 'main' },
  { id: 'about-page', label: 'About Page', icon: 'ri-information-line', category: 'main' },
  { id: 'esg-page', label: 'ESG Page', icon: 'ri-leaf-line', category: 'main' },
  { id: 'careers-page', label: 'Careers Page', icon: 'ri-briefcase-line', category: 'main' },
  { id: 'contact-page', label: 'Contact Page', icon: 'ri-mail-line', category: 'main' },
  { id: 'newsroom', label: 'Newsroom', icon: 'ri-newspaper-line', category: 'main' },
  { id: 'gallery', label: 'Gallery', icon: 'ri-image-line', category: 'main' },
  { id: 'investments-page', label: 'Investments Page', icon: 'ri-line-chart-line', category: 'main' },
  { id: 'diversity-inclusion', label: 'Diversity & Inclusion', icon: 'ri-team-line', category: 'main' },
  { id: 'header', label: 'Header', icon: 'ri-layout-top-2-line', category: 'navigation' },
  { id: 'footer', label: 'Footer', icon: 'ri-footer-line', category: 'navigation' },
  { id: 'email-settings', label: 'Email Settings', icon: 'ri-mail-settings-line', category: 'main' },
  { id: 'user-management', label: 'Users', icon: 'ri-user-settings-line', category: 'main' },
  { id: 'global-settings', label: 'Global Settings', icon: 'ri-settings-line', category: 'main' },
  { id: 'refex-refrigerants', label: 'Refex Refrigerants', icon: 'ri-building-line', category: 'business' },
  { id: 'refex-renewables', label: 'Refex Renewables', icon: 'ri-sun-line', category: 'business' },
  { id: 'refex-ash-coal-handling', label: 'Ash & Coal Handling', icon: 'ri-truck-line', category: 'business' },
  { id: 'refex-medtech', label: 'Refex MedTech', icon: 'ri-medicine-bottle-line', category: 'business' },
  { id: 'refex-capital', label: 'Refex Capital', icon: 'ri-money-dollar-circle-line', category: 'business' },
  { id: 'refex-airports', label: 'Refex Airports', icon: 'ri-flight-takeoff-line', category: 'business' },
  { id: 'refex-mobility', label: 'Refex Mobility', icon: 'ri-car-line', category: 'business' },
  { id: 'pharma-rl-fine-chem', label: 'Pharma RL Fine Chem', icon: 'ri-flask-line', category: 'business' },
  { id: 'venwind-refex', label: 'Venwind Refex', icon: 'ri-windy-line', category: 'business' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home-page');
  const [activeCategory, setActiveCategory] = useState<'main' | 'business' | 'navigation'>('main');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentEntityType, setCurrentEntityType] = useState<string>('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const storedToken = authService.getToken();
    const storedUser = authService.getUser();

    if (!storedToken || !storedUser) {
      navigate('/admin/login');
      return;
    }

    setToken(storedToken);
    setUser(storedUser);
  }, [navigate]);

  // Ensure activeTab always belongs to the selected category
  useEffect(() => {
    const categoryPages = PAGES.filter((page) => {
      if (activeCategory === 'business') return page.category === 'business';
      if (activeCategory === 'navigation') return page.category === 'navigation';
      return !page.category || page.category === 'main';
    });

    if (categoryPages.length === 0) return;

    const isActiveTabInCategory = categoryPages.some((page) => page.id === activeTab);
    if (!isActiveTabInCategory) {
      setActiveTab(categoryPages[0].id);
    }
  }, [activeCategory, activeTab]);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const getValidationRules = (entityType: string): Record<string, Array<(value: any, fieldName: string) => string | null>> => {
    const rules: Record<string, Array<(value: any, fieldName: string) => string | null>> = {};

    switch (entityType) {
      case 'hero-slide':
        rules.title = [validators.required];
        rules.orderIndex = [validators.positiveNumber];
        break;
      case 'business-card':
        rules.title = [validators.required];
        rules.orderIndex = [validators.positiveNumber];
        break;
      case 'job':
        rules.title = [validators.required];
        rules.department = [validators.required];
        rules.location = [validators.required];
        break;
      case 'testimonial':
        rules.authorName = [validators.required];
        rules.content = [validators.required, (v) => validators.minLength(v, 10, 'Content')];
        break;
      case 'newsroom':
        rules.title = [validators.required];
        // content is not required - newsroom items use excerpt or link instead
        break;
      case 'leader':
        rules.name = [validators.required];
        rules.position = [validators.required];
        break;
      case 'sdg-card':
        rules.title = [validators.required];
        break;
      case 'contact-info':
        rules.infoType = [validators.required];
        rules.value = [validators.required];
        break;
    }

    return rules;
  };

  // Helper function to recursively process URLs in nested objects/arrays
  const processNestedUrls = async (obj: any, fieldName: string, pageName: string, sectionName: string): Promise<any> => {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(async (item) => {
        if (typeof item === 'object' && item !== null) {
          const processed: any = {};
          for (const [k, v] of Object.entries(item)) {
            // Check if this field might contain an image URL or media ID
            if (['image', 'icon', 'iconPath', 'logo', 'backgroundImage', 'image1', 'image2', 'imageBottom', 'logoImage'].includes(k)) {
              if (typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://'))) {
                // Handle external URLs - download and convert to media ID
                try {
                  const { downloadImageFromUrl } = await import('./shared/utils');
                  const mediaId = await downloadImageFromUrl(v, token || '', pageName || '', sectionName || '', `${fieldName}-${k}-${Date.now()}`, 'image');
                  if (mediaId) {
                    // Convert media ID to path format for storage
                    processed[k] = `/uploads/media/${mediaId}`;
                  } else {
                    processed[k] = v; // Keep original if download fails
                  }
                } catch (error: any) {
                  console.error(`Error downloading URL for ${k}:`, error);
                  processed[k] = v; // Keep original on error
                }
              } else if (typeof v === 'number' && v > 0) {
                // Handle media ID (number) - fetch actual filePath from media record
                try {
                  const { mediaService } = await import('../../services/apiService');
                  const media = await mediaService.getById(v);
                  if (media?.filePath) {
                    // Use the actual file path instead of /uploads/media/{id}
                    processed[k] = media.filePath;
                  } else if (media?.data?.filePath) {
                    processed[k] = media.data.filePath;
                  } else {
                    // Fallback to /uploads/media/{id} if filePath not available
                processed[k] = `/uploads/media/${v}`;
                  }
                } catch (error) {
                  console.warn(`Could not fetch media filePath for ID ${v}, using fallback:`, error);
                  // Fallback to /uploads/media/{id} if fetch fails
                  processed[k] = `/uploads/media/${v}`;
                }
              } else if (typeof v === 'string' && v.startsWith('/uploads/')) {
                // Already a path - keep as is (preserves /uploads/images/... paths)
                processed[k] = v;
              } else {
                // Keep other values as is (empty strings, etc.)
                processed[k] = v;
              }
            } else if (typeof v === 'object' && v !== null) {
              processed[k] = await processNestedUrls(v, `${fieldName}-${k}`, pageName, sectionName);
            } else {
              processed[k] = v;
            }
          }
          return processed;
        }
        return item;
      }));
    } else if (typeof obj === 'object' && obj !== null) {
      const processed: any = {};
      for (const [k, v] of Object.entries(obj)) {
            if (['image', 'icon', 'iconPath', 'logo', 'backgroundImage', 'image1', 'image2', 'imageBottom', 'logoImage'].includes(k)) {
          if (typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://'))) {
            // Handle external URLs - download and convert to media ID
            try {
              const { downloadImageFromUrl } = await import('./shared/utils');
              const mediaId = await downloadImageFromUrl(v, token || '', pageName || '', sectionName || '', `${fieldName}-${k}-${Date.now()}`, 'image');
              if (mediaId) {
                // Convert media ID to path format for storage
                processed[k] = `/uploads/media/${mediaId}`;
              } else {
                processed[k] = v;
              }
            } catch (error: any) {
              console.error(`Error downloading URL for ${k}:`, error);
              processed[k] = v;
            }
          } else if (typeof v === 'number' && v > 0) {
            // Handle media ID (number) - fetch actual filePath from media record
            try {
              const { mediaService } = await import('../../services/apiService');
              const media = await mediaService.getById(v);
              if (media?.filePath) {
                // Use the actual file path instead of /uploads/media/{id}
                processed[k] = media.filePath;
              } else if (media?.data?.filePath) {
                processed[k] = media.data.filePath;
              } else {
                // Fallback to /uploads/media/{id} if filePath not available
            processed[k] = `/uploads/media/${v}`;
              }
            } catch (error) {
              console.warn(`Could not fetch media filePath for ID ${v}, using fallback:`, error);
              // Fallback to /uploads/media/{id} if fetch fails
              processed[k] = `/uploads/media/${v}`;
            }
          } else if (typeof v === 'string' && v.startsWith('/uploads/')) {
            // Already a path - keep as is (preserves /uploads/images/... paths)
            processed[k] = v;
          } else {
            // Keep other values as is (empty strings, etc.)
            processed[k] = v;
          }
        } else if (typeof v === 'object' && v !== null) {
          processed[k] = await processNestedUrls(v, `${fieldName}-${k}`, pageName, sectionName);
        } else {
          processed[k] = v;
        }
      }
      return processed;
    }
    return obj;
  };

  // Helper function to extract page name and section name from entity type
  const getPageAndSectionFromEntityType = (entityType: string): { pageName: string; sectionName: string } => {
    // Map entity types to page names
    const pageMap: { [key: string]: string } = {
      'home-page': 'home-page',
      'about-page': 'about-page',
      'esg-page': 'esg-page',
      'careers-page': 'careers-page',
      'contact-page': 'contact-page',
      'investments-page': 'investments-page',
      'diversity-inclusion': 'diversity-inclusion-page',
      'refex-refrigerants': 'refex-refrigerants-page',
      'refex-renewables': 'refex-renewables-page',
      'refex-ash-coal-handling': 'refex-ash-coal-handling-page',
      'refex-medtech': 'refex-medtech-page',
      'refex-capital': 'refex-capital-page',
      'refex-airports': 'refex-airports-page',
      'refex-mobility': 'refex-mobility-page',
      'pharma-rl-fine-chem': 'pharma-rl-fine-chem-page',
      'venwind-refex': 'venwind-refex-page'
    };

    let pageName = 'general';
    let sectionName = 'general';

    // Check if it's a section-content entity
    if (entityType?.startsWith('section-content-')) {
      const sectionKey = entityType.replace('section-content-', '');

      // Extract page name from section key (e.g., 'hero-capital' -> 'refex-capital')
      for (const [pageId, page] of Object.entries(pageMap)) {
        if (sectionKey.includes(pageId.replace('-page', '').replace('-', ''))) {
          pageName = page;
          break;
        }
      }

      // Extract section name (remove page-specific prefixes)
      sectionName = sectionKey
        .replace(/^(hero-|about-|cta-|stats-|intro-|message-|listed-|contact-)/, '')
        .replace(/-investments|-capital|-airports|-pharma|-mobility|-venwind|-medtech|-refrigerants|-renewables|-ash-coal$/g, '')
        .replace(/-section$/g, '') || sectionKey;
    } else {
      // For non-section entities, try to find page from entity type
      for (const [pageId, page] of Object.entries(pageMap)) {
        if (entityType?.includes(pageId.replace('-page', ''))) {
          pageName = page;
          break;
        }
      }
      sectionName = entityType || 'general';
    }

    return { pageName, sectionName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Validate form
      const rules = getValidationRules(currentEntityType);
      const errors = validateForm(formData, rules);

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setSubmitting(false);
        return;
      }

      // Prepare form data - convert image URLs to media IDs if needed
      const submitData = { ...formData };

      // Get page and section names for URL downloads
      const { pageName, sectionName } = getPageAndSectionFromEntityType(currentEntityType || '');

      // Helper function to download URL and return media ID
      const processImageUrl = async (url: string | number, fieldName: string): Promise<number | string | null> => {
        // If it's already a number (media ID), return as-is
        if (typeof url === 'number') {
          return url;
        }

        // If it's a string that's a number, return as number
        if (typeof url === 'string') {
          const parsed = parseInt(url);
          if (!isNaN(parsed)) {
            return parsed;
          }

          // If it's a URL (http:// or https://), download it
          if (url.startsWith('http://') || url.startsWith('https://')) {
            try {
              const { downloadImageFromUrl } = await import('./shared/utils');
              const mediaId = await downloadImageFromUrl(
                url,
                token || '',
                pageName || '',
                sectionName || '',
                `${fieldName}-${Date.now()}`,
                'image'
              );
              if (mediaId) {
                return mediaId;
              }
            } catch (error: any) {
              console.error(`Error downloading image from URL for ${fieldName}:`, error);
              throw new Error(`Failed to download image from URL: ${error.message || 'Unknown error'}`);
            }
          }
        }

        // Return original value if not a URL
        return url;
      };

      // Process all image fields to download URLs if needed
      // Skip this processing for three-pillar-card as it handles its own image storage format
      if (currentEntityType !== 'three-pillar-card') {
      const imageFieldsToProcess = [
        'backgroundImage',
        'image',
        'icon',
        'logo',
        'authorImage',
        'featuredImage',
        'coverImage',
        'image1',
        'image2',
        'imageBottom',
        'logoImage',
        'thumbnailImage',
      ];

      for (const field of imageFieldsToProcess) {
        if (submitData[field]) {
          try {
            const processed = await processImageUrl(submitData[field], field);

            if (typeof processed === 'number') {
              // For most fields we convert to an ID field and drop the original.
              // For `logo` specifically we KEEP the logo field so we can later
              // resolve the media ID to a filePath and store that in `logo`.
              if (field === 'logo') {
                submitData.logoId = processed;
                submitData.logo = processed; // keep numeric ID for later resolution
              } else {
                const idField =
                  field === 'backgroundImage'
                    ? 'backgroundImageId'
                    : field === 'image'
                      ? 'imageId'
                      : field === 'icon'
                        ? 'iconId'
                        : field === 'authorImage'
                          ? 'authorImageId'
                          : field === 'featuredImage'
                            ? 'featuredImageId'
                            : field === 'coverImage'
                              ? 'coverImageId'
                              : field === 'logoImage'
                                ? 'logoImageId'
                                : field === 'thumbnailImage'
                                  ? 'thumbnailImageId'
                                  : `${field}Id`;

                submitData[idField] = processed;
                delete submitData[field];
              }
            } else if (processed === null) {
              delete submitData[field];
            } else if (field === 'logo') {
              // For logo, keep non-null string values (paths/URLs) as-is
              submitData.logo = processed;
            }
          } catch (error: any) {
            setSubmitError(error.message || 'Failed to process image URL');
            setSubmitting(false);
            return;
            }
          }
        }
      }

      // Handle media IDs for different entity types
      if (currentEntityType === 'hero-slide') {
        // Remove linkType - it's just a UI helper
        if (submitData.linkType) {
          delete submitData.linkType;
        }

        if (submitData.backgroundImage) {
          if (typeof submitData.backgroundImage === 'string') {
            // If it's a URL, we need to find or create media
            // For now, we'll assume it's already a media ID if it's a number string
            const mediaId = parseInt(submitData.backgroundImage);
            if (!isNaN(mediaId)) {
              submitData.backgroundImageId = mediaId;
              delete submitData.backgroundImage;
            }
          } else if (typeof submitData.backgroundImage === 'number') {
            submitData.backgroundImageId = submitData.backgroundImage;
            delete submitData.backgroundImage;
          }
        }
      }

      if (currentEntityType === 'business-card' && submitData.image) {
        if (typeof submitData.image === 'string') {
          const mediaId = parseInt(submitData.image);
          if (!isNaN(mediaId)) {
            submitData.imageId = mediaId;
            delete submitData.image;
          }
        } else if (typeof submitData.image === 'number') {
          submitData.imageId = submitData.image;
          delete submitData.image;
        }
      }

      if (currentEntityType === 'testimonial' && submitData.authorImage) {
        if (typeof submitData.authorImage === 'string') {
          const mediaId = parseInt(submitData.authorImage);
          if (!isNaN(mediaId)) {
            submitData.authorImageId = mediaId;
            delete submitData.authorImage;
          }
        } else if (typeof submitData.authorImage === 'number') {
          submitData.authorImageId = submitData.authorImage;
          delete submitData.authorImage;
        }
      }

      // Handle featuredImageId for newsroom items
      if (currentEntityType === 'newsroom') {
        // Handle featuredImageId (from ImageUpload component)
        if (submitData.featuredImageId) {
          if (typeof submitData.featuredImageId === 'string') {
            const mediaId = parseInt(submitData.featuredImageId);
            if (!isNaN(mediaId)) {
              submitData.featuredImageId = mediaId;
            } else {
              delete submitData.featuredImageId;
            }
          } else if (typeof submitData.featuredImageId === 'number') {
            // Already a number, keep it
          } else {
            delete submitData.featuredImageId;
          }
        }
        // Also handle legacy 'image' field for backward compatibility
        if (submitData.image) {
          if (typeof submitData.image === 'string') {
            const mediaId = parseInt(submitData.image);
            if (!isNaN(mediaId)) {
              submitData.featuredImageId = mediaId;
            }
          } else if (typeof submitData.image === 'number') {
            submitData.featuredImageId = submitData.image;
          }
          delete submitData.image;
        }
      }

      // Handle logo field for newsroom - convert media ID to file path if needed
      if (currentEntityType === 'newsroom' && submitData.logo !== undefined && submitData.logo !== null && submitData.logo !== '') {
        try {
          // If the logo is a media ID (number or numeric string), try to resolve it to a filePath
          if (
            typeof submitData.logo === 'number' ||
            (typeof submitData.logo === 'string' && submitData.logo.match(/^\d+$/))
          ) {
            const mediaId =
              typeof submitData.logo === 'number' ? submitData.logo : parseInt(submitData.logo, 10);

            if (!Number.isNaN(mediaId)) {
              const { mediaService } = await import('../../services/apiService');
              const media = await mediaService.getById(mediaId);

              if (media?.filePath) {
                // Store the resolved file path (e.g. "/uploads/...") in the logo field
                submitData.logo = media.filePath;
              } else {
                console.warn('Logo media found but no filePath – leaving original logo value as-is', {
                  mediaId,
                  media,
                });
                // Fall back to keeping whatever value we already had (so edit modal can still show it)
              }
            }
          }
          // If it's already a non‑numeric string (URL or path), we just keep it untouched.
        } catch (error) {
          console.error('Error resolving newsroom logo media – keeping original logo value:', error);
          // Do NOT delete submitData.logo here – better to keep the existing value than to lose it.
        }
      }

      if (currentEntityType === 'leader' && submitData.image) {
        if (typeof submitData.image === 'string') {
          const mediaId = parseInt(submitData.image);
          if (!isNaN(mediaId)) {
            submitData.imageId = mediaId;
            delete submitData.image;
          }
        } else if (typeof submitData.image === 'number') {
          submitData.imageId = submitData.image;
          delete submitData.image;
        }
      }

      if (currentEntityType === 'sdg-card') {
        // Handle icon
        if (submitData.icon) {
          if (typeof submitData.icon === 'string') {
            const mediaId = parseInt(submitData.icon);
            if (!isNaN(mediaId) && mediaId > 0) {
              submitData.iconId = mediaId;
              delete submitData.icon;
            } else {
              delete submitData.icon;
            }
          } else if (typeof submitData.icon === 'number' && submitData.icon > 0) {
            submitData.iconId = submitData.icon;
            delete submitData.icon;
          } else {
            delete submitData.icon;
          }
        }
        // Clean up iconId if it's empty or invalid
        if (submitData.iconId === '' || submitData.iconId === null || submitData.iconId === undefined) {
          delete submitData.iconId;
        }

        // Handle banner/image - prioritize bannerId if already set
        if (submitData.bannerId !== undefined && submitData.bannerId !== null && submitData.bannerId !== '') {
          // bannerId is already set, ensure it's a number
          if (typeof submitData.bannerId === 'string') {
            const mediaId = parseInt(submitData.bannerId);
            if (!isNaN(mediaId) && mediaId > 0) {
              submitData.bannerId = mediaId;
            } else {
              delete submitData.bannerId;
            }
          } else if (typeof submitData.bannerId === 'number' && submitData.bannerId > 0) {
            // bannerId is already a valid number, keep it
          } else {
            delete submitData.bannerId;
          }
          // Clean up banner and image fields
          delete submitData.banner;
          delete submitData.image;
          delete submitData.imageId;
        } else if (submitData.banner || submitData.image || submitData.imageId) {
          // Process banner/image if bannerId is not set
          const bannerValue = submitData.banner || submitData.image || submitData.imageId;
          if (typeof bannerValue === 'string') {
            const mediaId = parseInt(bannerValue);
            if (!isNaN(mediaId) && mediaId > 0) {
              submitData.bannerId = mediaId;
            }
            // Clean up all banner/image fields
            delete submitData.banner;
            delete submitData.image;
            delete submitData.imageId;
          } else if (typeof bannerValue === 'number' && bannerValue > 0) {
            submitData.bannerId = bannerValue;
            delete submitData.banner;
            delete submitData.image;
            delete submitData.imageId;
          } else {
            // Invalid value, clean up
            delete submitData.banner;
            delete submitData.image;
            delete submitData.bannerId;
            delete submitData.imageId;
          }
        } else {
          // No banner data provided, ensure bannerId is not set
          delete submitData.banner;
          delete submitData.image;
          delete submitData.bannerId;
          delete submitData.imageId;
        }
      }

      if (currentEntityType === 'gallery-album' && (submitData.coverImage || submitData.coverImageId)) {
        if (submitData.coverImage) {
          if (typeof submitData.coverImage === 'string') {
            const mediaId = parseInt(submitData.coverImage);
            if (!isNaN(mediaId)) {
              submitData.coverImageId = mediaId;
            }
          } else if (typeof submitData.coverImage === 'number') {
            submitData.coverImageId = submitData.coverImage;
          }
          delete submitData.coverImage;
        }
      }

      if (currentEntityType === 'gallery-event' && (submitData.coverImage || submitData.coverImageId)) {
        if (submitData.coverImage) {
          if (typeof submitData.coverImage === 'string') {
            const mediaId = parseInt(submitData.coverImage);
            if (!isNaN(mediaId)) {
              submitData.coverImageId = mediaId;
            }
          } else if (typeof submitData.coverImage === 'number') {
            submitData.coverImageId = submitData.coverImage;
          }
          delete submitData.coverImage;
        }
      }

      if (currentEntityType === 'gallery-image' && (submitData.image || submitData.imageId)) {
        if (submitData.image) {
          if (typeof submitData.image === 'string') {
            const mediaId = parseInt(submitData.image);
            if (!isNaN(mediaId)) {
              submitData.imageId = mediaId;
            }
          } else if (typeof submitData.image === 'number') {
            submitData.imageId = submitData.image;
          }
          delete submitData.image;
        }
      }

      if (currentEntityType === 'global-setting' && submitData.image) {
        if (typeof submitData.image === 'string') {
          const mediaId = parseInt(submitData.image);
          if (!isNaN(mediaId)) {
            submitData.imageId = mediaId;
            delete submitData.image;
          }
        } else if (typeof submitData.image === 'number') {
          submitData.imageId = submitData.image;
          delete submitData.image;
        }
      }

      if (currentEntityType === 'award') {
        // Ensure showAwardName is explicitly included (even if false)
        if (submitData.showAwardName === undefined) {
          submitData.showAwardName = true; // Default to true if not set
        }
        
        if (submitData.image) {
          if (typeof submitData.image === 'string') {
            const mediaId = parseInt(submitData.image);
            if (!isNaN(mediaId)) {
              submitData.imageId = mediaId;
              delete submitData.image;
            }
          } else if (typeof submitData.image === 'number') {
            submitData.imageId = submitData.image;
            delete submitData.image;
          }
        }
      }

      if (currentEntityType === 'core-value' && submitData.icon) {
        if (typeof submitData.icon === 'string') {
          const mediaId = parseInt(submitData.icon);
          if (!isNaN(mediaId)) {
            submitData.iconId = mediaId;
            delete submitData.icon;
          }
        } else if (typeof submitData.icon === 'number') {
          submitData.iconId = submitData.icon;
          delete submitData.icon;
        }
      }

      // Handle section content updates
      if (currentEntityType?.startsWith('section-content-')) {
        try {
          const entitySectionKey = currentEntityType.replace('section-content-', '');
          // editingItem could be the section object or the content item
          // If it's a content item, we need to get the section from formData._section
          let section = editingItem;

          // If editingItem has contentKey, it's a content item, not a section
          // Check if section is stored in formData._section (set by handleEditSectionContent)
          if (editingItem?.contentKey && !editingItem?.sectionKey) {
            if (formData._section) {
              section = formData._section;
            } else if (formData.sectionId) {
              // Fallback: use sectionId if _section not available
              section = { id: formData.sectionId };
            } else {
              throw new Error('Section not found. Please refresh and try again.');
            }
          }

          if (!section?.id) {
            throw new Error('Section not found');
          }

          // Fetch fresh section data to ensure we have the latest content
          try {
            const freshSection = await sectionsService.getById(section.id);
            if (freshSection) {
              section = freshSection;
              console.log('Using fresh section data for save:', freshSection);
            }
          } catch (fetchError) {
            console.warn('Could not fetch fresh section data, using cached:', fetchError);
            // Continue with existing section if fetch fails
          }

          // Prepare content updates
          const contentUpdates: any[] = [];

          // Handle image fields - convert to media IDs
          const imageFields: { [key: string]: string[] } = {
            'hero': ['backgroundImage'],
            'hero-capital': ['backgroundImage'],
            'hero-airports': ['backgroundImage'],
            'hero-section': ['backgroundImage', 'image'],
            'intro': ['image', 'logo'],
            'championing-change': ['backgroundPattern'],
            'sustainability-report': ['backgroundImage'],
            'sdg': ['image'],
            'about': ['image', 'logo'],
            'about-capital': ['image', 'logo'],
            'about-us': ['image'],
            'careers': ['image'],
            'overview': ['image', 'backgroundImage', 'logo'],
            'hero-contact': ['backgroundImage'],
            'hero-diversity': ['backgroundImage'],
            'hero-careers': ['backgroundImage'],
            'hero-renewables': ['backgroundImage'],
            'be-you': ['image'],
            'life-refexian': ['image'],
            'video': ['coverImage'],
            'application-form': ['backgroundImage'],
            'featured-projects': ['backgroundImage', 'sunIcon'],
            'cta-renewables': ['backgroundImage'],
            'cta-section': ['backgroundImage'],
            'cta-capital': ['image'],
            'cta': ['backgroundImage'],
            'areas-of-interest': ['backgroundImage'],
            'contact-form': ['mapImage'],
            'cta-contact': [],
            'cta-diversity': [],
            'cta-careers': [],
            'solutions': ['image', 'backgroundImage'],
            'services': ['image', 'backgroundImage'],
            'projects': ['image', 'backgroundImage'],
            'investment-focus': ['image', 'backgroundImage'],
            'wind-energy': ['image', 'backgroundImage'],
            'fleet': ['image', 'backgroundImage'],
            'products': ['image', 'backgroundImage'],
            'manufacturing': ['image', 'backgroundImage'],
            'quality': ['image', 'backgroundImage'],
            'r-and-d': ['image', 'backgroundImage'],
            'certifications': ['image', 'backgroundImage'],
            'plant-capabilities': ['image', 'backgroundImage'],
            'technology': ['image', 'backgroundImage'],
            'applications': ['image', 'backgroundImage'],
            'gallery': ['image', 'backgroundImage'],
            'sustainability': ['image', 'backgroundImage'],
            'our-commitment': ['image', 'backgroundImage'],
            'initiatives': ['image', 'backgroundImage'],
            'quality-assurance': ['image', 'backgroundImage'],

            'mission-vision': ['backgroundImage', 'missionIcon', 'visionIcon'],
            'story': ['timelineImage'],
            'careers-cta': ['backgroundImage'],

            'corevalues': ['patternImage'],
            'core-values': ['patternImage'],
            'message-anil-jain': ['image'],
            'listed-companies': [],

            // Venwind sections
            'specialities': ['image'],
            'stats': ['image'],
            'unique': ['image'],
            'technical-specs': ['image'],
            'cta-venwind': ['backgroundImage']
          };

          // Use the actual section key from the section object, not the entity type
          // This ensures we use the correct key (e.g., 'hero' instead of 'hero-renewables')
          let sectionKey = section.sectionKey || entitySectionKey;
          console.log(`Initial sectionKey: ${sectionKey}, entitySectionKey: ${entitySectionKey}`);

          // Normalize section key to extract base type (e.g., 'hero-newsroom' -> 'hero', 'cta-contact' -> 'cta')
          // This handles cases where entity types have page-specific suffixes
          if (sectionKey && sectionKey.includes('-')) {
            const baseKey = sectionKey.split('-')[0];
            console.log(`Normalizing sectionKey: ${sectionKey} -> baseKey: ${baseKey}, imageFields[${baseKey}]:`, imageFields[baseKey]);
            // Check if base key exists in imageFields, if so use it
            if (imageFields[baseKey] !== undefined) {
              sectionKey = baseKey;
              console.log(`Using normalized sectionKey: ${sectionKey}`);
            }
          }
          console.log(`Final sectionKey for processing: ${sectionKey}, imageFields[${sectionKey}]:`, imageFields[sectionKey]);

          // First, collect all positioning fields to ensure they're saved even if image doesn't change
          const positioningUpdates: any = {};

          for (const [key, value] of Object.entries(submitData)) {
            if (key === 'sectionId' || key === '_section') continue; // Skip internal fields

            // Collect positioning fields
            if (key === 'backgroundPositionX' || key === 'backgroundPositionY') {
              positioningUpdates[key] = value;
            }
          }

          for (const [key, value] of Object.entries(submitData)) {
            if (key === 'sectionId' || key === '_section') continue; // Skip internal fields

            // Map field names that end with "Id" to their base name (e.g., backgroundImageId -> backgroundImage)
            // This handles cases where formData has backgroundImageId but the content item is backgroundImage
            let actualKey = key;
            if (key.endsWith('Id') && key !== 'id' && key !== 'mediaId') {
              const baseKey = key.slice(0, -2); // Remove "Id" suffix
              // Check if the base key exists in imageFields or is a common image field
              const sectionImageFields = imageFields[sectionKey] || [];
              const commonImageFields = ['backgroundImage', 'image', 'icon', 'logo', 'image1', 'image2', 'imageBottom', 'logoImage', 'patternImage', 'timelineImage'];
              if (sectionImageFields.includes(baseKey) || commonImageFields.includes(baseKey)) {
                // Skip if the base key already exists in submitData (to avoid processing both)
                if (submitData[baseKey] !== undefined) {
                  console.log(`Skipping ${key} because ${baseKey} already exists in submitData`);
                  continue;
                }
                actualKey = baseKey;
                console.log(`Mapped field ${key} -> ${actualKey}`);
              }
            }

            // Check if this is an image field that needs media ID conversion
            const sectionImageFields = imageFields[sectionKey] || [];

            // Also check common image field names as fallback
            const commonImageFields = ['backgroundImage', 'image', 'icon', 'logo', 'image1', 'image2', 'imageBottom', 'logoImage', 'patternImage', 'timelineImage', 'coverImage', 'missionIcon', 'visionIcon'];
            const isCommonImageField = commonImageFields.includes(actualKey);
            const isImageField = sectionImageFields.includes(actualKey) || isCommonImageField;

            // Also check if value is a number (likely a mediaId) and key looks like an image field
            const looksLikeImageField = (typeof value === 'number' && value > 0) &&
              (actualKey.toLowerCase().includes('image') || actualKey.toLowerCase().includes('icon') || actualKey.toLowerCase().includes('logo'));
            const finalIsImageField = isImageField || looksLikeImageField;

            console.log(`Field ${key} (actualKey: ${actualKey}): sectionKey=${sectionKey}, sectionImageFields=`, sectionImageFields, `isImageField=${isImageField}, looksLikeImageField=${looksLikeImageField}, finalIsImageField=${finalIsImageField}, value type=${typeof value}, value=`, value);

            if (finalIsImageField && value) {
              let mediaId: number | null = null;
              let isUrlOrPath = false;

              if (typeof value === 'string') {
                // Check if it's a URL or path (starts with http, https, or /)
                if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
                  isUrlOrPath = true;
                } else {
                  // Try to parse as number (mediaId)
                  mediaId = parseInt(value);
                  if (isNaN(mediaId) || mediaId <= 0) {
                    mediaId = null;
                    // If it's not a number and not a URL, it might be a path string
                    if (value.trim() !== '') {
                      isUrlOrPath = true;
                    }
                  }
                }
              } else if (typeof value === 'number' && value > 0) {
                mediaId = value;
              }

              console.log(`Image field ${key}: mediaId=${mediaId}, isUrlOrPath=${isUrlOrPath}`);

              // If it's a URL or path string, save it as regular text content
              if (isUrlOrPath && typeof value === 'string') {
                const existingContent = section.content?.find((c: any) => c.contentKey === actualKey);
                if (existingContent && existingContent.id) {
                  contentUpdates.push({
                    id: existingContent.id,
                    contentValue: value,
                    contentType: 'text',
                    mediaId: null // Clear mediaId if it was set before
                  });
                } else {
                  contentUpdates.push({
                    sectionId: section.id,
                    contentKey: actualKey, // Use actualKey instead of key
                    contentValue: value,
                    contentType: 'text',
                    mediaId: null
                  });
                }
                continue; // Skip to next field
              }

              if (mediaId) {
                // Find existing content item or create new - use actualKey for lookup
                const existingContent = section.content?.find((c: any) => c.contentKey === actualKey);

                // Fetch media filePath to store in contentValue for better reliability
                // This ensures the image can be displayed even if media relationship isn't loaded
                let mediaFilePath = `/uploads/media/${mediaId}`; // Default fallback
                try {
                  const { mediaService } = await import('../../services/apiService');
                  const media = await mediaService.getById(mediaId);
                  if (media?.filePath) {
                    mediaFilePath = media.filePath;
                  } else if (media?.url) {
                    mediaFilePath = media.url;
                  } else if (media?.data?.filePath) {
                    mediaFilePath = media.data.filePath;
                  } else if (media?.data?.url) {
                    mediaFilePath = media.data.url;
                  }
                  console.log(`Fetched media filePath for mediaId ${mediaId}:`, mediaFilePath);
                } catch (mediaError) {
                  console.warn('Could not fetch media filePath, using default:', mediaError);
                  // Use default path - this should still work if media exists
                }

                // Get positioning values if they exist
                const positionXKey = `${key}PositionX`;
                const positionYKey = `${key}PositionY`;
                const positionX = submitData[positionXKey] !== undefined && submitData[positionXKey] !== null && submitData[positionXKey] !== ''
                  ? String(submitData[positionXKey])
                  : (submitData.backgroundPositionX !== undefined && submitData.backgroundPositionX !== null && submitData.backgroundPositionX !== ''
                    ? String(submitData.backgroundPositionX)
                    : (existingContent?.backgroundPositionX !== undefined && existingContent.backgroundPositionX !== null
                      ? String(existingContent.backgroundPositionX)
                      : '50'));
                const positionY = submitData[positionYKey] !== undefined && submitData[positionYKey] !== null && submitData[positionYKey] !== ''
                  ? String(submitData[positionYKey])
                  : (submitData.backgroundPositionY !== undefined && submitData.backgroundPositionY !== null && submitData.backgroundPositionY !== ''
                    ? String(submitData.backgroundPositionY)
                    : (existingContent?.backgroundPositionY !== undefined && existingContent.backgroundPositionY !== null
                      ? String(existingContent.backgroundPositionY)
                      : '50'));

                if (existingContent && existingContent.id) {
                  const updateEntry: any = {
                    id: existingContent.id,
                    contentValue: mediaFilePath, // Store actual file path from media record
                    mediaId: mediaId,
                    contentType: 'text' // Ensure contentType is set
                  };

                  console.log(`Updating existing backgroundImage content (id: ${existingContent.id}) with:`, {
                    contentValue: mediaFilePath,
                    mediaId: mediaId
                  });

                  // Always add positioning fields (even if '50' - user might want to reset to center)
                  updateEntry.backgroundPositionX = positionX;
                  updateEntry.backgroundPositionY = positionY;

                  contentUpdates.push(updateEntry);

                  // Also create separate content items for positioning to ensure they're saved
                  // This is a fallback in case the backend doesn't support these fields on the main content item
                  // Use actualKey for positioning field names
                  const posXContent = section.content?.find((c: any) => c.contentKey === `${actualKey}PositionX`);
                  if (posXContent && posXContent.id) {
                    contentUpdates.push({
                      id: posXContent.id,
                      contentValue: positionX
                    });
                  } else {
                    contentUpdates.push({
                      sectionId: section.id,
                      contentKey: `${actualKey}PositionX`,
                      contentValue: positionX,
                      contentType: 'text'
                    });
                  }

                  const posYContent = section.content?.find((c: any) => c.contentKey === `${actualKey}PositionY`);
                  if (posYContent && posYContent.id) {
                    contentUpdates.push({
                      id: posYContent.id,
                      contentValue: positionY
                    });
                  } else {
                    contentUpdates.push({
                      sectionId: section.id,
                      contentKey: `${actualKey}PositionY`,
                      contentValue: positionY,
                      contentType: 'text'
                    });
                  }
                } else {
                  // Create new content item - use actualKey for contentKey
                  console.log(`Creating new ${actualKey} content for section ${section.id} with:`, {
                    contentKey: actualKey,
                    contentValue: mediaFilePath,
                    mediaId: mediaId
                  });

                  const newEntry: any = {
                    sectionId: section.id,
                    contentKey: actualKey, // Use actualKey (e.g., 'backgroundImage' instead of 'backgroundImageId')
                    contentValue: mediaFilePath, // Store actual file path from media record
                    contentType: 'text',
                    mediaId: mediaId
                  };

                  // Always add positioning fields
                  newEntry.backgroundPositionX = positionX;
                  newEntry.backgroundPositionY = positionY;

                  contentUpdates.push(newEntry);

                  // Also create separate content items for positioning
                  contentUpdates.push({
                    sectionId: section.id,
                    contentKey: `${key}PositionX`,
                    contentValue: positionX,
                    contentType: 'text'
                  });

                  contentUpdates.push({
                    sectionId: section.id,
                    contentKey: `${key}PositionY`,
                    contentValue: positionY,
                    contentType: 'text'
                  });
                }
              }
            } else if (key === 'backgroundPositionX' || key === 'backgroundPositionY' || key === 'imagePositionX' || key === 'imagePositionY' || key.endsWith('PositionX') || key.endsWith('PositionY')) {
              // Always save positioning fields as separate content items (not as properties of image content)
              // This ensures they persist correctly and can be loaded independently
              const existingPositionContent = section.content?.find((c: any) => c.contentKey === key);
              
              if (existingPositionContent && existingPositionContent.id) {
                // Update existing positioning content item
                const updateIndex = contentUpdates.findIndex((u: any) => u.id === existingPositionContent.id);
                if (updateIndex >= 0) {
                  contentUpdates[updateIndex].contentValue = String(value);
              } else {
                  contentUpdates.push({
                    id: existingPositionContent.id,
                    contentValue: String(value),
                    contentType: 'text'
                  });
                }
                  } else {
                // Create new content item for positioning
                    contentUpdates.push({
                  sectionId: section.id,
                  contentKey: key,
                  contentValue: String(value),
                  contentType: 'text'
                });
              }
            } else {
              // Check if this is a document mediaId field that needs to be resolved to filePath
              let resolvedMediaId: number | null = null;
              let contentValueToUse: any = value;
              if (key.endsWith('MediaId') && typeof value === 'number') {
                // Resolve mediaId to filePath
                try {
                  const { mediaService } = await import('../../services/apiService');
                  const media = await mediaService.getById(value);
                  if (media?.filePath) {
                    resolvedMediaId = value; // Store the original mediaId
                    // Update the corresponding URL field (e.g., qualityPolicyMediaId -> qualityPolicyUrl)
                    const urlField = key.replace('MediaId', 'Url');
                    submitData[urlField] = media.filePath;
                    // Use the URL field for contentValue instead of mediaId
                    actualKey = urlField;
                    contentValueToUse = media.filePath;
                  }
                } catch (err) {
                  console.warn(`Could not resolve mediaId ${value} to filePath for ${key}:`, err);
                }
              }

              // Regular text or JSON content - use actualKey for lookup
              const existingContent = section.content?.find((c: any) => c.contentKey === actualKey);

              // Known JSON fields that should always be treated as JSON
              const jsonFields = [
                'content', 'beliefs', 'features', 'cards', 'images', 'sliderImages',
                'vamika', 'kravMaga', 'pillars', 'tabs', 'coreValues', 'companies',
                'address', 'timeline', 'items', 'stats', 'specs', 'logos', 'paragraphs',
                'capabilities', 'formulationsFacilities', 'rlfcCapabilities', 'oncologyFacilities', 'approvals',
                'solutions', 'leftCards', 'rightCards', 'advantages', 'bullets',
                'areas', 'factors', 'portfolioLogos',
                'commitments', 'specialities', 'products', 'certifications', 'clientLogos',
                'tab1Items', 'tab2Items',
                'categories', 'benefits', 'projects' // Added for Renewables page
              ];

              // Determine content type - check if it's an object, or if existing content was JSON, or if it's a known JSON field
              let contentType: string = 'text';
              let contentValue: string;

              if (typeof contentValueToUse === 'object' || Array.isArray(contentValueToUse)) {
                // Process URLs in nested objects/arrays before stringifying
                const processedValue = await processNestedUrls(contentValueToUse, key, pageName, sectionName);
                contentType = 'json';
                contentValue = JSON.stringify(processedValue);
              } else if (jsonFields.includes(key) || existingContent?.contentType === 'json') {
                // Known JSON fields or existing JSON content
                contentType = 'json';
                const stringValue = String(contentValueToUse);
                // Try to parse to validate it's JSON, if not valid, try to stringify it
                try {
                  JSON.parse(stringValue);
                  contentValue = stringValue;
                } catch {
                  // If it's not valid JSON, wrap it as a JSON string
                  contentValue = JSON.stringify(stringValue);
                }
              } else {
                // Regular text content
                const stringValue = String(contentValueToUse);
                // Only treat as JSON if it's a valid JSON string that starts with [ or {
                try {
                  const parsed = JSON.parse(stringValue);
                  if (typeof parsed === 'object' && (stringValue.trim().startsWith('[') || stringValue.trim().startsWith('{'))) {
                    contentType = 'json';
                    contentValue = stringValue;
                  } else {
                    contentValue = stringValue;
                  }
                } catch {
                  // Not JSON, keep as text
                  contentValue = stringValue;
                }
              }

              if (existingContent && existingContent.id) {
                // Update existing content item
                const updateEntry: any = {
                  id: existingContent.id,
                  contentValue: contentValue,
                  contentType: contentType
                };
                // Store mediaId if it was resolved from a MediaId field
                if (resolvedMediaId !== null) {
                  updateEntry.mediaId = resolvedMediaId;
                }
                contentUpdates.push(updateEntry);
              } else {
                // Create new content item (no id means it doesn't exist yet) - use actualKey
                const newEntry: any = {
                  sectionId: section.id,
                  contentKey: actualKey, // Use actualKey instead of key
                  contentValue: contentValue,
                  contentType: contentType
                };
                // Store mediaId if it was resolved from a MediaId field
                if (resolvedMediaId !== null) {
                  newEntry.mediaId = resolvedMediaId;
                }
                contentUpdates.push(newEntry);
              }
            }
          }

          // Handle positioning updates for existing image content items (even if image didn't change)
          if (Object.keys(positioningUpdates).length > 0) {
            const sectionImageFields = imageFields[sectionKey] || [];
            for (const imageField of sectionImageFields) {
              const existingContent = section.content?.find((c: any) => c.contentKey === imageField);
              if (existingContent && existingContent.id) {
                // Check if we already have an update for this content item
                const existingUpdateIndex = contentUpdates.findIndex((u: any) => u.id === existingContent.id);

                if (existingUpdateIndex >= 0) {
                  // Update existing entry with positioning
                  if (positioningUpdates.backgroundPositionX !== undefined) {
                    contentUpdates[existingUpdateIndex].backgroundPositionX = String(positioningUpdates.backgroundPositionX);
                  }
                  if (positioningUpdates.backgroundPositionY !== undefined) {
                    contentUpdates[existingUpdateIndex].backgroundPositionY = String(positioningUpdates.backgroundPositionY);
                  }
                } else {
                  // Create new update entry just for positioning
                  const positionUpdate: any = { id: existingContent.id };
                  if (positioningUpdates.backgroundPositionX !== undefined && positioningUpdates.backgroundPositionX !== null && positioningUpdates.backgroundPositionX !== '') {
                    positionUpdate.backgroundPositionX = String(positioningUpdates.backgroundPositionX);
                  }
                  if (positioningUpdates.backgroundPositionY !== undefined && positioningUpdates.backgroundPositionY !== null && positioningUpdates.backgroundPositionY !== '') {
                    positionUpdate.backgroundPositionY = String(positioningUpdates.backgroundPositionY);
                  }
                  if (Object.keys(positionUpdate).length > 1) { // More than just id
                    contentUpdates.push(positionUpdate);
                  }

                  // Also save as separate content items for reliability
                  if (positioningUpdates.backgroundPositionX !== undefined && positioningUpdates.backgroundPositionX !== null && positioningUpdates.backgroundPositionX !== '') {
                    const posXContent = section.content?.find((c: any) => c.contentKey === `${imageField}PositionX`);
                    if (posXContent && posXContent.id) {
                      contentUpdates.push({
                        id: posXContent.id,
                        contentValue: String(positioningUpdates.backgroundPositionX)
                      });
                    } else {
                      contentUpdates.push({
                        sectionId: section.id,
                        contentKey: `${imageField}PositionX`,
                        contentValue: String(positioningUpdates.backgroundPositionX),
                        contentType: 'text'
                      });
                    }
                  }

                  if (positioningUpdates.backgroundPositionY !== undefined && positioningUpdates.backgroundPositionY !== null && positioningUpdates.backgroundPositionY !== '') {
                    const posYContent = section.content?.find((c: any) => c.contentKey === `${imageField}PositionY`);
                    if (posYContent && posYContent.id) {
                      contentUpdates.push({
                        id: posYContent.id,
                        contentValue: String(positioningUpdates.backgroundPositionY)
                      });
                    } else {
                      contentUpdates.push({
                        sectionId: section.id,
                        contentKey: `${imageField}PositionY`,
                        contentValue: String(positioningUpdates.backgroundPositionY),
                        contentType: 'text'
                      });
                    }
                  }
                }
              }
            }
          }

          // Debug: Log what we're sending
          console.log('Content updates being sent:', JSON.stringify(contentUpdates, null, 2));

          // Check if backgroundImage update is included
          const bgImageUpdate = contentUpdates.find((u: any) =>
            u.contentKey === 'backgroundImage' ||
            (u.id && section.content?.find((c: any) => c.id === u.id && c.contentKey === 'backgroundImage'))
          );
          if (bgImageUpdate) {
            console.log('✅ BackgroundImage update found:', bgImageUpdate);
          } else {
            console.warn('⚠️ BackgroundImage update NOT found in contentUpdates!');
            console.log('Available updates:', contentUpdates.map((u: any) => ({
              id: u.id,
              contentKey: u.contentKey,
              hasMediaId: 'mediaId' in u,
              contentValue: u.contentValue
            })));
            // Check if there's a backgroundImageId update that should have been mapped
            const bgImageIdUpdate = contentUpdates.find((u: any) => u.contentKey === 'backgroundImageId' || u.contentKey?.includes('backgroundImage'));
            if (bgImageIdUpdate) {
              console.warn('Found backgroundImageId update that should have been mapped to backgroundImage:', bgImageIdUpdate);
            }
          }

          // Use bulk update for section content
          const updateResult = await sectionContentService.bulkUpdate(contentUpdates);
          console.log('Bulk update result:', updateResult);

          // Success - close modal and refresh
          setShowModal(false);
          setFormData({});
          setFormErrors({});
          setEditingItem(null);

          // Trigger refresh in the active CMS component
          window.dispatchEvent(new Event('cms-refresh'));

          // Show success notification
          showNotification(
            modalType === 'add'
              ? 'Content created successfully!'
              : 'Content updated successfully!',
            'success'
          );

          setSubmitting(false);
          return;
        } catch (error: any) {
          console.error('Section content update error:', error);
          setSubmitError(error.message || 'Failed to save content. Please try again.');
          showNotification(error.message || 'Failed to save content. Please try again.', 'error');
          setSubmitting(false);
          return;
        }
      }

      // Handle three-pillar-card (updates JSON array in section content)
      if (currentEntityType === 'three-pillar-card') {
        console.log('🔵 Three-pillar-card submit - submitData:', submitData);
        console.log('🔵 Three-pillar-card submit - submitData.image:', submitData.image);
        console.log('🔵 Three-pillar-card submit - submitData.imageId:', submitData.imageId);
        
        const pillarsSection = editingItem?.section || editingItem; // Get the section
        if (!pillarsSection?.id) {
          throw new Error('Pillars section not found');
        }

        // Get current pillars
        const pillarsContent = pillarsSection.content?.find((c: any) => c.contentKey === 'pillars');
        let pillars: any[] = [];

        if (pillarsContent && pillarsContent.contentType === 'json') {
          try {
            pillars = JSON.parse(pillarsContent.contentValue);
          } catch {
            pillars = [];
          }
        }

        // Convert image value to storage format
        // Store media ID as number for better compatibility with ImageUpload on edit
        // ImageUpload passes either: number (media ID) or string (path/URL)
        // Check both submitData.image and submitData.imageId (in case image processing ran)
        const imageValue = submitData.image !== undefined ? submitData.image : (submitData.imageId !== undefined ? submitData.imageId : null);
        let imageForStorage: string | number = '';
        
        console.log('🔵 Three-pillar-card - imageValue:', imageValue);
        
        if (imageValue !== undefined && imageValue !== null && imageValue !== '') {
          if (typeof imageValue === 'number' && imageValue > 0) {
            // Media ID from ImageUpload - store as number (media ID) for easy editing
            imageForStorage = imageValue;
            console.log('🔵 Three-pillar-card - storing as media ID:', imageForStorage);
          } else if (typeof imageValue === 'string') {
            const imageStr = imageValue.trim();
            if (imageStr === '') {
              imageForStorage = '';
            } else if (imageStr.startsWith('/uploads/media/')) {
              // Extract media ID from /uploads/media/{id} format and store as number
              const mediaIdMatch = imageStr.match(/\/uploads\/media\/(\d+)/);
              if (mediaIdMatch) {
                imageForStorage = parseInt(mediaIdMatch[1]);
                console.log('🔵 Three-pillar-card - extracted media ID from path:', imageForStorage);
            } else {
                imageForStorage = imageStr; // Keep as string if can't extract
              }
            } else if (imageStr.startsWith('/uploads/images/') || 
                       imageStr.startsWith('http://') || 
                       imageStr.startsWith('https://')) {
              // Direct path or URL - keep as string
              imageForStorage = imageStr;
              console.log('🔵 Three-pillar-card - storing as direct path:', imageForStorage);
            } else if (/^\d+$/.test(imageStr)) {
              // Numeric string (media ID as string) - convert to number
              imageForStorage = parseInt(imageStr);
              console.log('🔵 Three-pillar-card - converted string to media ID:', imageForStorage);
            } else {
              // Other string - keep as-is
              imageForStorage = imageStr;
              }
            }
        } else {
          console.log('🔵 Three-pillar-card - no image value provided');
        }
        
        console.log('🔵 Three-pillar-card - final imageForStorage:', imageForStorage);

        if (modalType === 'add') {
          // Add new pillar with unique ID
          const newPillar = {
            id: `pillar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: submitData.title || '',
            description: submitData.description || '',
            image: imageForStorage,
            link: submitData.link || '',
            order: submitData.order !== undefined ? submitData.order : pillars.length,
            orderIndex: submitData.orderIndex !== undefined ? submitData.orderIndex : pillars.length
          };
          pillars.push(newPillar);
        } else {
          // Update existing pillar
          const index = editingItem.index !== undefined ? editingItem.index : pillars.findIndex((p: any) => (p.id === editingItem.id) || (p.title === editingItem.title));
          if (index >= 0) {
            pillars[index] = {
              ...pillars[index], // Preserve existing data like id
              title: submitData.title !== undefined ? submitData.title : pillars[index].title,
              description: submitData.description !== undefined ? submitData.description : pillars[index].description,
              image: imageForStorage || pillars[index].image || '', // Use new image or keep existing
              link: submitData.link !== undefined ? submitData.link : (pillars[index].link || ''),
              order: submitData.order !== undefined ? submitData.order : (pillars[index].order !== undefined ? pillars[index].order : index),
              orderIndex: submitData.orderIndex !== undefined ? submitData.orderIndex : (pillars[index].orderIndex !== undefined ? pillars[index].orderIndex : index)
            };
          } else {
            throw new Error('Pillar not found for update');
          }
        }

        // Sort by orderIndex
        pillars.sort((a, b) => {
          const orderA = a.orderIndex !== undefined ? a.orderIndex : (a.order !== undefined ? a.order : 0);
          const orderB = b.orderIndex !== undefined ? b.orderIndex : (b.order !== undefined ? b.order : 0);
          return orderA - orderB;
        });

        // Update section content
        if (pillarsContent) {
          await sectionContentService.update(pillarsContent.id, {
            contentValue: JSON.stringify(pillars),
            contentType: 'json'
          });
        } else {
          await sectionContentService.bulkUpdate([{
            sectionId: pillarsSection.id,
            contentKey: 'pillars',
            contentValue: JSON.stringify(pillars),
            contentType: 'json'
          }]);
        }

        // Show success notification
        showNotification(
          modalType === 'add'
            ? 'Three pillar card created successfully!'
            : 'Three pillar card updated successfully!',
          'success'
        );

        // Trigger refresh
        window.dispatchEvent(new Event('cms-refresh'));
        setShowModal(false);
        setFormData({});
        setFormErrors({});
        setEditingItem(null);
        setSubmitting(false);
        return;
      }

      // Handle policy
      if (currentEntityType === 'policy') {
        const policiesSection = editingItem?.section || (formData._section ? formData._section : null);
        let targetSection = policiesSection;

        if (!targetSection) {
          // Try to find 'policies' section in esg page
          const { sectionsService, pagesService } = await import('../../services/apiService');
          const page = await pagesService.getBySlug('esg');
          if (page) {
            const sections = await sectionsService.getByPageId(page.id);
            targetSection = sections.find((s: any) => s.sectionKey === 'policies');
          }
        }

        if (!targetSection) {
          throw new Error('Policies section not found. Please ensure the section exists.');
        }

        const policiesContent = targetSection.content?.find((c: any) => c.contentKey === 'policies');
        let policies: any[] = [];

        if (policiesContent && policiesContent.contentType === 'json') {
          try {
            policies = JSON.parse(policiesContent.contentValue);
            // Ensure all existing policies have IDs
            policies = policies.map((p: any, idx: number) => ({
              ...p,
              id: p.id || `policy-${idx}-${Date.now()}`,
              order: p.order || idx + 1
            }));
          } catch {
            policies = [];
          }
        }

        // Resolve mediaId to filePath if mediaId exists but link doesn't
        let resolvedLink = submitData.link || '';
        if (submitData.mediaId && !submitData.link) {
          try {
            const { mediaService } = await import('../../services/apiService');
            const media = await mediaService.getById(submitData.mediaId);
            if (media?.filePath) {
              resolvedLink = media.filePath;
            }
          } catch (err) {
            console.warn('Could not resolve mediaId to filePath:', err);
          }
        }

        const newPolicy = {
          id: submitData.id || (modalType === 'add' ? `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : editingItem?.id || `policy-${Date.now()}`),
          title: submitData.title,
          link: resolvedLink || submitData.link || '',
          label: submitData.label || '',
          mediaId: submitData.mediaId || null,
          order: submitData.order !== undefined ? submitData.order : (policies.length + 1)
        };

        if (modalType === 'add') {
          policies.push(newPolicy);
        } else {
          // Update existing - find by ID first, then fallback to index
          const existingIndex = policies.findIndex((p: any) => p.id === editingItem?.id || p.id === submitData.id);
          const index = existingIndex >= 0 ? existingIndex : (editingItem.index !== undefined ? editingItem.index : -1);

          if (index >= 0) {
            policies[index] = {
              ...policies[index],
              ...newPolicy,
              id: policies[index].id || newPolicy.id, // Preserve existing ID
              order: submitData.order !== undefined ? submitData.order : (policies[index].order || index + 1)
            };
          } else {
            // If not found, add as new (shouldn't happen, but handle gracefully)
            policies.push(newPolicy);
          }
        }

        // Sort by order
        policies.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Update content
        if (policiesContent) {
          await sectionContentService.update(policiesContent.id, {
            contentValue: JSON.stringify(policies),
            contentType: 'json'
          });
        } else {
          await sectionContentService.bulkUpdate([{
            sectionId: targetSection.id,
            contentKey: 'policies',
            contentValue: JSON.stringify(policies),
            contentType: 'json'
          }]);
        }

        window.dispatchEvent(new Event('cms-refresh'));
        setShowModal(false);
        setFormData({});
        setFormErrors({});
        setEditingItem(null);
        setSubmitting(false);
        return;
      }

      // Determine which service to use based on entity type
      let result;
      if (modalType === 'add') {
        switch (currentEntityType) {
          case 'hero-slide':
            result = await heroSlidesService.create(submitData);
            break;
          case 'business-card':
            result = await businessCardsService.create(submitData);
            break;
          case 'job':
            result = await jobsService.create(submitData);
            break;
          case 'testimonial':
            result = await testimonialsService.create(submitData);
            break;
          case 'newsroom':
            result = await newsroomService.create(submitData);
            break;
          case 'leader':
            result = await leadersService.create(submitData);
            break;
          case 'sdg-card':
            result = await sdgCardsService.create(submitData);
            break;
          case 'gallery-album':
            // Validate duplicate year for year-type albums
            if (submitData.albumType === 'year') {
              const existingAlbums = await galleryAlbumsService.getAll('year', false);
              const yearName = submitData.name?.trim();
              const yearSlug = submitData.slug?.trim();

              // Extract year number from name (e.g., "2026", "Year 2026", "Gallery 2026" -> "2026")
              const extractYear = (str: string): string | null => {
                if (!str) return null;
                const yearMatch = str.match(/\b(19|20)\d{2}\b/);
                return yearMatch ? yearMatch[0] : str.trim();
              };

              const newYear = extractYear(yearName || yearSlug || '');

              // Check if another album with the same year exists
              const duplicate = existingAlbums.find((album: any) => {
                if (album.id === editingItem?.id) return false; // Skip current album when editing
                if (album.albumType !== 'year') return false;

                const existingYear = extractYear(album.name || album.slug || '');
                return existingYear === newYear;
              });

              if (duplicate) {
                throw new Error(`A gallery for the year "${newYear}" already exists. Please use a different year.`);
              }
            }
            result = await galleryAlbumsService.create(submitData);
            break;
          case 'gallery-event':
            if (!submitData.albumId) {
              throw new Error('Album ID is required');
            }
            result = await galleryEventsService.create(submitData.albumId, submitData);
            break;
          case 'gallery-image':
            if (!submitData.eventId) {
              throw new Error('Event ID is required');
            }
            result = await galleryImagesService.create(submitData);
            break;
          case 'section':
            result = await sectionsService.create(submitData);
            break;
          case 'contact-info':
            result = await contactInfoService.create(submitData);
            break;
          case 'navigation':
            result = await navigationService.create(submitData);
            break;
          case 'footer-section':
            result = await footerService.createSection(submitData);
            break;
          case 'footer-settings':
            // Footer settings use key-value store in global settings
            const footerSettingsToCreate: any[] = [];
            if (submitData.logoFooterId) {
              footerSettingsToCreate.push({ key: 'logo_footer_id', value: submitData.logoFooterId, valueType: 'number' });
            }
            if (submitData.copyrightText) {
              footerSettingsToCreate.push({ key: 'copyright_text', value: submitData.copyrightText, valueType: 'string' });
            }
            if (submitData.complaintPhone) {
              footerSettingsToCreate.push({ key: 'footer_complaint_phone', value: submitData.complaintPhone, valueType: 'string' });
            }
            if (submitData.complaintEmail) {
              footerSettingsToCreate.push({ key: 'footer_complaint_email', value: submitData.complaintEmail, valueType: 'string' });
            }
            if (submitData.privacyPolicyUrl) {
              footerSettingsToCreate.push({ key: 'footer_privacy_policy_url', value: submitData.privacyPolicyUrl, valueType: 'string' });
            }
            if (submitData.termsOfUseUrl) {
              footerSettingsToCreate.push({ key: 'footer_terms_of_use_url', value: submitData.termsOfUseUrl, valueType: 'string' });
            }
            // Create or update each setting
            for (const setting of footerSettingsToCreate) {
              try {
                await globalSettingsService.update(setting.key, { value: setting.value, valueType: setting.valueType });
              } catch {
                await globalSettingsService.create(setting);
              }
            }
            result = { success: true };
            break;
          case 'social-link':
            result = await socialLinksService.create(submitData);
            break;
          case 'global-setting':
            if (!submitData.key) {
              throw new Error('Setting key is required');
            }
            // Map form type to backend valueType
            let valueType = 'string';
            if (submitData.type === 'number') valueType = 'number';
            else if (submitData.type === 'boolean') valueType = 'boolean';
            else if (submitData.type === 'json') valueType = 'json';
            // 'text', 'url', 'image' all map to 'string'

            // Handle image type - convert media ID to path
            let value = submitData.value;
            if (submitData.type === 'image' && submitData.image) {
              if (typeof submitData.image === 'string') {
                const mediaId = parseInt(submitData.image);
                if (!isNaN(mediaId)) {
                  value = `/uploads/media/${mediaId}`;
                }
              } else if (typeof submitData.image === 'number') {
                value = `/uploads/media/${submitData.image}`;
              }
            }

            result = await globalSettingsService.create({
              key: submitData.key,
              value: value,
              valueType: valueType
            });
            break;
          case 'award':
            // Ensure showAwardName is explicitly included (even if false)
            const awardCreateData = { ...submitData };
            // Explicitly ensure boolean type - preserve false, default to true if undefined
            if (awardCreateData.showAwardName === undefined || awardCreateData.showAwardName === null) {
              awardCreateData.showAwardName = true;
            } else {
              awardCreateData.showAwardName = Boolean(awardCreateData.showAwardName);
            }
            result = await awardsService.create(awardCreateData);
            break;
          case 'core-value':
            result = await coreValuesService.create(submitData);
            break;
          case 'home-cta-section':
            result = await homeCTASectionService.create(submitData);
            break;
          default:
            throw new Error(`Unknown entity type: ${currentEntityType}`);
        }
      } else {
        // Edit mode
        if (!editingItem?.id && currentEntityType !== 'global-setting') {
          throw new Error('No item selected for editing');
        }

        switch (currentEntityType) {
          case 'hero-slide':
            result = await heroSlidesService.update(editingItem.id, submitData);
            break;
          case 'business-card':
            result = await businessCardsService.update(editingItem.id, submitData);
            break;
          case 'job':
            result = await jobsService.update(editingItem.id, submitData);
            break;
          case 'testimonial':
            result = await testimonialsService.update(editingItem.id, submitData);
            break;
          case 'newsroom':
            result = await newsroomService.update(editingItem.id, submitData);
            break;
          case 'leader':
            result = await leadersService.update(editingItem.id, submitData);
            break;
          case 'sdg-card':
            result = await sdgCardsService.update(editingItem.id, submitData);
            break;
          case 'gallery-album':
            // Validate duplicate year for year-type albums
            if (submitData.albumType === 'year') {
              const existingAlbums = await galleryAlbumsService.getAll('year', false);
              const yearName = submitData.name?.trim();
              const yearSlug = submitData.slug?.trim();

              // Extract year number from name (e.g., "2026", "Year 2026", "Gallery 2026" -> "2026")
              const extractYear = (str: string): string | null => {
                if (!str) return null;
                const yearMatch = str.match(/\b(19|20)\d{2}\b/);
                return yearMatch ? yearMatch[0] : str.trim();
              };

              const newYear = extractYear(yearName || yearSlug || '');

              // Check if another album with the same year exists (excluding current album)
              const duplicate = existingAlbums.find((album: any) => {
                if (album.id === editingItem?.id) return false; // Skip current album
                if (album.albumType !== 'year') return false;

                const existingYear = extractYear(album.name || album.slug || '');
                return existingYear === newYear;
              });

              if (duplicate) {
                throw new Error(`A gallery for the year "${newYear}" already exists. Please use a different year.`);
              }
            }
            result = await galleryAlbumsService.update(editingItem.id, submitData);
            break;
          case 'gallery-event':
            result = await galleryEventsService.update(editingItem.id, submitData);
            break;
          case 'gallery-image':
            result = await galleryImagesService.update(editingItem.id, submitData);
            break;
          case 'section':
            result = await sectionsService.update(editingItem.id, submitData);
            break;
          case 'contact-info':
            result = await contactInfoService.update(editingItem.id, submitData);
            break;
          case 'navigation':
            result = await navigationService.update(editingItem.id, submitData);
            break;
          case 'footer-section':
            result = await footerService.updateSection(editingItem.id, submitData);
            break;
          case 'footer-settings':
            // Footer settings use key-value store in global settings
            const footerSettingsToUpdate: any[] = [];
            if (submitData.logoFooterId !== undefined) {
              footerSettingsToUpdate.push({ key: 'logo_footer_id', value: submitData.logoFooterId, valueType: 'number' });
            }
            if (submitData.copyrightText !== undefined) {
              footerSettingsToUpdate.push({ key: 'copyright_text', value: submitData.copyrightText, valueType: 'string' });
            }
            if (submitData.complaintPhone !== undefined) {
              footerSettingsToUpdate.push({ key: 'footer_complaint_phone', value: submitData.complaintPhone, valueType: 'string' });
            }
            if (submitData.complaintEmail !== undefined) {
              footerSettingsToUpdate.push({ key: 'footer_complaint_email', value: submitData.complaintEmail, valueType: 'string' });
            }
            if (submitData.privacyPolicyUrl !== undefined) {
              footerSettingsToUpdate.push({ key: 'footer_privacy_policy_url', value: submitData.privacyPolicyUrl, valueType: 'string' });
            }
            if (submitData.termsOfUseUrl !== undefined) {
              footerSettingsToUpdate.push({ key: 'footer_terms_of_use_url', value: submitData.termsOfUseUrl, valueType: 'string' });
            }
            // Update each setting
            for (const setting of footerSettingsToUpdate) {
              try {
                await globalSettingsService.update(setting.key, { value: setting.value, valueType: setting.valueType });
              } catch {
                await globalSettingsService.create(setting);
              }
            }
            result = { success: true };
            break;
          case 'social-link':
            result = await socialLinksService.update(editingItem.id, submitData);
            break;
          case 'global-setting':
            if (!editingItem?.key) {
              throw new Error('Setting key is required');
            }
            // Map form type to backend valueType
            let updateValueType = 'string';
            if (submitData.type === 'number') updateValueType = 'number';
            else if (submitData.type === 'boolean') updateValueType = 'boolean';
            else if (submitData.type === 'json') updateValueType = 'json';
            // 'text', 'url', 'image' all map to 'string'

            // Handle image type - convert media ID to path
            let updateValue = submitData.value;
            if (submitData.type === 'image' && submitData.image) {
              if (typeof submitData.image === 'string') {
                const mediaId = parseInt(submitData.image);
                if (!isNaN(mediaId)) {
                  updateValue = `/uploads/media/${mediaId}`;
                }
              } else if (typeof submitData.image === 'number') {
                updateValue = `/uploads/media/${submitData.image}`;
              }
            }

            result = await globalSettingsService.update(editingItem.key, {
              value: updateValue,
              valueType: updateValueType
            });
            break;
          case 'award':
            // Ensure showAwardName is explicitly included (even if false)
            const awardSubmitData = { ...submitData };
            // Explicitly ensure boolean type - preserve false, default to true if undefined
            if (awardSubmitData.showAwardName === undefined || awardSubmitData.showAwardName === null) {
              awardSubmitData.showAwardName = true;
            } else {
              awardSubmitData.showAwardName = Boolean(awardSubmitData.showAwardName);
            }
            result = await awardsService.update(editingItem.id, awardSubmitData);
            break;
          case 'core-value':
            result = await coreValuesService.update(editingItem.id, submitData);
            break;
          case 'core-value':
            result = await coreValuesService.update(editingItem.id, submitData);
            break;
          case 'three-pillar-card':
            {
              // editingItem contains the pillar info AND the parent section info (editingItem.section)
              // We need to update the JSON content array within that section
              const section = editingItem.section;
              if (!section) throw new Error('Parent section not found for pillar');

              const pillarsContent = section.content.find((c: any) => c.contentKey === 'pillars');
              if (!pillarsContent) throw new Error('Pillars content not found in section');

              // Parse existing pillars
              let pillars = [];
              try {
                pillars = JSON.parse(pillarsContent.contentValue);
              } catch (e) {
                pillars = [];
              }

              // Resolve image path/ID logic to ensure backend gets the right format
              // If submitData.image is a number, it's a Media ID.
              // If it's a string, it might be a path.
              let imageToSave = submitData.image;

              // Logic to persist the CORRECT path if it's an uploaded ID
              if (typeof submitData.image === 'number') {
                // It's a media ID, so we should probably look up the file path if we want to save the path, 
                // OR just save the ID if the frontend supports it. 
                // Based on ESGPage_cms, it handles both. But let's try to resolve to path if possible OR just save ID.
                // Saving just the ID is safer if the frontend is robust.
                // However, the user issue is "it gets saved in this path... and shows image path as ... environment.jpg".
                // This implies we need to forcefully overwrite the old path.
                imageToSave = `/uploads/media/${submitData.image}`; // Construct virtual path for ID
              }

              if (modalType === 'add') {
                // Add new pillar
                const newPillar = {
                  id: submitData.id || `pillar-${Date.now()}`,
                  title: submitData.title,
                  description: submitData.description,
                  link: submitData.link,
                  image: imageToSave,
                  order: submitData.order,
                  orderIndex: submitData.order
                };
                pillars.push(newPillar);
              } else {
                // Update existing pillar
                const index = pillars.findIndex((p: any) => p.id === editingItem.id);
                if (index !== -1) {
                  pillars[index] = {
                    ...pillars[index],
                    title: submitData.title,
                    description: submitData.description,
                    link: submitData.link,
                    image: imageToSave, // Update image
                    order: submitData.order,
                    orderIndex: submitData.order
                  };
                }
              }

              // Save back to backend
              result = await sectionContentService.update(pillarsContent.id, {
                contentValue: JSON.stringify(pillars),
                contentType: 'json'
              });
            }
            break;
          case 'home-video-section':
            // Convert empty string to null for thumbnailImageId to avoid database issues
            const videoSectionData = {
              ...submitData,
              thumbnailImageId: submitData.thumbnailImageId && submitData.thumbnailImageId !== ''
                ? submitData.thumbnailImageId
                : null
            };
            result = await homeVideoSectionService.update(videoSectionData);
            break;
          case 'home-about-section':
            {
              // Map form data to database fields
              const aboutSectionData: any = {
                title: submitData.title,
                tagline: submitData.tagline,
                button_text: submitData.button_text,
                button_link: submitData.button_link,
                logo_image_id: submitData.logo_image_id || null,
                main_image_id: submitData.main_image_id || null
              };

              // Convert single content_text into up to 4 paragraphs
              let paragraphs: string[] = [];

              if (typeof submitData.content_text === 'string' && submitData.content_text.trim()) {
                const normalized = submitData.content_text.replace(/\r\n/g, '\n').trim();
                // Split on blank lines to get logical paragraphs
                paragraphs = normalized
                  .split(/\n\s*\n+/)
                  .map((p: string) => p.trim())
                  .filter((p: string) => p.length > 0);
              } else if (Array.isArray(submitData.content_paragraphs)) {
                // Fallback to legacy content_paragraphs array if present
                paragraphs = submitData.content_paragraphs
                  .map((p: any) => (typeof p === 'string' ? p.trim() : String(p || '').trim()))
                  .filter((p: string) => p.length > 0);
              }

              aboutSectionData.content_paragraph_1 = paragraphs[0] || null;
              aboutSectionData.content_paragraph_2 = paragraphs[1] || null;
              aboutSectionData.content_paragraph_3 = paragraphs[2] || null;
              aboutSectionData.content_paragraph_4 = paragraphs[3] || null;

              result = await homeAboutSectionService.update(aboutSectionData);
            }
            break;
          case 'home-careers-section':
            result = await homeCareersSectionService.update(submitData);
            break;
          case 'home-cta-section':
            result = await homeCTASectionService.update(editingItem.id, submitData);
            break;
          default:
            throw new Error(`Unknown entity type: ${currentEntityType}`);
        }
      }

      // Success - close modal and refresh
      console.log('Operation successful:', result);
      setShowModal(false);
      setFormData({});
      setFormErrors({});
      setEditingItem(null);

      // Trigger refresh in the active CMS component
      // This will be handled by each component's useEffect
      window.dispatchEvent(new Event('cms-refresh'));

      // Show success notification
      showNotification(
        modalType === 'add'
          ? 'Item created successfully!'
          : 'Item updated successfully!',
        'success'
      );

    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Failed to save. Please try again.');
      showNotification(error.message || 'Failed to save. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
    notification.style.transition = 'all 0.3s ease-out';
    notification.style.transform = 'translateX(400px)';
    notification.innerHTML = `
      <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'} text-xl"></i>
      <span class="font-medium">${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const handleDelete = async (item: any, entityType?: string) => {
    if (!window.confirm(`Are you sure you want to delete this item? This action cannot be undone.`)) {
      return;
    }

    try {
      // Determine which service to use based on item structure or entityType
      let service;
      const type = entityType || currentEntityType;

      if (type) {
        // Use entityType if provided
        switch (type) {
          case 'hero-slide':
            service = heroSlidesService;
            break;
          case 'business-card':
            service = businessCardsService;
            break;
          case 'job':
            service = jobsService;
            break;
          case 'testimonial':
            service = testimonialsService;
            break;
          case 'newsroom':
            service = newsroomService;
            break;
          case 'leader':
            service = leadersService;
            break;
          case 'sdg-card':
            service = sdgCardsService;
            break;
          case 'gallery-album':
            service = galleryAlbumsService;
            break;
          case 'gallery-event':
            service = galleryEventsService;
            break;
          case 'gallery-image':
            service = galleryImagesService;
            break;
          case 'section':
            service = sectionsService;
            break;
          case 'contact-info':
            service = contactInfoService;
            break;
          case 'navigation':
            service = navigationService;
            break;
          case 'footer-section':
            service = { delete: footerService.deleteSection };
            break;
          case 'footer-settings':
            // Footer settings cannot be deleted
            throw new Error('Footer settings cannot be deleted');
          case 'social-link':
            service = socialLinksService;
            break;
          case 'award':
            service = awardsService;
            break;
          case 'core-value':
            service = coreValuesService;
            break;
          case 'home-cta-section':
            service = homeCTASectionService;
            break;
          case 'section-content':
            service = sectionContentService;
            break;
          case 'global-setting':
            service = { delete: (item: any) => globalSettingsService.delete(item.key) };
            break;
          default:
            throw new Error(`Unknown entity type: ${type}`);
        }
      } else {
        // Fallback to item structure detection
        if (item.pageId !== undefined) {
          service = heroSlidesService;
        } else if (item.link !== undefined || item.linkUrl !== undefined) {
          service = businessCardsService;
        } else if (item.jobType !== undefined) {
          service = jobsService;
        } else if (item.authorName !== undefined) {
          service = testimonialsService;
        } else if (item.type !== undefined) {
          service = newsroomService;
        } else if (item.position !== undefined && item.bio !== undefined) {
          service = leadersService;
        } else if (item.description !== undefined && !item.content && !item.bio) {
          service = sdgCardsService;
        } else if (item.slug !== undefined && item.albumId === undefined) {
          service = galleryAlbumsService;
        } else if (item.albumId !== undefined && item.eventId === undefined) {
          service = galleryEventsService;
        } else if (item.eventId !== undefined) {
          service = galleryImagesService;
        } else if (item.sectionKey !== undefined) {
          service = sectionsService;
        } else if (item.officeName !== undefined || item.email !== undefined) {
          service = contactInfoService;
        } else if (item.label !== undefined && item.url !== undefined) {
          service = navigationService;
        } else if (item.title !== undefined && item.content !== undefined && !item.slug) {
          service = { delete: footerService.deleteSection };
        } else if (item.platform !== undefined) {
          service = socialLinksService;
        } else {
          throw new Error('Unknown item type');
        }
      }

      await service.delete(item.id);

      // Trigger refresh
      window.dispatchEvent(new Event('cms-refresh'));

      // Show success notification
      showNotification('Item deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Delete error:', error);
      showNotification(error.message || 'Failed to delete item. Please try again.', 'error');
    }
  };

  const uploadImageUtil = async (file: File, pageName?: string, sectionName?: string): Promise<any> => {
    if (!token) return null;
    setUploadingImage(true);
    try {
      // Determine page and section from current context if not provided
      let finalPageName = pageName;
      let finalSectionName = sectionName;

      if (!finalPageName || !finalSectionName) {
        // Extract from activeTab or currentEntityType
        const { pageName: extractedPage, sectionName: extractedSection } = getPageAndSectionFromEntityType(activeTab || currentEntityType || '');
        finalPageName = finalPageName || extractedPage;
        finalSectionName = finalSectionName || extractedSection;
      }

      const mediaId = await uploadImage(file, token, finalPageName, finalSectionName);
      return mediaId;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadFileUtil = async (file: File, pageName?: string, sectionName?: string): Promise<number | null> => {
    if (!token) return null;
    setUploadingFile(true);
    try {
      // Determine page and section from current context if not provided
      let finalPageName = pageName;
      let finalSectionName = sectionName;

      if (!finalPageName || !finalSectionName) {
        // Extract from activeTab or currentEntityType
        const { pageName: extractedPage, sectionName: extractedSection } = getPageAndSectionFromEntityType(activeTab || currentEntityType || '');
        finalPageName = finalPageName || extractedPage;
        finalSectionName = finalSectionName || extractedSection;
      }

      const mediaId = await uploadFile(file, token, finalPageName, finalSectionName);
      return mediaId;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                <i className="ri-dashboard-line text-white text-lg sm:text-xl"></i>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Category Tabs */}
              <div className="hidden md:flex items-center gap-1 mr-2">
                {[
                  { id: 'main', label: 'Main', icon: 'ri-layout-4-line' },
                  { id: 'business', label: 'Business', icon: 'ri-building-4-line' },
                  { id: 'navigation', label: 'Navigation', icon: 'ri-route-line' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as 'main' | 'business' | 'navigation')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${activeCategory === cat.id
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <i className={`${cat.icon} text-base`} />
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>

              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-2 sm:px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
              >
                <i className="ri-logout-box-line"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Navigation - Page Tabs */}
      <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mx-4 mt-3 transition-colors">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-3">
          <div
            className="flex items-center space-x-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              nav div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {PAGES
              .filter((page) => {
                if (activeCategory === 'business') return page.category === 'business';
                if (activeCategory === 'navigation') return page.category === 'navigation';
                // Main: default category or explicitly marked as main
                return !page.category || page.category === 'main';
              })
              .map((page) => (
                <button
                  key={page.id}
                  onClick={() => setActiveTab(page.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeTab === page.id
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <i className={`${page.icon} text-base`}></i>
                  <span className="font-medium">{page.label}</span>
                </button>
              ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 dark:text-gray-100">
        {/* Modal for forms */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setFormData({});
            setFormErrors({});
            setEditingItem(null);
            setSubmitError(null);
          }}
          title={currentEntityType ? (modalType === 'add'
            ? `Add ${currentEntityType === 'gallery-album' ? 'Gallery' : currentEntityType === 'gallery-event' ? 'Event' : currentEntityType === 'gallery-image' ? 'Image' : currentEntityType.replace(/-/g, ' ')}`
            : `Edit ${currentEntityType === 'gallery-album' ? 'Gallery' : currentEntityType === 'gallery-event' ? 'Event' : currentEntityType === 'gallery-image' ? 'Image' : currentEntityType.replace(/-/g, ' ')}`) : 'Form'}
          size="lg"
          twoColumn={(() => {
            // Enable two-column layout for forms with many fields (6+ fields typically)
            const manyFieldsTypes = [
              'hero-slide', 'business-card', 'testimonial', 'newsroom',
              'leader', 'section-content', 'about-section-content',
              'careers-section-content', 'contact-info', 'navigation',
              'footer-section', 'social-link', 'global-setting',
              'core-value', 'mission-vision-section', 'story-timeline-section',
              'overview-section', 'core-values-section', 'sustainability-report-section',
              'sdg-section', 'governance-section', 'policies-section', 'policy',
              'tabs-section', 'message-anil-jain', 'listed-company',
              'investments-hero-section', 'investments-intro-section',
              'investments-contact-info-section', 'contact-hero-section',
              'contact-form-section', 'contact-cta-section', 'newsroom-hero-section',
              'newsroom-cta-section', 'gallery-hero-section', 'gallery-welcome-section',
              'gallery-cta-section', 'diversity-hero-section', 'diversity-be-you-section',
              'diversity-believe-section', 'diversity-initiatives-section',
              'diversity-cta-section', 'careers-hero-section', 'careers-main-content',
              'careers-why-choose', 'careers-video-section', 'careers-life-refexian',
              'careers-testimonial-slider', 'careers-cta-section', 'refrigerants-hero-section',
              'refrigerants-overview-section', 'refrigerants-products-section',
              'refrigerants-quality-assurance-section', 'refrigerants-applications-section',
              'refrigerants-breaking-grounds-section', 'refrigerants-refex-industries-section',
              'refrigerants-why-choose-us-section', 'refrigerants-cta-section',
              'renewables-hero-section', 'renewables-category-cards', 'renewables-benefits',
              'renewables-featured-projects', 'renewables-cta-section',
              'ash-coal-hero-section', 'ash-coal-overview-section', 'ash-coal-cta-section',
              'medtech-hero-section', 'medtech-commitment-section', 'medtech-specialities-section',
              'medtech-products-section', 'medtech-certifications-section',
              'medtech-clientele-section', 'medtech-stats-section', 'medtech-cta-section',
              'capital-hero-section', 'capital-areas-section', 'capital-what-we-look-for-section',
              'capital-stats-section', 'capital-portfolio-section',
              'airports-hero-section', 'airports-retail-partners-section',
              'airports-retail-advantage-section', 'airports-transport-section',
              'airports-tech-section', 'mobility-hero-section', 'mobility-about-section',
              'mobility-solutions-section', 'mobility-advantages-section',
              'mobility-electric-fleet-section', 'mobility-cta-section',
              'pharma-hero-section', 'pharma-about-section', 'pharma-plant-capability-section',
              'pharma-rd-capability-section', 'pharma-quality-section',
              'pharma-infrastructure-section', 'pharma-products-section',
              'pharma-certifications-section', 'pharma-stats-section',
              'pharma-logo-cards-section', 'pharma-leader-section', 'pharma-cta-section',
              'venwind-hero-section', 'venwind-stats-section', 'venwind-unique-section',
              'venwind-technical-specs-section', 'venwind-cta-section'
            ];
            return manyFieldsTypes.includes(currentEntityType || '');
          })()}
        >
          <form onSubmit={handleSubmit}>
            {currentEntityType === 'hero-slide' && (
              <HeroSlideForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'business-card' && (
              <BusinessCardForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'job' && (
              <JobForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'testimonial' && (
              <TestimonialForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'newsroom' && (
              <NewsroomForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'leader' && (
              <LeaderForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'sdg-card' && (
              <SDGCardForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'gallery-album' && (
              <GalleryAlbumForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
                editingItem={editingItem}
              />
            )}

            {currentEntityType === 'gallery-event' && (
              <GalleryEventForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImageUtil={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
                editingItem={editingItem}
              />
            )}

            {currentEntityType === 'gallery-image' && (
              <GalleryImageForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'policy' && (
              <PolicyForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadFile={uploadImageUtil}
                uploading={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section' && (
              <SectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'contact-info' && (
              <ContactInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'navigation' && (
              <NavigationForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil ? async (file: File) => {
                  const result = await uploadImageUtil(file);
                  return result ? parseInt(result) : null;
                } : undefined}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'footer-section' && (
              <FooterSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'footer-settings' && (
              <FooterSettingsForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImageUtil={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'social-link' && (
              <SocialLinkForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'global-setting' && (
              <GlobalSettingForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {/* Section Content Forms */}
            {currentEntityType === 'section-content-hero-section' && (
              <MedtechHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
                pageName="medtech"
                sectionName="hero"
              />
            )}

            {currentEntityType === 'section-content-areas-of-interest' && (
              <CapitalAreasSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-what-we-look-for' && (
              <CapitalWhatWeLookForSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-portfolio' && (
              <CapitalPortfolioSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-for-retail-partners' && (
              <AirportsRetailPartnersSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-refex-retail-advantage' && (
              <AirportsRetailAdvantageSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-transportation-enhancement' && (
              <AirportsTransportSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-tech-integration' && (
              <AirportsTechSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-associate-companies' && (
              <MedtechAssociateCompaniesForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-stats-capital' && (
              <CapitalStatsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-stats' && (
              <MedtechStatsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-commitment' && (
              <MedtechCommitmentSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-specialities' && (
              <MedtechSpecialitiesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-products' && (
              <MedtechProductsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-certifications' && (
              <MedtechCertificationsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-clientele' && (
              <MedtechClienteleSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-section' && (
              <MedtechCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-capital' && (
              <CapitalHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
                pageName="capital"
                sectionName="hero"
              />
            )}

            {currentEntityType === 'section-content-hero-airports' && (
              <AirportsHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero' && (
              <HeroSectionContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-intro' && (
              <IntroSectionContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-championing-change' && (
              <ChampioningSectionContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'three-pillar-card' && (
              <ThreePillarCardForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-about-capital' && (
              <CapitalAboutSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-about-us-airports' && (
              <AirportsAboutSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-about' && (
              <AboutSectionContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-careers' && (
              <CareersSectionContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-capital' && (
              <CapitalCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-airports' && (
              <AirportsCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta' && (
              <BusinessCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-mission-vision' && (
              <MissionVisionSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-story' && (
              <StoryTimelineSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-careers-cta' && (
              <AboutCareersCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-overview' && (
              <OverviewSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {(currentEntityType === 'section-content-corevalues' || currentEntityType === 'section-content-core-values') && (
              <CoreValuesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-sustainability-report' && (
              <SustainabilityReportSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                uploadFile={uploadFileUtil}
                uploading={uploadingFile}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-sdg' && (
              <SDGSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-governance' && (
              <GovernanceSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-policies' && (
              <PoliciesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadFile={uploadFileUtil}
                uploading={uploadingFile}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-tabs' && (
              <TabsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-esg' && (
              <ESGCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-investments' && (
              <InvestmentsHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-intro-investments' && (
              <InvestmentsIntroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-message-anil-jain' && (
              <MessageAnilJainForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-listed-companies' && (
              <ListedCompaniesForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-contact-info-investments' && (
              <InvestmentsContactInfoSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-investments' && (
              <InvestmentsCTAForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-contact' && (
              <ContactHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-contact-form' && (
              <ContactFormSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-contact' && (
              <ContactCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-newsroom' && (
              <NewsroomHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-newsroom' && (
              <NewsroomCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-gallery' && (
              <GalleryHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-welcome-gallery' && (
              <GalleryWelcomeSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-gallery' && (
              <GalleryCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-diversity' && (
              <DiversityHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-be-you' && (
              <DiversityBeYouSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-believe' && (
              <DiversityBelieveSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-initiatives' && (
              <DiversityInitiativesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-diversity' && (
              <DiversityCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-careers' && (
              <CareersHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-main-content' && (
              <CareersMainContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-video' && (
              <CareersVideoSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-life-refexian' && (
              <CareersLifeRefexianForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-why-choose' && (
              <CareersWhyChooseForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-application-form' && (
              <CareersApplicationFormSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-testimonials' && (
              <CareersTestimonialsContentForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-testimonial-slider' && (
              <CareersTestimonialSliderForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
              />
            )}

            {currentEntityType === 'section-content-know-more' && (
              <CareersKnowMoreForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-careers' && (
              <CareersCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-renewables' && (
              <RenewablesHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-ash-coal' && (
              <AshCoalHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-overview-ash-coal' && (
              <AshCoalOverviewSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-services-ash-coal' && (
              <AshCoalServicesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-ash-coal' && (
              <AshCoalCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-category-cards' && (
              <RenewablesCategoryCardsForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-benefits' && (
              <RenewablesBenefitsForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-featured-projects' && (
              <RenewablesFeaturedProjectsForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-renewables' && (
              <RenewablesCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-venwind' && (
              <VenwindHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-stats-venwind' && (
              <VenwindStatsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-unique-venwind' && (
              <VenwindUniqueSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-technical-specs' && (
              <VenwindTechnicalSpecsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-venwind' && (
              <VenwindCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-pharma' && (
              <PharmaHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-logo-cards' && (
              <PharmaLogoCardsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-about-pharma' && (
              <PharmaAboutSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-rd-capability' && (
              <PharmaRDCapabilitySectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-plant-capability' && (
              <PharmaPlantCapabilitySectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-pharma' && (
              <PharmaCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-mobility' && (
              <MobilityHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-about-mobility' && (
              <MobilityAboutSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-solutions-mobility' && (
              <MobilitySolutionsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-advantages-mobility' && (
              <MobilityAdvantagesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-electric-fleet' && (
              <MobilityElectricFleetSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-cta-mobility' && (
              <MobilityCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-hero-section-refrigerants' && (
              <RefrigerantsHeroSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-why-choose-us-refrigerants' && (
              <RefrigerantsWhyChooseUsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-breaking-grounds-refrigerants' && (
              <RefrigerantsBreakingGroundsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-products-refrigerants' && (
              <RefrigerantsProductsSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-quality-assurance-refrigerants' && (
              <RefrigerantsQualityAssuranceSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'section-content-refex-industries-refrigerants' && (
              <RefrigerantsRefexIndustriesSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {/* Generic Section Content Form for other sections */}
            {currentEntityType?.startsWith('section-content-') &&
              !['section-content-hero-section', 'section-content-associate-companies', 'section-content-stats', 'section-content-stats-capital', 'section-content-commitment', 'section-content-specialities', 'section-content-products', 'section-content-certifications', 'section-content-clientele', 'section-content-areas-of-interest', 'section-content-what-we-look-for', 'section-content-portfolio', 'section-content-hero', 'section-content-hero-capital', 'section-content-hero-airports', 'section-content-hero-contact', 'section-content-hero-diversity', 'section-content-hero-careers', 'section-content-hero-renewables', 'section-content-hero-ash-coal', 'section-content-hero-venwind', 'section-content-hero-pharma', 'section-content-hero-mobility', 'section-content-hero-section-refrigerants', 'section-content-hero-investments', 'section-content-hero-newsroom', 'section-content-hero-gallery', 'section-content-welcome-gallery', 'section-content-about-capital', 'section-content-about-us-airports', 'section-content-about-pharma', 'section-content-about-mobility', 'section-content-cta-capital', 'section-content-cta-airports', 'section-content-cta-venwind', 'section-content-cta-pharma', 'section-content-cta-mobility', 'section-content-cta-section-refrigerants', 'section-content-cta-investments', 'section-content-cta-newsroom', 'section-content-cta-gallery', 'section-content-intro', 'section-content-intro-investments', 'section-content-championing-change', 'section-content-about', 'section-content-careers', 'section-content-cta', 'section-content-mission-vision', 'section-content-story', 'section-content-careers-cta', 'section-content-overview', 'section-content-overview-refrigerants', 'section-content-overview-ash-coal', 'section-content-products-refrigerants', 'section-content-quality-assurance-refrigerants', 'section-content-applications-refrigerants', 'section-content-sustainability-report', 'section-content-sdg', 'section-content-governance', 'section-content-policies', 'section-content-tabs', 'section-content-cta-esg', 'section-content-message-anil-jain', 'section-content-listed-companies', 'section-content-contact-info-investments', 'section-content-contact-form', 'section-content-cta-contact', 'section-content-be-you', 'section-content-believe', 'section-content-initiatives', 'section-content-cta-diversity', 'section-content-main-content', 'section-content-video', 'section-content-life-refexian', 'section-content-why-choose', 'section-content-application-form', 'section-content-testimonials', 'section-content-testimonial-slider', 'section-content-know-more', 'section-content-cta-careers', 'section-content-category-cards', 'section-content-benefits', 'section-content-featured-projects', 'section-content-cta-renewables', 'section-content-services-ash-coal', 'section-content-cta-ash-coal', 'section-content-for-retail-partners', 'section-content-refex-retail-advantage', 'section-content-transportation-enhancement', 'section-content-tech-integration', 'section-content-stats-venwind', 'section-content-unique-venwind', 'section-content-technical-specs', 'section-content-logo-cards', 'section-content-rd-capability', 'section-content-plant-capability', 'section-content-solutions-mobility', 'section-content-advantages-mobility', 'section-content-electric-fleet'].includes(currentEntityType) && (
                <SectionContentForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  uploadImage={uploadImageUtil}
                  uploadingImage={uploadingImage}
                  errors={formErrors}
                  sectionKey={currentEntityType.replace('section-content-', '')}
                />
              )}

            {currentEntityType === 'award' && (
              <AwardForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'core-value' && (
              <CoreValueForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'home-video-section' && (
              <HomeVideoSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'home-about-section' && (
              <HomeAboutSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'home-careers-section' && (
              <HomeCareersSectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                uploadImage={uploadImageUtil}
                uploadingImage={uploadingImage}
                errors={formErrors}
              />
            )}

            {currentEntityType === 'home-cta-section' && (
              <HomeCTASectionForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={formErrors}
              />
            )}

            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {submitError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setFormData({});
                  setFormErrors({});
                  setEditingItem(null);
                  setSubmitError(null);
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 ease-out font-medium text-xs active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-medium text-xs flex items-center gap-1.5 active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={modalType === 'add' ? 'ri-add-line' : 'ri-save-line'}></i>
                    {modalType === 'add' ? 'Create Item' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {activeTab === 'home-page' && (
          <HomePage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'about-page' && (
          <AboutPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'esg-page' && (
          <ESGPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'careers-page' && (
          <CareersPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'contact-page' && (
          <ContactPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'newsroom' && (
          <Newsroom_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'gallery' && (
          <Gallery_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'investments-page' && (
          <InvestmentsPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'diversity-inclusion' && (
          <DiversityInclusionPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {/* Header CMS */}
        {activeTab === 'header' && (
          <Header_cms
            setShowModal={setShowModal}
            setModalType={setModalType}
            setEditingItem={setEditingItem}
            setFormData={setFormData}
            handleDelete={handleDelete}
            setCurrentEntityType={setCurrentEntityType}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
          />
        )}

        {/* Footer CMS */}
        {activeTab === 'footer' && (
          <Footer_cms
            setShowModal={setShowModal}
            setModalType={setModalType}
            setEditingItem={setEditingItem}
            setFormData={setFormData}
            handleDelete={handleDelete}
            setCurrentEntityType={setCurrentEntityType}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
          />
        )}

        {/* Email Settings */}
        {activeTab === 'email-settings' && (
          <div className="max-w-6xl mx-auto px-6">
            <EmailSettings_cms token={token} />
          </div>
        )}

        {/* User Management */}
        {activeTab === 'user-management' && (
          <div className="max-w-6xl mx-auto px-6">
            {/* Local-only CMS user management */}
            {/* Does not touch backend users table; safe for non-technical admins */}
            <UserManagement_cms />
          </div>
        )}


        {activeTab === 'global-settings' && (
          <GlobalSettings_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            uploadImageUtil={uploadImageUtil}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {/* Business Pages */}
        {activeTab === 'refex-refrigerants' && (
          <RefexRefrigerantsPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-renewables' && (
          <RefexRenewablesPage_cms
            setShowModal={setShowModal}
            setModalType={setModalType}
            setEditingItem={setEditingItem}
            setFormData={setFormData}
            handleDelete={handleDelete}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-ash-coal-handling' && (
          <RefexAshCoalHandlingPage_cms
            setShowModal={setShowModal}
            setModalType={setModalType}
            setEditingItem={setEditingItem}
            setFormData={setFormData}
            handleDelete={handleDelete}
            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-medtech' && (
          <RefexMedtechPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-capital' && (
          <RefexCapitalPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-airports' && (
          <RefexAirportsPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'refex-mobility' && (
          <RefexMobilityPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'pharma-rl-fine-chem' && (
          <PharmaRLFineChemPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}

        {activeTab === 'venwind-refex' && (
          <VenwindRefexPage_cms
            token={token}
            showModal={showModal}
            setShowModal={setShowModal}
            modalType={modalType}
            setModalType={setModalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}

            setCurrentEntityType={setCurrentEntityType}
          />
        )}
      </main>
    </div>
  );
}

