import { useEffect, useRef } from 'react';

type AnimationType = 'fade-up' | 'fade-left' | 'fade-right' | 'scale';

export function useScrollReveal(animationType: AnimationType = 'fade-up', threshold: number = 0.1) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    element.classList.add(`reveal-${animationType}`);
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [animationType, threshold]);

  return elementRef;
}
