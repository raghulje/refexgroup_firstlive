import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';
import ContactHeroBg from '../../wp-content/uploads/2023/02/Contact-Page-Bg.jpg';
import { pagesService, sectionsService, contactFormService } from '../../services/apiService';
import { getApiBaseUrl } from '../../config/env';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiringFor: 'Sales',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
    setErrorMessage('');

    try {
      const result = await contactFormService.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        enquiringFor: formData.enquiringFor,
        message: formData.message,
      });

      if (result) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          enquiringFor: 'Sales',
          message: '',
        });
        setErrorMessage('');
      } else {
        setSubmitStatus('error');
        setErrorMessage('Sorry, there was an error sending your message. Please try again.');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      
      if (error.response?.data?.errors?.length > 0) {
        setErrorMessage(error.response.data.errors[0].msg);
      } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Sorry, there was an error sending your message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <MainLayout>
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
                      <div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          minLength={2}
                          maxLength={100}
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm"
                          placeholder="Your Name"
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm"
                          placeholder="Your Email"
                        />
                      </div>

                      <div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-sm"
                          placeholder="Your Phone Number"
                        />
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
                        <textarea
                          id="message"
                          name="message"
                          required
                          minLength={10}
                          maxLength={2000}
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all resize-none text-sm"
                          placeholder="Your Message"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">{formData.message.length}/2000 characters</p>
                      </div>

                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                          Thank you! Your message has been sent successfully.
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                          {errorMessage || 'Sorry, there was an error sending your message. Please try again.'}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
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
