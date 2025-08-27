import { NextRequest, NextResponse } from 'next/server';
import { type Locale, isValidLocale } from '@/lib/i18n';
import { 
  parseCollectionURL, 
  getLocalizedCollectionURL, 
  getLocalizedStaticPageURL 
} from '@/content/lib/content-resolver';

export async function POST(request: NextRequest) {
  try {
    const { currentURL, targetLocale } = await request.json();
    
    if (!currentURL || !targetLocale || !isValidLocale(targetLocale)) {
      return NextResponse.json(
        { error: 'Invalid parameters' }, 
        { status: 400 }
      );
    }

    // First, try to parse as collection URL
    const collectionMatch = await parseCollectionURL(currentURL);
    
    if (collectionMatch) {
      // It's a collection item - get localized URL
      const translatedURL = await getLocalizedCollectionURL(
        collectionMatch.collection,
        collectionMatch.itemId,
        targetLocale
      );
      
      if (translatedURL) {
        return NextResponse.json({ translatedURL });
      }
    }

    // Not a collection item - try static page translation
    const staticURL = await getLocalizedStaticPageURL(currentURL, targetLocale);
    
    if (staticURL) {
      return NextResponse.json({ translatedURL: staticURL });
    }

    // Fallback: simple locale replacement
    // Fixed regex to handle both /en and /en/ formats
    const pathWithoutLocale = currentURL.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/^\/+/, '');
    const fallbackURL = `/${targetLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    
    return NextResponse.json({ translatedURL: fallbackURL });
    
  } catch (error) {
    console.error('Error translating URL:', error);
    return NextResponse.json(
      { error: 'Translation failed' }, 
      { status: 500 }
    );
  }
}
