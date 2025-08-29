import { NextWebVitalsMetric } from 'next/app';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics (Google Analytics example)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        custom_map: { metric_id: 'dimension1' },
      });
    }

    // Console log for debugging
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      label: metric.label,
    });

    // Send to custom analytics endpoint if needed
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch((err) => {
        console.error('Failed to send web vitals:', err);
      });
    }
  }
}

export function preloadCriticalResources() {
  if (typeof document !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = '';
    document.head.appendChild(fontLink);

    // DNS prefetch for external resources
    const dnsPrefetchLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://storage.googleapis.com',
    ];

    dnsPrefetchLinks.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }
}
