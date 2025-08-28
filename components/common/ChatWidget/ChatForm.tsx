'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import Icon from '@/components/ui/Icon'
import { type Locale } from '@/lib/i18n'

interface ChatFormTranslations {
  nameLabel: string
  emailLabel: string
  phoneLabel: string
  messageLabel: string
  submitButton: string
  successMessage: string
  errorMessage: string
}

interface ChatFormProps {
  locale: Locale
  translations: ChatFormTranslations
  onSubmitSuccess: () => void
  onSubmitError: (error: string) => void
}

const FORM_DRAFT_KEY = 'chatWidget_formDraft'

interface FormDraft {
  name: string
  email: string
  phone: string
  message: string
  timestamp: number
}

export function ChatForm({ locale, translations, onSubmitSuccess, onSubmitError }: ChatFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(FORM_DRAFT_KEY)
      if (savedDraft) {
        const draft: FormDraft = JSON.parse(savedDraft)
        // Only restore if draft is less than 24 hours old
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          setFormData({
            name: draft.name || '',
            email: draft.email || '',
            phone: draft.phone || '',
            message: draft.message || ''
          })
        } else {
          // Clear expired draft
          localStorage.removeItem(FORM_DRAFT_KEY)
        }
      }
    } catch (error) {
      console.warn('Failed to load form draft:', error)
    }
  }, [])

  // Auto-save draft every 2 seconds when form has data
  useEffect(() => {
    const hasData = formData.name || formData.email || formData.phone || formData.message
    if (!hasData) return

    const saveTimer = setTimeout(() => {
      try {
        const draft: FormDraft = {
          ...formData,
          timestamp: Date.now()
        }
        localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft))
      } catch (error) {
        console.warn('Failed to save form draft:', error)
      }
    }, 2000)

    return () => clearTimeout(saveTimer)
  }, [formData])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(FORM_DRAFT_KEY)
    } catch (error) {
      console.warn('Failed to clear form draft:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        formType: 'chat',
        triggerType: 'chat',
        locale,
        timestamp: new Date().toISOString(),
        // Honeypot field (should be empty)
        website: ''
      }
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Clear form and draft on success
        setFormData({ name: '', email: '', phone: '', message: '' })
        clearDraft()
        onSubmitSuccess()
      } else {
        // Handle specific error types
        const errorMessage = result.error === 'RATE_LIMITED' 
          ? (locale === 'lt' ? 'Per daug užklausų. Palaukite minutę.' :
             locale === 'pl' ? 'Zbyt wiele zapytań. Poczekaj minutę.' :
             locale === 'uk' ? 'Забагато запитів. Зачекайте хвилину.' :
             'Too many requests. Please wait a minute.')
          : translations.errorMessage
        
        onSubmitError(errorMessage)
        console.error('Form submission error:', result.message, result.details)
      }
    } catch (error) {
      console.error('Network error:', error)
      onSubmitError(translations.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot fields - hidden from users but visible to bots */}
      <div style={{ display: 'none' }}>
        <Input name="website" placeholder="Website" tabIndex={-1} autoComplete="off" />
        <Input name="url" placeholder="URL" tabIndex={-1} autoComplete="off" />
        <Input name="company" placeholder="Company" tabIndex={-1} autoComplete="off" />
      </div>
      
      <div>
        <Label htmlFor="chat-name">{translations.nameLabel}</Label>
        <Input 
          id="chat-name" 
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder={translations.nameLabel}
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="chat-email">{translations.emailLabel}</Label>
        <Input 
          id="chat-email" 
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder={translations.emailLabel}
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="chat-phone">{translations.phoneLabel}</Label>
        <Input 
          id="chat-phone" 
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder={translations.phoneLabel}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="chat-message">{translations.messageLabel}</Label>
        <Textarea 
          id="chat-message" 
          name="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder={translations.messageLabel}
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
        variant="default"
      >
        {isSubmitting ? (
          <>
            <Icon name="Clock" className="w-4 h-4 mr-2 animate-spin" />
            {locale === 'lt' ? 'Siunčiama...' :
             locale === 'pl' ? 'Wysyłanie...' :
             locale === 'uk' ? 'Надсилання...' :
             'Sending...'}
          </>
        ) : (
          <>
            <Icon name="Send" className="w-4 h-4 mr-2" />
            {translations.submitButton}
          </>
        )}
      </Button>
    </form>
  )
}
