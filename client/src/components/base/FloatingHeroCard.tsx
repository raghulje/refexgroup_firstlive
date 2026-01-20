import { useLayoutEffect, useRef, useState, ReactNode } from 'react';

interface FloatingHeroCardProps {
  children: ReactNode;
  className?: string;
}

export default function FloatingHeroCard({ children, className = '' }: FloatingHeroCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();

    const handleScroll = () => {
      if (isMobile || !cardRef.current) return;

      requestAnimationFrame(() => {
        if (!cardRef.current) return;

        const scrollY = window.scrollY;
        const speed = 4;
        const translateY = -(scrollY * (speed / 100));

        cardRef.current.style.setProperty('--translateY', `${translateY}px`);
      });
    };

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <div
      ref={cardRef}
      className={`floating-hero-card ${className}`}
      style={{
        transform: 'translateY(var(--translateY, 0))',
        transition: 'transform 100ms cubic-bezier(0, .33, .07, 1.03)',
        marginTop: isMobile ? '0' : '-200px',
        padding: '2em',
        borderRadius: '12px',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
