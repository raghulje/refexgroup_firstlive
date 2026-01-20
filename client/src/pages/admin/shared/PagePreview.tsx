import { useState } from 'react';
import { getAssetPath } from './utils';

interface PagePreviewProps {
  pageSlug: string;
  sections: any[];
  getContentValue: (sectionKey: string, contentKey: string) => string;
  getContentMedia: (sectionKey: string, contentKey: string) => any;
  getContentArray: (sectionKey: string, contentKey: string) => any[];
  title: string;
}

export const PagePreview = ({
  pageSlug,
  sections,
  getContentValue,
  getContentMedia,
  getContentArray,
  title
}: PagePreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!showPreview) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview {title}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Preview: {title}</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {sections.map((section) => {
              const sectionKey = section.sectionKey;
              
              // Hero Section
              if (sectionKey === 'hero' || sectionKey === 'hero-section') {
                const title = getContentValue(sectionKey, 'title');
                const subtitle = getContentValue(sectionKey, 'subtitle');
                const description = getContentValue(sectionKey, 'description');
                const backgroundImage = getContentMedia(sectionKey, 'backgroundImage');
                
                return (
                  <div key={sectionKey} className="relative rounded-lg overflow-hidden border border-gray-200">
                    {backgroundImage && (
                      <div className="absolute inset-0">
                        <img
                          src={getAssetPath(backgroundImage.url || backgroundImage.filePath)}
                          alt="Hero Background"
                          className="w-full h-full object-cover opacity-20"
                        />
                      </div>
                    )}
                    <div className="relative p-8 bg-gradient-to-b from-gray-900/80 to-gray-900/40">
                      {subtitle && (
                        <p className="text-blue-400 text-sm font-semibold mb-2">{subtitle}</p>
                      )}
                      {title && (
                        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
                      )}
                      {description && (
                        <p className="text-gray-200 text-lg">{description}</p>
                      )}
                    </div>
                  </div>
                );
              }

              // Stats Section
              if (sectionKey === 'stats') {
                const stats = getContentArray(sectionKey, 'stats');
                
                return (
                  <div key={sectionKey} className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    {stats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                );
              }

              // About Section
              if (sectionKey === 'about' || sectionKey === 'about-us') {
                const heading = getContentValue(sectionKey, 'heading');
                const description = getContentValue(sectionKey, 'description');
                const image = getContentMedia(sectionKey, 'image');
                
                return (
                  <div key={sectionKey} className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-lg border border-gray-200">
                    <div>
                      {heading && <h2 className="text-2xl font-bold text-gray-900 mb-4">{heading}</h2>}
                      {description && <p className="text-gray-700">{description}</p>}
                    </div>
                    {image && (
                      <img
                        src={getAssetPath(image.url || image.filePath)}
                        alt="About"
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                );
              }

              // CTA Section
              if (sectionKey === 'cta' || sectionKey === 'cta-section') {
                const ctaTitle = getContentValue(sectionKey, 'title');
                const ctaDescription = getContentValue(sectionKey, 'description');
                const buttonText = getContentValue(sectionKey, 'buttonText');
                const buttonLink = getContentValue(sectionKey, 'buttonLink');
                const backgroundImage = getContentMedia(sectionKey, 'backgroundImage');
                
                return (
                  <div key={sectionKey} className="relative rounded-lg overflow-hidden border border-gray-200">
                    {backgroundImage && (
                      <div className="absolute inset-0">
                        <img
                          src={getAssetPath(backgroundImage.url || backgroundImage.filePath)}
                          alt="CTA Background"
                          className="w-full h-full object-cover opacity-30"
                        />
                      </div>
                    )}
                    <div className="relative p-8 bg-blue-600/80 text-center">
                      {ctaTitle && <h2 className="text-3xl font-bold text-white mb-4">{ctaTitle}</h2>}
                      {ctaDescription && <p className="text-blue-100 mb-6">{ctaDescription}</p>}
                      {buttonText && (
                        <a
                          href={buttonLink || '#'}
                          className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          {buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              // Generic Section Preview
              return (
                <div key={sectionKey} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {sectionKey.replace(/-/g, ' ')}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {section.content?.length > 0 ? (
                      <p>{section.content.length} content items configured</p>
                    ) : (
                      <p className="text-gray-400 italic">No content configured</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

