import { loadSharedContent, getLocalizedSharedContent } from '@/content/lib/content-resolver';
import { type Locale } from '@/lib/i18n';

interface PrefillTemplates {
  interestedIn: string;
  inquiryAbout: string;
  requestQuote: string;
}

/**
 * Generates a prefilled message for CTA buttons triggered from list items
 * @param templateKey - The template key to use ('interestedIn', 'inquiryAbout', 'requestQuote')
 * @param itemName - The name of the item to include in the message
 * @param locale - The current locale
 * @returns The formatted prefill message
 */
export async function generatePrefillMessage(
  templateKey: keyof PrefillTemplates,
  itemName: string,
  locale: Locale
): Promise<string> {
  try {
    const commonContent = await loadSharedContent('common');
    if (!commonContent) {
      // Fallback to English template
      return `I'm interested in: ${itemName}`;
    }

    const localizedContent = getLocalizedSharedContent(commonContent, locale);
    const templates = localizedContent?.prefillTemplates as PrefillTemplates;
    
    if (!templates || !templates[templateKey]) {
      // Fallback to English template
      return `I'm interested in: ${itemName}`;
    }

    // Replace {itemName} placeholder with actual item name
    return templates[templateKey].replace('{itemName}', itemName);
  } catch (error) {
    console.error('Error generating prefill message:', error);
    // Fallback to English template
    return `I'm interested in: ${itemName}`;
  }
}

/**
 * Generates a prefilled message synchronously using pre-loaded templates
 * @param templates - Pre-loaded prefill templates
 * @param templateKey - The template key to use
 * @param itemName - The name of the item to include in the message
 * @returns The formatted prefill message
 */
export function generatePrefillMessageSync(
  templates: PrefillTemplates | undefined,
  templateKey: keyof PrefillTemplates,
  itemName: string
): string {
  if (!templates || !templates[templateKey]) {
    // Fallback to English template
    return `I'm interested in: ${itemName}`;
  }

  // Replace {itemName} placeholder with actual item name
  return templates[templateKey].replace('{itemName}', itemName);
}
