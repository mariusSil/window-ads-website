'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { ChatForm } from './ChatForm'
import { type Locale } from '@/lib/i18n'

interface ChatModalTranslations {
  modal: {
    title: string
    subtitle: string
    closeButton: string
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasFormData, setHasFormData] = useState(false)

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }, [isOpen])

  // Check if form has data before closing
  const handleClose = () => {
    if (hasFormData && submitStatus === 'idle') {
      const confirmMessage = locale === 'lt' ? 'Ar tikrai norite uždaryti? Jūsų žinutė bus prarasta.' :
                            locale === 'pl' ? 'Czy na pewno chcesz zamknąć? Twoja wiadomość zostanie utracona.' :
                            locale === 'uk' ? 'Ви впевнені, що хочете закрити? Ваше повідомлення буде втрачено.' :
                            'Are you sure you want to close? Your message will be lost.'
      
      if (!confirm(confirmMessage)) {
        return
      }
    }
    onClose()
  }

  const handleSubmitSuccess = () => {
    setSubmitStatus('success')
    setHasFormData(false)
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose()
      setSubmitStatus('idle')
    }, 3000)
  }

  const handleSubmitError = (error: string) => {
    setSubmitStatus('error')
    setErrorMessage(error)
  }

  // Track form data changes
  useEffect(() => {
    if (isOpen) {
      const checkFormData = () => {
        try {
          const draft = localStorage.getItem('chatWidget_formDraft')
          if (draft) {
            const parsedDraft = JSON.parse(draft)
            const hasData = parsedDraft.name || parsedDraft.email || parsedDraft.phone || parsedDraft.message
            setHasFormData(hasData)
          }
        } catch (error) {
          // Ignore localStorage errors
        }
      }

      // Check initially and then periodically
      checkFormData()
      const interval = setInterval(checkFormData, 1000)
      
      return () => clearInterval(interval)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto chat-modal-content"
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
      >
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleClose}
            aria-label={translations.modal.closeButton}
          >
            <Icon name="X" className="h-4 w-4" />
          </Button>
          
          <DialogTitle id="chat-modal-title" className="text-xl font-semibold text-gray-900 pr-8">
            {translations.modal.title}
          </DialogTitle>
          
          <p id="chat-modal-description" className="text-sm text-gray-600 mt-2">
            {translations.modal.subtitle}
          </p>
        </DialogHeader>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <Icon name="Check" className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-800">
                {translations.form.successMessage}
              </p>
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
            <div className="flex items-center">
              <Icon name="Info" className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-800">
                {errorMessage || translations.form.errorMessage}
              </p>
            </div>
          </div>
        )}
        
        {/* Form */}
        {submitStatus !== 'success' && (
          <ChatForm
            locale={locale}
            translations={translations.form}
            onSubmitSuccess={handleSubmitSuccess}
            onSubmitError={handleSubmitError}
          />
        )}

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes slide-up {
            from { 
              opacity: 0; 
              transform: translateY(100%) translateX(50%) scale(0.8); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) translateX(0) scale(1); 
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          
          /* Mobile optimizations */
          @media (max-width: 640px) {
            .chat-modal-content {
              margin: 0;
              width: 100vw;
              height: 100vh;
              max-width: none;
              max-height: none;
              border-radius: 0;
              animation: slide-up 0.3s ease-out;
              padding: calc(20px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom)) 20px;
            }
            
            /* Ensure form inputs are properly sized for mobile */
            .chat-modal-content input,
            .chat-modal-content textarea {
              font-size: 16px; /* Prevent zoom on iOS */
              min-height: 44px; /* Minimum touch target */
            }
            
            .chat-modal-content button {
              min-height: 44px; /* Minimum touch target */
              font-size: 16px;
            }
          }
          
          /* Tablet optimizations */
          @media (min-width: 641px) and (max-width: 1024px) {
            .chat-modal-content {
              max-width: 500px;
              margin: 2rem auto;
            }
          }
          
          /* Desktop slide-up animation from bottom-right */
          @media (min-width: 1025px) {
            .chat-modal-content {
              animation: slide-up 0.3s ease-out;
              transform-origin: bottom right;
            }
          }
          
          /* Prevent background scroll on mobile */
          @media (max-width: 640px) {
            body:has(.chat-modal-content) {
              overflow: hidden;
              position: fixed;
              width: 100%;
            }
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .chat-modal-content {
              border: 2px solid;
            }
            
            .chat-modal-content input,
            .chat-modal-content textarea {
              border: 2px solid;
            }
          }
          
          /* Reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
            .chat-modal-content {
              animation: none;
            }
            
            .animate-fade-in,
            .animate-shake {
              animation: none;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .chat-modal-content {
              background-color: #1f2937;
              color: #f9fafb;
              border: 1px solid #374151;
            }
          }
          
          /* Landscape mobile optimization */
          @media (max-width: 640px) and (orientation: landscape) {
            .chat-modal-content {
              height: 100vh;
              overflow-y: auto;
              padding: 10px 20px;
            }
          }
          
          /* Focus management for accessibility */
          .chat-modal-content:focus-within {
            outline: 2px solid #DC2626;
            outline-offset: 2px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
