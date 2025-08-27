'use client';

import { RequestTechnicianButton } from './RequestTechnicianButton';
import { ConsultationButton } from './ConsultationButton';
import { type Locale } from '@/lib/i18n';

interface CTAButtonsProps {
  showTechnician?: boolean;
  showConsultation?: boolean;
  technicianProps?: {
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'outline-red' | 'success' | 'green' | 'blue' | 'ghost' | 'link' | 'accent';
    size?: 'sm' | 'lg' | 'xl' | 'default' | 'icon';
    className?: string;
    prefillMessage?: string;
    showIcon?: boolean;
  };
  consultationProps?: {
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'outline-red' | 'success' | 'green' | 'blue' | 'ghost' | 'link' | 'accent';
    size?: 'sm' | 'lg' | 'xl' | 'default' | 'icon';
    className?: string;
    prefillMessage?: string;
    showIcon?: boolean;
  };
  locale: Locale;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  translations?: {
    technician?: {
      prefillMessage?: string;
    };
    consultation?: {
      prefillMessage?: string;
    };
  };
}

export function CTAButtons({
  showTechnician = true,
  showConsultation = true,
  technicianProps = {},
  consultationProps = {},
  locale,
  className = "",
  layout = 'horizontal',
  translations
}: CTAButtonsProps) {
  const containerClasses = layout === 'horizontal' 
    ? `flex flex-col sm:flex-row gap-3 ${className}`
    : `flex flex-col gap-3 ${className}`;

  return (
    <div className={containerClasses}>
      {showTechnician && (
        <RequestTechnicianButton
          locale={locale}
          translations={translations}
          {...technicianProps}
        />
      )}
      {showConsultation && (
        <ConsultationButton
          locale={locale}
          translations={translations}
          {...consultationProps}
        />
      )}
    </div>
  );
}
