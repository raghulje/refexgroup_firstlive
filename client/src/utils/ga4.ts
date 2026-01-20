import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-WHLGZNHDN3';

// Track if GA4 has been initialized to prevent duplicate initialization
let isInitialized = false;

/**
 * Initialize Google Analytics 4
 * This should be called only once when the app starts
 */
export const initGA4 = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    try {
      ReactGA.initialize(GA_MEASUREMENT_ID, {
        testMode: false, // Set to true only for testing
        gtagOptions: {
          // Additional GA4 configuration options
          send_page_view: false, // We'll handle page views manually to avoid duplicates
        },
      });
      isInitialized = true;
      console.log('✅ GA4 initialized successfully');
      
      // Set up global click tracking
      setupGlobalClickTracking();
      
      // Set up scroll depth tracking
      setupScrollDepthTracking();
    } catch (error) {
      console.error('❌ GA4 initialization failed:', error);
    }
  }
};

/**
 * Track a page view
 * @param path - The path of the page (including search params if any)
 * @param title - Optional page title
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      // Use react-ga4's gtag method to send page_view event (GA4 standard)
      // This is the recommended way to track pageviews in GA4
      ReactGA.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    } catch (error) {
      console.error('❌ GA4 pageview tracking failed:', error);
    }
  }
};

/**
 * Track custom events
 * @param eventName - Name of the event
 * @param eventParams - Optional event parameters
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      ReactGA.event(eventName, eventParams);
    } catch (error) {
      console.error(`❌ GA4 event tracking failed for ${eventName}:`, error);
    }
  }
};

/**
 * Track form submission
 * @param formName - Name/type of the form (e.g., 'contact_form', 'career_application')
 * @param formData - Optional form data (will exclude sensitive info)
 */
export const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      // Sanitize form data - exclude sensitive information
      const sanitizedData: Record<string, any> = {};
      if (formData) {
        Object.keys(formData).forEach(key => {
          // Include non-sensitive fields only
          if (['enquiringFor', 'subject', 'company', 'message'].includes(key)) {
            sanitizedData[key] = formData[key];
          }
        });
      }

      trackEvent('form_submit', {
        form_name: formName,
        form_location: window.location.pathname,
        ...sanitizedData,
      });
    } catch (error) {
      console.error('❌ GA4 form tracking failed:', error);
    }
  }
};

/**
 * Track button/CTA clicks
 * @param buttonName - Name/label of the button
 * @param buttonLocation - Where the button is located
 * @param destination - Optional destination URL
 */
export const trackButtonClick = (buttonName: string, buttonLocation?: string, destination?: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('button_click', {
        button_name: buttonName,
        button_location: buttonLocation || window.location.pathname,
        destination: destination || '',
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 button tracking failed:', error);
    }
  }
};

/**
 * Track link clicks (internal or external)
 * @param linkText - Text/content of the link
 * @param linkUrl - URL of the link
 * @param linkType - 'internal' or 'external'
 */
export const trackLinkClick = (linkText: string, linkUrl: string, linkType: 'internal' | 'external' = 'internal') => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('link_click', {
        link_text: linkText,
        link_url: linkUrl,
        link_type: linkType,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 link tracking failed:', error);
    }
  }
};

/**
 * Track video plays
 * @param videoTitle - Title/name of the video
 * @param videoUrl - URL of the video (if available)
 */
export const trackVideoPlay = (videoTitle: string, videoUrl?: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('video_play', {
        video_title: videoTitle,
        video_url: videoUrl || '',
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 video tracking failed:', error);
    }
  }
};

/**
 * Track file downloads
 * @param fileName - Name of the file
 * @param fileUrl - URL of the file
 */
export const trackDownload = (fileName: string, fileUrl: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('file_download', {
        file_name: fileName,
        file_url: fileUrl,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 download tracking failed:', error);
    }
  }
};

/**
 * Track tab switches
 * @param tabName - Name of the tab
 * @param tabLocation - Where the tab is located (page/section)
 */
export const trackTabSwitch = (tabName: string, tabLocation?: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('tab_switch', {
        tab_name: tabName,
        tab_location: tabLocation || window.location.pathname,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 tab switch tracking failed:', error);
    }
  }
};

/**
 * Track modal opens
 * @param modalName - Name/type of the modal
 * @param modalContent - Optional content identifier (e.g., leader name, project name)
 * @param modalLocation - Where the modal was opened from
 */
export const trackModalOpen = (modalName: string, modalContent?: string, modalLocation?: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('modal_open', {
        modal_name: modalName,
        modal_content: modalContent || '',
        modal_location: modalLocation || window.location.pathname,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 modal open tracking failed:', error);
    }
  }
};

/**
 * Track modal closes
 * @param modalName - Name/type of the modal
 * @param modalContent - Optional content identifier
 * @param timeSpent - Optional time spent in modal (seconds)
 */
