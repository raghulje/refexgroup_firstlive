import { Link } from 'react-router-dom';

interface HeroSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ sectionData, getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackTitleHighlight = 'Refex Mobility:';
  const fallbackTitleMain = 'Where reliability meets responsibility!';
  const fallbackDescription = 'Our cleaner-fuelled 4-wheeler fleet is transforming the way you commute, making every journey clean, safe and on time.';
  const fallbackButtonText = 'Discover More';
  const fallbackButtonLink = '/contact';
  // Get CMS values
  const tagline = getSectionContent?.(sectionData, 'tagline') || '';
  const titleHighlight = getSectionContent?.(sectionData, 'titleHighlight') || fallbackTitleHighlight;
  const titleMain = getSectionContent?.(sectionData, 'titleMain') || fallbackTitleMain;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const buttonText = getSectionContent?.(sectionData, 'buttonText') || fallbackButtonText;
  const buttonLink = getSectionContent?.(sectionData, 'buttonLink') || fallbackButtonLink;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || '';

  return (
    <section className="relative lg:min-h-[70vh] flex items-center overflow-hidden bg-white pt-24 lg:pt-8 pb-4 lg:pb-8">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-0 items-center lg:min-h-[70vh]">
          {/* Left Content - White Background */}
          <div className="text-left space-y-3 lg:space-y-6 py-8 lg:py-8 lg:pr-12">
            {tagline && (
              <p className="text-gray-600 text-[18px] mb-2 lg:mb-4 tracking-wide" data-aos="fade-up">
                {tagline}
              </p>
            )}
            <div className="space-y-2 lg:space-y-4">
              <h1
                className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight"
                data-aos="fade-up"
              >
                <span 
                  style={{
                    color: '#ee6a31'
                  }}
                >
                  {titleHighlight}
                </span>
                <br />
                <span 
                  className="font-bold whitespace-pre-line"
                  style={{
                    color: '#ee6a31'
                  }}
                >
                  {titleMain}
                </span>
              </h1>
            </div>

            <p
              className="text-base lg:text-lg text-gray-700 max-w-xl leading-relaxed mb-4 lg:mb-0"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {description}
            </p>

            {/* Button hidden per user request */}
            {/* <div data-aos="fade-up" data-aos-delay="200">
              <Link
                to={buttonLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#7dc144] text-gray-900 hover:bg-gray-50 font-semibold rounded-full transition-all duration-300 hover:shadow-lg cursor-pointer whitespace-nowrap group"
              >
                {buttonText}
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            </div> */}
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] lg:h-[70vh] lg:max-h-[600px] -mt-4 lg:mt-0 flex items-center">
            {image ? (
              <img
                src={image}
                alt="Refex Mobility Car"
                className="w-full h-full object-contain object-center"
                data-aos="fade-left"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
