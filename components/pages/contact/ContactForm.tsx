'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import Icon from '@/components/ui/Icon';

interface ContactFormProps {
  translations: {
    contactForm: {
      title: string;
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      serviceLabel: string;
      messageLabel: string;
      submitButton: string;
      successMessage: string;
      errorMessage: string;
    };
  };
  locale: Locale;
}

export default function ContactForm({ translations, locale }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        formType: 'contact',
        locale,
        timestamp: new Date().toISOString(),
        // Add honeypot field (should be empty)
        website: ''
      };
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result.message, result.details);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const serviceOptions = [
    { value: 'window-repair', label: locale === 'en' ? 'Window Repair' : locale === 'lt' ? 'Langų remontas' : locale === 'pl' ? 'Naprawa okien' : 'Ремонт вікон' },
    { value: 'door-repair', label: locale === 'en' ? 'Door Repair' : locale === 'lt' ? 'Durų remontas' : locale === 'pl' ? 'Naprawa drzwi' : 'Ремонт дверей' },
    { value: 'installation', label: locale === 'en' ? 'Installation' : locale === 'lt' ? 'Montavimas' : locale === 'pl' ? 'Instalacja' : 'Встановлення' },
    { value: 'consultation', label: locale === 'en' ? 'Consultation' : locale === 'lt' ? 'Konsultacija' : locale === 'pl' ? 'Konsultacja' : 'Консультація' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-h2 text-secondary mb-6">{translations.contactForm.title}</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="Check" className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-sm text-green-800">{translations.contactForm.successMessage}</p>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="Info" className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-800">{translations.contactForm.errorMessage}</p>
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
          <Label htmlFor="name">{translations.contactForm.nameLabel}</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="email">{translations.contactForm.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="phone">{translations.contactForm.phoneLabel}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="service">{translations.contactForm.serviceLabel}</Label>
          <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)} disabled={isSubmitting}>
            <SelectTrigger>
              <SelectValue placeholder={locale === 'en' ? 'Select a service' : locale === 'lt' ? 'Pasirinkite paslaugą' : locale === 'pl' ? 'Wybierz usługę' : 'Оберіть послугу'} />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="message">{translations.contactForm.messageLabel}</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="default" 
          size="lg" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Icon name="Clock" className="w-4 h-4 mr-2 animate-spin" />
              {locale === 'en' ? 'Sending...' : locale === 'lt' ? 'Siunčiama...' : locale === 'pl' ? 'Wysyłanie...' : 'Надсилання...'}
            </>
          ) : (
            <>
              <Icon name="Send" className="w-4 h-4 mr-2" />
              {translations.contactForm.submitButton}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
