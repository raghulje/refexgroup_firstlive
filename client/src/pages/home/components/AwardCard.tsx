
interface AwardCardProps {
  image: string;
  title: string;
  year?: string;
  recipient?: string;
  showAwardName?: boolean;
  delay?: number;
}

export default function AwardCard({ image, title, year, recipient, showAwardName = true, delay = 0 }: AwardCardProps) {
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
      className={`award-card flex flex-col items-center text-center h-full ${shouldHideName ? 'justify-start' : 'space-y-1'}`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Award Image Container */}
      <div className={`w-full flex items-end justify-center ${shouldHideName ? 'p-2 sm:p-3 md:p-4 pb-0' : 'p-2 sm:p-3 md:p-4 pb-0'}`}>
        <div className={`relative w-full ${shouldHideName ? 'max-w-[240px]' : 'max-w-[280px] aspect-square'} flex items-end justify-center bg-transparent rounded-lg`}>
          {image ? (
          <img
            src={image}
            alt={title}
            className={`${shouldHideName ? 'w-full h-auto max-h-[340px]' : 'max-h-full max-w-full'} object-contain drop-shadow-lg`}
            style={shouldHideName ? { 
              marginTop: '0px',
              marginBottom: '0',
              width: '100%'
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

      {/* Award Title - Hide for "Great Place to Work" award */}
      {!shouldHideName && showAwardName && (
        <div className="space-y-2 sm:space-y-3 px-2 pt-0.5 sm:pt-1 md:pt-2">
          <div 
            className="text-sm text-gray-700 leading-relaxed font-medium min-h-[40px] sm:min-h-[50px] md:min-h-[60px] flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          
          {/* Year Badge (if exists) */}
          {year && (
            <div className="flex flex-col items-center space-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#d4af37] bg-white">
                <span className="text-2xl font-bold text-[#d4af37]">{year}</span>
              </div>
              {recipient && (
                <p className="text-xs text-gray-600 font-medium">{recipient}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
