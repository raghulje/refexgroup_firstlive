import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../feature/MainLayout';
import Footer from '../feature/Footer';

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface GalleryYearConfig {
  year: string;
  heroImage: string;
  categories: GalleryCategory[];
  images: GalleryImage[];
}

interface GalleryYearPageProps {
  config: GalleryYearConfig;
}

const GalleryYearPage = ({ config }: GalleryYearPageProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(config.images);
    } else {
      setFilteredImages(config.images.filter(img => img.category === activeCategory));
    }
  }, [activeCategory, config.images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : filteredImages.length - 1;
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => {
          if (prev === null) return null;
          return prev < filteredImages.length - 1 ? prev + 1 : 0;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages.length]);

  const handlePrevImage = () => {
    setSelectedImage((prev) => {
      if (prev === null) return null;
      return prev > 0 ? prev - 1 : filteredImages.length - 1;
    });
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => {
      if (prev === null) return null;
      return prev < filteredImages.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[180px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={config.heroImage}
              alt={`Gallery ${config.year}`}
              className="w-full h-full object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Gallery - {config.year}
              </h1>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {config.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredImages.length > 0 ? (
              <div 
                key={activeCategory}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                    style={{
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${(index % 9) * 0.1}s`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <i className="ri-search-line text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No images found for this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: '#2188d1' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Got a question?
                </h2>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#2188d1] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Get in touch
                </Link>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  See our latest news
                </h2>
                <Link
                  to="/newsroom"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#2188d1] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Refex Newsroom
                </Link>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Work at Refex
                </h2>
                <Link
                  to="/careers"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#2188d1] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Careers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <i className="ri-close-line"></i>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center cursor-pointer"
              aria-label="Previous"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center cursor-pointer"
              aria-label="Next"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg z-10">
              {selectedImage + 1} / {filteredImages.length}
            </div>

            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </MainLayout>
  );
};

export default GalleryYearPage;

