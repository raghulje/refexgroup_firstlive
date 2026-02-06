# Image Optimization & Performance Plan

**Date**: January 2026  
**Issue**: Large images (5-10MB+) causing slow loading throughout the website  
**Constraint**: Image locations are mapped in CMS, cannot easily replace files

---

## 📊 Current Situation Analysis

### Problems Identified:
- Images are 5-10MB+ in size
- All images load on page load (no lazy loading)
- No image compression/optimization
- No thumbnail generation
- No CDN usage
- No progressive image loading
- Backend serves full-size images directly
- No caching strategy for images
- No image format optimization (likely using JPEG/PNG)

### Impact:
- Slow page load times
- Poor user experience
- High bandwidth usage
- Increased server load
- Poor mobile performance
- Higher bounce rates

---

## 🎯 Solution Strategy Overview

**Approach**: Implement backend image processing pipeline that:
1. Automatically optimizes images on upload
2. Generates multiple sizes (thumbnails, medium, large)
3. Serves optimized versions based on context
4. Implements caching and CDN
5. Uses modern image formats (WebP, AVIF)
6. Maintains CMS mapping (no breaking changes)

---

## 📋 Implementation Plan

### Phase 1: Backend Image Processing Pipeline (Week 1-2)

#### 1.1 Install Image Processing Library
**Technology**: Sharp (Node.js) - Fast, efficient image processing

**Why Sharp?**
- 4-5x faster than ImageMagick
- Low memory footprint
- Supports WebP, AVIF, JPEG, PNG
- Automatic optimization
- Batch processing support

**Action Items**:
- Install `sharp` package: `npm install sharp`
- Create image processing service
- Set up processing queue (optional, for large batches)

---

#### 1.2 Create Image Optimization Service
**Location**: `server/services/imageProcessingService.js`

**Features to Implement**:
1. **Automatic Format Conversion**
   - Convert JPEG/PNG to WebP (better compression)
   - Fallback to original if browser doesn't support WebP
   - Support AVIF for modern browsers (even better compression)

2. **Multiple Size Generation**
   - **Thumbnail**: 150x150px (for lists, grids)
   - **Small**: 400x400px (for cards, previews)
   - **Medium**: 800x800px (for detail pages)
   - **Large**: 1920x1920px (for hero images, full-width)
   - **Original**: Keep original for download/print

3. **Quality Optimization**
   - WebP: 85% quality (good balance)
   - JPEG: 80% quality (if WebP not supported)
   - Progressive JPEG encoding
   - Optimize PNG (reduce colors if possible)

4. **Metadata Stripping**
   - Remove EXIF data (reduces file size)
   - Remove unnecessary metadata

**File Structure**:
```
server/uploads/
├── images/
│   ├── original/          # Original uploaded images
│   ├── webp/              # WebP optimized versions
│   │   ├── thumbnail/
│   │   ├── small/
│   │   ├── medium/
│   │   └── large/
│   ├── jpeg/              # JPEG fallback versions
│   │   ├── thumbnail/
│   │   ├── small/
│   │   ├── medium/
│   │   └── large/
│   └── avif/              # AVIF for modern browsers
│       ├── thumbnail/
│       ├── small/
│       ├── medium/
│       └── large/
```

---

#### 1.3 Update Media Model
**Location**: `server/models/media.js`

**New Fields to Add**:
- `optimizedPaths` (JSON): Store paths to all optimized versions
  ```json
  {
    "webp": {
      "thumbnail": "/uploads/images/webp/thumbnail/image-123.webp",
      "small": "/uploads/images/webp/small/image-123.webp",
      "medium": "/uploads/images/webp/medium/image-123.webp",
      "large": "/uploads/images/webp/large/image-123.webp"
    },
    "jpeg": { ... },
    "avif": { ... }
  }
  ```
- `fileSize`: Original file size
- `optimizedSizes`: Sizes of optimized versions
- `optimizationStatus`: "pending", "processing", "completed", "failed"
- `optimizedAt`: Timestamp of last optimization

