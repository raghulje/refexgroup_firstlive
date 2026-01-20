interface AboutSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function AboutSection({ sectionData, getImagePath, getSectionContent }: AboutSectionProps) {
  const fallbackTitle = 'About Refex Life Sciences';
  const fallbackParagraphs = [
    'At Refex Life Sciences, innovation defines who we are. As the pharmaceutical platform of the Refex Group, we combine cutting-edge science with customer-focused excellence to advance healthcare globally.',
    'Our journey began with the acquisition of RLFC, a 40-year-old API company whose legacy we infused with the Refex spirit of innovation. We expanded further with Modepro, strengthening our advanced intermediate capabilities, and with Extrovis, establishing a global footprint in speciality formulations and antibiotics.'
  ];

  const heading = getSectionContent?.(sectionData, 'heading') || fallbackTitle;
  const paragraphsData = getSectionContent?.(sectionData, 'paragraphs');
  const paragraphs = Array.isArray(paragraphsData) ? paragraphsData : (paragraphsData ? JSON.parse(paragraphsData) : fallbackParagraphs);

  return (
    <section id="about" className="py-8 bg-white">
      <div className="max-w-[1156.67px] mx-auto px-6 text-center">
        <div data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7cb342] mb-6">
            {heading}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            {paragraphs.map((para: string, index: number) => (
              <p key={index} className="text-sm md:text-base text-gray-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
