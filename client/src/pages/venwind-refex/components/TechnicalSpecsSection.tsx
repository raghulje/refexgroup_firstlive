import SpecsImage from '../../../wp-content/uploads/2025/03/gallery-img03.jpg';

interface SpecCardProps {
  value: string;
  label: string;
}

interface TechnicalSpecsSectionProps {
  sectionData?: any;
  specs?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const SpecCard = ({ value, label }: SpecCardProps) => {
  return (
    <div className="bg-black text-white p-8 rounded-lg text-center space-y-3 hover:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-bold">{value}</h1>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
};

const TechnicalSpecsSection = ({ sectionData, specs = [], getImagePath, getSectionContent }: TechnicalSpecsSectionProps) => {
  // Fallback values
  const fallbackHeading = 'Our Technical Specifications';
  const fallbackImage = SpecsImage;
  const fallbackSpecs = [
    { value: '26417 m²', label: 'Swept Area' },
    { value: '130m', label: 'Hub Height' },
    { value: '2.5 m/s', label: 'Cut-in Wind Speed' },
    { value: 'IEC S', label: 'Class' }
  ];

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const imageData = getSectionContent?.(sectionData, 'image');
  const image = imageData?.path || (getImagePath && imageData ? getImagePath(imageData) : null) || fallbackImage;

  const specsToShow = specs.length > 0 ? specs : fallbackSpecs;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div data-aos="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {heading}
              </h2>
            </div>

            <div className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specsToShow.slice(0, 2).map((spec: any, index: number) => (
                  <div key={index} data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                    <SpecCard value={spec.value || ''} label={spec.label || ''} />
                  </div>
                ))}
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specsToShow.slice(2, 4).map((spec: any, index: number) => (
                  <div key={index + 2} data-aos="fade-up" data-aos-delay={(index + 3) * 100}>
                    <SpecCard value={spec.value || ''} label={spec.label || ''} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center" data-aos="fade-left">
            <div className="relative w-full max-w-[600px]">
              <img
                src={image}
                alt="Technical Specifications"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecsSection;
