import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import ContactHeroBg from '../../wp-content/uploads/2023/02/Contact-Page-Bg.jpg';
import { pagesService, sectionsService, contactFormService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useCooldownTimer } from '../../hooks/enquiry/useCooldownTimer';
import { useEmailValidation } from '../../hooks/enquiry/useEmailValidation';
import { usePhoneValidation } from '../../hooks/enquiry/usePhoneValidation';
import { checkEnquiry, createEnquiry, HttpError } from '../../hooks/enquiry/enquiryApi';

function SubmissionSuccessOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 4500);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#06121f]/90">
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-[#06121f] via-[#071a2c] to-[#06121f] shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="px-8 py-10 md:px-12 md:py-12">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
              <div className="absolute -inset-3 rounded-full border border-emerald-400/30 animate-spin [animation-duration:6s]" />
              <div className="relative h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-white text-2xl font-bold leading-none">✓</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-6 py-5">
              <p className="text-white text-lg md:text-xl font-semibold">
                Your enquiry has been <span className="text-emerald-300">submitted successfully!</span>
              </p>
              <p className="mt-2 text-sm md:text-base text-slate-200/90 leading-relaxed">
                Thank you for reaching out to us.
                <br />
                Our <span className="text-emerald-200 font-semibold">Agentic AI</span> will call you shortly for further enquiry and details.
                During the call, you can provide more details and also ask any queries you may have.
              </p>
              <p className="mt-3 text-sm text-emerald-200 font-semibold">We&apos;re here to help!</p>
            </div>

            <div className="w-full max-w-xl">
              <p className="text-xs text-slate-200/70 mb-2">You will be redirected shortly...</p>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse" />
              </div>
            </div>

            <button
              type="button"
              onClick={onDone}
              className="mt-2 text-xs text-slate-200/70 hover:text-slate-200 underline underline-offset-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_SECTIONS = [
  'General Enquiry',
  'Refex Ash utilization & Coal Handling',
  'Refex Renewables',
  'Refex MedTech',
  'Refex Airports and Transportation',
  'Refex Mobility',
  'Refex Life Sciences',
  'Venwind Refex',
] as const;

