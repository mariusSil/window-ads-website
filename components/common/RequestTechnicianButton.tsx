'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RequestTechnicianModal } from './RequestTechnicianModal';
import { getButtonText } from '@/lib/button-constants';
import { type Locale } from '@/lib/i18n';

interface RequestTechnicianButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'outline-red' | 'success' | 'green' | 'blue' | 'ghost' | 'link' | 'accent';
  size?: 'sm' | 'lg' | 'xl' | 'default' | 'icon';
  className?: string;
  prefillMessage?: string;
  locale: Locale;
  showIcon?: boolean;
  translations?: {
    technician?: {
      prefillMessage?: string;
    };
  };
}

export function RequestTechnicianButton({ 
  variant = "default",
  size = "sm", 
  className = "",
  prefillMessage = "",
  locale,
  showIcon = false,
  translations
}: RequestTechnicianButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
        showIcon={showIcon}
      >
        {getButtonText('CALL_TECHNICIAN', locale)}
      </Button>
      
      <RequestTechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        triggerType="technician"
        prefillMessage={translations?.technician?.prefillMessage || prefillMessage}
      />
    </>
  );
}