---

#### 1.4 Update Upload Middleware
**Location**: `server/middlewares/uploadImage.js`

**Changes**:
1. After upload, trigger image processing
2. Store original in `original/` folder
3. Process image in background (async)
4. Update Media record with optimized paths when done
5. Handle processing errors gracefully

**Processing Flow**:
```
Upload Image → Save Original → Queue Processing → 
Generate Optimized Versions → Update Database → 
Delete Processing Queue Item
```

---

#### 1.5 Create Image Processing Queue (Optional)
**For Large Batches**: Use Bull or similar queue system

**Why?**
- Process images asynchronously
- Don't block API requests
- Handle failures gracefully
- Retry failed processing
- Monitor processing status

**Alternative**: Simple async processing without queue (simpler, but may slow down uploads)

---

### Phase 2: API Endpoints for Optimized Images (Week 2)

#### 2.1 Smart Image Serving Endpoint
**New Route**: `GET /api/v1/media/:id/image`

**Features**:
- Accepts query parameters:
  - `size`: thumbnail, small, medium, large, original
  - `format`: webp, jpeg, avif, auto (auto detects browser support)
- Automatically serves best format based on Accept header
- Returns optimized version if available
- Falls back to original if optimization not done yet

**Example**:
```
GET /api/v1/media/123/image?size=medium&format=auto
→ Returns WebP if browser supports, else JPEG
→ Returns medium size (800x800)
```

---

#### 2.2 Batch Optimization Endpoint
**New Route**: `POST /api/v1/media/optimize`

**Features**:
- Optimize all existing images in database
- Process in batches (e.g., 50 at a time)
- Return progress status
- Can be run as background job

**Use Cases**:
- Initial migration of existing images
- Re-optimization after algorithm improvements
- Manual trigger for specific images

---

#### 2.3 Image Info Endpoint
**New Route**: `GET /api/v1/media/:id/info`

**Returns**:
- Available sizes
- Available formats
- File sizes
- Dimensions
- Optimization status

---

### Phase 3: Frontend Integration (Week 2-3)

#### 3.1 Update Image URL Helper
**Location**: `client/src/config/env.ts` or new utility

**New Function**: `getOptimizedImageUrl(imageId, options)`

**Options**:
- `size`: thumbnail, small, medium, large
- `format`: auto, webp, jpeg
- `fallback`: true/false (use original if optimized not available)

**Example**:
```typescript
getOptimizedImageUrl(123, { 
  size: 'medium', 
  format: 'auto' 
})
// Returns: /api/v1/media/123/image?size=medium&format=auto
```

---

#### 3.2 Update Image Components
**Components to Update**:
- Gallery images
- Hero images
- Business card images
- Newsroom images
- All image displays

**Changes**:
1. Use optimized URLs instead of direct file paths
2. Implement lazy loading
3. Add loading placeholders
4. Use responsive images (srcset)

---

#### 3.3 Implement Lazy Loading
**Strategy**: 
- Use Intersection Observer API
- Load images only when in viewport
- Show placeholder/blur while loading
- Progressive image loading (low quality → high quality)

**Implementation**:
- Create `LazyImage` component
- Replace all `<img>` tags with `<LazyImage>`
- Add blur-up effect for better UX

---

#### 3.4 Responsive Images
**Implementation**:
- Use `srcset` attribute
- Serve different sizes based on screen size
- Use `sizes` attribute for proper selection

**Example**:
```html
<img 
  srcset="
    /api/v1/media/123/image?size=small 400w,
    /api/v1/media/123/image?size=medium 800w,
    /api/v1/media/123/image?size=large 1920w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1920px"
  src="/api/v1/media/123/image?size=medium"
/>
```

---

### Phase 4: Caching Strategy (Week 3)

#### 4.1 Server-Side Caching
**Technology**: Redis or in-memory cache

**Cache Strategy**:
- Cache processed images (avoid re-processing)
- Cache image metadata
- Cache API responses