function normalizeProductKey(v: string) {
  return String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function dedupeProducts(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const key = normalizeProductKey(v);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

const REFEX_MEDTECH_PRODUCTS = dedupeProducts([
  // From latest 3imedtech lists
  'Mini 90 Point-of-Care X-Ray',
  'ADONIS HF Mobile DR',
  'PINKVIEW DR PLUS (Digital Mammography)',
  'PINKVIEW RT (Analog Mammography)',
  'Glass-Free Flat Panel Detector',
  'Retrofit Mammography Panel',
  'DMD D 2000, X-Ray Film Digitizer',
  'Image Display Monitors',
  'CT/MR/Mammograph Multi-Modality Workstations',
  'CD/DVD Publishers',
  'MedE Drive for Patient Data Storage',
  'Anamaya',
  'Philips Achieva 3.0Tesla X-Series',
  'GE Signa HDxt 1.5Tesla',

  // From earlier 3imedtech screenshot
  'FPD C-ARM',
  'DReam CMT-Dual (Ceiling Type, Dual Detector)',
  'DReam CMT-Single (Ceiling Type, Single Detector)',
  'DReam Floor Mounted DR',
  'ADONIS 100HF/150HF Mobile X-Ray',
  'ADONIS HF Radiographic Systems 300mA / 500mA / 600mA',

  // From Adonis contact product list
  'HF Mobile',
  'HF Fixed',
  'FPD-C-Arm',
  '1K*1K High End HF C-ARM',
  'Line Frequency X-Ray Systems',
  'Digital Radiography',
  'Dream Series-Ceiling Suspended',
]);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    enquiringFor: 'Sales',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'phone' | 'product' | 'message', string>>>({});
  const [touched, setTouched] = useState<Partial<Record<'name' | 'email' | 'phone' | 'product' | 'message', boolean>>>({});
  const { isCoolingDown, secondsLeft, startCooldown } = useCooldownTimer(10);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeProductSection, setActiveProductSection] = useState<(typeof PRODUCT_SECTIONS)[number]>('General Enquiry');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const emailValidation = useEmailValidation(formData.email, true);
  const phoneValidation = usePhoneValidation(formData.phone, true);
  const productError = !String(formData.product || '').trim() ? 'Product is required' : null;
  const messageError =
    !formData.message.trim()
      ? 'Message is required'
      : formData.message.trim().length < 15
        ? 'Message must be at least 15 characters'
        : null;

  const validateAndSet = (field: keyof typeof touched) => {
    const next: Partial<Record<'name' | 'email' | 'phone' | 'product' | 'message', string>> = {};
    if (field === 'name') {
      next.name = !formData.name.trim() ? 'Name is required' : formData.name.trim().length < 2 ? 'Name must be at least 2 characters' : undefined;
    }
    if (field === 'email') next.email = emailValidation.validate() || undefined;
    if (field === 'phone') next.phone = phoneValidation.validate() || undefined;
    if (field === 'product') next.product = productError || undefined;
    if (field === 'message') next.message = messageError || undefined;
    setFieldErrors((prev) => ({ ...prev, ...next }));
  };
  const [pageSections, setPageSections] = useState<any>({});
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

    // For image fields, return the media path or contentValue
    if (contentItem.media || contentItem.mediaId) {
      const imagePath = getImagePath(contentItem.media);
      if (imagePath) {
        return {
          path: imagePath
        };
      }
      // If getImagePath returns empty, try contentValue as fallback
      if (contentItem.contentValue) {
        return contentItem.contentValue;
      }
      return null;
    }

    // For non-image fields, return contentValue directly
    return contentItem.contentValue || null;
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);

        // Fetch page and sections
        const page = await pagesService.getBySlug('contact');
        if (page?.id) {
          const sections = await sectionsService.getByPageId(page.id);
          const sectionsMap: any = {};
          sections.forEach((section: any) => {
            sectionsMap[section.sectionKey] = section;
          });
          setPageSections(sectionsMap);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setFieldErrors({});

    try {
      if (isCoolingDown) return;

      const nextErrors: typeof fieldErrors = {};
      if (!formData.name.trim() || formData.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters';
      const emailErr = emailValidation.validate();
      if (emailErr) nextErrors.email = emailErr;
      const phoneErr = phoneValidation.validate();
      if (phoneErr) nextErrors.phone = phoneErr;
      if (messageError) nextErrors.message = messageError;
      if (Object.keys(nextErrors).length) {
        setFieldErrors(nextErrors);
        setTouched({ name: true, email: true, phone: true, message: true });
        setSubmitStatus('error');
        return;
      }

      // Duplicate check (skip if endpoint not present)
      try {
        const dup = await checkEnquiry({
          name: formData.name.trim(),
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
          setSubmitStatus('error');
          return;
        }
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 404)) throw err;
      }

      // Preferred API
      try {
        await createEnquiry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          product: formData.product,
          enquiringFor: formData.enquiringFor,
          message: formData.message,
          source: 'refexgroup-contact',
        });
        setSubmitStatus('success');
      setShowSuccessOverlay(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          product: '',
          enquiringFor: 'Sales',
          message: '',
        });
        startCooldown();
        return;
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 404)) throw err;
      }

      // Fallback: preserve existing submission behavior
      const result = await contactFormService.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        product: formData.product,
        enquiringFor: formData.enquiringFor,
        message: formData.message,
      });

      if (result) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          product: '',
          enquiringFor: 'Sales',
          message: '',
        });
        startCooldown();
      } else {
        setSubmitStatus('error');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    const key = e.target.name as keyof typeof touched;
    if (key in touched) {
      setTouched((prev) => ({ ...prev, [key]: true }));
      if (touched[key]) validateAndSet(key);
    }
  };

  const selectProductAndClose = (value: string) => {
    setFormData((prev) => ({ ...prev, product: value }));
    setTouched((prev) => ({ ...prev, product: true }));
    setFieldErrors((prev) => ({ ...prev, product: undefined }));
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    if (!isProductModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProductModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isProductModalOpen]);

  return (
    <MainLayout>
      {showSuccessOverlay && (
        <SubmissionSuccessOverlay
          onDone={() => {
            setShowSuccessOverlay(false);
            setSubmitStatus('idle');
          }}
        />
      )}
      <div className="min-h-screen bg-white">
        {/* Hero Section with Green Background */}
        {(() => {
          const heroSection = pageSections.hero;
          const bgImage = getSectionContent(heroSection, 'backgroundImage');

          // Handle background image path - support both object with path and direct string
          let bgImagePath = ContactHeroBg; // Default fallback
          if (bgImage) {
            let resolvedPath = '';
            if (typeof bgImage === 'object' && bgImage.path) {
              resolvedPath = bgImage.path;
            } else if (typeof bgImage === 'string' && bgImage.trim()) {
              resolvedPath = bgImage;
            } else {
              resolvedPath = getImagePath(bgImage);
            }

            // Only use resolved path if it's valid (not empty and not just whitespace)
            if (resolvedPath && resolvedPath.trim() && resolvedPath !== 'null' && resolvedPath !== 'undefined') {
              bgImagePath = resolvedPath;
            }
          }

          // Ensure the path is properly formatted
          if (bgImagePath && bgImagePath.startsWith('/uploads/')) {
            const apiBase = getApiBaseUrl();
            bgImagePath = `${apiBase}${bgImagePath}`;
          } else if (bgImagePath && !bgImagePath.startsWith('http') && !bgImagePath.startsWith('/') && bgImagePath !== ContactHeroBg) {
            // If it's a relative path, make sure it's accessible
            bgImagePath = bgImagePath.startsWith('/') ? bgImagePath : `/${bgImagePath}`;
          }

          const tagline = getSectionContent(heroSection, 'tagline') || '';
          const title = getSectionContent(heroSection, 'title') || 'Get in touch with us for any questions, comments, or business inquiries.';
          const officeLabel = getSectionContent(heroSection, 'officeLabel') || 'CORPORATE OFFICE';
          const companyName = getSectionContent(heroSection, 'companyName') || 'Refex Group';
          const address = getSectionContent(heroSection, 'address') || 'Refex Building,<br />67, Bazullah Road,<br />Parthasarathy Puram, T Nagar<br />Chennai – 600017';
          const phone = getSectionContent(heroSection, 'phone') || '044 – 4340 5900';
          const phoneLink = getSectionContent(heroSection, 'phoneLink') || '04443405900';
          const email = getSectionContent(heroSection, 'email') || 'info@refex.co.in';
          const backgroundColor = getSectionContent(heroSection, 'backgroundColor') || '#7cb342';
          const overlayOpacity = getSectionContent(heroSection, 'overlayOpacity') || 10;
          const overlayOpacityValue = typeof overlayOpacity === 'number' ? overlayOpacity : parseFloat(overlayOpacity) || 10;

          return (
            <section className="relative py-20 lg:py-24 min-h-[500px] flex items-center overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={bgImagePath}
                  alt="Contact Background"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // If CMS image fails to load, fallback to default
                    if ((e.target as HTMLImageElement).src !== ContactHeroBg) {
                      (e.target as HTMLImageElement).src = ContactHeroBg;
                    }
                  }}
                />
                {/* Dark overlay with configurable opacity */}
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: overlayOpacityValue / 100 }}
                ></div>
              </div>

              <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-[1210px]">
                {/* Green Context Box */}
                <div
                  className="w-full lg:max-w-xl p-8 lg:p-12 shadow-2xl"
                  style={{ backgroundColor }}
                  data-aos="fade-up"
                  data-aos-duration="800"
                >
                  {tagline && (
                    <p className="text-white/90 text-sm mb-4 tracking-wide">{tagline}</p>
                  )}
                  <h1 className="text-xl lg:text-2xl font-bold text-white mb-8 leading-tight">
                    {title}
                  </h1>

                  <div className="space-y-6 text-white">
                    <h2 className="text-[0.7rem] md:text-xs font-semibold uppercase tracking-wider opacity-90">{officeLabel}</h2>

                    <div className="space-y-1">
                      <p className="font-bold text-base md:text-lg mb-2">{companyName}</p>
                      <p className="text-xs md:text-sm leading-relaxed opacity-95" dangerouslySetInnerHTML={{ __html: address }}></p>
                      <div className="pt-4 space-y-1">
                        <p className="text-xs md:text-sm font-medium">
                          Phone: <a href={`tel:${phoneLink}`} className="hover:underline">{phone}</a>
                        </p>
                        <p className="text-xs md:text-sm font-medium">
                          Email: <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Contact Form & Map Section */}
        {(() => {
          const contactFormSection = pageSections['contact-form'];
          const formTitle = getSectionContent(contactFormSection, 'title') || 'Get In Touch';
          const formDescription = getSectionContent(contactFormSection, 'description') || 'We welcome your questions, comments, and business inquiries.';
          const mapUrl = getSectionContent(contactFormSection, 'mapUrl') || 'https://maps.google.com/maps?q=Refex%20Group%2C%20Chennai&t=m&z=10&output=embed&iwloc=near';

          return (
            <section className="py-16 lg:py-20 bg-white">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Contact Form */}
                  <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {formTitle}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-8">
                      {formDescription}
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      data-readdy-form
                      id="contact-form"
                    >
                      {isProductModalOpen && (
                        <div
                          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                          role="dialog"
                          aria-modal="true"
                          aria-label="Choose product"
                          onMouseDown={() => setIsProductModalOpen(false)}
                        >
                          <div className="absolute inset-0 bg-black/40" />
                          <div
                            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[85vh] flex flex-col"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0 bg-white">
                              <div className="min-w-0">
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">Choose product</h3>
                                <p className="text-xs md:text-sm text-gray-500 truncate">Select a section, then choose a product.</p>
                              </div>
                              <button
                                type="button"
                                className="ml-4 inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 text-gray-600"
                                onClick={() => setIsProductModalOpen(false)}
                                aria-label="Close"
                              >
                                <span className="text-xl leading-none">×</span>
                              </button>
                            </div>

                            <div className="grid md:grid-cols-[260px_1fr] flex-1 min-h-0">
                              <div className="border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-3 overflow-auto">
                                <div className="space-y-1">
                                  {PRODUCT_SECTIONS.map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setActiveProductSection(s)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                        activeProductSection === s
                                          ? 'bg-gray-900 text-white'
                                          : 'hover:bg-gray-200 text-gray-800'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 overflow-auto min-h-0">
                                {activeProductSection === 'Refex MedTech' ? (
                                  <div className="flex flex-wrap gap-2">
                                    {REFEX_MEDTECH_PRODUCTS.map((p) => (
                                      <button
                                        key={p}
                                        type="button"
                                        onClick={() => selectProductAndClose(p)}
                                        className="px-3 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition text-left"
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                      {activeProductSection === 'General Enquiry'
                                        ? 'For general questions, choose General Enquiry.'
                                        : 'Choose this business unit.'}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => selectProductAndClose(activeProductSection)}
                                      className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
                                    >
                                      {activeProductSection}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, name: true }));
                            validateAndSet('name');
                          }}
                          className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g., John Doe"
                        />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, email: true }));
                            validateAndSet('email');
                          }}
                          className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="name@company.com"
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <div className={`w-full px-4 py-2 border rounded-md focus-within:ring-1 focus-within:ring-gray-400 focus-within:border-gray-400 transition-all text-sm ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                          <PhoneInput
                            country="in"
                            value={formData.phone.replace(/^\+/, '')}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: value ? `+${value}` : '',
                              }))
                            }
                            inputProps={{
                              id: 'phone',
                              name: 'phone',
                              autoComplete: 'tel',
                              required: true,
                              onBlur: () => {
                                setTouched((prev) => ({ ...prev, phone: true }));
                                validateAndSet('phone');
                              }
                            }}
                            containerClass="w-full"
                            inputClass="!w-full !border-0 !shadow-none focus:!outline-none"
                            buttonClass="!bg-transparent !border-0"
                            placeholder="Enter phone number"
                          />
                        </div>
                        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                      </div>

                      <div>
                        <select
                          id="enquiringFor"
                          name="enquiringFor"
                          value={formData.enquiringFor}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm appearance-none bg-white cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem',
                          }}
                        >
                          <option value="Sales">Sales</option>
                          <option value="Support">Support</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                          Product <span className="text-red-500">*</span>
                        </label>
                        <button
                          id="product"
                          type="button"
                          onClick={() => setIsProductModalOpen(true)}
                          onBlur={() => validateAndSet('product')}
                          className={`w-full px-4 py-3 border rounded-md text-left text-sm bg-white hover:bg-gray-50 transition ${
                            fieldErrors.product ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <span className={formData.product ? 'text-gray-900' : 'text-gray-400'}>
                            {formData.product || 'Choose product'}
                          </span>
                        </button>
                        {fieldErrors.product && <p className="text-xs text-red-500 mt-1">{fieldErrors.product}</p>}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, message: true }));
                            validateAndSet('message');
                          }}
                          maxLength={500}
                          className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all resize-none text-sm ${fieldErrors.message ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Let us know what you need."
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                        {fieldErrors.message && <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>}
                      </div>

                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                          Thank you! Your message has been sent successfully.
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                          Sorry, there was an error sending your message. Please try again.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || isCoolingDown}
                        className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </form>
                  </div>

                  {/* Map */}
                  <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="200"
                  >
                    <div className="h-full min-h-[500px] rounded-lg overflow-hidden shadow-lg bg-gray-100">
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: '500px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Refex Group Location"
                      ></iframe>
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
          const card1Title = getSectionContent(ctaSection, 'card1Title') || 'See our latest news';
          const card1ButtonText = getSectionContent(ctaSection, 'card1ButtonText') || 'Refex Newsroom';
          const card1ButtonLink = getSectionContent(ctaSection, 'card1ButtonLink') || '/newsroom';
          const card2Title = getSectionContent(ctaSection, 'card2Title') || 'Work at Refex';
          const card2ButtonText = getSectionContent(ctaSection, 'card2ButtonText') || 'Careers';
          const card2ButtonLink = getSectionContent(ctaSection, 'card2ButtonLink') || '/careers';
          const bgGradientFrom = getSectionContent(ctaSection, 'bgGradientFrom') || '#3b8ac6';
          const bgGradientTo = getSectionContent(ctaSection, 'bgGradientTo') || '#4a9fd8';

          return (
            <section
              className="py-6 md:py-8"
              style={{ background: `linear-gradient(to right, ${bgGradientFrom}, ${bgGradientTo})` }}
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* See our latest news */}
                  <div
                    className="text-center"
                    data-aos="fade-up"
                    data-aos-duration="800"
                  >
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
                      {card1Title}
                    </h2>
                    <a
                      href={card1ButtonLink}
                      className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-[#3b8ac6] transition-all whitespace-nowrap cursor-pointer"
                    >
                      {card1ButtonText}
                    </a>
                  </div>

                  {/* Work at Refex */}
                  <div
                    className="text-center"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="100"
                  >
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
                      {card2Title}
                    </h2>
                    <a
                      href={card2ButtonLink}
                      className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-[#3b8ac6] transition-all whitespace-nowrap cursor-pointer"
                    >
                      {card2ButtonText}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
      </div>
      <Footer />
    </MainLayout>
  );
}
