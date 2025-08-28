'use client'

import { useState } from 'react'
import { TechnicianRequestForm, type FormTranslations } from '@/components/common/TechnicianRequestForm'
import Icon from '@/components/ui/Icon'
import { type Locale } from '@/lib/i18n'

interface ChatModalTranslations {
  modal: {
    title: string
    subtitle: string
    minimize: string
    close: string
  }
  form: FormTranslations
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
  translations: ChatModalTranslations
  prefillMessage?: string
}

export function ChatModal({ isOpen, onClose, locale, translations, prefillMessage }: ChatModalProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  if (!isOpen) return null

  const handleSubmitSuccess = () => {
    // Auto-close chat widget after successful submission
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Chat Widget Container */}
      <div 
        className={`fixed z-50 bg-white rounded-lg shadow-2xl border transition-all duration-300 ease-in-out ${
          isMinimized 
            ? 'top-4 right-4 w-80 h-14' 
            : 'top-4 right-4 w-80 max-h-[600px] md:top-4 md:right-4 max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[95vw] max-md:max-w-md'
        }`}
        role="dialog"
        aria-labelledby="chat-widget-title"
        aria-describedby="chat-widget-description"
      >
        {/* Chat Header */}
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex-1">
            <h3 id="chat-widget-title" className="font-semibold text-sm">
              {translations.modal.title}
            </h3>
            {!isMinimized && (
              <p id="chat-widget-description" className="text-xs text-red-100 mt-1">
                {translations.modal.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {/* Minimize Button */}
            <button
              onClick={handleMinimize}
              className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded transition-colors"
              aria-label={translations.modal.minimize}
              title={translations.modal.minimize}
            >
              <Icon name={isMinimized ? "Plus" : "Minus"} className="w-3 h-3" />
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded transition-colors"
              aria-label={translations.modal.close}
              title={translations.modal.close}
            >
              <Icon name="X" className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Chat Content */}
        {!isMinimized && (
          <div className="p-4 max-h-[520px] overflow-y-auto">
            {/* Chat Introduction */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-primary">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="MessageSquare" className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {locale === 'lt' 
                      ? 'Sveiki! Užpildykite formą ir mes susisieksime per 2 valandas.' 
                      : locale === 'pl' 
                      ? 'Witaj! Wypełnij formularz, a skontaktujemy się w ciągu 2 godzin.' 
                      : locale === 'uk' 
                      ? 'Привіт! Заповніть форму і ми зв\'яжемося протягом 2 годин.' 
                      : 'Hi! Fill out the form and we\'ll contact you within 2 hours.'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <TechnicianRequestForm
              locale={locale}
              translations={translations.form}
              prefillMessage={prefillMessage}
              triggerType="chat"
              onSubmitSuccess={handleSubmitSuccess}
              showTitle={false}
              compact={true}
            />
          </div>
        )}
      </div>
    </>
  )
}
