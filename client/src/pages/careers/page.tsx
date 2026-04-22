import { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import CareersHero from '../../wp-content/uploads/2023/02/People-Group-Careers.jpg';
import CareersGallery1 from '../../wp-content/uploads/2023/02/Careers-Gallery-1-e1677566533601.png';
import NurturingTalent from '../../wp-content/uploads/2023/02/Nurturing-Talent.svg';
import CultureInclusion from '../../wp-content/uploads/2023/02/Culture-and-Inclusion.svg';
import CenterOfExcellence from '../../wp-content/uploads/2023/02/Center-of-Excellence.svg';
import CareersBg2 from '../../wp-content/uploads/2023/03/Careers-bg-2.jpg';
import { pagesService, sectionsService, testimonialsService, mediaService, formSubmissionsService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useCooldownTimer } from '../../hooks/enquiry/useCooldownTimer';
import { useEmailValidation } from '../../hooks/enquiry/useEmailValidation';
import { usePhoneValidation } from '../../hooks/enquiry/usePhoneValidation';
import { checkEnquiry, createEnquiry, HttpError } from '../../hooks/enquiry/enquiryApi';

// Import images from esops folder
const careers1 = new URL('./esops/careers1.png', import.meta.url).href;
const careers2 = new URL('./esops/careers2.png', import.meta.url).href;
const careers3 = new URL('./esops/careers3.png', import.meta.url).href;
const careers4 = new URL('./esops/careers4.png', import.meta.url).href;

export default function CareersPage() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pageSections, setPageSections] = useState<any>({});
  const [testimonialImages, setTestimonialImages] = useState([careers1, careers2, careers3, careers4]);
  const [whyChooseCards, setWhyChooseCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0); // Start as horizontal underline (0 degrees, flat)

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'firstName' | 'lastName' | 'email' | 'phone', string>>>({});
  const { isCoolingDown, secondsLeft, startCooldown } = useCooldownTimer(10);

  const emailValidation = useEmailValidation(formData.email, true);
  const phoneValidation = usePhoneValidation(formData.phone, false);

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

  // Helper function to get background position style
  const getBackgroundPosition = (positionX?: string, positionY?: string): string => {
    const x = positionX || '50';
    const y = positionY || '50';
    return `${x}% ${y}%`;
  };

  useEffect(() => {
    const fetchCareersData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('careers');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });

          // Resolve cover image for video section if it's a mediaId
          const videoSection = sections.find((s: any) => s.sectionKey === 'video');
          if (videoSection?.content) {
            const coverImageContent = videoSection.content.find((c: any) => c.contentKey === 'coverImage');
            if (coverImageContent) {
              let mediaIdToResolve: number | null = null;

              // Check if mediaId field exists
              if (coverImageContent.mediaId) {
                mediaIdToResolve = typeof coverImageContent.mediaId === 'number'
                  ? coverImageContent.mediaId
                  : parseInt(coverImageContent.mediaId);
              }
              // Check if contentValue is a number (media ID)
              else if (coverImageContent.contentValue) {
                if (typeof coverImageContent.contentValue === 'number' && coverImageContent.contentValue > 0) {
                  mediaIdToResolve = coverImageContent.contentValue;
                }
                // Check if contentValue is /uploads/media/{id} format
                else if (typeof coverImageContent.contentValue === 'string' && coverImageContent.contentValue.startsWith('/uploads/media/')) {
                  const mediaIdMatch = coverImageContent.contentValue.match(/\/uploads\/media\/(\d+)/);
                  if (mediaIdMatch) {
                    mediaIdToResolve = parseInt(mediaIdMatch[1]);
                  }
                }
                // Check if contentValue is a numeric string
                else if (typeof coverImageContent.contentValue === 'string' && /^\d+$/.test(coverImageContent.contentValue.trim())) {
                  mediaIdToResolve = parseInt(coverImageContent.contentValue.trim());
                }
              }

              // Resolve mediaId if we found one and media relationship is missing
              if (mediaIdToResolve && !isNaN(mediaIdToResolve) && mediaIdToResolve > 0 && !coverImageContent.media) {
                try {
                  const media = await mediaService.getById(mediaIdToResolve);
                  if (media) {
                    coverImageContent.media = media;
                    // Update contentValue to the actual filePath for easier access
                    if (media.filePath) {
                      coverImageContent.contentValue = media.filePath;
                    }
                    console.log('✅ Resolved cover image mediaId:', mediaIdToResolve, 'to:', media.filePath);
                  }
                } catch (error) {
                  console.error('Error resolving cover image mediaId:', mediaIdToResolve, error);
                }
              }
            }
          }

          // Set state after all media resolutions are complete
          setPageSections(sectionsMap);

          // Resolve background image for application form section
          const applicationFormSection = sections.find((s: any) => s.sectionKey === 'application-form');
          if (applicationFormSection?.content) {
            const bgImageContent = applicationFormSection.content.find((c: any) => c.contentKey === 'backgroundImage');
            if (bgImageContent && bgImageContent.mediaId && !bgImageContent.media) {
              try {
                const media = await mediaService.getById(bgImageContent.mediaId);
                if (media) {
                  bgImageContent.media = media;
                }
              } catch (error) {
                console.error('Error resolving application form background image mediaId:', error);
              }
            }
          }

          // Parse Why Choose Cards
          const whyChooseSection = sections.find((s: any) => s.sectionKey === 'why-choose');
          if (whyChooseSection?.content) {
            const cardsContent = whyChooseSection.content.find((c: any) => c.contentKey === 'cards');
            if (cardsContent && cardsContent.contentType === 'json') {
              try {
                const parsed = JSON.parse(cardsContent.contentValue);
                setWhyChooseCards(Array.isArray(parsed) ? parsed : []);
              } catch (e) {
                console.error('Error parsing why choose cards:', e);
              }
            }
          }

          // Fetch Testimonial Slider images from section content
          try {
            const testimonialSliderSection = sections.find((s: any) => s.sectionKey === 'testimonial-slider');
            if (testimonialSliderSection?.content) {
              const imagesContent = testimonialSliderSection.content.find((c: any) => c.contentKey === 'images');
              if (imagesContent && imagesContent.contentType === 'json') {
                try {
                  const imagesArray = JSON.parse(imagesContent.contentValue || '[]');
                  console.log('📸 Testimonial slider images from CMS:', imagesArray);

                  if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                    // Resolve each image (could be mediaId, URL, or filePath)
                    const resolvedImages = await Promise.all(
                      imagesArray.map(async (img: string | number) => {
                        // If it's a number, it's a mediaId - resolve it
                        if (typeof img === 'number' && img > 0) {
                          try {
                            const media = await mediaService.getById(img);
                            if (media?.filePath) {
                              const resolvedPath = getImagePath(media);
                              console.log(`✅ Resolved mediaId ${img} to:`, resolvedPath);
                              return resolvedPath;
                            }
                          } catch (error) {
                            console.error(`❌ Error resolving mediaId ${img}:`, error);
                          }
                        }
                        // If it's a string, it could be a URL or filePath
                        if (typeof img === 'string' && img.trim()) {
                          const resolvedPath = getImagePath(img);
                          console.log(`✅ Using string path:`, resolvedPath);
                          return resolvedPath;
                        }
                        console.warn('⚠️ Invalid image value:', img);
                        return null;
                      })
                    );

                    const validImages = resolvedImages.filter((url: string | null) => url !== null);
                    console.log('📸 Final resolved images:', validImages);

                    if (validImages.length > 0) {
                      setTestimonialImages(validImages);
                    } else {
                      console.warn('⚠️ No valid images found after resolution');
                    }
                  } else {
                    console.log('ℹ️ No images in testimonial slider section');
                  }
                } catch (e) {
                  console.error('❌ Error parsing testimonial slider images:', e);
                }
              } else {
                console.log('ℹ️ Testimonial slider images content not found or not JSON');
              }
            } else {
              console.log('ℹ️ Testimonial slider section not found');
            }
          } catch (error) {
            console.error('❌ Error fetching testimonial slider images:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching careers data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareersData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll-based rotation for green line (clock needle effect)
  useEffect(() => {
    // Maximum rotation angle (negative for anticlockwise)
    const MAX_ROTATION = -90; // degrees
    // Scroll distance that maps to full rotation (adjust this to control sensitivity)
    // Lower value = faster rotation, higher value = slower rotation
    const SCROLL_FOR_FULL_ROTATION = 550; // pixels

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // At top (scrollY = 0): 0 degrees (flat underline)
      // As scrollY increases: rotate anticlockwise (negative degrees)
      // As scrollY decreases: rotate clockwise (back toward 0 degrees)
      
      // Calculate rotation based on scroll position
      // Linear mapping: scrollY 0 -> rotation 0, scrollY SCROLL_FOR_FULL_ROTATION -> rotation MAX_ROTATION
      const rotation = Math.max(MAX_ROTATION, Math.min(0, -(currentScrollY / SCROLL_FOR_FULL_ROTATION) * Math.abs(MAX_ROTATION)));
      
      setScrollRotation(rotation);
    };

    // Set initial rotation based on current scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to apply section if hash is present
  useEffect(() => {
    if (window.location.hash === '#apply') {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        const applySection = document.getElementById('apply');
        if (applySection) {
          applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as 'firstName' | 'lastName' | 'email' | 'phone']) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setSubmitMessage({ type: 'error', text: 'Please upload a PDF, DOC, or DOCX file' });
        return;
      }
      // Validate file size (30MB)
      if (file.size > 30 * 1024 * 1024) {
        setSubmitMessage({ type: 'error', text: 'File size must be less than 30MB' });
        return;
      }
      setResumeFile(file);
      setSubmitMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCoolingDown) return;
    setSubmitting(true);
    setSubmitMessage(null);
    setFieldErrors({});

    try {
      // Validate required fields
      const nextErrors: typeof fieldErrors = {};
      if (formData.firstName.trim().length < 2) nextErrors.firstName = 'Name must be at least 2 characters';
      if (formData.lastName.trim().length < 2) nextErrors.lastName = 'Name must be at least 2 characters';
      const emailErr = emailValidation.validate();
      if (emailErr) nextErrors.email = emailErr;
      const phoneErr = phoneValidation.validate();
      if (phoneErr) nextErrors.phone = phoneErr;
      if (Object.keys(nextErrors).length) {
        setFieldErrors(nextErrors);
        setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
        setSubmitting(false);
        return;
      }

      // Duplicate check (skip if endpoint not present)
      try {
        const dup = await checkEnquiry({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        });
        if (dup?.exists) {
          const field = dup.field || 'phone';
          const msg =
            field === 'email'
              ? 'This email is already registered'
              : field === 'phone'
                ? 'This phone number is already registered'
                : 'This name is already registered';
          setFieldErrors((prev) => ({ ...prev, [field]: msg } as any));
          setSubmitMessage({ type: 'error', text: msg });
          setSubmitting(false);
          return;
        }
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 404)) throw err;
      }

      // Optional create-enquiry record (no file upload)
      try {
        await createEnquiry({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message,
          source: 'refexgroup-careers',
        });
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 404)) throw err;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('message', formData.message);
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      // Submit to API
      await formSubmissionsService.submitCareerApplication(submitData);

      // Success
      setSubmitMessage({ type: 'success', text: 'Application submitted successfully! We will get back to you soon.' });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      setResumeFile(null);
      startCooldown();

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error submitting application:', error);
      setSubmitMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to submit application. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        {(() => {
          const heroSection = pageSections.hero;
          const bgImage = getSectionContent(heroSection, 'backgroundImage');
          const bgImagePath = bgImage?.path || (typeof bgImage === 'string' ? bgImage : (bgImage ? getImagePath(bgImage) : CareersHero));
          const bgPosition = bgImage?.positionX && bgImage?.positionY
            ? getBackgroundPosition(bgImage.positionX, bgImage.positionY)
            : 'center';
          const tagline = getSectionContent(heroSection, 'tagline') || '';
          const title = getSectionContent(heroSection, 'title') || 'Careers';
          const description = getSectionContent(heroSection, 'description') || 'Join Our Team and Make an Impact: Discover Your Next Career Opportunity at Refex Group';

          return (
            <section
              className="relative text-white py-16 md:py-20 bg-cover"
              style={{
                backgroundImage: `url(${bgImagePath})`,
                backgroundPosition: bgPosition
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>

              <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div
                    id="hero-title"
                    data-animate
                    className={`transition-all duration-1000 ${isVisible['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {tagline && (
                      <p className="text-white/90 text-sm mb-4 tracking-wide">{tagline}</p>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                  </div>
                  <div
                    id="hero-desc"
                    data-animate
                    className={`transition-all duration-1000 delay-300 ${isVisible['hero-desc'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Main Content Section */}
        {(() => {
          const mainContentSection = pageSections['main-content'];
          const heading = getSectionContent(mainContentSection, 'heading') || 'Refex fosters a supportive and welcoming community for all.';
          const paragraph1 = getSectionContent(mainContentSection, 'paragraph1') || 'Refex is dedicated to creating a workplace where employees can expand their skills and reach their full potential. We believe in equality and value diversity, fostering a respectful and inclusive environment for all employees.';
          const paragraph2 = getSectionContent(mainContentSection, 'paragraph2') || 'At Refex Group, we are proud of the diverse and talented team of professionals who make our company a leading business conglomerate. Our employees come from a wide range of backgrounds and bring unique perspectives to the table, allowing us to continue to innovate and excel in our various business sectors including refrigerant gas, renewables, venture capital, power trading, thermal – ash and coal handling, thermal – power generation and health care.';

          // Get video section data for the video card
          const videoSection = pageSections.video;
          const videoUrl = getSectionContent(videoSection, 'videoUrl') || 'https://www.youtube.com/embed/Exp79B_pL9I';
          const videoTitle = getSectionContent(videoSection, 'title') || 'Refex Careers Video';

          // Get cover image with positioning
          let coverImagePath: string | null = null;
          let coverImagePositionX = '50';
          let coverImagePositionY = '50';

          if (videoSection?.content) {
            const coverImageContent = videoSection.content.find((c: any) => c.contentKey === 'coverImage');

            if (coverImageContent) {
              // Priority 1: Check if media relationship exists and has filePath
              if (coverImageContent.media?.filePath) {
                coverImagePath = getImagePath(coverImageContent.media);
              }
              // Priority 2: Check if media relationship exists and has url
              else if (coverImageContent.media?.url) {
                coverImagePath = coverImageContent.media.url;
              }
              // Priority 3: Check if mediaId exists (from coverImageId conversion)
              else if (coverImageContent.mediaId) {
                // Resolve mediaId to filePath
                const mediaId = typeof coverImageContent.mediaId === 'number'
                  ? coverImageContent.mediaId
                  : parseInt(coverImageContent.mediaId);
                if (!isNaN(mediaId) && mediaId > 0) {
                  // Construct /uploads/media/{id} path which will be resolved by getImagePath
                  const apiBase = getApiBaseUrl();
                  coverImagePath = `${apiBase}/uploads/media/${mediaId}`;
                }
              }
              // Priority 4: Use contentValue (which might be a URL, filePath, mediaId, or /uploads/media/{id})
              else if (coverImageContent.contentValue) {
                const contentValue = coverImageContent.contentValue;
                // Check if it's a URL (starts with http:// or https://)
                if (typeof contentValue === 'string' && (contentValue.startsWith('http://') || contentValue.startsWith('https://'))) {
                  coverImagePath = contentValue;
                }
                // Check if it's /uploads/media/{id} format
                else if (typeof contentValue === 'string' && contentValue.startsWith('/uploads/media/')) {
                  const apiBase = getApiBaseUrl();
                  coverImagePath = `${apiBase}${contentValue}`;
                }
                // Check if it's a number (media ID)
                else if (typeof contentValue === 'number' && contentValue > 0) {
                  const apiBase = getApiBaseUrl();
                  coverImagePath = `${apiBase}/uploads/media/${contentValue}`;
                }
                // Check if it's a numeric string (media ID as string)
                else if (typeof contentValue === 'string' && /^\d+$/.test(contentValue.trim())) {
                  const mediaId = parseInt(contentValue.trim());
                  if (!isNaN(mediaId) && mediaId > 0) {
                    const apiBase = getApiBaseUrl();
                    coverImagePath = `${apiBase}/uploads/media/${mediaId}`;
                  }
                }
                // Try to resolve as file path
                else {
                  const contentValuePath = getImagePath(contentValue);
                  if (contentValuePath && contentValuePath.trim() !== '' && !contentValuePath.startsWith('/assets/')) {
                    coverImagePath = contentValuePath;
                  }
                }
              }
            }

            // Get positioning values
            const positionXItem = videoSection.content.find((c: any) => c.contentKey === 'coverImagePositionX');
            const positionYItem = videoSection.content.find((c: any) => c.contentKey === 'coverImagePositionY');

            if (positionXItem && positionXItem.contentValue) {
              coverImagePositionX = positionXItem.contentValue;
            }
            if (positionYItem && positionYItem.contentValue) {
              coverImagePositionY = positionYItem.contentValue;
            }
          }

          const coverImagePosition = `${coverImagePositionX}% ${coverImagePositionY}%`;

          return (
            <section ref={mainContentRef} className="py-16 lg:py-10 bg-white relative">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div
                    id="main-title"
                    data-animate
                    className={`transition-all duration-1000 ${isVisible['main-title'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                      }`}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      {(() => {
                        // Split heading to wrap "welcoming" with underline
                        const headingText = heading || 'Refex fosters a supportive and welcoming community for all.';
                        const parts = headingText.split(/(welcoming)/i);

                        return (
                          <>
                            {parts.map((part: string, index: number) => {
                              if (part.toLowerCase() === 'welcoming') {
                                return (
                                  <span key={index} className="relative inline-block">
                                    {part}
                                    {/* Green underline with scroll-based rotation (clock needle effect) - Hidden on mobile */}
                                    <span
                                      className="hidden md:block absolute bg-[#50b848]"
                                      style={{
                                        width: '160px',
                                        height: '4px',
                                        transformOrigin: 'right center',
                                        transform: `rotate(${scrollRotation}deg)`,
                                        transition: 'transform 0.1s ease-out',
                                        right: '-10px',
                                        bottom: '-8px'
                                      }}
                                    ></span>
                                  </span>
                                );
                              }
                              return <span key={index}>{part}</span>;
                            })}
                          </>
                        );
                      })()}
                    </h2>
                    
                    {/* Video Card - Below heading in left column */}
                    <div className="relative overflow-hidden shadow-2xl rounded-xl mt-8 lg:mt-24">
                      <div className="relative" style={{ paddingBottom: '56.25%', width: '100%' }}>
                        {/* Cover Image - Show when video is not playing */}
                        {!isVideoPlaying && coverImagePath && (
                          <>
                            <img
                              src={coverImagePath}
                              alt={videoTitle}
                              className="absolute inset-0 w-full h-full object-cover z-10"
                              style={{ objectPosition: coverImagePosition, objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {/* Play Button Overlay */}
                            <div
                              className="absolute inset-0 z-20 flex items-center justify-center transition-colors cursor-pointer"
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                              onClick={() => setIsVideoPlaying(true)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
                            >
                              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                                <i className="ri-play-fill text-4xl text-gray-900 ml-1"></i>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Video Iframe - Show when playing */}
                        {isVideoPlaying && (
                          <iframe
                            className="absolute inset-0 w-full h-full z-10"
                            src={videoUrl}
                            title={videoTitle}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )}

                        {/* Fallback if no cover image - show video directly */}
                        {!coverImagePath && (
                          <iframe
                            className="absolute inset-0 w-full h-full z-10"
                            src={videoUrl}
                            title={videoTitle}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p
                      id="main-p1"
                      data-animate
                      className={`text-sm md:text-base text-gray-700 leading-relaxed font-bold transition-all duration-1000 ${isVisible['main-p1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                      {paragraph1}
                    </p>
                    <p
                      id="main-p2"
                      data-animate
                      className={`text-sm md:text-base text-gray-700 leading-relaxed transition-all duration-1000 delay-200 ${isVisible['main-p2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                      {paragraph2}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}



        {/* Life as a Refexian Section */}
        {(() => {
          const lifeRefexianSection = pageSections['life-refexian'];
          const title = getSectionContent(lifeRefexianSection, 'title') || 'Life as A #Refexian';
          const description = getSectionContent(lifeRefexianSection, 'description') || 'We\'re Nurturing Diversity, Embracing Inclusion, Igniting Passion, and Fostering Growth.';
          const backgroundColor = getSectionContent(lifeRefexianSection, 'backgroundColor') || '#ff7f50';
          const image = getSectionContent(lifeRefexianSection, 'image');
          const imagePath = image?.path || (image ? getImagePath(image) : CareersGallery1);
          const backgroundImage = getSectionContent(lifeRefexianSection, 'backgroundImage');
          const backgroundImagePath = backgroundImage?.path || (backgroundImage ? getImagePath(backgroundImage) : null);

          // Determine section style
          const sectionStyle: React.CSSProperties = backgroundImagePath
            ? {
              backgroundImage: `url(${backgroundImagePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative'
            }
            : { backgroundColor };

          return (
            <section className="py-16 md:py-20" style={sectionStyle}>
              <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h2
                    id="refexian-title"
                    data-animate
                    className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-1000 ${isVisible['refexian-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {title}
                  </h2>
                  <p
                    id="refexian-desc"
                    data-animate
                    className={`text-sm md:text-base transition-all duration-1000 delay-200 ${isVisible['refexian-desc'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {description}
                  </p>
                </div>
                <div
                  id="refexian-image"
                  data-animate
                  className={`mt-12 transition-all duration-1000 delay-300 ${isVisible['refexian-image'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                  <img
                    src={imagePath}
                    alt="Life at Refex"
                    className="w-full max-w-5xl mx-auto rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </section>
          );
        })()}

        {/* Why Choose Refex Section */}
        {(() => {
          const whyChooseSection = pageSections['why-choose'];
          const heading = getSectionContent(whyChooseSection, 'heading') || 'Why choose Refex?';
          const fallbackCards = [
            {
              icon: NurturingTalent,
              title: 'Nurturing Talent',
              description: 'Harnessing the power of potential, our extensive training program is dedicated to identifying and nurturing talent to reach new heights.',
            },
            {
              icon: CultureInclusion,
              title: 'Culture & Inclusion',
              description: 'Working towards creating a workplace where everyone feels valued and has equal opportunities for success.',
            },
            {
              icon: CenterOfExcellence,
              title: 'Center of Excellence',
              description: 'Investing in the growth and development of our employees to drive long-term success for both individuals and the company.',
            },
          ];
          const cardsToShow = whyChooseCards.length > 0 ? whyChooseCards : fallbackCards;

          return (
            <section className="py-8 md:py-10 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-12">
                  <h2
                    id="why-title"
                    data-animate
                    className={`text-2xl md:text-3xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${isVisible['why-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {heading}
                  </h2>
                  <div
                    id="why-divider"
                    data-animate
                    className={`w-24 h-1 bg-[#50b848] mx-auto transition-all duration-1000 delay-300 ${isVisible['why-divider'] ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                  {cardsToShow.map((item: any, index: number) => {
                    const iconPath = item.icon?.path || (item.icon ? getImagePath(item.icon) : item.icon) || (fallbackCards[index]?.icon || '');

                    return (
                      <div
                        key={index}
                        id={`why-card-${index}`}
                        data-animate
                        className={`text-center transition-all duration-1000 ${isVisible[`why-card-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                          }`}
                        style={{ transitionDelay: `${index * 300}ms` }}
                      >
                        <div className="mb-6 flex justify-center">
                          <img src={iconPath} alt={item.title || 'Card'} className="w-20 h-20 object-contain" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title || 'Card'}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description || ''}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Application Form Section */}
        {(() => {
          const applicationFormSection = pageSections['application-form'];
          const leftTitle = getSectionContent(applicationFormSection, 'leftTitle') || 'Make a Difference';
          const leftSubtitle = getSectionContent(applicationFormSection, 'leftSubtitle') || 'Shape Your Future with Refex';
          const backgroundImage = getSectionContent(applicationFormSection, 'backgroundImage');
          // Handle backgroundImage - could be object with path, string URL, or mediaId
          let bgImagePath = CareersBg2;
          if (backgroundImage) {
            if (typeof backgroundImage === 'object' && backgroundImage.path) {
              bgImagePath = backgroundImage.path;
            } else if (typeof backgroundImage === 'string') {
              bgImagePath = getImagePath(backgroundImage);
            }
          }
          // Also check if backgroundImage is stored in section content with media
          if (applicationFormSection?.content) {
            const bgImageContent = applicationFormSection.content.find((c: any) => c.contentKey === 'backgroundImage');
            if (bgImageContent?.media?.filePath) {
              bgImagePath = getImagePath(bgImageContent.media);
            } else if (bgImageContent?.contentValue && bgImagePath === CareersBg2) {
              // Try to parse as mediaId or use as URL
              const parsed = parseInt(bgImageContent.contentValue);
              if (!isNaN(parsed) && parsed > 0 && bgImageContent.mediaId) {
                // It's a mediaId - should have been resolved
                if (bgImageContent.media?.filePath) {
                  bgImagePath = getImagePath(bgImageContent.media);
                }
              } else if (bgImageContent.contentValue && typeof bgImageContent.contentValue === 'string') {
                bgImagePath = getImagePath(bgImageContent.contentValue);
              }
            }
          }
          const formTitle = getSectionContent(applicationFormSection, 'formTitle') || 'Apply now';

          return (
            <section id="apply" className="py-8 md:py-10 bg-white scroll-mt-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Side - Background Image with Gradient Overlay */}
                  <div
                    id="form-left"
                    data-animate
                    className={`relative rounded-lg p-8 md:p-12 flex items-center justify-center text-white transition-all duration-1000 overflow-hidden ${isVisible['form-left'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                      }`}
                    style={{
                      backgroundImage: `url(${bgImagePath})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(118deg, rgba(80, 184, 72, 0.73) 0%, rgba(107, 166, 68, 0.73) 100%)',
                        mixBlendMode: 'normal'
                      }}
                    ></div>

                    {/* Content */}
                    <div className="text-center relative z-10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">{leftTitle}</h2>
                      <p className="text-base md:text-lg">{leftSubtitle}</p>
                    </div>
                  </div>

                  {/* Right Side - Application Form */}
                  <div
                    id="form-right"
                    data-animate
                    className={`bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 transition-all duration-1000 ${isVisible['form-right'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                      }`}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{formTitle}</h2>

                    {/* Success/Error Message */}
                    {submitMessage && (
                      <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                          {submitMessage.text}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="e.g., John"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#50b848] focus:border-transparent"
                          />
                          {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="e.g., Doe"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#50b848] focus:border-transparent"
                          />
                          {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                        </div>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#50b848] focus:border-transparent"
                      />
                      {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-full focus-within:ring-2 focus-within:ring-[#50b848] focus-within:border-transparent">
                        <PhoneInput
                          country="in"
                          value={formData.phone.replace(/^\+/, '')}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: value ? `+${value}` : '',
                            }))
                          }
                          inputProps={{ name: 'phone', autoComplete: 'tel' }}
                          containerClass="w-full"
                          inputClass="!w-full !border-0 !shadow-none focus:!outline-none !rounded-full"
                          buttonClass="!bg-transparent !border-0"
                          placeholder="Enter phone number"
                        />
                      </div>
                      {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Upload your CV here {resumeFile && <span className="text-green-600">✓ {resumeFile.name}</span>}
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#50b848] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#50b848] file:text-white hover:file:bg-[#45a03d] file:cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Let us know what you need."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#50b848] focus:border-transparent resize-none"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={submitting || isCoolingDown}
                        className="bg-gray-900 text-white px-4 md:px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                      >
                        {submitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Employee Testimonials Section */}
        {(() => {
          const testimonialsSection = pageSections.testimonials;
          const heading = getSectionContent(testimonialsSection, 'heading') || 'What our employees say about us';
          const paragraph1 = getSectionContent(testimonialsSection, 'paragraph1') || 'At Refex we value employee input and foster a supportive work environment where open communication is encouraged. We believe our employees\' perspectives drive company success. It\'s a privilege to be part of a company that values its team.';
          const paragraph2 = getSectionContent(testimonialsSection, 'paragraph2') || 'At Refex, ESOP isn\'t just a financial benefit; it\'s a catalyst for life-changing milestones. For many Refexians, it has helped close long-term loans, support children\'s education, and even secure land for future homes. These stories reflect our belief in shared growth and the power of true ownership.';
          const paragraph3 = getSectionContent(testimonialsSection, 'paragraph3') || 'Hear from Refexians as they share their ESOP journeys…';
          const content = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;

          return (
            <section className="py-8 md:py-10 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-4xl mx-auto">
                  <div
                    id="testimonial-title"
                    data-animate
                    className={`text-center mb-8 transition-all duration-1000 ${isVisible['testimonial-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {heading}
                    </h2>
                  </div>
                  <div
                    id="testimonial-content"
                    data-animate
                    className={`text-gray-700 leading-relaxed transition-all duration-1000 ${isVisible['testimonial-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    <div className="whitespace-pre-line">
                      {content}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Testimonial Image Slider Section */}
        {(() => {
          const testimonialSliderSection = pageSections['testimonial-slider'];
          const defaultBadgeText = getSectionContent(testimonialSliderSection, 'badgeText') || 'RIL ESOP Testimonials';
          const carouselRef = useRef<HTMLDivElement>(null);
          const isTransitioningRef = useRef(false);

          // Define slide sizes - make 2nd and 4th slides bigger
          const getSlideSize = (index: number) => {
            // Slide 1 (index 0): max-w-6xl
            // Slide 2 (index 1): max-w-[90rem] (larger)
            // Slide 3 (index 2): max-w-6xl
            // Slide 4 (index 3): max-w-[90rem] (larger)
            if (index === 1 || index === 3) {
              return 'max-w-full sm:max-w-4xl lg:max-w-[90rem]'; // Responsive sizing for mobile
            }
            return 'max-w-full sm:max-w-4xl lg:max-w-6xl';
          };

          // Get badge text based on slide index (0-indexed)
          const getBadgeText = (index: number) => {
            // Slide 1 (index 0): default
            // Slide 2 (index 1): default
            // Slide 3 (index 2): "RIL ESOP Testimonials"
            // Slide 4 (index 3): "RRIL ESOP Testimonials"
            if (index === 2) {
              return 'RIL ESOP Testimonials';
            } else if (index === 3) {
              return 'RRIL ESOP Testimonials';
            }
            return defaultBadgeText;
          };

          const handleNext = () => {
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;

            setCurrentSlideIndex((prev) => {
              const nextIndex = prev + 1;
              // If at last slide (index 3), go to duplicate/clone of first slide (index 4)
              // Then instantly reset to first slide (index 0) without animation
              if (nextIndex >= testimonialImages.length) {
                // Animate forward to duplicate slide (index 4 = testimonialImages.length)
                // After transition completes, instantly jump back to first slide (index 0)
                setTimeout(() => {
                  if (carouselRef.current) {
                    carouselRef.current.style.transition = 'none';
                    carouselRef.current.style.transform = 'translateX(0%)';
                    // Force reflow
                    void carouselRef.current.offsetWidth;
                    // Re-enable transition
                    setTimeout(() => {
                      if (carouselRef.current) {
                        carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
                      }
                      isTransitioningRef.current = false;
                      // Reset state to 0 after visual reset
                      setCurrentSlideIndex(0);
                    }, 50);
                  }
                }, 500);
                // Return duplicate index (testimonialImages.length = 4) for forward animation
                return testimonialImages.length;
              }
              setTimeout(() => {
                isTransitioningRef.current = false;
              }, 500);
              return nextIndex;
            });
          };

          const handlePrev = () => {
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;

            setCurrentSlideIndex((prev) => {
              const prevIndex = prev - 1;
              // If at first slide, loop to last
              if (prevIndex < 0) {
                // Jump to last position without animation first
                if (carouselRef.current) {
                  carouselRef.current.style.transition = 'none';
                  carouselRef.current.style.transform = `translateX(-${testimonialImages.length * 100}%)`;
                  void carouselRef.current.offsetWidth;
                  // Then animate to last position
                  setTimeout(() => {
                    if (carouselRef.current) {
                      carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
                      carouselRef.current.style.transform = `translateX(-${(testimonialImages.length - 1) * 100}%)`;
                    }
                    setTimeout(() => {
                      isTransitioningRef.current = false;
                    }, 500);
                  }, 50);
                }
                return testimonialImages.length - 1;
              }
              setTimeout(() => {
                isTransitioningRef.current = false;
              }, 500);
              return prevIndex;
            });
          };

          // Get the actual slide index (map duplicate index 4 to 0)
          const actualSlideIndex = currentSlideIndex >= testimonialImages.length ? 0 : currentSlideIndex;

          return (
            <section className="py-16 bg-gray-900 relative overflow-hidden">
              {/* Badge - Half inside, half outside - Only show for 3rd and 4th slides */}
              {(actualSlideIndex === 2 || actualSlideIndex === 3) && (
                <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: '30px' }}>
                  <div className="bg-white px-6 py-2 rounded-full shadow-lg">
                    <span className="text-gray-900 font-semibold text-sm md:text-base">{getBadgeText(actualSlideIndex)}</span>
                  </div>
                </div>
              )}

              <div className="container mx-auto px-6 lg:px-12 pt-8">
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-300 touch-manipulation"
                  aria-label="Previous slide"
                >
                  <i className="ri-arrow-left-s-line text-xl sm:text-2xl"></i>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-300 touch-manipulation"
                  aria-label="Next slide"
                >
                  <i className="ri-arrow-right-s-line text-xl sm:text-2xl"></i>
                </button>

                {/* Image Carousel */}
                <div className="relative overflow-hidden w-full">
                  <div
                    ref={carouselRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
                  >
                    {/* Original slides */}
                    {testimonialImages.map((image, index) => (
                      <div
                        key={index}
                        className="min-w-full w-full flex items-center justify-center px-2 sm:px-4 md:px-8 flex-shrink-0"
                        style={{ width: '100%', flexShrink: 0 }}
                      >
                        <div className={`w-full ${getSlideSize(index)} mx-auto`}>
                          <img
                            src={image}
                            alt={`Testimonial ${index + 1}`}
                            className="w-full h-auto rounded-lg shadow-2xl"
                            style={{
                              backgroundColor: 'transparent',
                              display: 'block',
                              maxWidth: '100%',
                              height: 'auto',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {/* Duplicate first slide at the end for seamless forward loop */}
                    {testimonialImages.length > 0 && (
                      <div
                        key="clone-0"
                        className="min-w-full w-full flex items-center justify-center px-2 sm:px-4 md:px-8 flex-shrink-0"
                        style={{ width: '100%', flexShrink: 0 }}
                      >
                        <div className={`w-full ${getSlideSize(0)} mx-auto`}>
                          <img
                            src={testimonialImages[0]}
                            alt={`Testimonial 1`}
                            className="w-full h-auto rounded-lg shadow-2xl"
                            style={{
                              backgroundColor: 'transparent',
                              display: 'block',
                              maxWidth: '100%',
                              height: 'auto',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Know More Section */}
        {(() => {
          const knowMoreSection = pageSections['know-more'];
          const title = getSectionContent(knowMoreSection, 'title') || 'Want to know more about Refex?';
          const buttonText = getSectionContent(knowMoreSection, 'buttonText') || 'Go to About Refex';
          const buttonLink = getSectionContent(knowMoreSection, 'buttonLink') || '/about';

          return (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-6 lg:px-12 text-center">
                <h2
                  id="know-more-title"
                  data-animate
                  className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${isVisible['know-more-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                  {title}
                </h2>
                <a
                  href={buttonLink}
                  className="inline-block bg-white border-2 border-gray-900 text-gray-900 px-4 md:px-8 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer text-sm md:text-base"
                >
                  {buttonText}
                </a>
              </div>
            </section>
          );
        })()}

        {/* CTA Section */}
        {(() => {
          const ctaSection = pageSections.cta;
          const card1Title = getSectionContent(ctaSection, 'card1Title') || 'Got a question?';
          const card1ButtonText = getSectionContent(ctaSection, 'card1ButtonText') || 'Get in touch';
          const card1ButtonLink = getSectionContent(ctaSection, 'card1ButtonLink') || '/contact';
          const card2Title = getSectionContent(ctaSection, 'card2Title') || 'See our latest news';
          const card2ButtonText = getSectionContent(ctaSection, 'card2ButtonText') || 'Refex Newsroom';
          const card2ButtonLink = getSectionContent(ctaSection, 'card2ButtonLink') || '/newsroom';

          return (
            <section className="py-[27px] md:py-[34px] bg-green-50">
              <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                <div className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]" style={{ backgroundColor: '#3b9dd6' }}>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div
                      id="cta-1"
                      data-animate
                      className={`text-center transition-all duration-1000 ${isVisible['cta-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                      <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{card1Title}</h3>
                      <a
                        href={card1ButtonLink}
                        className="inline-block border-2 border-white bg-transparent text-white px-4 sm:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-normal sm:whitespace-nowrap cursor-pointer text-xs sm:text-sm md:text-base text-center"
                      >
                        {card1ButtonText}
                      </a>
                    </div>
                    <div
                      id="cta-2"
                      data-animate
                      className={`text-center transition-all duration-1000 delay-100 ${isVisible['cta-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                      <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{card2Title}</h3>
                      <a
                        href={card2ButtonLink}
                        className="inline-block border-2 border-white bg-transparent text-white px-4 sm:px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-normal sm:whitespace-nowrap cursor-pointer text-xs sm:text-sm md:text-base text-center"
                      >
                        {card2ButtonText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Footer */}
        <Footer />
      </div>
    </MainLayout>
  );
}
