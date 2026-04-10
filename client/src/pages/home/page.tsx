
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import HeroSlider from './components/HeroSlider';
import AboutSection from './components/AboutSection';
import BusinessGrid from './components/BusinessGrid';
import AwardsSection from './components/AwardsSection';
import NewsroomSection from './components/NewsroomSection';
import CareersSection from './components/CareersSection';
import CTASection from './components/CTASection';
import WelcomeModal from './components/Welcome';

export default function HomePage() {
  const [showNonCritical, setShowNonCritical] = useState(false);
  // Handle smooth scroll to section on hash navigation
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    const hash = window.location.hash;
    if (hash) {
      // Remove the # from hash
      const id = hash.replace('#', '');
      // Wait for page to render then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    // Defer non-critical sections so route transition stays responsive.
    const idleCallback = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout: number }) => number);
    const cancelIdleCallback = (window as any).cancelIdleCallback as undefined | ((id: number) => void);
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (idleCallback) {
      idleId = idleCallback(() => setShowNonCritical(true), { timeout: 300 });
    } else {
      timeoutId = setTimeout(() => setShowNonCritical(true), 150);
    }

    return () => {
      if (idleId !== null && cancelIdleCallback) cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div className="min-h-screen bg-white pt-20">
      <Header />
      <main>
        <div data-aos="fade">
          <HeroSlider />
        </div>
        <div id="business" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          <BusinessGrid />
        </div>
        <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          <AboutSection />
        </div>
        {showNonCritical && (
          <>
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <AwardsSection />
            </div>
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <CareersSection />
            </div>
            <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <NewsroomSection />
            </div>
            <div data-aos="fade-up" data-aos-duration="800">
              <CTASection />
            </div>
          </>
        )}
      </main>
      <Footer />
      <WelcomeModal />
    </div>
  );
}
