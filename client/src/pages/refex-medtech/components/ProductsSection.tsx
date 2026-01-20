import { useEffect, useRef } from 'react';

import Mini90 from '../../../wp-content/uploads/2025/05/Mini-90-new.jpg';
import FPD from '../../../wp-content/uploads/2025/05/Flat-Panel-Detector-new-1.jpg';
import Anamaya from '../../../wp-content/uploads/2025/04/Anamaya-1.5T-MRI.jpg';
import FloorDR from '../../../wp-content/uploads/2025/04/Floor-mounted-DR.jpg';
import CeilingDR from '../../../wp-content/uploads/2025/04/Ceiling-mounted-DR.jpg';
import DisplayMonitors from '../../../wp-content/uploads/2025/04/Image-Display-Monitors.jpg';
import FilmDigitizer from '../../../wp-content/uploads/2025/04/X-ray-film-digitizer.jpg';
import Mytian from '../../../wp-content/uploads/2025/04/Mytian.jpg';
import { getApiBaseUrl } from '../../../config/env';

interface ProductsSectionProps {
  sectionData?: any;
  products?: any[];
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

const ProductsSection = ({ sectionData, products = [], getImagePath, getSectionContent }: ProductsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback values
  const fallbackTitle = 'Extensive product portfolio';
  const fallbackDescription = 'Our product range encompasses X-ray systems, digital radiography solutions, C-Arms, dedicated to improving healthcare accessibility and quality. Our strategic focus on Tier 2 and Tier 3 markets ensures that healthcare facilities in every corner of the country benefit from our advanced technology.';
  const fallbackProducts = [
    {
      id: 1,
      image: Mini90,
      title: 'MINI 90',
      description: 'Ultra-portable hand-held digital X-ray system',
      features: [
        'Lightweight and compact design: Weighing <4 kg',
        'Best in class: up to 90 kV, 10 mA for precise and high resolution',
        'SID tracker',
        '7 inch LED smart screen',
        'Dose display',
        'Leak proof adjustable collimator',
        'Skin guard leaves',
        'Temperature and shock sensor',
        'Versatile uses in clinical settings',
        'Cutting-edge AI powered diagnostics'
      ]
    },
    {
      id: 2,
      image: FPD,
      title: 'Flat Panel Detector',
      description: 'Applications for X-ray and Fluoroscopy',
      features: [
        'New generation Flat Panel Detector',
        '17 x 17 and 14 x 17 inches',
        'Wired and wireless CSI Technology',
        'High DQE for excellent image quality',
        'Durable and robust-handle up to 150 kg of distributed load',
        'Unprecedented weight of 3 kg',
        'Advanced software technology for easy Deployment'
      ]
    },
    {
      id: 3,
      image: Anamaya,
      title: 'Anamaya 1.5T MRI',
      description: 'The country\'s first completely Made-in-India MRI, 1.5T superconductive MRI',
      featuresHeading: 'Unparalleled Diagnostic Clarity and Advanced Applications:',
      features: [
        '96% acoustic noise reduction',
        '50% power savings and energy efficiency',
        'Radar technology and Smart analytics',
        'High-Precision Signal Correction technology',
        'Superior magnet technology'
      ]
    },
    {
      id: 4,
      image: FloorDR,
      title: 'Floor mounted DR',
      description: 'Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs',
      features: [
        'Advanced Display for Bucky selection, Focal point selection, Exposure.',
        'APR Based Control for all body parts',
        'Microprocessor control tube for overload protection',
        'Automatic voltage compensation',
        'Self-Diagnostic program with Error code.'
      ]
    },
    {
      id: 5,
      image: CeilingDR,
      title: 'Ceiling mounted DR',
      description: 'Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs',
      features: [
        'Advanced Display for Bucky selection, Focal point selection, Exposure.',
        'APR Based Control for all body parts',
        'Microprocessor control tube for overload protection',
        'Automatic voltage compensation',
        'Self-Diagnostic program with Error code.'
      ]
    },
    {
      id: 6,
      image: DisplayMonitors,
      title: 'Image Display Monitors',
      description: '',
      featuresHeading: 'A comprehensive set of Radiology and OT scope display monitors with USFDA/CE-certification bringing dependable diagnostic imaging to its true potential. Amplify your reading experience with:',
      features: [
        'Accurate visualization with high resolution, brightness and contrast ratio from any angle.',
        'Ergonomic design for enhanced comfort, speed and immersion.',
        'Optimized image quality with uniform luminance and long term consistency.',
        'Multi monitor setup and multi-modal compatibility.'
      ]
    },
    {
      id: 7,
      image: FilmDigitizer,
      title: 'X-ray film digitizer',
      description: '',
      featuresHeading: 'Image Display Monitors',
      features: [
        'Easy to scan all sizes of X-ray films',
        'High quality mammography scan',
        'Scan time- 8 secs for 14 x17 film',
        'Support data format- DCM, BMP, JPEG, DICOM',
        'Slim data size (max 3.3MB /200dpi)',
        'One-click scans with auto-sizing',
        'Brightness control for each X-ray film',
        'Various support for PACS viewer'
      ]
    },
    {
      id: 8,
      image: Mytian,
      title: 'Mytian',
      description: 'An advanced, fully orchestrated visualization solution.',
      features: [
        'Smart layout',
        'Quick patient throughput',
        'Multi modality',
        'Patient lifeline',
        'Dedicated tools by modality',
        'Seamless communication'
      ]
    },
    {
      id: 9,
      image: FilmDigitizer,
      title: 'FPD C-arm',
      description: 'An advanced imaging solution for high-end surgeries in Orthopedics, Urology, Neurology, Gastrointestinal, and Pain Management.',
      features: [
        'Cesium Iodide FPD for high-resolution, high-contrast imaging',
        'Large FOV captures more anatomy in one shot',
        'Low radiation dose with advanced dose management',
        'ADONIS TIALIC ensures optimized low-dose clarity',
        'Wireless, PACS-ready digital storage',
        'Compact design for flexible use in tight spaces'
      ]
    }
  ];

  // Get CMS values
  const title = getSectionContent?.(sectionData, 'title') || fallbackTitle;
  const description = getSectionContent?.(sectionData, 'description') || fallbackDescription;
  const productsToShow = products.length > 0 ? products : fallbackProducts;

  const getImage = (img: any): string => {
    // Handle string paths
    if (typeof img === 'string') {
      if (img.startsWith('/uploads/')) {
        const apiBase = getApiBaseUrl();
        return `${apiBase}${img}`;
      }
      // If it's already a full URL, return as-is
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return img;
    }
    
    // Handle objects with path/image properties
    if (img && typeof img === 'object') {
      if (img.path || img.image) {
      return getImagePath ? getImagePath(img) : (img.path || img.image);
    }
      // Handle imported image modules (Vite imports) - they have a default export
      if (img.default) {
        return img.default;
      }
    }
    
    // Handle imported image modules directly (Vite imports return a string URL)
    // If it's a function (React component), we shouldn't use it here
    if (typeof img === 'function') {
      return '';
    }
    
    return '';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('[data-aos]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {title}
          </h2>
          <p
            className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {productsToShow.map((product: any, index: number) => (
            <div
              key={product.id}
              className="group relative h-full"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              {/* Flip Card Container */}
              <div
                className="flip-card-container relative h-full min-h-[350px] sm:min-h-[400px] lg:min-h-[450px]"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Inner wrapper for 3D transform */}
                <div
                  className="flip-card-inner relative w-full h-full transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Front of Card */}
                  <div
                    className="flip-card-front absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)'
                    }}
                  >
                    <div
                      className="w-full h-full rounded-lg overflow-hidden shadow-lg relative"
                      style={(() => {
                        // Get image path from product
                        let imagePath = '';
                        if (product.image) {
                          imagePath = getImage(product.image);
                        }
                        
                        // If no image path, try fallback
                        if (!imagePath || imagePath.trim() === '') {
                          const fallbackProduct = fallbackProducts[index];
                          if (fallbackProduct?.image) {
                            // Handle fallback image (could be imported module or string)
                            const fallbackPath = getImage(fallbackProduct.image);
                            if (fallbackPath && fallbackPath.trim() !== '') {
                              imagePath = fallbackPath;
                            }
                          }
                        }
                        
                        // Only set backgroundImage if we have a valid string path
                        if (imagePath && typeof imagePath === 'string' && imagePath.trim() !== '') {
                          return {
                            backgroundImage: `url(${imagePath})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          };
                        }
                        
                        // Default background if no image
                        return {
                          backgroundColor: '#2A78B2'
                        };
                      })()}
                    >
                      {/* Title and Subtitle Overlay - Bottom Left */}
                      <div className="absolute bottom-16 left-4 right-4 z-30">
                        <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-white drop-shadow-lg">
                          {product.name || product.title || 'Product'}
                        </h3>
                        {/* Subtitle below title */}
                        {product.subtitle && (
                          <p className="text-sm lg:text-base text-white/90 drop-shadow-lg mt-1">
                            {product.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Description Overlay - Bottom Left below title/subtitle */}
                      {/* Only show description if it's short (less than 100 chars) - long descriptions should go to featuresHeading */}
                      {product.description && product.description.length < 100 && (
                        <div className="absolute bottom-4 left-4 right-4 z-30">
                          <p className="text-sm lg:text-base text-white drop-shadow-lg">
                            {product.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back of Card - Flip Content */}
                  <div
                    className="flip-card-back absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#2A78B2] to-[#1a5a8a] p-6 flex flex-col ${(product.description || product.featuresHeading) && product.features && product.features.length > 0 ? 'justify-start' : 'justify-center'}`}>
                      {/* Description/Heading (if exists) - appears at top */}
                      {/* Prioritize featuresHeading, but if description is long (>100 chars), use it as featuresHeading */}
                      {(product.featuresHeading || (product.description && product.description.length >= 100)) && (
                        <div className="mb-4">
                          <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                            {product.featuresHeading || (product.description && product.description.length >= 100 ? product.description : '')}
                          </p>
                        </div>
                      )}
                      {/* Show short description only if no featuresHeading and description is short */}
                      {!product.featuresHeading && product.description && product.description.length < 100 && (
                        <div className="mb-4">
                          <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                            {product.description}
                          </p>
                        </div>
                      )}
                      {/* Features List */}
                      {product.features && product.features.length > 0 ? (
                        <ul className={`text-white space-y-2 text-sm lg:text-base ${(product.description || product.featuresHeading) ? 'mt-0' : ''}`}>
                          {product.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span className="flex-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-white text-center">
                          <p className="text-sm lg:text-base">Features coming soon...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .flip-card-container {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s ease-in-out;
          transform-style: preserve-3d;
        }
        .group:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default ProductsSection;
