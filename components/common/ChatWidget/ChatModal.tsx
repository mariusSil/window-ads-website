'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import ContactForm from '@/components/pages/contact/ContactForm'
import { type Locale } from '@/lib/i18n'

interface ChatModalTranslations {
  modal: {
    title: string
    subtitle: string
  }
  form: {
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    messageLabel: string
    submitButton: string
    successMessage: string
    errorMessage: string
  }
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
  translations: ChatModalTranslations
}

export function ChatModal({ isOpen, onClose, locale, translations }: ChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto"
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
      >
        <DialogHeader className="text-center pb-4">
          <DialogTitle id="chat-modal-title" className="text-xl font-semibold text-secondary">
            {translations.modal.title}
          </DialogTitle>
          <p id="chat-modal-description" className="text-sm text-gray-600 mt-2">
            {translations.modal.subtitle}
          </p>
        </DialogHeader>

        <ContactForm
          locale={locale}
          translations={{
            contactForm: {
              title: translations.modal.title,
              nameLabel: translations.form.nameLabel,
              emailLabel: translations.form.emailLabel,
              phoneLabel: translations.form.phoneLabel,
              serviceLabel: locale === 'en' ? 'Service Type' : locale === 'lt' ? 'Paslaugos tipas' : locale === 'pl' ? 'Typ usługi' : 'Тип послуги',
              messageLabel: translations.form.messageLabel,
              submitButton: translations.form.submitButton,
              successMessage: translations.form.successMessage,
              errorMessage: translations.form.errorMessage
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
