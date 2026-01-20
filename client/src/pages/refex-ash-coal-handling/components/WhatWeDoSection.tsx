interface WhatWeDoSectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function WhatWeDoSection({ sectionData, getImagePath, getSectionContent }: WhatWeDoSectionProps) {
  // Function to highlight specific phrases in yellow
  const highlightPhrases = (text: string, phrases: string[]): string => {
    if (!text) return '';
    let highlightedText = text;
    
    // Process each phrase and wrap it in yellow span
    phrases.forEach(phrase => {
      // Escape special regex characters in the phrase
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Check if already highlighted (case-insensitive check)
      const highlightRegex = new RegExp(`<span[^>]*class=["'][^"']*text-\\[#f9d342\\][^"']*["'][^>]*>.*?${escapedPhrase}.*?</span>`, 'gi');
      if (highlightRegex.test(highlightedText)) {
        return; // Already highlighted, skip
      }
      
      // Use case-insensitive matching without word boundaries (to catch phrases with commas/punctuation)
      const regex = new RegExp(`(${escapedPhrase})`, 'gi');
      
      highlightedText = highlightedText.replace(regex, (match) => {
        return `<span class="text-[#f9d342] font-semibold">${match}</span>`;
      });
    });
    
    return highlightedText;
  };

  // Fallback values
  const fallbackHeading = 'What We do';
  const fallbackBgColor = '#000000';
  const fallbackFlyAshTitle = 'Handling & Disposal of Fly Ash';
  const fallbackFlyAshDescription = 'We specialize in ash handling services, including ash collection, transportation, and disposal, as well as recycling and reuse options. Our experienced team uses state-of-the-art equipment and techniques to ensure that ash is handled safely and responsibly, in compliance with all relevant regulations. Our team of experts are highly trained in complete gamut of operations and our equipment is outfitted with latest trends in technology to carry out all our processes effectively, thereby ensuring high quality services provided to all our clients - thermal plants, cement companies, brick manufacturers, mine owners etc.';
  const fallbackCoalYardTitle = 'Coal Yard Management';
  const fallbackCoalYardDescription = 'We provide round the clock, cost effective and sustainable services for management of coal yards in thermal power plants, that includes CHP room operations, Housekeeping, Segregation of coal & stone, management of heavy machineries, Rake unloading, shifting and crushing of coal etc., thereby offering comprehensive support from procurement of coal to feeding it into boilers.';
  const fallbackCoalTradingTitle = 'Coal Trading';
  const fallbackCoalTradingDescription = 'Our coal trading services includes sourcing, procurement, and transportation of various types of coal. We work with a network of trusted suppliers to ensure that our clients receive only the highest quality coal products, delivered on time and within budget. Our strategic partnerships, efficient supply chain management, and ability to navigate market fluctuations play a significant role in our success.';
  // No fallback images - all must come from CMS

  // Get CMS values
  const heading = getSectionContent?.(sectionData, 'heading') || fallbackHeading;
  const backgroundColor = getSectionContent?.(sectionData, 'backgroundColor') || fallbackBgColor;
  const flyAshTitle = getSectionContent?.(sectionData, 'flyAshTitle') || fallbackFlyAshTitle;
  const flyAshDescriptionRaw = getSectionContent?.(sectionData, 'flyAshDescription') || fallbackFlyAshDescription;
  const flyAshDescription = highlightPhrases(flyAshDescriptionRaw, ['experienced team', 'safely and responsibly']);
  const flyAshImageData = getSectionContent?.(sectionData, 'flyAshImage');
  const flyAshImage = flyAshImageData?.path || (getImagePath && flyAshImageData ? getImagePath(flyAshImageData) : null) || '';
  const coalYardTitle = getSectionContent?.(sectionData, 'coalYardTitle') || fallbackCoalYardTitle;
  const coalYardDescriptionRaw = getSectionContent?.(sectionData, 'coalYardDescription') || fallbackCoalYardDescription;
  const coalYardDescription = highlightPhrases(coalYardDescriptionRaw, ['round the clock, cost effective and sustainable services']);
  const coalYardImageData = getSectionContent?.(sectionData, 'coalYardImage');
  const coalYardImage = coalYardImageData?.path || (getImagePath && coalYardImageData ? getImagePath(coalYardImageData) : null) || '';
  const coalTradingTitle = getSectionContent?.(sectionData, 'coalTradingTitle') || fallbackCoalTradingTitle;
  const coalTradingDescriptionRaw = getSectionContent?.(sectionData, 'coalTradingDescription') || fallbackCoalTradingDescription;
  const coalTradingDescription = highlightPhrases(coalTradingDescriptionRaw, ['sourcing, procurement, and transportation']);
  const coalTradingImageData = getSectionContent?.(sectionData, 'coalTradingImage');
  const coalTradingImage = coalTradingImageData?.path || (getImagePath && coalTradingImageData ? getImagePath(coalTradingImageData) : null) || '';

  return (
    <section className="pt-20 pb-0" style={{ backgroundColor }}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Heading Banner */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12" data-aos="fade-up">
          {heading}
        </h2>
      </div>

        {/* Handling & Disposal of Fly Ash */}
        <div className="flex flex-col lg:flex-row mb-0 relative group h-auto lg:h-[320px]" data-aos="fade-up">
        {/* Left: Image - Full Width */}
        <div className="w-full lg:flex-1 relative h-[320px] lg:h-full bg-gray-800">
            {flyAshImage ? (
              <img
                src={flyAshImage}
                alt="Fly ash handling"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
            {/* Gradient Overlay - Fades to black on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"></div>
          </div>

          {/* Right: Text Block */}
        <div className="lg:w-[40%] lg:max-w-[600px] bg-black flex flex-col justify-center p-6 lg:p-[5.5rem] lg:pl-16 relative z-10 -ml-1 h-auto lg:h-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-right leading-tight">
              {flyAshTitle}
            </h3>
            <p className="text-white text-sm leading-relaxed text-right line-clamp-6 lg:line-clamp-none" dangerouslySetInnerHTML={{ __html: flyAshDescription }} />
          </div>
        </div>

        {/* Coal Yard Management */}
        <div className="flex flex-col lg:flex-row mb-0 relative group h-auto lg:h-[320px]" data-aos="fade-up">
          {/* Left: Text Block */}
        <div className="lg:w-[40%] lg:max-w-[600px] bg-black flex flex-col justify-center p-6 lg:p-[5.5rem] lg:pr-16 relative z-10 order-2 lg:order-1 -mr-1 h-auto lg:h-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-left leading-tight">
              {coalYardTitle}
            </h3>
            <p className="text-white text-sm leading-relaxed text-left line-clamp-6 lg:line-clamp-none" dangerouslySetInnerHTML={{ __html: coalYardDescription }} />
          </div>

        {/* Right: Image - Full Width */}
        <div className="w-full lg:flex-1 relative h-[320px] lg:h-full order-1 lg:order-2 bg-gray-800">
            {coalYardImage ? (
              <img
                src={coalYardImage}
                alt="Coal yard management"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
            {/* Gradient Overlay - Fades to black on the left */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black"></div>
          </div>
        </div>

        {/* Coal Trading */}
        <div className="flex flex-col lg:flex-row relative group h-auto lg:h-[320px]" data-aos="fade-up">
        {/* Left: Image - Full Width */}
        <div className="w-full lg:flex-1 relative h-[320px] lg:h-full bg-gray-800">
            {coalTradingImage ? (
              <img
                src={coalTradingImage}
                alt="Coal trading"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
            {/* Gradient Overlay - Fades to black on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"></div>
          </div>

          {/* Right: Text Block */}
        <div className="lg:w-[40%] lg:max-w-[600px] bg-black flex flex-col justify-center p-6 lg:p-[5.5rem] lg:pl-16 relative z-10 -ml-1 h-auto lg:h-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-right leading-tight">
              {coalTradingTitle}
            </h3>
            <p className="text-white text-sm leading-relaxed text-right line-clamp-6 lg:line-clamp-none" dangerouslySetInnerHTML={{ __html: coalTradingDescription }} />
        </div>
      </div>
    </section>
  );
}
