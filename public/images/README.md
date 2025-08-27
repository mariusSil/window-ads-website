# Image Optimization Guidelines

## Folder Structure
- `hero/` - Above-the-fold hero images (use HeroImage component)
- `gallery/` - Gallery and content images (use GalleryImage component)  
- `thumbnails/` - Small preview images (use ThumbnailImage component)

## Image Specifications

### Hero Images
- **Dimensions**: 1920x1080 (16:9 ratio) maximum
- **Format**: WebP preferred, JPEG fallback
- **File size**: < 500KB optimized
- **Usage**: Above-the-fold content, priority loading

### Gallery Images  
- **Dimensions**: 800x600 maximum
- **Format**: WebP preferred, JPEG for photos, PNG for graphics
- **File size**: < 200KB optimized
- **Usage**: Content galleries, feature images

### Thumbnails
- **Dimensions**: 300x200 maximum  
- **Format**: WebP preferred
- **File size**: < 50KB optimized
- **Usage**: Preview images, cards, listings

## Naming Convention
Use descriptive, SEO-friendly filenames:
- `hero-modern-office-space.webp`
- `gallery-team-collaboration.webp`
- `thumbnail-service-consulting.webp`

## Optimization Checklist
- [ ] Compress images before upload
- [ ] Use appropriate format (WebP/AVIF > JPEG > PNG)
- [ ] Include descriptive alt text
- [ ] Use Next.js Image component variants
- [ ] Test on different screen sizes
