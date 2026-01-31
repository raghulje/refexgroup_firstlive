import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string; // For responsive images
  quality?: number; // Image quality (1-100)
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Optimized Image Component with:
 * - Lazy loading (except priority images)
 * - Responsive images with srcset
 * - Blur placeholder support
 * - Error handling
 * - Intersection Observer for viewport detection
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  quality = 85,
  className = '',
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images are always "in view"
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate responsive srcset if width is provided
  const generateSrcSet = (baseSrc: string, baseWidth?: number): string => {
    if (!baseWidth) return '';
    
    const breakpoints = [640, 768, 1024, 1280, 1536]; // sm, md, lg, xl, 2xl
    const srcSets: string[] = [];
    
    // Add original size
    srcSets.push(`${baseSrc}?w=${baseWidth} ${baseWidth}w`);
    
    // Generate smaller sizes for responsive loading
    breakpoints.forEach(bp => {
      if (bp < baseWidth) {
        srcSets.push(`${baseSrc}?w=${bp} ${bp}w`);
      }
    });
    
    return srcSets.join(', ');
  };

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return; // Skip observer for priority images

    const imgElement = imgRef.current;
    if (!imgElement) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect once in view
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoaded(false);
    if (onError) {
      onError(e);
    }
  };

  // Generate optimized image URL with quality parameter
  const getOptimizedSrc = (imageSrc: string): string => {
    // If it's already a full URL with query params, append quality
    if (imageSrc.includes('?')) {
      return `${imageSrc}&q=${quality}`;
    }
    // If it's a local upload, add optimization params
    if (imageSrc.includes('/uploads/') || imageSrc.includes('/api/')) {
      return `${imageSrc}${imageSrc.includes('?') ? '&' : '?'}w=${width || 'auto'}&q=${quality}`;
    }
    return imageSrc;
  };

  const optimizedSrc = isInView ? getOptimizedSrc(src) : '';
  const srcSet = width && isInView ? generateSrcSet(src, width) : undefined;
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md scale-110"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          aria-hidden="true"
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={defaultSizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            objectFit: 'cover',
            ...props.style,
          }}
          {...props}
        />
      )}

      {/* Error placeholder */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          aria-label="Image failed to load"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