export const trackModalClose = (modalName: string, modalContent?: string, timeSpent?: number) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('modal_close', {
        modal_name: modalName,
        modal_content: modalContent || '',
        time_spent: timeSpent || 0,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 modal close tracking failed:', error);
    }
  }
};

/**
 * Track scroll depth
 * @param depth - Percentage of page scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (depth: number) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('scroll_depth', {
        scroll_depth: depth,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 scroll depth tracking failed:', error);
    }
  }
};

/**
 * Track image gallery/lightbox interactions
 * @param action - Action type (open, close, navigate_next, navigate_prev, fullscreen, share)
 * @param galleryName - Name of the gallery
 * @param imageIndex - Current image index (if applicable)
 * @param imageTotal - Total number of images (if applicable)
 */
export const trackGalleryInteraction = (
  action: 'open' | 'close' | 'navigate_next' | 'navigate_prev' | 'fullscreen' | 'share',
  galleryName: string,
  imageIndex?: number,
  imageTotal?: number
) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('gallery_interaction', {
        action: action,
        gallery_name: galleryName,
        image_index: imageIndex || 0,
        image_total: imageTotal || 0,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 gallery interaction tracking failed:', error);
    }
  }
};

/**
 * Track business card/grid interactions
 * @param businessName - Name of the business
 * @param interactionType - Type of interaction (click, hover, explore)
 * @param location - Where the interaction occurred
 */
export const trackBusinessInteraction = (
  businessName: string,
  interactionType: 'click' | 'hover' | 'explore',
  location?: string
) => {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      trackEvent('business_interaction', {
        business_name: businessName,
        interaction_type: interactionType,
        location: location || window.location.pathname,
        page_path: window.location.pathname,
      });
    } catch (error) {
      console.error('❌ GA4 business interaction tracking failed:', error);
    }
  }
};

/**
 * Set up scroll depth tracking
 * Tracks when user scrolls 25%, 50%, 75%, and 100% of the page
 */
export const setupScrollDepthTracking = () => {
  if (typeof window === 'undefined' || !isInitialized) return;

  const trackedDepths = new Set<number>();
  const depths = [25, 50, 75, 100];

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

    depths.forEach((depth) => {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        trackScrollDepth(depth);
      }
    });

    // Reset tracking when user scrolls back to top
    if (scrollPercent < 25) {
      trackedDepths.clear();
    }
  };

  // Throttle scroll events
  let ticking = false;
  const throttledScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', throttledScroll);
  };
};

/**
 * Set up global click tracking for buttons and links
 * This tracks clicks on elements with data-ga-track attributes
 * This ensures dynamically added elements are tracked automatically
 */
const setupGlobalClickTracking = () => {
  if (typeof window === 'undefined') return;

  // Use event delegation to track clicks on dynamically added elements
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Find the closest element with tracking data
    const trackedElement = target.closest('[data-ga-track]') as HTMLElement;
    if (!trackedElement) return;

    // Skip if already handled by explicit onClick handler (prevent duplicate tracking)
    // This is detected by checking if the event was explicitly prevented
    if (e.defaultPrevented) return;

    const trackType = trackedElement.getAttribute('data-ga-track');
    const trackLabel = trackedElement.getAttribute('data-ga-label') || 
                      trackedElement.textContent?.trim() || 
                      'Unknown';
    const trackLocation = trackedElement.getAttribute('data-ga-location') || 
                         window.location.pathname;

    // Handle different track types
    if (trackType === 'button' || trackType === 'cta') {
      const destination = (trackedElement as HTMLAnchorElement).href || 
                         (trackedElement as HTMLLinkElement).getAttribute('to') ||
                         trackedElement.getAttribute('data-ga-destination') || 
                         '';
      trackButtonClick(trackLabel, trackLocation, destination);
    } else if (trackType === 'link') {
      const href = (trackedElement as HTMLAnchorElement).href || 
                   (trackedElement as HTMLLinkElement).getAttribute('to') ||
                   trackedElement.getAttribute('href') || '';
      const isExternal = href.startsWith('http://') || 
                         href.startsWith('https://') || 
                         href.startsWith('mailto:') ||
                         href.startsWith('tel:') ||
                         (href.startsWith('http') && !href.includes(window.location.hostname));
      trackLinkClick(trackLabel, href, isExternal ? 'external' : 'internal');
    } else if (trackType === 'download') {
      const downloadUrl = (trackedElement as HTMLAnchorElement).href || 
                         trackedElement.getAttribute('href') ||
                         '';
      trackDownload(trackLabel, downloadUrl);
    } else if (trackType === 'video') {
      const videoUrl = (trackedElement as HTMLAnchorElement).href || 
                       trackedElement.getAttribute('href') ||
                       '';
      trackVideoPlay(trackLabel, videoUrl);
    }
  }, true); // Use capture phase to catch events early
};

