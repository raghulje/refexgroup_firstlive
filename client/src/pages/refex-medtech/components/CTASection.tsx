import { useEffect, useRef } from 'react';

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('[data-aos]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-gradient-to-r from-[#4a90a4] to-[#5ba3b8] py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 
          className="text-white text-3xl lg:text-3xl xl:text-3xl font-bold mb-6 leading-tight"
          data-aos="fade-up"
        >
          Adonis & 3i MedTech together makes Refex MedTech stronger.
        </h2>
        <p 
          className="text-lg text-white mb-8 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Offering superior patented products and exceptional customer service, we are a trusted solution provider.
        </p>
        <a 
          href="https://3imedtech.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-[#4a90a4] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 whitespace-nowrap cursor-pointer"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default CTASection;
