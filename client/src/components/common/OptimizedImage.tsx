import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { getOptimizedImageUrl, getLowQualityPlaceholder, generateResponsiveSrcSet } from '../../utils/imageOptimization';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  placeholder?: 'blur' | 'empty' | 'skeleton';
  blurDataURL?: string;
  sizes?: string; // For responsive images
  quality?: number; // Image quality (1-100)
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Enhanced Optimized Image Component with:
 * - Advanced lazy loading with Intersection Observer
 * - Progressive loading with low-quality placeholders
 * - Responsive images with srcset
 * - Automatic image optimization
 * - Error handling and retry
 * - Loading states and smooth transitions
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'skeleton',
  blurDataURL,
  sizes,
  quality = 85,
  className = '',
  onError,
  onLoad,
  objectFit = 'cover',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images are always "in view"
  const [lowQualitySrc, setLowQualitySrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  // Generate low-quality placeholder on mount
  useEffect(() => {
    if (placeholder === 'blur' && src && !blurDataURL) {
      const lowQuality = getLowQualityPlaceholder(src);
      setLowQualitySrc(lowQuality);
    } else if (blurDataURL) {
      setLowQualitySrc(blurDataURL);
    }
  }, [src, placeholder, blurDataURL]);

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return; // Skip observer for priority images

    const imgElement = imgRef.current;
    if (!imgElement) return;

    // Use a more aggressive rootMargin for faster perceived loading
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
        rootMargin: '100px', // Start loading 100px before image enters viewport
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

  // Preload priority images
  useEffect(() => {
    if (priority && src && !isLoaded && !hasError) {
      const img = new Image();
      img.src = getOptimizedImageUrl(src, { width, height, quality });
      img.onload = () => {
        // Image is preloaded, ready to display
      };
    }
  }, [priority, src, width, height, quality, isLoaded, hasError]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error with retry logic
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    
    // Retry logic for transient errors
    if (retryCountRef.current < maxRetries && src) {
      retryCountRef.current += 1;
      setTimeout(() => {
        if (img && img.parentElement) {
          img.src = getOptimizedImageUrl(src, { width, height, quality });
        }
      }, 1000 * retryCountRef.current); // Exponential backoff
      return;
    }

    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  // Generate optimized URLs
  const optimizedSrc = isInView && src 
    ? getOptimizedImageUrl(src, { width, height, quality })
    : '';
  
  const srcSet = width && isInView && src
    ? generateResponsiveSrcSet(src, width, { height, quality })
    : undefined;
  
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, minHeight: height ? `${height}px` : undefined }}
    >
      {/* Low-quality blur placeholder for progressive loading */}
      {placeholder === 'blur' && lowQualitySrc && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${lowQualitySrc})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
          aria-hidden="true"
        />
      )}

      {/* Skeleton/Loading placeholder */}
      {(placeholder === 'skeleton' || placeholder === 'empty') && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      {!hasError && isInView && optimizedSrc && (
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
          className={`w-full h-full transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: objectFit,
            ...props.style,
          }}
          {...props}
        />
      )}

      {/* Error placeholder */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center"
          aria-label="Image failed to load"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-2"
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
          <p className="text-xs text-gray-500">Image unavailable</p>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

