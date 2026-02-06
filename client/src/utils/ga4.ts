import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-PELQP7E4ZJ';

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
    ReactGA.event(eventName, eventParams);
  }
};

