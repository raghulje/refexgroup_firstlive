import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../data/navigation';
import { getApiBaseUrl } from '../../config/env';
import { getCachedGlobalSettings, getCachedNavigation } from '../../services/siteDataCache';

const HEADER_CACHE_TTL_MS = 30000;
let headerCache: {
  ts: number;
  navLinks: any[];
  headerLogo: string;
  ctaButton: { label: string; url: string };
} | null = null;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(80);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [headerLogo, setHeaderLogo] = useState<string>('');
  const [ctaButton, setCtaButton] = useState({ label: 'Get in touch', url: '/contact' });
  const [loading, setLoading] = useState(false); // Changed to false to prevent initial flicker
  const location = useLocation();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const headerRef = useRef<HTMLElement | null>(null);
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

  // Transform CMS navigation to frontend format
  const transformNavigation = async (cmsNav: any[]): Promise<any[]> => {
    if (!cmsNav || cmsNav.length === 0) return NAV_LINKS;
    
    const transformed = await Promise.all(
      cmsNav
        .filter((item: any) => item.isActive && !item.parentId)
        .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
        .map(async (item: any) => {
          // Process children - handle both array and object formats
          let children = undefined;
          if (item.children) {
            const childrenArray = Array.isArray(item.children) ? item.children : [];
            children = childrenArray
              .filter((child: any) => child.isActive !== false) // Include if isActive is true or undefined
              .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((child: any) => ({
                label: child.label,
                path: child.linkUrl || child.path || '#',
              }));
            
            // Only set children if there are items
            if (children.length === 0) {
              children = undefined;
            }
          }

          // Fetch mega menu image if needed
          let megaMenuImage = null;
          if (item.megaMenu) {
            megaMenuImage = getImagePath(item.megaMenu);
          } else if (item.megaMenuMediaId) {
            try {
              const { mediaService } = await import('../../services/apiService');
              const media = await mediaService.getById(item.megaMenuMediaId);
              if (media?.filePath) {
                const apiBase = getApiBaseUrl();
                megaMenuImage = media.filePath.startsWith('/uploads/') ? `${apiBase}${media.filePath}` : media.filePath;
              }
            } catch (e) {
              console.error('Error fetching mega menu image:', e);
            }
          }

          return {
            label: item.label,
            path: item.linkUrl || item.path || '#',
            submenu: item.linkType === 'dropdown' && children && children.length > 0 ? children : undefined,
            // Mega menu data - prioritize item-level data over global settings
            megaMenuTitle: item.megaMenuTitle || item.mega_menu_title,
            description: item.description,
            megaMenuImage: megaMenuImage,
            megaMenuMediaId: item.megaMenuMediaId || item.mega_menu_media_id,
          };
        })
    );

    return transformed;
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      // Prevent concurrent fetches
      if (fetchingRef.current) {
        return;
      }

      // Fast-path: reuse recent header payload to avoid bursts on rapid route switches
      if (headerCache && (Date.now() - headerCache.ts) < HEADER_CACHE_TTL_MS) {
        setNavLinks(headerCache.navLinks);
        setHeaderLogo(headerCache.headerLogo);
        setCtaButton(headerCache.ctaButton);
        return;
      }

      try {
        fetchingRef.current = true;
        setLoading(true);
        
        // Fetch navigation - this is critical, don't let it fail
        let navData: any[] = [];
        try {
          navData = await getCachedNavigation();
        } catch (navError) {
          console.error('Error fetching navigation:', navError);
          // If navigation fails, use fallback
          setNavLinks(NAV_LINKS);
          setLoading(false);
          fetchingRef.current = false;
          return;
        }
        
        // Transform navigation data
        const transformedNav = await transformNavigation(navData);
        
        // Fetch header settings - make this non-blocking
        let settings: any = null;
        try {
          settings = await getCachedGlobalSettings();
        } catch (settingsError) {
          console.warn('Error fetching global settings (non-critical):', settingsError);
          // Continue without settings - navigation will still work
        }
        
        // Merge global settings mega menu data as fallback
        const finalNavLinks = transformedNav.map((link: any) => {
          if (link.label === 'About Refex' && settings) {
            return {
              ...link,
              megaMenuTitle: link.megaMenuTitle || settings.about_mega_menu_title || 'About Refex Group',
              description: link.description || settings.about_mega_menu_description || 'Refex Group, a trusted name in the industry for two decades. Our commitment to core values and a growth mindset drives excellence and innovation.',
              megaMenuImage: link.megaMenuImage || (settings.about_mega_menu_image_url ? 
                (settings.about_mega_menu_image_url.startsWith('/uploads/') ? 
                  `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3002'}${settings.about_mega_menu_image_url}` : 
                  settings.about_mega_menu_image_url) : null),
            };
          }
          if (link.label === 'Business' && settings) {
            return {
              ...link,
              megaMenuTitle: link.megaMenuTitle || settings.business_mega_menu_title || 'Our Businesses',
              description: link.description || settings.business_mega_menu_description || 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.',
              megaMenuImage: link.megaMenuImage || (settings.business_mega_menu_image_url ? 
                (settings.business_mega_menu_image_url.startsWith('/uploads/') ? 
                  `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3002'}${settings.business_mega_menu_image_url}` : 
                  settings.business_mega_menu_image_url) : null),
            };
          }
          return link;
        });
        
        // Only update state if data actually changed
        setNavLinks((prevLinks) => {
          const prevStr = JSON.stringify(prevLinks);
          const newStr = JSON.stringify(finalNavLinks);
          return prevStr === newStr ? prevLinks : finalNavLinks;
        });

        // Handle logo and CTA button from settings (non-blocking)
        let resolvedHeaderLogo = headerLogo;
        let resolvedCtaButton = ctaButton;
        if (settings) {
          // Logo
          if (settings.logo_main_id) {
            try {
              const { mediaService } = await import('../../services/apiService');
              const media = await mediaService.getById(settings.logo_main_id);
              if (media?.filePath) {
                const apiBase = getApiBaseUrl();
                const newLogo = media.filePath.startsWith('/uploads/') ? `${apiBase}${media.filePath}` : media.filePath;
                setHeaderLogo((prevLogo) => prevLogo !== newLogo ? newLogo : prevLogo);
                resolvedHeaderLogo = newLogo;
              }
            } catch (e) {
              console.error('Error fetching logo:', e);
            }
          }

          // CTA Button
          if (settings.header_cta_label || settings.header_cta_url) {
            const newCta = {
              label: settings.header_cta_label || 'Get in touch',
              url: settings.header_cta_url || '/contact',
            };
            setCtaButton((prevCta) => {
              return prevCta.label !== newCta.label || prevCta.url !== newCta.url ? newCta : prevCta;
            });
            resolvedCtaButton = newCta;
          }
        }

        headerCache = {
          ts: Date.now(),
          navLinks: finalNavLinks,
          headerLogo: resolvedHeaderLogo,
          ctaButton: resolvedCtaButton
        };
      } catch (error) {
        console.error('Unexpected error fetching header data:', error);
        // Only fallback if navigation fetch failed (handled above)
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchHeaderData();

    // Listen for CMS updates with debouncing
    const handleRefresh = () => {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      // Debounce refresh by 300ms
      refreshTimeoutRef.current = setTimeout(() => {
        fetchHeaderData();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Calculate header height for dropdown positioning
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setClosingDropdown(null);
    // Clear any pending timeouts when location changes
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [location]);

  // Handle link clicks - scroll to top for normal links, handle hash navigation for hash links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path?: string) => {
    const linkPath = path || (e.currentTarget as HTMLAnchorElement).getAttribute('href') || '';
    
    // Check if this is a hash link (contains #)
    if (linkPath.includes('#')) {
      const [basePath, hash] = linkPath.split('#');
      const currentPath = location.pathname;
      
      // If we're already on the same base page, handle hash scrolling manually
      if (basePath === currentPath || (basePath === '/about-refex' && currentPath === '/about-refex')) {
        e.preventDefault(); // Prevent React Router navigation
        const hashId = hash.toLowerCase();
        
        // Scroll to the hash section after a small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(hashId);
          if (element) {
            const offset = 150; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            // Update URL hash without scrolling
            window.history.replaceState(null, '', `#${hashId}`);
          }
        }, 100);
        return;
      }
    }
    
    // For normal navigation (different page), scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = (label: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Clear any closing state
    setClosingDropdown(null);
    setActiveDropdown(label);
  };

  const handleMenuContainerLeave = (label: string, event?: React.MouseEvent) => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Only close when cursor truly leaves the entire menu container (trigger + dropdown)
    closeTimeoutRef.current = setTimeout(() => {
      // Double-check if dropdown is still active for this label
      if (activeDropdown !== label) {
        return;
      }

      const mouseX = (window as any).mouseX || 0;
      const mouseY = (window as any).mouseY || 0;

      // Check if mouse is still over the dropdown container
      const container = dropdownContainerRef.current[label];
      if (container) {
        const rect = container.getBoundingClientRect();
        const padding = 10; // Reduced padding for more responsive closing
        if (
          mouseX >= rect.left - padding &&
          mouseX <= rect.right + padding &&
          mouseY >= rect.top - padding &&
          mouseY <= rect.bottom + padding
        ) {
          // Mouse is still over dropdown, cancel close
          return;
        }
      }

      // Check if mouse is over the nav link trigger
      const navLink = document.querySelector(`nav > div[data-nav-label="${label}"] > a`);
      if (navLink) {
        const linkRect = navLink.getBoundingClientRect();
        const padding = 20;
            if (
          mouseX >= linkRect.left - padding &&
          mouseX <= linkRect.right + padding &&
          mouseY >= linkRect.top - padding &&
          mouseY <= linkRect.bottom + padding
        ) {
          // Mouse is still over the nav link, cancel close
          return;
        }
      }

      // Start exit animation and close
      setClosingDropdown(label);
      setTimeout(() => {
        setActiveDropdown(null);
        setClosingDropdown(null);
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }, 100);
    }, 200); // Reduced delay for faster response
  };

  const handleDropdownMouseEnter = (label: string) => {
    // Clear any pending close timeout when mouse enters dropdown
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Clear any closing state
    setClosingDropdown(null);
    setActiveDropdown(label);
  };

  // Track mouse position globally and force close dropdown if mouse leaves header area completely
  useEffect(() => {
    if (!activeDropdown) return;

    const handleMouseMove = (e: MouseEvent) => {
      (window as any).mouseX = e.clientX;
      (window as any).mouseY = e.clientY;
    };

    // Force close if mouse leaves the viewport/document completely
    const handleMouseLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && activeDropdown) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
        setClosingDropdown(activeDropdown);
        setTimeout(() => {
          setActiveDropdown(null);
          setClosingDropdown(null);
        }, 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeDropdown]);

  // Handle exit animations - CSS class handles the animation, just clear state after duration
  useEffect(() => {
    if (closingDropdown) {
      // Clear closing state after fade out animation completes (400ms for large, 350ms for small)
      const timer = setTimeout(() => {
        setClosingDropdown(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [closingDropdown]);

  // Reset animation when dropdown opens to ensure smooth fade in
  useEffect(() => {
    if (activeDropdown && !closingDropdown) {
      const container = dropdownContainerRef.current[activeDropdown];
      if (container) {
        // Remove closing class if it exists and reset to trigger enter animation
        container.classList.remove('closing');
        // Force reflow to restart animation
        requestAnimationFrame(() => {
          void container.offsetWidth;
        });
      }
    }
  }, [activeDropdown, closingDropdown]);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
          } py-4`}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 h-12"
              onClick={(e) => handleLinkClick(e, '/')}
            >
              {headerLogo ? (
              <img
                src={headerLogo}
                alt="Refex Group"
                className="h-full w-auto object-contain"
                />
              ) : (
                <img
                  src="/assets/logos/refex-logo.png"
                  alt="Refex Group"
                  className="h-full w-auto object-contain"
              />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" style={{ pointerEvents: 'auto' }}>
              {(navLinks.length > 0 ? navLinks : NAV_LINKS).map((link) => (
                <div
                  key={link.label}
                  data-nav-label={link.label}
                  className="relative"
                  style={{ pointerEvents: 'auto' }}
                  onMouseEnter={() => {
                    if (link.submenu) {
                      handleMouseEnter(link.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (link.submenu) {
                      handleMenuContainerLeave(link.label);
                    }
                  }}
                >
                  <Link
                    to={link.path}
                    className="text-[#262626] hover:text-[#7cb342] font-semibold text-[16px]  transition-all duration-300 flex items-center gap-1 px-4 py-2"
                    style={{ pointerEvents: 'auto' }}
                    onClick={(e) => handleLinkClick(e, link.path)}
                  >
                    {link.label}
                    {link.submenu && (
                      <i className="ri-arrow-down-s-line text-sm"></i>
                    )}
                  </Link>

                  {/* Dropdown Menu - About Refex Full Width Design */}
                  {link.submenu && (activeDropdown === link.label || closingDropdown === link.label) && link.label === 'About Refex' && (
                    <>
                      {/* Invisible bridge to prevent closing when moving from trigger to dropdown */}
                      <div
                        className="absolute top-full left-0 right-0 h-4 z-[99]"
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                      ></div>
                      <div
                        ref={(el) => {
                          dropdownContainerRef.current[link.label] = el;
                        }}
                        className={`fixed left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[99] dropdown-menu ${closingDropdown === link.label ? 'closing' : ''}`}
                        style={{
                          top: `${headerHeight}px`,
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                        onMouseLeave={() => handleMenuContainerLeave(link.label)}
                      >
                        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-[13.52px]">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left Section - Image (800x534 aspect ratio) */}
                            {link.megaMenuImage && (
                            <div className="col-span-12 md:col-span-3 px-2">
                              <div className="relative overflow-hidden w-full rounded-lg">
                                <img
                                  alt="Refex Group Team"
                                  width="800"
                                  height="534"
                                  className="w-full h-auto object-cover rounded-lg"
                                    src={link.megaMenuImage}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                            )}

                            {/* Middle Section - Content */}
                            <div className={`${link.megaMenuImage ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'} flex items-center px-4`}>
                              <div className="w-full">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                  {link.megaMenuTitle || 'About Refex Group'}
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                  {link.description || 'Refex Group, a trusted name in the industry for two decades. Our commitment to core values and a growth mindset drives excellence and innovation.'}
                                </p>
                                <Link
                                  to={link.path}
                                  className="inline-flex items-center gap-2 text-[#7cb342] font-semibold text-sm hover:gap-2.5 transition-all duration-300 group"
                                  onClick={(e) => handleLinkClick(e, link.path)}
                                >
                                  <span>Know more</span>
                                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                                </Link>
                              </div>
                            </div>

                            {/* Right Section - Navigation Links in 2 Columns */}
                            <div className={`${link.megaMenuImage ? 'col-span-12 md:col-span-6' : 'col-span-12 md:col-span-8'} flex items-center px-4`}>
                              <div className="w-full flex flex-row justify-around items-center gap-8">
                                {/* Column 1 */}
                                <ul className="flex flex-col space-y-0 flex-1">
                                  {link.submenu.slice(0, Math.ceil(link.submenu.length / 2)).map((sublink: any) => (
                                    <li key={sublink.path}>
                                      <Link
                                        to={sublink.path}
                                        className="block py-1.5 text-[#262626] hover:text-[#7cb342] transition-colors duration-200 text-[16px] font-semibold "
                                        onClick={handleLinkClick}
                                      >
                                        {sublink.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                {/* Column 2 */}
                                <ul className="flex flex-col space-y-0 flex-1">
                                  {link.submenu.slice(Math.ceil(link.submenu.length / 2)).map((sublink: any) => (
                                    <li key={sublink.path}>
                                      <Link
                                        to={sublink.path}
                                        className="block py-1.5 text-[#262626] hover:text-[#7cb342] transition-colors duration-200 text-[16px] font-semibold "
                                        onClick={handleLinkClick}
                                      >
                                        {sublink.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Dropdown Menu - Business Full Width Design */}
                  {link.submenu && (activeDropdown === link.label || closingDropdown === link.label) && link.label === 'Business' && (
                    <>
                      {/* Invisible bridge to prevent closing when moving from trigger to dropdown */}
                      <div
                        className="absolute top-full left-0 right-0 h-4 z-[99]"
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                      ></div>
                      <div
                        ref={(el) => {
                          dropdownContainerRef.current[link.label] = el;
                        }}
                        className={`fixed left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-[99] dropdown-menu ${closingDropdown === link.label ? 'closing' : ''}`}
                        style={{
                          top: `${headerHeight}px`,
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                        onMouseLeave={() => handleMenuContainerLeave(link.label)}
                      >
                        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-[13.52px]">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left Section - Image */}
                            {link.megaMenuImage && (
                            <div className="col-span-12 md:col-span-3 px-2">
                              <div className="relative overflow-hidden w-full rounded-lg">
                                <img
                                  alt="Our Businesses"
                                    src={link.megaMenuImage}
                                  className="w-full h-auto object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                            )}

                            {/* Middle Section - Content */}
                            <div className={`${link.megaMenuImage ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'} flex items-center px-4`}>
                              <div className="w-full">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                  {link.megaMenuTitle || 'Our Businesses'}
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                  {link.description || 'Refex – Your trusted partner in Renewable Energy, Ash & Coal Handling, Medical Imaging, Pharmaceuticals, Refrigerant gas, Venture Capital, Electric Vehicles, and Airports Retail.'}
                                </p>
                              </div>
                            </div>

                            {/* Right Section - Business Links in 2 Columns */}
                            <div className={`${link.megaMenuImage ? 'col-span-12 md:col-span-6' : 'col-span-12 md:col-span-8'} flex items-center px-4`}>
                              <div className="w-full flex flex-row justify-around items-center gap-8">
                                {/* Column 1 */}
                                <ul className="flex flex-col space-y-0 flex-1">
                                  {link.submenu.slice(0, Math.ceil(link.submenu.length / 2)).map((sublink: any) => (
                                    <li key={sublink.path}>
                                      <Link
                                        to={sublink.path}
                                        className="block py-1.5 text-[#262626] hover:text-[#7cb342] transition-colors duration-200 text-[16px] font-semibold "
                                        onClick={(e) => handleLinkClick(e, sublink.path)}
                                      >
                                        {sublink.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>

                                {/* Column 2 */}
                                <ul className="flex flex-col space-y-0 flex-1">
                                  {link.submenu.slice(Math.ceil(link.submenu.length / 2)).map((sublink: any) => (
                                    <li key={sublink.path}>
                                      <Link
                                        to={sublink.path}
                                        className="block py-1.5 text-[#262626] hover:text-[#7cb342] transition-colors duration-200 text-[16px] font-semibold "
                                        onClick={(e) => handleLinkClick(e, sublink.path)}
                                      >
                                        {sublink.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Regular Dropdown Menu for other items */}
                  {link.submenu && (activeDropdown === link.label || closingDropdown === link.label) && link.label !== 'About Refex' && link.label !== 'Business' && (
                    <>
                      {/* Invisible bridge to prevent closing when moving from trigger to dropdown */}
                      <div
                        className="absolute top-full left-0 right-0 h-4 z-[99]"
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                      ></div>
                      <div
                        ref={(el) => {
                          dropdownContainerRef.current[link.label] = el;
                        }}
                        className={`absolute top-full left-0 mt-0 bg-white shadow-xl rounded-lg py-3 min-w-[240px] z-50 dropdown-menu-small ${closingDropdown === link.label ? 'closing' : ''}`}
                        onMouseEnter={() => handleDropdownMouseEnter(link.label)}
                        onMouseLeave={() => handleMenuContainerLeave(link.label)}
                      >
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.label}
                            to={sublink.path}
                            className="block px-6 py-2.5 text-[#262626] hover:text-[#7cb342] hover:bg-gray-50 transition-all duration-200 text-[16px] font-semibold "
                            onClick={(e) => handleLinkClick(e, sublink.path)}
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>

            {/* Get in Touch Button */}
            <Link
              to={ctaButton.url}
              className="hidden lg:inline-block relative px-6 py-2.5 border border-slate-600 text-slate-700 rounded-full font-semibold text-[14px] overflow-hidden whitespace-nowrap group/btn"
              onClick={(e) => handleLinkClick(e, ctaButton.url)}
            >
              <span className="relative z-10">{ctaButton.label}</span>
              <span className="absolute inset-0 bg-black transform origin-bottom scale-y-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100"></span>
              <span className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
                {ctaButton.label}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#50b848] transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`text-2xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-80 max-w-[90vw] sm:max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-4 sm:p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#50b848] transition-colors"
              aria-label="Close menu"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            {/* Logo */}
            <Link to="/" className="block mb-8 mt-2" onClick={(e) => handleLinkClick(e, '/')}>
              <img
                src={headerLogo || '/assets/logos/refex-logo.png'}
                alt="Refex Group"
                className="h-12 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logos/refex-logo.png';
                }}
              />
            </Link>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {(navLinks.length > 0 ? navLinks : NAV_LINKS).map((link) => (
                <div key={link.label}>
                  {link.submenu ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-[#50b848] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                      >
                        {link.label}
                        <i
                          className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''
                            }`}
                        ></i>
                      </button>
                      {activeDropdown === link.label && (
                        <div className="pl-4 space-y-1 mt-1">
                          {/* Show mega menu content if available */}
                          {link.megaMenuImage && (
                            <div className="mb-4 px-4">
                              <img
                                src={link.megaMenuImage}
                                alt={link.megaMenuTitle || link.label}
                                className="w-full h-auto rounded-lg mb-3"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              {link.megaMenuTitle && (
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {link.megaMenuTitle}
                                </h3>
                              )}
                              {link.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {link.description}
                                </p>
                              )}
                            </div>
                          )}
                          {link.submenu.map((sublink) => (
                            <Link
                              key={sublink.label}
                              to={sublink.path}
                              className="block px-4 py-2.5 text-gray-600 hover:text-[#50b848] hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm"
                              onClick={(e) => handleLinkClick(e, sublink.path)}
                            >
                              {sublink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className="block px-4 py-3 text-gray-700 hover:text-[#50b848] hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                      onClick={(e) => handleLinkClick(e, link.path)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile CTA Button */}
            <Link
              to={ctaButton.url}
              className="block mt-6 bg-[#50b848] text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-[#3d8c36] transition-colors text-sm md:text-base"
              onClick={(e) => handleLinkClick(e, ctaButton.url)}
            >
              {ctaButton.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
