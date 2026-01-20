import React from 'react';
import { getApiBaseUrl } from '../../../config/env';

interface SolutionsSectionProps {
  sectionData?: any;
  solutions?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ sectionData, solutions = [], getImagePath, getSectionContent }) => {
  // Fallback values
  const fallbackTitle = 'Refex Mobility Solutions';
  // No fallback solutions - all must come from CMS
  const fallbackSolutions: any[] = [];
  const fallbackCitiesTitle = 'Available In Major Cities';
  const fallbackCities = 'Chennai | Bengaluru | Mumbai | Hyderabad | Delhi';

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const citiesTitle = getSectionContent?.(sectionData, 'citiesTitle') || fallbackCitiesTitle;
  const cities = getSectionContent?.(sectionData, 'cities') || fallbackCities;
  const solutionsToShow = solutions.length > 0 ? solutions : fallbackSolutions;

  const getImage = (img: any): string => {
    if (typeof img === 'string') {
      // Filter out old /assets/ paths
      if (img.startsWith('/assets/')) {
        return '';
      }
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      return img;
    }
    if (img?.path) {
      return getImagePath ? getImagePath(img) : img.path;
    }
    return '';
  };

  return (
    <section
      id="solutions"
      className="relative pt-8 lg:pt-0 pb-16"
      style={{
        background: 'linear-gradient(120deg, #E87A43 0%, #466B34 99%)'
      }}
    >
      {/* Badge/Tab - "Refex Mobility Solutions" - Mobile: White rounded badge, Desktop: Rounded pill */}
      <div className="absolute -top-6 md:-top-8 left-6 md:left-6 md:left-8 lg:left-12 z-10 w-auto md:w-auto">
        <div 
          className="bg-white rounded-2xl md:rounded-full px-6 md:px-8 lg:px-10 py-3 md:py-4 shadow-lg md:shadow-lg"
        >
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap text-left md:text-left">
            {title}
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pt-16 md:pt-6 lg:pt-4">

        <div className="space-y-6 lg:space-y-4 mt-4 lg:mt-0">
          {solutionsToShow.map((solution: any, index: number) => {
            const isEven = index % 2 === 1;
            // Force reverse layout for "Corporate Airport Transfers" (image left, text right)
            const isCorporateAirport = solution.title?.includes('Corporate Airport Transfers');
            // Check if it's "On call" or "on-demand" rides
            const isOnCallOnDemand = solution.title?.toLowerCase().includes('on call') || solution.title?.toLowerCase().includes('on-demand');
            // For Corporate Airport: image left, text right = swap order and use normal flex-row
            // For others: follow alternating pattern
            const shouldReverse = isCorporateAirport ? false : isEven;
            // Reduce padding by 70% for these specific cards on desktop only
            const shouldReducePadding = (isCorporateAirport || isOnCallOnDemand);
            
            // Content components
            const textContent = (
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 whitespace-pre-line">
                  {(() => {
                    // Make "LOCAL RIDES | AIRPORT RIDES" bold in title
                    const title = solution.title || '';
                    const parts = title.split(/(LOCAL RIDES\s*\|\s*AIRPORT RIDES)/gi);
                    return parts.map((part: string, idx: number) => {
                      if (part.match(/LOCAL RIDES\s*\|\s*AIRPORT RIDES/gi)) {
                        return <strong key={idx}>{part}</strong>;
                      }
                      return <span key={idx}>{part}</span>;
                    });
                  })()}
                </h3>
                <div className="text-white text-sm lg:text-base leading-relaxed whitespace-pre-line">
                  {(() => {
                    // Process description to highlight "Refex Mobility app" in white for Corporate Airport
                    // "Website" as link without underline, and "LOCAL RIDES | AIRPORT RIDES" as bold
                    const description = solution.description || '';
                    const parts = description.split(/(Refex Mobility app|Website|LOCAL RIDES\s*\|\s*AIRPORT RIDES)/gi);
                    
                    return parts.map((part: string, idx: number) => {
                      const lowerPart = part.toLowerCase();
                      if (part.match(/LOCAL RIDES\s*\|\s*AIRPORT RIDES/gi)) {
                        return <strong key={idx}>{part}</strong>;
                      } else if (lowerPart === 'refex mobility app') {
                        // Make white for Corporate Airport Transfers, black for others
                        return (
                          <span 
                            key={idx} 
                            className={isCorporateAirport ? "text-white font-semibold" : "text-black font-semibold"}
                          >
                            {part}
                          </span>
                        );
                      } else if (lowerPart === 'website') {
                        return (
                          <a
                            key={idx}
                            href="https://refexmobility.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black font-semibold no-underline hover:no-underline"
                          >
                            {part}
                          </a>
                        );
                      }
                      return <span key={idx}>{part}</span>;
                    });
                  })()}
                </div>
              </div>
            );

            const imageContent = (
              <div className="flex-1 w-full bg-gray-100 rounded-[2rem]">
                {getImage(solution.image) ? (
                  <img
                    src={getImage(solution.image)}
                    alt={solution.title}
                    className="w-full h-auto object-cover rounded-[2rem] shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-400 rounded-[2rem]">
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            );

            return (
              <div key={index} className={shouldReducePadding ? 'lg:-my-[33.6px]' : ''}>
                {/* Mobile: Card Layout with Image at Top */}
                <div className="lg:hidden">
                  <div className="bg-transparent rounded-3xl overflow-hidden">
                    {/* Image at Top */}
                    <div className="w-full mb-0">
                      {getImage(solution.image) ? (
                        <img
                          src={getImage(solution.image)}
                          alt={solution.title}
                          className="w-full h-auto object-cover rounded-t-3xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center text-gray-400 rounded-t-3xl bg-gray-100">
                          <span className="text-sm">No image available</span>
                        </div>
                      )}
                    </div>
                    {/* Text Content Below Image */}
                    <div className="px-6 py-6 pb-8">
                      <h3 className="text-xl font-bold text-white mb-4 whitespace-pre-line">
                        {(() => {
                          const title = solution.title || '';
                          const parts = title.split(/(LOCAL RIDES\s*\|\s*AIRPORT RIDES)/gi);
                          return parts.map((part: string, idx: number) => {
                            if (part.match(/LOCAL RIDES\s*\|\s*AIRPORT RIDES/gi)) {
                              return <strong key={idx}>{part}</strong>;
                            }
                            return <span key={idx}>{part}</span>;
                          });
                        })()}
                      </h3>
                      <div className="text-white text-sm leading-relaxed whitespace-pre-line">
                        {(() => {
                          const description = solution.description || '';
                          const parts = description.split(/(Refex Mobility app|Website|LOCAL RIDES\s*\|\s*AIRPORT RIDES)/gi);
                          
                          return parts.map((part: string, idx: number) => {
                            const lowerPart = part.toLowerCase();
                            if (part.match(/LOCAL RIDES\s*\|\s*AIRPORT RIDES/gi)) {
                              return <strong key={idx}>{part}</strong>;
                            } else if (lowerPart === 'refex mobility app') {
                              return (
                                <span 
                                  key={idx} 
                                  className="text-white font-semibold"
                                >
                                  {part}
                                </span>
                              );
                            } else if (lowerPart === 'website') {
                              return (
                                <a
                                  key={idx}
                                  href="https://refexmobility.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white font-semibold no-underline hover:no-underline"
                                >
                                  {part}
                                </a>
                              );
                            }
                            return <span key={idx}>{part}</span>;
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Original Side-by-side Layout */}
                <div className={`hidden lg:flex flex-col lg:flex-row${shouldReverse ? '-reverse' : ''} gap-8 lg:gap-16 items-center`}>
                {isCorporateAirport ? (
                  <>
                    {imageContent}
                    {textContent}
                  </>
                ) : (
                  <>
                    {textContent}
                    {imageContent}
                  </>
                )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Available Cities Footer */}
        <div className="mt-20 lg:mt-24 text-center">
          <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
            {citiesTitle}
          </h4>
          <p className="text-lg md:text-xl text-white font-medium">
            {cities}
          </p>
        </div>
      </div>
    </section>
  );
};