**Cache Keys**:
- `image:${id}:${size}:${format}`
- TTL: 30 days (images don't change often)

---

#### 4.2 CDN Integration
**Options**:
1. **Cloudflare** (Recommended)
   - Free tier available
   - Automatic image optimization
   - Global CDN
   - Easy setup

2. **AWS CloudFront**
   - Pay per use
   - Integrates with S3
   - Advanced features

3. **Cloudinary/ImageKit**
   - Specialized image CDN
   - Automatic optimization
   - Transformations on-the-fly
   - More expensive but powerful

**Benefits**:
- Images served from edge locations (faster)
- Automatic compression
- Browser caching
- Reduced server load

---

#### 4.3 Browser Caching
**HTTP Headers**:
```
Cache-Control: public, max-age=31536000, immutable
ETag: "image-hash"
Last-Modified: timestamp
```

**Strategy**:
- Cache optimized images for 1 year (immutable)
- Use ETags for validation
- Cache original images for shorter period

---

### Phase 5: Database Optimization (Week 3-4)

#### 5.1 Add Indexes
**Indexes to Add**:
- `media.filePath` (for lookups)
- `media.optimizationStatus` (for batch processing)
- `media.createdAt` (for sorting)

---

#### 5.2 Optimize Queries
**Changes**:
- Only fetch needed fields (not full Media objects)
- Use pagination for image lists
- Cache frequently accessed images
- Batch load images when possible

---

#### 5.3 Migration Script
**Purpose**: 
- Add new fields to existing Media records
- Set default values
- Mark all existing images as "pending" optimization

---

### Phase 6: Performance Monitoring (Week 4)

#### 6.1 Image Loading Metrics
**Track**:
- Average image load time
- Image size distribution
- Cache hit rates
- Optimization success rate
- Error rates

---

#### 6.2 Monitoring Tools
**Options**:
- Google Lighthouse (performance scores)
- WebPageTest (detailed analysis)
- Custom analytics (track image load events)
- Server logs (processing times)

---

## 🔧 Technical Implementation Details

### Image Processing Specifications

#### Size Presets:
| Size | Dimensions | Use Case | Approx. File Size |
|------|-----------|----------|-------------------|
| Thumbnail | 150x150 | Grids, lists | 5-15 KB |
| Small | 400x400 | Cards, previews | 20-50 KB |
| Medium | 800x800 | Detail pages | 50-150 KB |
| Large | 1920x1920 | Hero, full-width | 150-400 KB |
| Original | Full size | Download, print | 5-10 MB |

#### Format Priority:
1. **AVIF** (if browser supports) - Best compression
2. **WebP** (if browser supports) - Good compression
3. **JPEG** (fallback) - Universal support

#### Quality Settings:
- **WebP**: 85% quality
- **JPEG**: 80% quality, progressive
- **AVIF**: 75% quality (very efficient)

---

### Processing Pipeline Flow

```
1. User uploads image (5MB JPEG)
   ↓
2. Save to server/uploads/images/original/
   ↓
3. Create Media record (status: "processing")
   ↓
4. Queue image processing (async)
   ↓
5. Generate optimized versions:
   - WebP: thumbnail, small, medium, large
   - JPEG: thumbnail, small, medium, large
   - AVIF: thumbnail, small, medium, large
   ↓
6. Save optimized files to respective folders
   ↓
7. Update Media record:
   - optimizedPaths: { webp: {...}, jpeg: {...}, avif: {...} }
   - optimizationStatus: "completed"
   ↓
8. Delete processing queue item
```

---

### API Response Format

#### Get Optimized Image:
```
GET /api/v1/media/123/image?size=medium&format=auto

Response:
- Status: 200
- Headers:
  Content-Type: image/webp (or image/jpeg)
  Cache-Control: public, max-age=31536000
  Content-Length: 125000
- Body: Image binary data
```

#### Get Image Info:
```
GET /api/v1/media/123/info

Response:
{
  "id": 123,
  "originalPath": "/uploads/images/original/image.jpg",
  "originalSize": 5242880,
  "optimizationStatus": "completed",
  "optimizedPaths": {
    "webp": {
      "thumbnail": "/uploads/images/webp/thumbnail/image.webp",
      "small": "/uploads/images/webp/small/image.webp",
      "medium": "/uploads/images/webp/medium/image.webp",
      "large": "/uploads/images/webp/large/image.webp"
    },
    "jpeg": { ... },
    "avif": { ... }
  },
  "sizes": {
    "webp": {
      "thumbnail": 12000,
      "small": 35000,
      "medium": 95000,
      "large": 280000
    }
  },
  "dimensions": {
    "original": { "width": 4000, "height": 3000 },
    "large": { "width": 1920, "height": 1440 },
    "medium": { "width": 800, "height": 600 },
    "small": { "width": 400, "height": 300 },
    "thumbnail": { "width": 150, "height": 150 }
  }
}
```

---

## 📊 Expected Performance Improvements

### Before Optimization:
- **Average image size**: 7 MB
- **Page load time**: 15-30 seconds
- **Bandwidth per page**: 50-100 MB
- **User experience**: Poor (long waits)

### After Optimization:
- **Average image size**: 100-300 KB (medium size)
- **Page load time**: 2-5 seconds
- **Bandwidth per page**: 2-5 MB
- **User experience**: Excellent (fast loading)

### Improvement Metrics:
- **File size reduction**: 95-97% (7MB → 100-300KB)
- **Load time improvement**: 80-85% faster
- **Bandwidth savings**: 90-95% reduction
- **Mobile performance**: 10x better

---

## 🚀 Implementation Priority

### Phase 1: Critical (Week 1-2)
1. ✅ Install Sharp
2. ✅ Create image processing service
3. ✅ Update upload middleware
4. ✅ Generate optimized versions on upload
5. ✅ Update Media model

**Impact**: New uploads will be optimized immediately

---

### Phase 2: High Priority (Week 2-3)
1. ✅ Create smart image serving endpoint
2. ✅ Update frontend to use optimized URLs
3. ✅ Implement lazy loading
4. ✅ Add responsive images

**Impact**: All images load faster, better UX

---

### Phase 3: Important (Week 3-4)
1. ✅ Batch optimize existing images
2. ✅ Implement caching (Redis)
3. ✅ Set up CDN
4. ✅ Add monitoring

**Impact**: Complete optimization, production-ready

---

## 💡 Alternative Quick Wins (Can Do Immediately)

### Option 1: On-the-Fly Optimization
**Technology**: Sharp middleware

**How it works**:
- Intercept image requests
- Process image on first request
- Cache processed version
- Serve cached version on subsequent requests

**Pros**:
- No database changes needed
- Works with existing CMS mapping
- Quick to implement

**Cons**:
- First request is slow
- Requires caching layer
- More server CPU usage

---

### Option 2: Proxy Through Image CDN
**Technology**: Cloudinary, ImageKit, or Cloudflare Images

**How it works**:
- Point image URLs to CDN
- CDN optimizes on-the-fly
- Automatic format conversion
- Global CDN delivery

**Pros**:
- Very fast implementation
- No backend changes
- Automatic optimization
- Global CDN included

**Cons**:
- Monthly cost (varies by usage)
- Less control over processing
- Dependency on third-party

---

### Option 3: Hybrid Approach
**Best of both worlds**:
1. Use Sharp for new uploads (backend processing)
2. Use CDN for existing images (on-the-fly)
3. Gradually migrate to backend processing

---

## 📝 Migration Strategy for Existing Images

### Step 1: Preparation
- Backup all images
- Test optimization on sample images
- Verify CMS still works with new paths

### Step 2: Batch Processing
- Create migration script
- Process images in batches (100 at a time)
- Update database records
- Monitor processing time

### Step 3: Verification
- Check all optimized images load correctly
- Verify CMS displays properly
- Test on different devices/browsers

### Step 4: Cleanup (Optional)
- Archive original large files
- Keep originals for 30 days
- Monitor for any issues

---

## 🔒 Considerations

### Storage Space
**Current**: ~4GB (original images)  
**After Optimization**: ~8-10GB (original + optimized versions)

**Solution**:
- Use cloud storage (S3, Google Cloud Storage)
- Implement lifecycle policies (archive old originals)
- Compress originals after optimization

---

### Processing Time
**Per Image**: 2-5 seconds  
**10,000 Images**: ~6-14 hours (with queue)

**Solution**:
- Process in background
- Use queue system
- Process during off-peak hours
- Show progress to admin

---

### Backward Compatibility
**Important**: 
- Keep original file paths working
- Fallback to original if optimized not available
- Gradual migration (don't break existing functionality)

---

## 📈 Success Metrics

### Key Performance Indicators (KPIs):
1. **Page Load Time**: Target < 3 seconds
2. **Image Load Time**: Target < 1 second per image
3. **File Size Reduction**: Target 90%+ reduction
4. **Cache Hit Rate**: Target 80%+
5. **User Satisfaction**: Monitor bounce rate, time on page

### Monitoring:
- Google PageSpeed Insights score
- Lighthouse performance score
- Real user monitoring (RUM)
- Server resource usage

---

## 🎯 Recommended Approach

### Immediate (This Week):
1. **Set up Sharp** and create processing service
2. **Update upload middleware** to process new images
3. **Create image serving endpoint** with size/format options

### Short Term (Next 2 Weeks):
1. **Update frontend** to use optimized URLs
2. **Implement lazy loading**
3. **Add caching layer** (Redis)

### Medium Term (Next Month):
1. **Batch optimize** existing images
2. **Set up CDN** (Cloudflare recommended)
3. **Add monitoring** and analytics

### Long Term (Ongoing):
1. **Monitor performance** metrics
2. **Optimize further** based on data
3. **Consider** moving to cloud storage
4. **Implement** advanced features (blur-up, progressive loading)

---

## 💰 Cost Considerations

### Infrastructure Costs:
- **Sharp processing**: Free (open source)
- **Storage**: +5-6GB (optimized versions)
- **CDN**: 
  - Cloudflare: Free tier available
  - AWS CloudFront: ~$0.085/GB
  - ImageKit: $49/month (starter)

### Development Time:
- **Phase 1**: 1-2 weeks
- **Phase 2**: 1 week
- **Phase 3**: 1 week
- **Total**: 3-4 weeks

---

## ✅ Checklist

### Backend:
- [ ] Install Sharp package
- [ ] Create image processing service
- [ ] Update Media model with optimizedPaths
- [ ] Update upload middleware
- [ ] Create image serving endpoint
- [ ] Create batch optimization endpoint
- [ ] Add caching layer
- [ ] Create migration script for existing images

### Frontend:
- [ ] Create getOptimizedImageUrl utility
- [ ] Update all image components
- [ ] Implement lazy loading
- [ ] Add responsive images (srcset)
- [ ] Add loading placeholders
- [ ] Test on all pages

### Infrastructure:
- [ ] Set up CDN (optional but recommended)
- [ ] Configure caching headers
- [ ] Set up monitoring
- [ ] Create backup strategy

### Testing:
- [ ] Test image upload and processing
- [ ] Test image serving endpoint
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Performance testing
- [ ] Load testing

---

## 📚 Resources

### Libraries:
- **Sharp**: https://sharp.pixelplumbing.com/
- **Bull** (Queue): https://github.com/OptimalBits/bull
- **Cloudflare Images**: https://developers.cloudflare.com/images/

### Documentation:
- WebP: https://developers.google.com/speed/webp
- AVIF: https://avif.io/
- Image Optimization: https://web.dev/fast/#optimize-your-images

---

**Last Updated**: January 2026  
**Next Review**: After Phase 1 completion

