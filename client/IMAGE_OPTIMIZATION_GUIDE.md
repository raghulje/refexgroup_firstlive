# Image Optimization Guide

This document outlines the image optimization strategies implemented to improve website performance.

## 🚀 Performance Improvements

### 1. **Lazy Loading**
- All images below the fold automatically use `loading="lazy"`
- Above-the-fold images use `loading="eager"` with `fetchpriority="high"`
- Global lazy loading is automatically applied to all images

### 2. **Optimized Image Component**
- `OptimizedImage` component with built-in lazy loading
- Responsive images with srcset support
- Blur placeholder support
- Automatic error handling

### 3. **Image Preloading**
- Critical images (hero slider, above-the-fold) are preloaded
- Adjacent slide images are preloaded in background
- Preloading uses `fetchpriority` for better resource hints

### 4. **Global Image Optimization**
- Automatic lazy loading setup in `main.tsx`
- Intersection Observer for viewport detection
- Automatic `loading` and `decoding` attributes

## 📦 Components

### OptimizedImage Component
```tsx
import OptimizedImage from '@/components/common/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
  className="rounded-lg"
/>
```

### Image Preloading Hook
```tsx
import { useImagePreload } from '@/hooks/useImagePreload';

// Preload critical images
useImagePreload([
  { src: '/hero-image.jpg', fetchPriority: 'high' },
  { src: '/logo.png', fetchPriority: 'high' }
]);
```

### Image Optimization Utilities
```tsx
import { getOptimizedImageUrl, generateSrcSet } from '@/utils/imageOptimization';

// Get optimized URL
const optimizedUrl = getOptimizedImageUrl('/image.jpg', {
  width: 800,
  quality: 85,
  format: 'webp'
});

// Generate responsive srcset
const srcSet = generateSrcSet('/image.jpg', 1920);
```

## 🔧 Implementation Details

### Automatic Lazy Loading
The global lazy loading system:
- Detects images without `loading` attribute
- Adds `loading="lazy"` to below-the-fold images
- Adds `loading="eager"` with `fetchpriority="high"` to above-the-fold images
- Uses Intersection Observer for efficient viewport detection

### Image Loading Strategy
1. **Critical Images (Above Fold)**
   - `loading="eager"`
   - `fetchpriority="high"`
   - Preloaded in document head

2. **Hero Slider Images**
   - First slide: `fetchpriority="high"`, preloaded immediately
   - Adjacent slides: Preloaded in background with `fetchpriority="low"`
   - Other slides: Lazy loaded

3. **Below Fold Images**
   - `loading="lazy"`
   - `decoding="async"`
   - Loaded when entering viewport (50px margin)

## 📊 Best Practices

### For Developers

1. **Use OptimizedImage for new components**
   ```tsx
   <OptimizedImage src={imageSrc} alt="..." width={800} height={600} />
   ```

2. **Add lazy loading to existing img tags**
   ```tsx
   <img src="..." alt="..." loading="lazy" decoding="async" />
   ```

3. **Preload critical images**
   ```tsx
   useImagePreload([{ src: '/critical-image.jpg', fetchPriority: 'high' }]);
   ```

4. **Use appropriate image sizes**
   - Hero images: 1920px width
   - Card images: 800px width
   - Thumbnails: 400px width

### For CMS/Content

1. **Upload optimized images**
   - Compress images before upload (use tools like TinyPNG)
   - Use WebP format when possible
   - Keep file sizes under 500KB for web images

2. **Provide multiple sizes**
   - Upload high-res version
   - System will generate responsive sizes

3. **Use descriptive alt text**
   - Improves SEO and accessibility

## 🎯 Performance Metrics

Expected improvements:
- **Initial Load Time**: 30-50% reduction
- **Time to Interactive**: 20-40% improvement
- **Largest Contentful Paint (LCP)**: 40-60% improvement
- **Bandwidth Usage**: 30-50% reduction (for users who don't scroll)

## 🔍 Monitoring

Monitor these metrics:
- **LCP (Largest Contentful Paint)**: Should be < 2.5s
- **FCP (First Contentful Paint)**: Should be < 1.8s
- **Total Blocking Time**: Should be < 200ms
- **Cumulative Layout Shift (CLS)**: Should be < 0.1

## 🛠️ Future Enhancements

1. **Image CDN Integration**
   - Consider using Cloudinary, Imgix, or similar
   - Automatic format conversion (WebP, AVIF)
   - Automatic optimization

2. **Service Worker Caching**
   - Cache optimized images
   - Offline support

3. **Progressive Image Loading**
   - Low-quality placeholder → High-quality image
   - Better perceived performance

4. **Responsive Images**
   - Implement `srcset` for all images
   - Art direction with `<picture>` element

## 📝 Notes

- All images from CMS are automatically optimized
- Static images in `/public` should be optimized before deployment
- Consider using image optimization services for production
- Monitor image loading performance in production

