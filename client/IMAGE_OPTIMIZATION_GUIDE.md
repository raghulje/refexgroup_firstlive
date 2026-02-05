# Image Optimization Guide

This guide explains how to use the optimized image components for faster loading and better user experience.

## Overview

The image optimization system includes:
- **OptimizedImage**: Advanced image component with lazy loading, progressive loading, and error handling
- **CMSImage**: Wrapper component that automatically handles CMS image data
- **Image Optimization Utilities**: Functions for generating optimized URLs and preloading images

## Quick Start

### Using CMSImage (Recommended for CMS Images)

```tsx
import CMSImage from '../components/common/CMSImage';

// In your component
<CMSImage
  imageData={business.image} // CMS image data (string, object, or number)
  alt="Business card image"
  width={400}
  height={256}
  priority={index < 4} // Prioritize first 4 images
  placeholder="skeleton" // or "blur" or "empty"
  quality={85}
/>
```

### Using OptimizedImage (For Direct Image URLs)

```tsx
import OptimizedImage from '../components/common/OptimizedImage';

<OptimizedImage
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Optional low-quality placeholder
  quality={85}
/>
```

## Props

### CMSImage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageData` | `any` | Required | CMS image data (string path, object, or media ID) |
| `getImagePath` | `function` | Optional | Custom function to extract image path from CMS data |
| `fallback` | `string` | Optional | Fallback image URL if imageData is invalid |
| All OptimizedImage props | - | - | See OptimizedImage props below |

### OptimizedImage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | Required | Image source URL |
| `alt` | `string` | Required | Alt text for accessibility |
| `width` | `number` | Optional | Image width (for optimization) |
| `height` | `number` | Optional | Image height (for optimization) |
| `priority` | `boolean` | `false` | Set to `true` for above-the-fold images |
| `placeholder` | `'blur' \| 'skeleton' \| 'empty'` | `'skeleton'` | Loading placeholder type |
| `blurDataURL` | `string` | Optional | Low-quality placeholder for blur effect |
| `sizes` | `string` | Auto | Responsive image sizes attribute |
| `quality` | `number` | `85` | Image quality (1-100) |
| `objectFit` | `string` | `'cover'` | CSS object-fit value |
| `onLoad` | `function` | Optional | Callback when image loads |
| `onError` | `function` | Optional | Callback when image fails to load |

## Best Practices

### 1. Prioritize Above-the-Fold Images

```tsx
// Hero images, logos, and first few items should be prioritized
<CMSImage
  imageData={heroImage}
  priority={true}
  width={1920}
  height={1080}
/>
```

### 2. Use Appropriate Placeholders

```tsx
// For images with known aspect ratio
<CMSImage
  imageData={image}
  placeholder="skeleton" // Shows animated skeleton
/>

// For images with blur placeholder
<CMSImage
  imageData={image}
  placeholder="blur"
  blurDataURL={lowQualityBase64}
/>

// For minimal placeholder
<CMSImage
  imageData={image}
  placeholder="empty" // No placeholder, just empty space
/>
```

### 3. Set Appropriate Dimensions

Always provide width and height when possible for:
- Better layout stability (prevents layout shift)
- Automatic image optimization
- Responsive srcset generation

```tsx
<CMSImage
  imageData={image}
  width={400}  // Actual display width
  height={256} // Actual display height
/>
```

### 4. Preload Critical Images

For hero images and critical above-the-fold content:

```tsx
import { preloadCriticalImages } from '../utils/imagePreloader';

useEffect(() => {
  // Preload hero images
  preloadCriticalImages([
    heroImage1,
    heroImage2,
    logoImage
  ], { width: 1920, quality: 90 });
}, []);
```

### 5. Use Lazy Loading for Below-Fold Images

```tsx
// Images below the fold automatically use lazy loading
<CMSImage
  imageData={image}
  priority={false} // Default, enables lazy loading
/>
```

## Migration Guide

### Replacing Regular img Tags

**Before:**
```tsx
<img
  src={business.image}
  alt={business.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.target as HTMLImageElement).style.display = 'none';
  }}
/>
```

**After:**
```tsx
<CMSImage
  imageData={business.image}
  alt={business.title}
  width={400}
  height={256}
  className="w-full h-full"
  objectFit="cover"
/>
```

## Performance Benefits

1. **Lazy Loading**: Images only load when they're about to enter the viewport
2. **Progressive Loading**: Low-quality placeholders show immediately, then fade to full quality
3. **Automatic Optimization**: Images are automatically optimized with query parameters
4. **Responsive Images**: Automatic srcset generation for different screen sizes
5. **Error Handling**: Built-in retry logic and error placeholders
6. **Priority Loading**: Critical images load first

## Backend Requirements

For full optimization, your backend should support image optimization query parameters:

- `?w=800` - Resize to width
- `?h=600` - Resize to height
- `?q=85` - Quality (1-100)
- `?f=webp` - Format (webp, jpeg, png)
- `?fit=cover` - Fit mode
- `?blur=10` - Blur amount for placeholders

If your backend doesn't support these, the images will still work but won't be optimized.

## Troubleshooting

### Images Not Loading
- Check that `imageData` contains a valid image path
- Verify the image URL is accessible
- Check browser console for errors

### Images Loading Slowly
- Ensure `priority={true}` for above-the-fold images
- Use appropriate `width` and `height` props
- Consider reducing `quality` for non-critical images

### Layout Shift
- Always provide `width` and `height` props
- Use appropriate `objectFit` value
- Consider using aspect-ratio CSS
