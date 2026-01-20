import React from 'react';

interface ScrollRevealSectionProps {
  animation?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'flip-left' | 'flip-right' | 'slide-up' | 'slide-down';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollRevealSection({
  animation = 'fade-up',
  delay = 0,
  duration = 1000,
  children,
  className = ''
}: ScrollRevealSectionProps) {
  return (
    <div
      className={className}
      data-aos={animation}
      data-aos-delay={delay}
      data-aos-duration={duration}
    >
      {children}
    </div>
  );
}

