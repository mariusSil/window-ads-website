'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Label } from '@/components/ui/Label'
import Icon from '@/components/ui/Icon'
import { type Locale } from '@/lib/i18n'

interface FormTranslations {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  privacyPolicyText: string;
  privacyPolicyLink: string;
  submitButton: string;
}

interface RequestTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  triggerType: 'technician' | 'consultation' | 'learnMore' | null;
  prefillMessage?: string;
  translations?: FormTranslations;
}

// Helper function to get privacy policy URL by locale
const getPrivacyPolicyUrl = (locale: Locale): string => {
  const urls: Record<Locale, string> = {
    en: 'privacy-policy',
    lt: 'privatumo-politika', 
    pl: 'polityka-prywatnosci',
    uk: 'polityka-konfidentsiynosti'
  }
  return urls[locale] || urls.en
}

export function RequestTechnicianModal({ 
  isOpen, 
  onClose, 
  locale, 
  triggerType, 
  prefillMessage,
  translations 
}: RequestTechnicianModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle')

  // Fallback translations if not provided
  const defaultTranslations: FormTranslations = {
    title: locale === 'lt' ? 'Kviesti meistrą' : locale === 'pl' ? 'Wezwać technika' : locale === 'uk' ? 'Викликати техніка' : 'Request Technician',
    nameLabel: locale === 'lt' ? 'Vardas' : locale === 'pl' ? 'Imię' : locale === 'uk' ? 'Ім\'я' : 'Name',
    namePlaceholder: locale === 'lt' ? 'Jūsų vardas' : locale === 'pl' ? 'Twoje imię' : locale === 'uk' ? 'Ваше ім\'я' : 'Your name',
    phoneLabel: locale === 'lt' ? 'Telefonas' : locale === 'pl' ? 'Telefon' : locale === 'uk' ? 'Телефон' : 'Phone',
    phonePlaceholder: locale === 'lt' ? 'Jūsų telefonas' : locale === 'pl' ? 'Twój telefon' : locale === 'uk' ? 'Ваш телефон' : 'Your phone',
    cityLabel: locale === 'lt' ? 'Miestas' : locale === 'pl' ? 'Miasto' : locale === 'uk' ? 'Місто' : 'City',
    cityPlaceholder: locale === 'lt' ? 'Jūsų miestas' : locale === 'pl' ? 'Twoje miasto' : locale === 'uk' ? 'Ваше місто' : 'Your city',
    emailLabel: locale === 'lt' ? 'El. paštas' : locale === 'pl' ? 'E-mail' : locale === 'uk' ? 'Електронна пошта' : 'Email',
    emailPlaceholder: locale === 'lt' ? 'Jūsų el. paštas' : locale === 'pl' ? 'Twój e-mail' : locale === 'uk' ? 'Ваша електронна пошта' : 'Your email',
    messageLabel: locale === 'lt' ? 'Žinutė' : locale === 'pl' ? 'Wiadomość' : locale === 'uk' ? 'Повідомлення' : 'Message',
    messagePlaceholder: locale === 'lt' ? 'Aprašykite savo poreikius...' : locale === 'pl' ? 'Opisz swoje potrzeby...' : locale === 'uk' ? 'Опишіть ваші потреби...' : 'Describe your needs...',
    privacyPolicyText: locale === 'lt' ? 'Sutinku su privatumo politika' : locale === 'pl' ? 'Zgadzam się z polityką prywatności' : locale === 'uk' ? 'Погоджуюся з політикою конфіденційності' : 'I agree to the privacy policy',
    privacyPolicyLink: locale === 'lt' ? 'privatumo politika' : locale === 'pl' ? 'polityka prywatności' : locale === 'uk' ? 'політика конфіденційності' : 'privacy policy',
    submitButton: locale === 'lt' ? 'Siųsti užklausą' : locale === 'pl' ? 'Wyślij zapytanie' : locale === 'uk' ? 'Надіслати запит' : 'Send Request'
  };

  const finalTranslations = translations || defaultTranslations;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData.entries())
      
      // Add required fields for API
      const submissionData = {
        ...data,
        formType: 'technician',
        triggerType,
        locale,
        timestamp: new Date().toISOString(),
        // Add honeypot field (should be empty)
        website: ''
      }
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        // Reset form after short delay to show success message
        setTimeout(() => {
          onClose()
          ;(e.target as HTMLFormElement).reset()
          setSubmitStatus('idle')
        }, 2000)
      } else {
        // Handle specific error types
        if (result.error === 'RATE_LIMITED') {
          setSubmitStatus('rate-limited')
        } else {
          setSubmitStatus('error')
          console.error('Form submission error:', result.message, result.details)
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{finalTranslations.title}</DialogTitle>
        </DialogHeader>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="Check" className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800">
                {locale === 'lt' ? 'Užklausa sėkmingai išsiųsta! Susisieksime per 2 valandas.' :
                 locale === 'pl' ? 'Zapytanie wysłane pomyślnie! Skontaktujemy się w ciągu 2 godzin.' :
                 locale === 'uk' ? 'Запит успішно надіслано! Зв\'яжемося протягом 2 годин.' :
                 'Request sent successfully! We will contact you within 2 hours.'}
              </p>
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="Info" className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">
                {locale === 'lt' ? 'Klaida siunčiant užklausą. Bandykite dar kartą arba susisiekite tiesiogiai.' :
                 locale === 'pl' ? 'Błąd podczas wysyłania zapytania. Spróbuj ponownie lub skontaktuj się bezpośrednio.' :
                 locale === 'uk' ? 'Помилка надсилання запиту. Спробуйте ще раз або зв\'яжіться безпосередньо.' :
                 'Error sending request. Please try again or contact us directly.'}
              </p>
            </div>
          </div>
        )}
        
        {submitStatus === 'rate-limited' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="Clock" className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                {locale === 'lt' ? 'Per daug užklausų. Palaukite minutę ir bandykite dar kartą.' :
                 locale === 'pl' ? 'Zbyt wiele zapytań. Poczekaj minutę i spróbuj ponownie.' :
                 locale === 'uk' ? 'Забагато запитів. Зачекайте хвилину і спробуйте ще раз.' :
                 'Too many requests. Please wait a minute and try again.'}
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot fields - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <Input name="website" placeholder="Website" tabIndex={-1} autoComplete="off" />
            <Input name="url" placeholder="URL" tabIndex={-1} autoComplete="off" />
            <Input name="company" placeholder="Company" tabIndex={-1} autoComplete="off" />
          </div>
          
          <div>
            <Label htmlFor="name">{finalTranslations.nameLabel}</Label>
            <Input id="name" name="name" placeholder={finalTranslations.namePlaceholder} required />
          </div>
          
          <div>
            <Label htmlFor="phone">{finalTranslations.phoneLabel}</Label>
            <Input id="phone" name="phone" type="tel" placeholder={finalTranslations.phonePlaceholder} required />
          </div>
          
          <div>
            <Label htmlFor="city">{finalTranslations.cityLabel}</Label>
            <Input id="city" name="city" placeholder={finalTranslations.cityPlaceholder} />
          </div>
          
          <div>
            <Label htmlFor="email">{finalTranslations.emailLabel}</Label>
            <Input id="email" name="email" type="email" placeholder={finalTranslations.emailPlaceholder} />
          </div>
          
          <div>
            <Label htmlFor="message">{finalTranslations.messageLabel}</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder={finalTranslations.messagePlaceholder}
              defaultValue={prefillMessage || ''}
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="privacy" name="privacy" required />
            <Label htmlFor="privacy" className="text-sm">
              {finalTranslations.privacyPolicyText}{' '}
              <Link 
                href={`/${locale}/${getPrivacyPolicyUrl(locale)}`}
                className="text-primary hover:underline"
                target="_blank"
              >
                {finalTranslations.privacyPolicyLink}
              </Link>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : finalTranslations.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
