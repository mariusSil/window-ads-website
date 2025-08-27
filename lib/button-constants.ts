import { type Locale } from './i18n';

// Standardized button texts for consistency across the entire project
export const BUTTON_TEXTS = {
  CALL_TECHNICIAN: {
    en: "CALL A TECHNICIAN",
    lt: "KVIESTI MEISTRĄ", 
    pl: "WEZWAĆ TECHNIKA",
    uk: "ВИКЛИКАТИ ТЕХНІКА"
  },
  CONSULTATION: {
    en: "CONSULTATION",
    lt: "KONSULTACIJA",
    pl: "KONSULTACJA", 
    uk: "КОНСУЛЬТАЦІЯ"
  },
  LEARN_MORE: {
    en: "LEARN MORE",
    lt: "SUŽINOTI DAUGIAU",
    pl: "DOWIEDZ SIĘ WIĘCEJ",
    uk: "ДІЗНАТИСЯ БІЛЬШЕ"
  }
} as const;

// Helper function to get button text by locale
export function getButtonText(buttonType: keyof typeof BUTTON_TEXTS, locale: Locale): string {
  return BUTTON_TEXTS[buttonType][locale] || BUTTON_TEXTS[buttonType].en;
}
