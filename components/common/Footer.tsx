import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { RequestTechnicianButton } from '@/components/common/RequestTechnicianButton';
import { type Locale } from '@/lib/i18n';

interface FooterLink {
  text: string;
  href: string;
}

interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

interface FooterProps {
  translations: {
    common?: {
      phone: string;
      email: string;
      redesign?: {
        header?: {
          contactIcons?: {
            telegram: string;
            whatsapp: string;
          };
        };
      };
    };
    redesign: {
      footer: {
        logoText: string;
        description: string;
        navigationTitle: string;
        servicesTitle: string;
        contactTitle: string;
        legalTitle: string;
        copyright: string;
        contactInfo: {
          address: string;
          phone: string;
          email: string;
          telegram: string;
          whatsapp: string;
        };
        workingHours: {
          title: string;
          schedule: string;
          emergency: string;
        };
        trustBadges: {
          certified: string;
          sameDay: string;
        };
        legal: {
          privacyPolicy: string;
          termsOfService: string;
          cookiePolicy: string;
        };
        business: {
          title: string;
          companyName: string;
          registrationNumber: string;
          vatNumber: string;
          registeredAddress: string;
        };
        certifications: Array<{
          name: string;
          icon: string;
        }>;
        socialLinks: SocialLink[];
      };
    };
    navigation: {
      items: FooterLink[];
    };
    services: {
      items: FooterLink[]; 
    };
  };
  locale: Locale;
  className?: string;
}

// Map string icon names to Lucide icons
const socialIconMap: { [key: string]: string } = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'Linkedin'
};

export function Footer({ translations, locale, className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { footer } = translations.redesign ? 
    { 
      footer: translations.redesign.footer
    } : {
      footer: {} as any
    };

  if (!translations.redesign) return null;

  return (
    <footer className={`bg-secondary text-white ${className}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Brand & Description */}
          <div className="col-span-1">
            {/* Logo matching header style */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="Wrench" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">{footer.logoText}</h3>
            </div>
            
            {/* Enhanced description */}
            <p className="text-gray-400 text-sm mb-6">{footer.description}</p>
          </div>

          {/* Business Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">{footer.business.title}</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-400">{footer.business.companyName}</p>
              <p>{footer.business.registrationNumber}</p>
              <p>{footer.business.vatNumber}</p>
              <p>{footer.business.registeredAddress}</p>
            </div>
          </div>

          {/* Contact & Working Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">{footer.contactTitle}</h4>
            
            {/* Contact methods - using header phone number */}
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center">
                <Icon name="Phone" className="h-4 w-4 text-primary mr-3" />
                <a href={`tel:${translations.common?.phone?.replace(/\s/g, '') || footer.contactInfo.phone}`} 
                   className="text-gray-400 hover:text-white">
                  {translations.common?.phone || footer.contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Icon name="Mail" className="h-4 w-4 text-primary mr-3" />
                <a href={`mailto:${translations.common?.email || footer.contactInfo.email}`} 
                   className="text-gray-400 hover:text-white">
                  {translations.common?.email || footer.contactInfo.email}
                </a>
              </li>
            </ul>
            
            {/* Quick contact buttons matching header */}
            <div className="flex space-x-2 mb-4">
              <a href={`https://t.me/${translations.common?.redesign?.header?.contactIcons?.telegram || footer.contactInfo.telegram}`} 
                 className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors"
                 title="Contact via Telegram">
                <Icon name="Send" className="w-4 h-4 text-white" />
              </a>
              <a href={`https://wa.me/${translations.common?.redesign?.header?.contactIcons?.whatsapp || footer.contactInfo.whatsapp}`} 
                 className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors"
                 title="Contact via WhatsApp">
                <Icon name="MessageSquare" className="w-4 h-4 text-white" />
              </a>
            </div>
            
            {/* Working hours */}
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-400">{footer.workingHours.title}</p>
              <p>{footer.workingHours.schedule}</p>
              <p className="text-primary">{footer.workingHours.emergency}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Privacy Policy and Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                {footer.copyright?.replace('{year}', currentYear.toString())}
              </p>
            </div>
            
            {/* Privacy Policy Link */}
            <div className="text-center">
              <Link href={`/${locale}/privacy-policy`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                {footer.legal.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
