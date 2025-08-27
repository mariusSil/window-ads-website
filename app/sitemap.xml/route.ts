import { locales } from '@/lib/i18n';
import { generateAllLocalizedUrls } from '@/content/lib/content-resolver';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Get all localized URLs from page configurations
  const localizedUrls = await generateAllLocalizedUrls();
  
  // Add homepage URLs
  const homepageUrls = locales.map(locale => ({
    locale,
    slug: '',
    pageId: 'homepage'
  }));
  
  const allUrls = [...homepageUrls, ...localizedUrls];
  
  const urlEntries = allUrls.map(({ locale, slug }) => {
    const url = `${baseUrl}/${locale}${slug ? `/${slug}` : ''}`;
    const alternateLinks = locales
      .map((altLocale) => {
        // Find the corresponding slug for this locale
        const altUrl = allUrls.find(u => u.pageId === allUrls.find(u2 => u2.locale === locale && u2.slug === slug)?.pageId && u.locale === altLocale);
        const altSlug = altUrl?.slug || '';
        return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${altSlug ? `/${altSlug}` : ''}" />`;
      })
      .join('\n');
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
${alternateLinks}
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
