
import { StrictMode } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { initGA4 } from './utils/ga4'
import { setupGlobalImageLazyLoading } from './utils/imageLazyLoad'
import { setupRoutePrefetch } from './utils/routePrefetch'

// Initialize Google Analytics 4 (only once)
initGA4();

// Setup global image lazy loading for better performance
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupGlobalImageLazyLoading();
      setupRoutePrefetch();
    });
  } else {
    setupGlobalImageLazyLoading();
    setupRoutePrefetch();
  }
}

AOS.init({
  duration: 600, // Reduced from 800ms for smoother animations
  once: true,
  offset: 50,
  easing: 'ease-out-cubic',
  delay: 0,
  anchorPlacement: 'top-bottom',
  useClassNames: false, // Better performance
  disableMutationObserver: false,
  debounceDelay: 50, // Optimize scroll performance
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
