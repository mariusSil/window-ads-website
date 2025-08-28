'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { TechnicianRequestForm, type FormTranslations } from '@/components/common/TechnicianRequestForm'
import { type Locale } from '@/lib/i18n'

interface RequestTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  triggerType: 'technician' | 'consultation' | 'learnMore' | null;
  prefillMessage?: string;
  translations?: FormTranslations;
}


export function RequestTechnicianModal({ 
  isOpen, 
  onClose, 
  locale, 
  triggerType, 
  prefillMessage,
  translations 
}: RequestTechnicianModalProps) {
  const handleSubmitSuccess = () => {
    // Close modal after successful submission
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {translations?.title || 
             (locale === 'lt' ? 'Kviesti meistrą' : 
              locale === 'pl' ? 'Wezwać technika' : 
              locale === 'uk' ? 'Викликати техніка' : 
              'Request Technician')}
          </DialogTitle>
        </DialogHeader>
        
        <TechnicianRequestForm
          locale={locale}
          translations={translations}
          prefillMessage={prefillMessage}
          triggerType={triggerType || 'technician'}
          onSubmitSuccess={handleSubmitSuccess}
          showTitle={false}
        />
      </DialogContent>
    </Dialog>
  )
}
