'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RequestTechnicianModal } from './RequestTechnicianModal';
import { getButtonText } from '@/lib/button-constants';
import { type Locale } from '@/lib/i18n';

interface LearnMoreButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'outline-red' | 'success' | 'green' | 'blue' | 'ghost' | 'link' | 'accent';
  size?: 'sm' | 'lg' | 'xl' | 'default' | 'icon';
  className?: string;
  prefillMessage?: string;
  locale: Locale;
  showIcon?: boolean;
  customText?: string; // Allow custom text override
  translations?: {
    buttons?: {
      learnMore?: string;
    };
    learnMore?: {
      prefillMessage?: string;
    };
  };
}

export function LearnMoreButton({ 
  variant = "success", // Green variant like in header
  size = "sm", 
  className = "",
  prefillMessage,
  locale,
  showIcon = false,
  customText,
  translations
}: LearnMoreButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use custom text if provided, otherwise use "Learn More" from translations or fallback
  const buttonText = customText || translations?.buttons?.learnMore || getButtonText('LEARN_MORE', locale);
  
  // Default prefill message for learn more inquiries
  const defaultPrefillMessage = "I would like to learn more about your services and get additional information.";
  const finalPrefillMessage = translations?.learnMore?.prefillMessage || prefillMessage || defaultPrefillMessage;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
        showIcon={showIcon}
      >
        {buttonText}
      </Button>
      
      <RequestTechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        triggerType="learnMore"
        prefillMessage={finalPrefillMessage}
      />
    </>
  );
}
