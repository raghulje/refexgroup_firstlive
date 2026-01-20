interface CertificationCardProps {
  image: string;
  title: string;
  showAwardName?: boolean;
  delay?: number;
}

export default function CertificationCard({ image, title, showAwardName = true, delay = 0 }: CertificationCardProps) {
  // Check if this is the "Great Place to Work" award - hide name and move image down
  // Match various forms: "Great Place to Work", "Great Place To Work", "great place to work", etc.
  // Extract text from HTML if title contains HTML tags
  let titleText = '';
  if (title && typeof title === 'string') {
    // Remove HTML tags to get plain text for matching
    titleText = title.replace(/<[^>]*>/g, '').toLowerCase().trim();
  }
  const isGreatPlaceToWork = titleText.includes('great place') && titleText.includes('work');
  const shouldHideName = isGreatPlaceToWork || !showAwardName;
  
  return (
    <div
      className={`flex flex-col items-center text-center h-full ${shouldHideName ? 'justify-end' : 'space-y-1'}`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Certification Image - Plaque Style */}
      <div className={`w-full flex ${shouldHideName ? 'flex-grow items-end' : 'items-end'} justify-center pb-0`} style={shouldHideName ? { paddingBottom: 0, minHeight: '300px' } : {}}>
        <div className={`relative w-full max-w-[240px] md:max-w-[220px] flex items-end justify-center bg-transparent rounded-lg ${shouldHideName ? 'h-full' : 'min-h-[220px]'}`}>
          {image ? (
          <img
            src={image}
            alt={title}
            className={`w-full h-auto ${shouldHideName ? 'max-h-[380px]' : 'max-h-[220px]'} object-contain`}
            style={shouldHideName ? { 
              marginTop: '0px',
              marginBottom: '0',
              objectPosition: 'bottom',
              alignSelf: 'flex-end',
              width: '100%',
              height: 'auto'
            } : {}}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const container = (e.target as HTMLImageElement).parentElement;
                if (container) {
                  container.innerHTML = '<div class="text-gray-400 text-xs text-center p-4">No image</div>';
                }
              }}
            />
          ) : (
            <div className="text-gray-400 text-xs text-center p-4">No image available</div>
          )}
        </div>
      </div>

      {/* Certification Title - Hide for "Great Place to Work" award */}
      {!shouldHideName && title && (
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium px-2 max-w-[260px] min-h-[40px] sm:min-h-[50px] md:min-h-[60px] flex items-center justify-center pt-0.5 sm:pt-1 md:pt-2">
          {title}
        </p>
      )}
    </div>
  );
}

