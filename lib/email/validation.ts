import { z } from 'zod';
import { type Locale } from '@/lib/i18n';

// Base validation schemas
const localeSchema = z.enum(['en', 'lt', 'pl', 'uk']);

const phoneSchema = z.string()
  .min(8, 'Phone number too short')
  .max(20, 'Phone number too long')
  .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid phone format');

const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long');

const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-ZÀ-ÿĀ-žА-я\s\-\'\.]+$/, 'Name contains invalid characters');

const messageSchema = z.string()
  .max(2000, 'Message too long');

const citySchema = z.string()
  .max(100, 'City name too long')
  .regex(/^[a-zA-ZÀ-ÿĀ-žА-я\s\-\'\.]*$/, 'City contains invalid characters');

// RequestTechnician form validation
export const requestTechnicianSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  city: citySchema.optional(),
  email: emailSchema.optional(),
  message: messageSchema.optional(),
  privacy: z.boolean().refine(val => val === true, 'Privacy policy must be accepted'),
  triggerType: z.enum(['technician', 'consultation', 'learnMore']).optional(),
  locale: localeSchema,
  formType: z.literal('technician'),
  timestamp: z.string().datetime(),
  
  // Honeypot fields (should be empty)
  website: z.string().max(0, 'Invalid field').optional(),
  url: z.string().max(0, 'Invalid field').optional(),
  company: z.string().max(0, 'Invalid field').optional(),
});

// ContactForm validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  service: z.enum(['window-repair', 'door-repair', 'installation', 'consultation']).optional(),
  message: messageSchema.min(1, 'Message is required'),
  locale: localeSchema,
  formType: z.literal('contact'),
  timestamp: z.string().datetime(),
  
  // Honeypot fields (should be empty)
  website: z.string().max(0, 'Invalid field').optional(),
  url: z.string().max(0, 'Invalid field').optional(),
  company: z.string().max(0, 'Invalid field').optional(),
});

// Unified schema that accepts both form types
export const unifiedEmailSchema = z.discriminatedUnion('formType', [
  requestTechnicianSchema,
  contactFormSchema
]);

// Type inference
export type RequestTechnicianData = z.infer<typeof requestTechnicianSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type UnifiedEmailData = z.infer<typeof unifiedEmailSchema>;

// Validation function with detailed error messages
export function validateEmailRequest(data: unknown): {
  success: boolean;
  data?: UnifiedEmailData;
  errors?: string[];
} {
  try {
    const validatedData = unifiedEmailSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Invalid data format'] };
  }
}

// Phone validation by locale
export function validatePhoneByLocale(phone: string, locale: Locale): {
  isValid: boolean;
  formattedPhone?: string;
  error?: string;
} {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Expected patterns by locale
  const patterns: Record<Locale, { regex: RegExp; example: string }> = {
    en: { 
      regex: /^(\+44|44|0)[1-9]\d{8,9}$/, 
      example: '+44 20 1234 5678' 
    },
    lt: { 
      regex: /^(\+370|370|8)[1-9]\d{7}$/, 
      example: '+370 612 34567' 
    },
    pl: { 
      regex: /^(\+48|48)[1-9]\d{8}$/, 
      example: '+48 123 456 789' 
    },
    uk: { 
      regex: /^(\+380|380)[1-9]\d{8}$/, 
      example: '+380 12 345 6789' 
    }
  };
  
  const pattern = patterns[locale];
  
  if (!pattern.regex.test(cleanPhone)) {
    return {
      isValid: false,
      error: `Invalid phone format for ${locale.toUpperCase()}. Expected format: ${pattern.example}`
    };
  }
  
  // Format the phone number
  let formattedPhone = cleanPhone;
  if (!formattedPhone.startsWith('+')) {
    // Add country code if missing
    const countryCodes: Record<Locale, string> = {
      en: '+44',
      lt: '+370',
      pl: '+48',
      uk: '+380'
    };
    
    if (formattedPhone.startsWith('0') && locale === 'en') {
      formattedPhone = '+44' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('8') && locale === 'lt') {
      formattedPhone = '+370' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith(countryCodes[locale].substring(1))) {
      formattedPhone = countryCodes[locale] + formattedPhone;
    }
  }
  
  return {
    isValid: true,
    formattedPhone
  };
}

// Sanitize input data
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 2000); // Limit length
}

// Validate and sanitize form data
export function processFormData(rawData: any): {
  success: boolean;
  data?: UnifiedEmailData;
  errors?: string[];
} {
  // Sanitize string fields
  const sanitizedData = {
    ...rawData,
    name: typeof rawData.name === 'string' ? sanitizeInput(rawData.name) : rawData.name,
    email: typeof rawData.email === 'string' ? sanitizeInput(rawData.email) : rawData.email,
    phone: typeof rawData.phone === 'string' ? sanitizeInput(rawData.phone) : rawData.phone,
    city: typeof rawData.city === 'string' ? sanitizeInput(rawData.city) : rawData.city,
    message: typeof rawData.message === 'string' ? sanitizeInput(rawData.message) : rawData.message,
  };
  
  // Validate with schema
  const validation = validateEmailRequest(sanitizedData);
  
  if (!validation.success) {
    return validation;
  }
  
  // Additional phone validation if provided
  if (validation.data?.phone) {
    const phoneValidation = validatePhoneByLocale(validation.data.phone, validation.data.locale);
    if (!phoneValidation.isValid) {
      return {
        success: false,
        errors: [`Phone: ${phoneValidation.error}`]
      };
    }
    
    // Update with formatted phone
    validation.data.phone = phoneValidation.formattedPhone;
  }
  
  return validation;
}
