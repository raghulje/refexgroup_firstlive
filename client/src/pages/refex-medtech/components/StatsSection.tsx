import { useEffect, useRef, useState } from 'react';

interface StatsSectionProps {
  sectionData?: any;
  stats?: any[];
  getSectionContent?: (section: any, contentKey: string) => any;
}

const StatsSection = ({ sectionData, stats = [], getSectionContent }: StatsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fallback values
  const fallbackStats = [
    { value: 30, suffix: '+', label: 'Years of experience' },
    { value: 3, suffix: '', label: 'Manufacturing and R&D facilities' },
    { value: 8000, suffix: '+', label: 'Installations' }
  ];

  const statsToShow = stats.length > 0 ? stats : fallbackStats;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            entry.target.classList.add('aos-animate');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const Counter = ({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        setCount(Math.floor(end * percentage));

        if (percentage < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  return (
    <div ref={sectionRef} className="bg-gradient-to-r from-[#e8f4f8] to-[#d4ebf2] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {statsToShow.map((stat: any, index: number) => (
            <div
              key={index}
              className="text-center"
              data-aos="slide-up"
              data-aos-delay={index * 100}
            >
              <div className="text-4xl lg:text-5xl font-bold text-[#4a90a4] mb-2">
                <Counter end={stat.value || stat.end || 0} suffix={stat.suffix || ''} />
              </div>
              <div className="text-gray-700 text-lg font-medium">{stat.label || stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
