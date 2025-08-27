import { Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ContactForm from './ContactForm';

interface ContactPageContentProps {
  translations: {
    mapSection: {
      title: string;
      address: string;
      googleMapsUrl: string;
      mapImageAlt: string;
    };
    contactInfo: {
      title: string;
      phone: string;
      email: string;
      telegram: string;
      whatsapp: string;
      businessHours: {
        title: string;
        weekdays: string;
        saturday: string;
        sunday: string;
      };
    };
    businessRequisites: {
      title: string;
      companyName: string;
      registrationNumber: string;
      vatNumber: string;
      address: string;
      bankAccount: string;
    };
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

export default function ContactPageContent({ translations, locale }: ContactPageContentProps) {

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-h2 text-secondary mb-4">{translations.mapSection.title}</h2>
              <div className="space-y-4">
                <p className="text-body text-neutral-600 flex items-start">
                  <Icon name="MapPin" className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  {translations.mapSection.address}
                </p>
                <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <div className="text-center">
                      <Icon name="MapPin" className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">{translations.mapSection.mapImageAlt}</p>
                    </div>
                  </div>
                </div>
                <a 
                  href={translations.mapSection.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    variant="outline-red" 
                    size="default"
                    className="w-full"
                  >
                    <Icon name="MapPin" className="w-4 h-4 mr-2" />
                    {locale === 'en' ? 'Open in Google Maps' : locale === 'lt' ? 'Atidaryti Google žemėlapiuose' : locale === 'pl' ? 'Otwórz w Google Maps' : 'Відкрити в Google Maps'}
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-h2 text-secondary mb-6">{translations.contactInfo.title}</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Icon name="Phone" className="w-5 h-5 text-primary mr-3" />
                  <a href={`tel:${translations.contactInfo.phone}`} className="text-body text-neutral-900 hover:text-primary transition-colors">
                    {translations.contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Icon name="Mail" className="w-5 h-5 text-primary mr-3" />
                  <a href={`mailto:${translations.contactInfo.email}`} className="text-body text-neutral-900 hover:text-primary transition-colors">
                    {translations.contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Icon name="Send" className="w-5 h-5 text-primary mr-3" />
                  <a href={`https://t.me/${translations.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-body text-neutral-900 hover:text-primary transition-colors">
                    {translations.contactInfo.telegram}
                  </a>
                </div>
                <div className="flex items-center">
                  <Icon name="MessageSquare" className="w-5 h-5 text-primary mr-3" />
                  <a href={`https://wa.me/${translations.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-body text-neutral-900 hover:text-primary transition-colors">
                    WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-h3 text-secondary mb-3">{translations.contactInfo.businessHours.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Icon name="Clock" className="w-4 h-4 text-primary mr-2" />
                    <span className="text-neutral-900">{translations.contactInfo.businessHours.weekdays}</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Clock" className="w-4 h-4 text-primary mr-2" />
                    <span className="text-neutral-900">{translations.contactInfo.businessHours.saturday}</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Clock" className="w-4 h-4 text-primary mr-2" />
                    <span className="text-neutral-600">{translations.contactInfo.businessHours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Form */}
            <ContactForm translations={translations} locale={locale} />
            
            {/* Business Requisites */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-h2 text-secondary mb-6">{translations.businessRequisites.title}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-neutral-600">{locale === 'en' ? 'Company:' : locale === 'lt' ? 'Įmonė:' : locale === 'pl' ? 'Firma:' : 'Компанія:'}</span>
                  <span className="text-sm text-neutral-900 text-right">{translations.businessRequisites.companyName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-neutral-600">{locale === 'en' ? 'Registration:' : locale === 'lt' ? 'Kodas:' : locale === 'pl' ? 'Rejestracja:' : 'Реєстрація:'}</span>
                  <span className="text-sm text-neutral-900 text-right">{translations.businessRequisites.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-neutral-600">{locale === 'en' ? 'VAT:' : locale === 'lt' ? 'PVM:' : locale === 'pl' ? 'VAT:' : 'ПДВ:'}</span>
                  <span className="text-sm text-neutral-900 text-right">{translations.businessRequisites.vatNumber}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-neutral-600">{locale === 'en' ? 'Address:' : locale === 'lt' ? 'Adresas:' : locale === 'pl' ? 'Adres:' : 'Адреса:'}</span>
                  <span className="text-sm text-neutral-900 text-right">{translations.businessRequisites.address}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-neutral-600">{locale === 'en' ? 'Bank:' : locale === 'lt' ? 'Bankas:' : locale === 'pl' ? 'Bank:' : 'Банк:'}</span>
                  <span className="text-sm text-neutral-900 text-right font-mono">{translations.businessRequisites.bankAccount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
