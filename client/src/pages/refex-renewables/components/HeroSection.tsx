import { useState, useEffect } from 'react';

interface HeroSectionProps {
  section?: any;
  getSectionContent?: (section: any, contentKey: string) => any;
  getImagePath?: (imageData: any) => string;
}

export default function HeroSection({ section, getSectionContent, getImagePath }: HeroSectionProps) {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  // Get CMS data with fallback to hardcoded values
  const tagline = section && getSectionContent ? getSectionContent(section, 'tagline') : 'Refex Renewables';
  const title = section && getSectionContent ? getSectionContent(section, 'title') : 'Brightening the future with renewables';
  const description = section && getSectionContent ? getSectionContent(section, 'description') : 'Your trusted partner in renewable energy. With 10 years of experience in the solar PV industry, we specialize in designing, executing, installing, and maintaining efficient solar power systems.';
  const buttonText = section && getSectionContent ? getSectionContent(section, 'buttonText') : 'Explore';
  const buttonLink = section && getSectionContent ? getSectionContent(section, 'buttonLink') : '#explore';
  const stat1Value = section && getSectionContent ? getSectionContent(section, 'stat1Value') : '10';
  const stat1Label = section && getSectionContent ? getSectionContent(section, 'stat1Label') : 'YEARS OF EXPERIENCE';
  const stat2Value = section && getSectionContent ? getSectionContent(section, 'stat2Value') : '41';
  const stat2Label = section && getSectionContent ? getSectionContent(section, 'stat2Label') : 'LOCATIONS';
  const stat3Value = section && getSectionContent ? getSectionContent(section, 'stat3Value') : '12';
  const stat3Label = section && getSectionContent ? getSectionContent(section, 'stat3Label') : 'ACROSS STATES';

  // Get background image
  let backgroundImage = '';
  if (section && getSectionContent) {
    const bgImageData = getSectionContent(section, 'backgroundImage');
    if (bgImageData && bgImageData.path) {
      backgroundImage = bgImageData.path;
    } else if (typeof bgImageData === 'string' && bgImageData && !bgImageData.startsWith('/assets/')) {
      backgroundImage = bgImageData;
    }
  }

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const target1 = parseInt(stat1Value) || 10;
    const target2 = parseInt(stat2Value) || 41;
    const target3 = parseInt(stat3Value) || 12;

    const timer1 = setInterval(() => {
      setCount1((prev) => {
        if (prev >= target1) {
          clearInterval(timer1);
          return target1;
        }
        return prev + 1;
      });
    }, interval);

    const timer2 = setInterval(() => {
      setCount2((prev) => {
        if (prev >= target2) {
          clearInterval(timer2);
          return target2;
        }
        return prev + 1;
      });
    }, interval / 2);

    const timer3 = setInterval(() => {
      setCount3((prev) => {
        if (prev >= target3) {
          clearInterval(timer3);
          return target3;
        }
        return prev + 1;
      });
    }, interval);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, [stat1Value, stat2Value, stat3Value]);

  return (
    <div
      className="relative min-h-[85vh] bg-cover bg-center bg-no-repeat flex items-center pt-40 bg-gray-800"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p className="text-[18px] font-medium mb-4 tracking-wide" data-aos="fade-up">
              {tagline}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
              {title}
            </h1>
            <p className="text-sm md:text-base mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
              {description}
            </p>
            {/* Explore button - commented out for future use */}
            {/* <a
              href={buttonLink}
              className="cta-button-fill-renewables inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <i className="ri-arrow-right-line"></i>
              </span>
            </a> */}
          </div>

          {/* Stats Section - Mobile: Below text, Desktop: Right side */}
          <div className="flex flex-col gap-4 max-w-md lg:mx-0 mx-auto">
            {/* Top Row: Two boxes side by side */}
            <div className="flex gap-4">
              <div
                className="bg-[#f9d342] text-center text-black p-4 rounded-lg flex-1 shadow-lg"
                data-aos="fade-up"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 leading-none">{count1}+</div>
                <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">{stat1Label}</div>
              </div>
              <div
                className="bg-[#f9d342] text-center text-black p-4 rounded-lg flex-1 shadow-lg"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 leading-none">{count2}+</div>
                <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">{stat2Label}</div>
              </div>
            </div>
            {/* Bottom Row: One box centered - same width as top boxes */}
            <div className="flex justify-center">
              <div
                className="bg-[#f9d342] text-center text-black p-4 rounded-lg shadow-lg"
                style={{ 
                  width: 'calc(50% - 0.5rem)',
                  maxWidth: '100%'
                }}
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 leading-none">{count3}+</div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">{stat3Label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .cta-button-fill-renewables {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .cta-button-fill-renewables::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: #f9d342;
          transition: height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .cta-button-fill-renewables:hover::before {
          height: 100%;
        }
        
        .cta-button-fill-renewables:hover {
          color: black;
        }
        
        .cta-button-fill-renewables span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </div>
  );
}
