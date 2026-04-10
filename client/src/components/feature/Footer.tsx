import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PhoneIcon from '../../pages/svg/footer/phone.svg';
import MailIcon from '../../pages/svg/footer/mail.svg';
import LinkedinIcon from '../../pages/svg/footer/linkedin.svg';
import FacebookIcon from '../../pages/svg/footer/facebook.svg';
import XIcon from '../../pages/svg/footer/x.svg';
import YoutubeIcon from '../../pages/svg/footer/youtube.svg';
import InstagramIcon from '../../pages/svg/footer/instagram.svg';
import { getApiBaseUrl } from '../../config/env';
import { getCachedFooterSections, getCachedGlobalSettings, getCachedSocialLinks } from '../../services/siteDataCache';

const FOOTER_CACHE_TTL_MS = 30000;
let footerCache: {
  ts: number;
  businessLinks: any[];
  quickLinks: any[];
  otherLinks: any[];
  socialLinks: any[];
  footerLogo: string;
  copyrightText: string;
  complaintPhone: string;
  complaintEmail: string;
  privacyPolicyUrl: string;
  termsOfUseUrl: string;
} | null = null;

export default function Footer() {
  const [businessLinks, setBusinessLinks] = useState([
    { label: 'Refex Refrigerants', path: '/refex-refrigerants' },
    { label: 'Refex Renewables', path: '/refex-renewables' },
    { label: 'Refex Ash & Coal Handling', path: '/refex-ash-coal-handling' },
    { label: 'Refex Medtech', path: '/refex-medtech' },
    { label: 'Refex Capital', path: '/refex-capital' },
    { label: 'Refex Airports and Transportation', path: '/refex-airports' },
    { label: 'Refex Mobility', path: '/refex-mobility' },
    { label: 'Refex Life Sciences', path: '/pharma-rl-fine-chem' },
    { label: 'Venwind Refex', path: '/venwind-refex' }
  ]);

  const [quickLinks, setQuickLinks] = useState([
    { label: 'About Refex', path: '/about-refex' },
    { label: 'Leadership Team', path: '/about-refex#leadership' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'ESG', path: '/esg' },
    { label: 'Diversity & Inclusion', path: '/diversity-inclusion' }
  ]);

  const [otherLinks, setOtherLinks] = useState([
    { label: 'INVESTMENTS', path: '/investments' },
    { label: 'NEWSROOM', path: '/newsroom' },
    { label: 'CAREERS', path: '/careers' },
    { label: 'CONTACT US', path: '/contact' }
  ]);

  const [socialLinks, setSocialLinks] = useState([
    { icon: LinkedinIcon, url: 'https://www.linkedin.com/company/refex-group/', label: 'LinkedIn' },
    { icon: FacebookIcon, url: 'https://www.facebook.com/refexindustrieslimited/', label: 'Facebook' },
    { icon: XIcon, url: 'https://twitter.com/GroupRefex', label: 'X' },
    { icon: YoutubeIcon, url: 'https://www.youtube.com/@refexgroup', label: 'YouTube' },
    { icon: InstagramIcon, url: 'https://www.instagram.com/refexgroup/', label: 'Instagram' }
  ]);

  const [footerLogo, setFooterLogo] = useState('/assets/logos/refex-logo.png');
  const [copyrightText, setCopyrightText] = useState('2024 REFEX. All right reserved.');
  const [complaintPhone, setComplaintPhone] = useState('+91 96297 38734');
  const [complaintEmail, setComplaintEmail] = useState('refexcares@refex.co.in');
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('https://www.refex.group/privacy-policy/');
  const [termsOfUseUrl, setTermsOfUseUrl] = useState('https://www.refex.group/terms-of-use/');
  const fetchingRef = useRef<boolean>(false); // Prevent concurrent fetches
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Debounce refresh

  // Helper function to get image path from media object
  const getImagePath = (media: any): string => {
    if (!media) return '';
    if (typeof media === 'string') {
      if (media.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${media}`;
      }
      return media;
    }
    if (media.filePath) {
      if (media.filePath.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${media.filePath}`;
      }
      return media.filePath;
    }
    if (media.url) return media.url;
    return '';
  };

  // Icon map for social links fallback
  const iconMap: any = {
    'linkedin': LinkedinIcon,
    'facebook': FacebookIcon,
    'twitter': XIcon,
    'x': XIcon,
    'youtube': YoutubeIcon,
    'instagram': InstagramIcon,
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      // Prevent concurrent fetches
      if (fetchingRef.current) {
        return;
      }

      // Fast-path: reuse recent footer payload to avoid bursts on rapid route switches
      if (footerCache && (Date.now() - footerCache.ts) < FOOTER_CACHE_TTL_MS) {
        setBusinessLinks(footerCache.businessLinks);
        setQuickLinks(footerCache.quickLinks);
        setOtherLinks(footerCache.otherLinks);
        setSocialLinks(footerCache.socialLinks);
        setFooterLogo(footerCache.footerLogo);
        setCopyrightText(footerCache.copyrightText);
        setComplaintPhone(footerCache.complaintPhone);
        setComplaintEmail(footerCache.complaintEmail);
        setPrivacyPolicyUrl(footerCache.privacyPolicyUrl);
        setTermsOfUseUrl(footerCache.termsOfUseUrl);
        return;
      }

      try {
        fetchingRef.current = true;
        
        // Track resolved values for cache snapshot
        let resolvedBusinessLinks = businessLinks;
        let resolvedQuickLinks = quickLinks;
        let resolvedOtherLinks = otherLinks;
        let resolvedSocialLinks = socialLinks;
        let resolvedFooterLogo = footerLogo;
        let resolvedCopyright = copyrightText;
        let resolvedComplaintPhone = complaintPhone;
        let resolvedComplaintEmail = complaintEmail;
        let resolvedPrivacyPolicy = privacyPolicyUrl;
        let resolvedTermsOfUse = termsOfUseUrl;

        // Fetch footer sections
        const sectionsData = await getCachedFooterSections();
        const activeSections = sectionsData
          .filter((section: any) => section.isActive)
          .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

        // Transform sections to links
        activeSections.forEach((section: any) => {
          const links = typeof section.links === 'string' ? JSON.parse(section.links) : (section.links || []);
          const transformedLinks = links.map((link: any) => ({
            label: link.label || link.title,
            path: link.path || link.url || '#',
          }));

          if (section.sectionType === 'business') {
            if (transformedLinks.length > 0) {
              setBusinessLinks((prevLinks) => {
                const prevStr = JSON.stringify(prevLinks);
                const newStr = JSON.stringify(transformedLinks);
                return prevStr === newStr ? prevLinks : transformedLinks;
              });
              resolvedBusinessLinks = transformedLinks;
            }
          } else if (section.sectionType === 'quick-links') {
            if (transformedLinks.length > 0) {
              setQuickLinks((prevLinks) => {
                const prevStr = JSON.stringify(prevLinks);
                const newStr = JSON.stringify(transformedLinks);
                return prevStr === newStr ? prevLinks : transformedLinks;
              });
              resolvedQuickLinks = transformedLinks;
            }
          } else if (section.sectionType === 'other-links') {
            if (transformedLinks.length > 0) {
              setOtherLinks((prevLinks) => {
                const prevStr = JSON.stringify(prevLinks);
                const newStr = JSON.stringify(transformedLinks);
                return prevStr === newStr ? prevLinks : transformedLinks;
              });
              resolvedOtherLinks = transformedLinks;
            }
          }
        });

        // Fetch social links
        const socialData = await getCachedSocialLinks();
        const activeSocialLinks = socialData
          .filter((link: any) => link.isActive)
          .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
          .map((link: any) => {
            const platform = (link.platform || '').toLowerCase();
            const icon = link.icon ? getImagePath(link.icon) : (iconMap[platform] || LinkedinIcon);
            return {
              icon: typeof icon === 'string' ? icon : icon,
              url: link.url || '#',
              label: link.platform || 'Social',
            };
          });

        if (activeSocialLinks.length > 0) {
          setSocialLinks((prevLinks) => {
            const prevStr = JSON.stringify(prevLinks);
            const newStr = JSON.stringify(activeSocialLinks);
            return prevStr === newStr ? prevLinks : activeSocialLinks;
          });
          resolvedSocialLinks = activeSocialLinks;
        }

        // Fetch footer settings
        const settings = await getCachedGlobalSettings();
        if (settings) {
          // Logo
          if (settings.logo_footer_id) {
            try {
              const { mediaService } = await import('../../services/apiService');
              const media = await mediaService.getById(settings.logo_footer_id);
              if (media?.filePath) {
                const apiBase = getApiBaseUrl();
                const newLogo = media.filePath.startsWith('/uploads/') ? `${apiBase}${media.filePath}` : media.filePath;
                setFooterLogo((prevLogo) => prevLogo !== newLogo ? newLogo : prevLogo);
                resolvedFooterLogo = newLogo;
              }
            } catch (e) {
              console.error('Error fetching footer logo:', e);
            }
          }

          // Copyright
          if (settings.copyright_text) {
            setCopyrightText((prevText) => prevText !== settings.copyright_text ? settings.copyright_text : prevText);
            resolvedCopyright = settings.copyright_text;
          }

          // Complaint contact
          if (settings.footer_complaint_phone) {
            setComplaintPhone((prevPhone) => prevPhone !== settings.footer_complaint_phone ? settings.footer_complaint_phone : prevPhone);
            resolvedComplaintPhone = settings.footer_complaint_phone;
          }
          if (settings.footer_complaint_email) {
            setComplaintEmail((prevEmail) => prevEmail !== settings.footer_complaint_email ? settings.footer_complaint_email : prevEmail);
            resolvedComplaintEmail = settings.footer_complaint_email;
          }

          // Legal links
          if (settings.footer_privacy_policy_url) {
            setPrivacyPolicyUrl((prevUrl) => prevUrl !== settings.footer_privacy_policy_url ? settings.footer_privacy_policy_url : prevUrl);
            resolvedPrivacyPolicy = settings.footer_privacy_policy_url;
          }
          if (settings.footer_terms_of_use_url) {
            setTermsOfUseUrl((prevUrl) => prevUrl !== settings.footer_terms_of_use_url ? settings.footer_terms_of_use_url : prevUrl);
            resolvedTermsOfUse = settings.footer_terms_of_use_url;
          }
        }

        footerCache = {
          ts: Date.now(),
          businessLinks: resolvedBusinessLinks,
          quickLinks: resolvedQuickLinks,
          otherLinks: resolvedOtherLinks,
          socialLinks: resolvedSocialLinks,
          footerLogo: resolvedFooterLogo,
          copyrightText: resolvedCopyright,
          complaintPhone: resolvedComplaintPhone,
          complaintEmail: resolvedComplaintEmail,
          privacyPolicyUrl: resolvedPrivacyPolicy,
          termsOfUseUrl: resolvedTermsOfUse
        };
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Fallback to hardcoded data (already set as initial state)
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchFooterData();

    // Listen for CMS updates with debouncing
    const handleRefresh = () => {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      // Debounce refresh by 300ms
      refreshTimeoutRef.current = setTimeout(() => {
        fetchFooterData();
      }, 300);
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => {
      window.removeEventListener('cms-refresh', handleRefresh);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to top when clicking any link
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-6 md:py-8">
        {/* Mobile Layout: Single Column, Centered Logo */}
        <div className="flex flex-col md:hidden space-y-6">
          {/* Logo - Centered */}
          <div className="flex flex-col items-center">
            <Link to="/" className="inline-block mb-4" onClick={handleLinkClick}>
              <img
                src={footerLogo}
                alt="Refex Group"
                className="w-[174px] h-[54px] object-contain"
              />
            </Link>
            
            {/* Follow us on - Centered */}
            <p className="text-[16px] font-bold mb-3 text-gray-900">Follow us on</p>
            
            {/* Social Media Icons - Centered */}
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {typeof social.icon === 'string' ? (
                    <img src={social.icon} alt={social.label} className="w-[25px] h-[25px] object-contain" onError={(e) => {
                      // Fallback to default icon if CMS image fails
                      const platform = social.label.toLowerCase();
                      const fallbackIcon = iconMap[platform] || LinkedinIcon;
                      if (typeof fallbackIcon === 'string') {
                        (e.target as HTMLImageElement).src = fallbackIcon;
                      }
                    }} />
                  ) : (
                    <img src={social.icon} alt={social.label} className="w-[25px] h-[25px] object-contain" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Business Links Section */}
          <div>
            <h3 className="text-[16px] font-bold mb-3 text-gray-900 border-b-2 border-[#7cb342] pb-1 inline-block">BUSINESS</h3>
            <ul className="flex flex-col mt-3">
              {businessLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-1.5 text-[16px] text-[#4D5763] hover:text-[#7cb342] transition-colors duration-300"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-[16px] font-bold mb-3 text-gray-900 border-b-2 border-[#7cb342] pb-1 inline-block">QUICK LINKS</h3>
            <ul className="flex flex-col mt-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-1.5 text-[16px] text-[#4D5763] hover:text-[#7cb342] transition-colors duration-300"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links Section - INVESTMENTS, NEWSROOM, CAREERS */}
          <div className="space-y-2.5">
            {otherLinks
              .filter(link => ['INVESTMENTS', 'NEWSROOM', 'CAREERS'].includes(link.label))
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-[16px] font-bold text-gray-900 block hover:text-[#7cb342] transition-colors duration-300"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>

        {/* Desktop Layout: 4 Column Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* Column 1: Logo & Social Media */}
          <div className="flex flex-col">
            <Link to="/" className="inline-block mb-3" onClick={handleLinkClick}>
              <img
                src={footerLogo}
                alt="Refex Group"
                className="w-[174px] h-[54px] object-contain"
              />
            </Link>
            <div className="mt-auto">
              <p className="text-[16px] font-bold mb-2.5 text-gray-900 border-b-2 border-[#7cb342] pb-1 inline-block ">Follow us on</p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    {typeof social.icon === 'string' ? (
                      <img src={social.icon} alt={social.label} className="w-[25px] h-[25px] object-contain" onError={(e) => {
                        // Fallback to default icon if CMS image fails
                        const platform = social.label.toLowerCase();
                        const fallbackIcon = iconMap[platform] || LinkedinIcon;
                        if (typeof fallbackIcon === 'string') {
                          (e.target as HTMLImageElement).src = fallbackIcon;
                        }
                      }} />
                    ) : (
                      <img src={social.icon} alt={social.label} className="w-[25px] h-[25px] object-contain" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Business Links */}
          <div>
            <h3 className="text-[16px] font-bold mb-2.5 text-gray-900 border-b-2 border-[#7cb342] pb-1 inline-block ">BUSINESS</h3>
            <ul className="flex flex-col">
              {businessLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-2 text-[16px] text-[#4D5763]  hover:text-[#7cb342] transition-colors duration-300"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-[16px] font-bold mb-2.5 text-gray-900 border-b-2 border-[#7cb342] pb-1 inline-block ">QUICK LINKS</h3>
            <ul className="flex flex-col">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-2 text-[16px] text-[#4D5763]  hover:text-[#7cb342] transition-colors duration-300"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Other Links */}
          <div>
            <ul className="flex flex-col items-start gap-2">
              {otherLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="relative text-[16px] text-[#131111]  font-semibold uppercase inline-block overflow-hidden group px-3 py-2 rounded-md"
                    onClick={handleLinkClick}
                  >
                    <span className="relative z-10 transition-colors duration-300">{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7dc144] group-hover:w-full transition-all duration-300 ease-out"></span>
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-[#7dc144] group-hover:h-full transition-all duration-500 ease-out delay-300"></span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="text-[16px] text-[#131111] mb-3.5 ">For any complaints:</p>
              <div className="space-y-1">
                <a
                  href={`https://wa.me/${complaintPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[8px] text-[18px] font-bold text-[#131111]  hover:text-[#7cb342] transition-colors duration-300"
                >
                  <img src={PhoneIcon} alt="Phone" className="w-[24px] h-[24px] object-contain" />
                  <span>{complaintPhone}</span>
                </a>
                <a
                  href={`mailto:${complaintEmail}`}
                  className="flex items-center gap-[8px] text-[18px] font-bold text-[#131111]  hover:text-[#7cb342] transition-colors duration-300"
                >
                  <img src={MailIcon} alt="Email" className="w-[24px] h-[24px] object-contain" />
                  <span>{complaintEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              {copyrightText}
            </p>
            <div className="flex gap-4">
              {privacyPolicyUrl.startsWith('http://') || privacyPolicyUrl.startsWith('https://') ? (
                <a
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-[#7cb342] transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              ) : (
                <Link
                  to={privacyPolicyUrl}
                  className="text-xs text-gray-600 hover:text-[#7cb342] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              )}
              {termsOfUseUrl.startsWith('http://') || termsOfUseUrl.startsWith('https://') ? (
                <a
                  href={termsOfUseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-[#7cb342] transition-colors duration-300"
                >
                  Terms of Use
                </a>
              ) : (
                <Link
                  to={termsOfUseUrl}
                  className="text-xs text-gray-600 hover:text-[#7cb342] transition-colors duration-300"
                >
                  Terms of Use
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
