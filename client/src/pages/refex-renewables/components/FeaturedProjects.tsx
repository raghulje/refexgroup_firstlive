import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../../config/env';

interface FeaturedProjectsProps {
  section?: any;
  projects?: any[];
  getImagePath?: (imageData: any) => string;
}

export default function FeaturedProjects({ section, projects = [], getImagePath }: FeaturedProjectsProps) {
  // Fallback to hardcoded projects if CMS data not available
  // No fallback projects - all must come from CMS
  const defaultProjects: any[] = [];

  const displayProjects = projects.length > 0 ? projects : [];
  const [activeProject, setActiveProject] = useState(displayProjects[0] || null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle keyboard navigation and body scroll lock
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      const allImages = activeProject.images || [];
      const totalImages = allImages.length;

      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, activeProject]);

  // Get title and description from CMS
  const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue || 
                'Featured Projects';
  const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue || 
                      'Explore our featured projects and discover how Refex is leading the way in sustainable innovation and excellence.';

  // Get background image
  let backgroundImage = '';
  if (section?.content) {
    const bgImageItem = section.content.find((c: any) => c.contentKey === 'backgroundImage');
    if (bgImageItem) {
      if (bgImageItem.media && getImagePath) {
        const path = getImagePath(bgImageItem.media);
        if (path && !path.startsWith('/assets/')) backgroundImage = path;
      } else if (bgImageItem.contentValue) {
        if (bgImageItem.contentValue.startsWith('/uploads/')) {
          const apiBase = getApiBaseUrl();
          backgroundImage = `${apiBase}${bgImageItem.contentValue}`;
        } else if (!bgImageItem.contentValue.startsWith('/assets/')) {
          backgroundImage = bgImageItem.contentValue;
        }
      }
    }
  }

  // Get sun background icon
  let sunIcon = '/assets/icons/sun-bg.png'; // Fallback to default
  if (section?.content) {
    const sunIconItem = section.content.find((c: any) => c.contentKey === 'sunIcon');
    if (sunIconItem) {
      if (sunIconItem.media && getImagePath) {
        const path = getImagePath(sunIconItem.media);
        if (path && !path.startsWith('/assets/')) {
          sunIcon = path;
        } else if (path && path.startsWith('/assets/')) {
          // Keep /assets/ paths for sun icon as fallback
          sunIcon = path;
        }
      } else if (sunIconItem.contentValue) {
        if (sunIconItem.contentValue.startsWith('/uploads/')) {
          const apiBase = getApiBaseUrl();
          sunIcon = `${apiBase}${sunIconItem.contentValue}`;
        } else if (sunIconItem.contentValue.startsWith('/assets/')) {
          sunIcon = sunIconItem.contentValue;
        } else if (sunIconItem.contentValue.startsWith('http://') || sunIconItem.contentValue.startsWith('https://')) {
          sunIcon = sunIconItem.contentValue;
        }
      }
    }
  }

  // Helper to get image path - use getImagePath prop if available, otherwise use local logic
  const getImageSrc = (imagePath: any): string => {
    if (!imagePath) return '';
    
    // If getImagePath prop is available, use it first
    if (getImagePath) {
      const resolved = getImagePath(imagePath);
      if (resolved) return resolved;
    }
    
    // Handle different types of imagePath
    let pathStr = '';
    if (typeof imagePath === 'string') {
      pathStr = imagePath;
    } else if (typeof imagePath === 'object' && imagePath !== null) {
      // Extract path from object (could be Media object or path object)
      pathStr = imagePath.filePath || imagePath.path || imagePath.url || imagePath.contentValue || '';
    } else if (typeof imagePath === 'number') {
      // If it's a media ID, construct path
      const apiBase = getApiBaseUrl();
      return `${apiBase}/uploads/media/${imagePath}`;
    } else {
      // Convert to string as fallback
      pathStr = String(imagePath || '');
    }
    
    // Ensure pathStr is a string before calling startsWith
    if (!pathStr || typeof pathStr !== 'string') return '';
    
    if (pathStr.startsWith('/uploads/')) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}${pathStr}`;
    }
    
    // If it's already a full URL, return as-is
    if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
      return pathStr;
    }
    
    return pathStr;
  };

  return (
    <section className="relative py-12 pb-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      ></div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(178deg, #131111 0%, #1E2227D6 87%)',
          transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'
        }}
      ></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Project Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {displayProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project)}
              data-active={activeProject.id === project.id}
              className={`project-button-fill px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 whitespace-normal sm:whitespace-nowrap cursor-pointer relative overflow-hidden group text-sm sm:text-base ${
                activeProject.id === project.id
                  ? 'bg-[#f9d71c] text-black'
                  : 'bg-white text-black'
              }`}
            >
              <span className="relative z-10">
                {project.name}
              </span>
            </button>
          ))}
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {(activeProject?.images || []).map((image: any, index: number) => {
              const imageSrc = getImageSrc(image);
              if (!imageSrc) return null; // Don't render if no valid image
              
              return (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-video bg-gray-800 cursor-pointer group"
                onClick={() => {
                  setCurrentImageIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                    src={imageSrc}
                  alt={`${activeProject.name} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
              );
            })}
          </div>

          {/* Right: Project Details */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">
              {activeProject.name}
            </h3>

            <div className="flex items-center gap-2" style={{ color: '#7dc144' }}>
              <i className="ri-map-pin-line text-xl"></i>
              <span className="text-lg">{activeProject.location}</span>
            </div>

            <div className="space-y-4">
              <p className="text-white text-lg font-bold">
                Capacity – {activeProject.capacity}
              </p>

              <div className="text-white text-base leading-relaxed space-y-4">
                {activeProject.id === 'indian-army' ? (
                  <>
                    <p className="font-bold">Solar project at the highest altitude in India</p>
                    <p>{activeProject.details}</p>
                    {activeProject.extraDetails && <p>{activeProject.extraDetails}</p>}
                  </>
                ) : (
                  <>
                    {activeProject.description && <p>{activeProject.description}</p>}
                    {activeProject.details && <p>{activeProject.details}</p>}
                    {activeProject.extraDetails && <p>{activeProject.extraDetails}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Sun Icon - Bottom Right */}
      {sunIcon && (
      <div className="absolute bottom-8 right-8 w-32 h-32 lg:w-48 lg:h-48 opacity-80 pointer-events-none z-0">
        <img
            src={sunIcon}
          alt="Sun Background"
          className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to default if custom icon fails to load
              if (sunIcon !== '/assets/icons/sun-bg.png') {
                (e.target as HTMLImageElement).src = '/assets/icons/sun-bg.png';
              } else {
                (e.target as HTMLImageElement).style.display = 'none';
              }
            }}
        />
      </div>
      )}

      {/* Lightbox Gallery */}
      {lightboxOpen && activeProject && (() => {
        const allImages = activeProject.images || [];
        const currentImage = allImages[currentImageIndex];
        const currentImageSrc = getImageSrc(currentImage);
        const totalImages = allImages.length;

        const goToPrevious = () => {
          setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
        };

        const goToNext = () => {
          setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
        };

        const handleFullscreen = () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
          } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
          }
        };

        const handleShare = async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: activeProject.name,
                text: `Check out ${activeProject.name}`,
                url: window.location.href
              });
            } catch (err) {
              // User cancelled or error occurred
            }
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }
        };

        return (
          <div className="fixed inset-0 z-50">
            {/* Backdrop - closes lightbox when clicked */}
            <div 
              className="absolute inset-0 bg-black/95"
              onClick={() => setLightboxOpen(false)}
            ></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
            {/* Header */}
              <div 
                className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-[#2a2a2a] border-b border-gray-700 pointer-events-auto"
              >
              {/* Left: Counter and Logo */}
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium">
                  {currentImageIndex + 1}/{totalImages}
                </span>
                <div className="text-[#ff6b35] text-xl font-bold">refex</div>
              </div>

              {/* Right: Navigation and Actions */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                {/* Navigation Links (hidden on mobile) */}
                <div className="hidden md:flex items-center gap-6 text-white text-sm">
                  <a href="/" className="hover:text-[#ff6b35] transition-colors">Home</a>
                  <a href="/about-refex" className="hover:text-[#ff6b35] transition-colors">About Refex</a>
                  <a href="/business" className="hover:text-[#ff6b35] transition-colors">Business</a>
                  <a href="/investments" className="hover:text-[#ff6b35] transition-colors">Investments</a>
                  <a href="/esg" className="hover:text-[#ff6b35] transition-colors">ESG</a>
                  <button className="px-4 py-2 bg-[#2a2a2a] text-white rounded hover:bg-[#3a3a3a] transition-colors">
                    Get in touch
                  </button>
                </div>

                {/* Action Icons */}
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-[#ff6b35] transition-colors p-2"
                  title="Fullscreen"
                >
                  <i className="ri-fullscreen-line text-xl"></i>
                </button>
                <button
                  onClick={() => {
                    // Zoom functionality - can be enhanced later
                    const img = document.querySelector('.lightbox-main-image') as HTMLImageElement;
                    if (img) {
                      img.style.transform = img.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
                    }
                  }}
                  className="text-white hover:text-[#ff6b35] transition-colors p-2"
                  title="Zoom"
                >
                  <i className="ri-zoom-in-line text-xl"></i>
                </button>
                <button
                  onClick={handleShare}
                  className="text-white hover:text-[#ff6b35] transition-colors p-2"
                  title="Share"
                >
                  <i className="ri-share-line text-xl"></i>
                </button>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="text-white hover:text-[#ff6b35] transition-colors p-2"
                  title="Close"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            {/* Main Image Area */}
              <div 
                className="flex-1 relative flex items-center justify-center p-4"
              >
              {/* Left Thumbnails - Hidden on mobile, shown on large screens */}
              <div className="hidden lg:flex flex-col gap-4 absolute left-2 lg:left-4 z-10 max-h-[80vh] overflow-y-auto pointer-events-auto">
                {allImages.map((img: any, idx: number) => {
                  const thumbSrc = getImageSrc(img);
                  return (
                    <div
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-24 h-16 rounded overflow-hidden cursor-pointer border-2 transition-all ${
                        idx === currentImageIndex ? 'border-[#ff6b35] opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
                      }`}
                    >
                      <img
                        src={thumbSrc}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Main Image */}
              <div className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-auto px-2 sm:px-4">
                <img
                  src={currentImageSrc}
                  alt={`${activeProject.name} ${currentImageIndex + 1}`}
                  className="lightbox-main-image max-w-full max-h-full object-contain transition-transform duration-300"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 lg:left-16 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all pointer-events-auto"
                  title="Previous"
                >
                  <i className="ri-arrow-left-line text-2xl"></i>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 lg:right-16 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all pointer-events-auto"
                  title="Next"
                >
                  <i className="ri-arrow-right-line text-2xl"></i>
                </button>
              </div>
            </div>

            {/* Footer */}
              <div 
                className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-[#2a2a2a] border-t border-gray-700 pointer-events-auto"
              >
              <div className="text-white text-sm">
                Renewables - Projects - {activeProject.name}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      <style>{`
        .project-button-fill {
          position: relative;
        }
        
        .project-button-fill:not([data-active="true"]):before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background-color: #f9d71c;
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        
        .project-button-fill:not([data-active="true"]):hover:before {
          width: 100%;
        }
        
        .project-button-fill:not([data-active="true"]):hover {
          color: black;
        }
        
        .project-button-fill span {
          transition: color 0.3s ease 0.1s;
        }
      `}</style>
    </section>
  );
}
