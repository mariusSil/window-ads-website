import { type Locale } from '@/lib/i18n';

interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  score: number;
}

interface UnifiedEmailRequest {
  // Common fields
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  locale: Locale;
  
  // RequestTechnician specific
  city?: string;
  triggerType?: 'technician' | 'consultation' | 'learnMore';
  privacy?: boolean;
  
  // ContactForm specific  
  service?: string;
  
  // System fields
  formType: 'technician' | 'contact';
  timestamp: string;
  userAgent?: string;
  ip?: string;
  
  // Honeypot fields (should always be empty)
  website?: string;
  url?: string;
  company?: string;
}

// Spam keywords in multiple languages
const SPAM_KEYWORDS = [
  // English
  'viagra', 'casino', 'loan', 'crypto', 'bitcoin', 'investment', 'profit', 'money back',
  'click here', 'buy now', 'limited time', 'act now', 'free money', 'earn money',
  'work from home', 'make money', 'get rich', 'guaranteed', 'no risk',
  
  // Common spam patterns
  'seo', 'backlinks', 'ranking', 'traffic', 'followers', 'likes', 'subscribers',
  'pharmacy', 'pills', 'medication', 'weight loss', 'diet pills',
  
  // Lithuanian spam
  'pinigai', 'pelnas', 'investicijos', 'paskola', 'kazino',
  
  // Polish spam  
  'pieniądze', 'zysk', 'inwestycje', 'pożyczka', 'kasyno',
  
  // Ukrainian spam
  'гроші', 'прибуток', 'інвестиції', 'позика', 'казино'
];

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /https?:\/\/[^\s]+/gi, // URLs
  /\b\d{10,}\b/g, // Long numbers (credit cards, etc.)
  /[A-Z]{5,}/g, // Excessive caps
  /(.)\1{4,}/g, // Repeated characters
  /\$\d+/g, // Money amounts
  /%\d+/g, // Percentages
];

// Known bot user agents
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php',
  'automated', 'script', 'tool', 'monitor', 'check', 'test'
];

