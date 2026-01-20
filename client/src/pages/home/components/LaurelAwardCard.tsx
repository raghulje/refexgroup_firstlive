interface LaurelAwardCardProps {
  image: string;
  title: string;
  year: string;
  recipient: string;
  showAwardName?: boolean;
  delay?: number;
}

export default function LaurelAwardCard({ image, title, year, recipient, showAwardName = true, delay = 0 }: LaurelAwardCardProps) {
  return (
    <div
      className="flex flex-col items-center text-center"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Award Image - Laurel Wreath Style (year is already in the image) */}
      <div className="w-full flex items-end justify-center pb-0">
        <div className={`relative w-full ${showAwardName ? 'max-w-[240px] aspect-square' : 'max-w-[240px] min-h-[360px]'} flex items-end justify-center bg-transparent rounded-lg`}>
          {image ? (
          <img
            src={image}
            alt={title}
            className={`${showAwardName ? 'max-h-full max-w-full' : 'w-full h-full max-h-[400px]'} object-contain`}
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

      {/* Recipient Text - Only show if showAwardName is true */}
      {showAwardName && recipient && (
        <p className="text-xs text-gray-600 font-medium pt-0.5 sm:pt-1 md:pt-1.5">{recipient}</p>
      )}
    </div>
  );
}

