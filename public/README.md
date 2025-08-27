# Public Assets Structure

This folder contains static assets optimized for SEO and performance.

## Structure

```
public/
├── favicon.ico              # Legacy favicon (32x32)
├── icon.svg                # Modern SVG favicon
├── apple-touch-icon.png    # Apple devices (180x180)
├── icon-192.png           # PWA icon (192x192)
├── icon-512.png           # PWA icon (512x512)
├── icon-mask.png          # Maskable PWA icon (512x512)
├── manifest.webmanifest   # PWA manifest
├── images/                # Optimized images
│   ├── hero/             # Hero section images
│   ├── gallery/          # Gallery images
│   └── thumbnails/       # Thumbnail images
├── icons/                # UI icons and graphics
└── documents/            # PDFs, downloads
```

## Guidelines

- Use descriptive filenames with keywords for SEO
- Optimize images before adding (WebP/AVIF preferred)
- Keep file sizes minimal for performance
- Use Next.js Image component for all images