export function checkForSpam(data: UnifiedEmailRequest): SpamCheckResult {
  let score = 0;
  const reasons: string[] = [];
  
  // Honeypot check - instant spam if any honeypot field is filled
  if (data.website || data.url || data.company) {
    return {
      isSpam: true,
      reason: 'Honeypot field filled',
      score: 100
    };
  }
  
  // Check for suspicious user agent
  if (data.userAgent) {
    const userAgent = data.userAgent.toLowerCase();
    if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
      score += 50;
      reasons.push('Suspicious user agent');
    }
  }
  
  // Time-based validation - form filled too quickly (less than 3 seconds)
  if (data.timestamp) {
    const submissionTime = new Date(data.timestamp).getTime();
    const now = Date.now();
    const timeDiff = now - submissionTime;
    
    if (timeDiff < 3000) { // Less than 3 seconds
      score += 40;
      reasons.push('Form filled too quickly');
    }
  }
  
  // Content analysis
  if (data.message) {
    const message = data.message.toLowerCase();
    
    // Check for spam keywords
    const spamKeywordCount = SPAM_KEYWORDS.filter(keyword => 
      message.includes(keyword.toLowerCase())
    ).length;
    
    if (spamKeywordCount > 0) {
      score += spamKeywordCount * 15;
      reasons.push(`Contains ${spamKeywordCount} spam keywords`);
    }
    
    // Check for suspicious patterns
    SUSPICIOUS_PATTERNS.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches && matches.length > 0) {
        score += matches.length * 10;
        reasons.push('Contains suspicious patterns');
      }
    });
    
    // Message length checks
    if (data.message.length > 2000) {
      score += 25;
      reasons.push('Message too long');
    }
    
    if (data.message.length < 10) {
      score += 15;
      reasons.push('Message too short');
    }
  }
  
  // Name validation
  if (data.name) {
    // Check for numbers in name (suspicious)
    if (/\d{3,}/.test(data.name)) {
      score += 20;
      reasons.push('Name contains numbers');
    }
    
    // Check for excessive length
    if (data.name.length > 100) {
      score += 15;
      reasons.push('Name too long');
    }
    
    // Check for suspicious characters
    if (/[<>{}[\]\\|`~]/.test(data.name)) {
      score += 25;
      reasons.push('Name contains suspicious characters');
    }
  }
  
  // Email validation (if provided)
  if (data.email) {
    // Check for suspicious email patterns
    const email = data.email.toLowerCase();
    
    // Temporary/disposable email domains
    const disposableEmailDomains = [
      '10minutemail', 'tempmail', 'guerrillamail', 'mailinator',
      'throwaway', 'temp-mail', 'fake-mail'
    ];
    
    if (disposableEmailDomains.some(domain => email.includes(domain))) {
      score += 30;
      reasons.push('Disposable email address');
    }
    
    // Multiple dots or suspicious patterns
    if ((email.match(/\./g) || []).length > 3) {
      score += 15;
      reasons.push('Suspicious email format');
    }
  }
  
  // Phone validation (if provided)
  if (data.phone) {
    // Check for valid phone format based on locale
    const phoneValidation = validatePhoneByLocale(data.phone, data.locale);
    if (!phoneValidation.isValid) {
      score += 10;
      reasons.push('Invalid phone format');
    }
  }
  
  // Form type specific checks
  if (data.formType === 'technician') {
    // RequestTechnician should have privacy consent
    if (!data.privacy) {
      score += 20;
      reasons.push('Missing privacy consent');
    }
  }
  
  if (data.formType === 'contact') {
    // ContactForm should have email (required field)
    if (!data.email) {
      score += 30;
      reasons.push('Missing required email');
    }
  }
  
  return {
    isSpam: score >= 50,
    score,
    reason: reasons.length > 0 ? reasons.join(', ') : undefined
  };
}

function validatePhoneByLocale(phone: string, locale: Locale): { isValid: boolean; reason?: string } {
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Expected prefixes by locale
  const expectedPrefixes: Record<Locale, string[]> = {
    en: ['44'], // UK
    lt: ['370'], // Lithuania
    pl: ['48'], // Poland
    uk: ['380'] // Ukraine
  };
  
  const prefixes = expectedPrefixes[locale] || expectedPrefixes.en;
  
  // Check if phone starts with expected country code
  const hasValidPrefix = prefixes.some(prefix => 
    cleanPhone.startsWith(prefix) || cleanPhone.startsWith(`+${prefix}`)
  );
  
  // Basic length validation (should be reasonable length)
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return { isValid: false, reason: 'Invalid phone length' };
  }
  
  // If locale-specific validation fails, it's still not necessarily spam
  // Just mark as potentially suspicious
  return { isValid: hasValidPrefix, reason: hasValidPrefix ? undefined : 'Unexpected country code' };
}

// Duplicate detection - check if same content was submitted recently
const recentSubmissions = new Map<string, number>();

export function checkForDuplicate(data: UnifiedEmailRequest): boolean {
  // Create a hash of the submission content
  const contentHash = createContentHash(data);
  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);
  
  // Clean up old entries
  for (const [hash, timestamp] of recentSubmissions.entries()) {
    if (timestamp < fiveMinutesAgo) {
      recentSubmissions.delete(hash);
    }
  }
  
  // Check if this content was submitted recently
  if (recentSubmissions.has(contentHash)) {
    return true; // Duplicate found
  }
  
  // Store this submission
  recentSubmissions.set(contentHash, now);
  return false;
}

function createContentHash(data: UnifiedEmailRequest): string {
  // Create a simple hash of key content fields
  const content = [
    data.name?.toLowerCase().trim(),
    data.email?.toLowerCase().trim(),
    data.phone?.replace(/\D/g, ''), // Remove formatting
    data.message?.toLowerCase().trim(),
    data.formType
  ].filter(Boolean).join('|');
  
  // Simple hash function (for demonstration - in production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString(36);
}

export { type UnifiedEmailRequest, type SpamCheckResult };
