'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RequestTechnicianModal } from './RequestTechnicianModal';
import { getButtonText } from '@/lib/button-constants';
import { type Locale } from '@/lib/i18n';

interface ConsultationButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'outline-red' | 'success' | 'green' | 'blue' | 'ghost' | 'link' | 'accent';
  size?: 'sm' | 'lg' | 'xl' | 'default' | 'icon';
  className?: string;
  prefillMessage?: string;
  locale: Locale;
  showIcon?: boolean;
  translations?: {
    consultation?: {
      prefillMessage?: string;
    };
  };
}

export function ConsultationButton({ 
  variant = "outline-red",
  size = "sm", 
  className = "",
  prefillMessage,
  locale,
  showIcon = false,
  translations
}: ConsultationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use prefillMessage from translations if available, otherwise fall back to prop or default
  const defaultPrefillMessage = "";
  const finalPrefillMessage = translations?.consultation?.prefillMessage || prefillMessage || defaultPrefillMessage;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
        showIcon={showIcon}
      >
        {getButtonText('CONSULTATION', locale)}
      </Button>
      
      <RequestTechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        triggerType="consultation"
        prefillMessage={finalPrefillMessage}
      />
    </>
  );
}
