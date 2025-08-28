'use client'

import { useState, useEffect } from 'react'
import { ChatBubble } from './ChatBubble'
import { ChatModal } from './ChatModal'
import { type Locale } from '@/lib/i18n'

interface ChatWidgetTranslations {
  bubble: {
    tooltip: string
    ariaLabel: string
  }
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

interface ChatWidgetProps {
  locale: Locale
  translations: ChatWidgetTranslations
}

const WIDGET_STORAGE_KEY = 'chatWidget_state'

interface WidgetState {
  hasInteracted: boolean
  lastInteraction: number
  submissionCount: number
  dismissedCount: number
}

export default function ChatWidget({ locale, translations }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetState, setWidgetState] = useState<WidgetState>({
    hasInteracted: false,
    lastInteraction: 0,
    submissionCount: 0,
    dismissedCount: 0
  })

  // Load widget state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(WIDGET_STORAGE_KEY)
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setWidgetState(parsed)
        
        // Hide widget if dismissed too many times (3+)
        if (parsed.dismissedCount >= 3) {
          return
        }
      }
    } catch (error) {
      console.warn('Failed to load widget state:', error)
    }
  }, [])

  // Save widget state to localStorage
  const updateWidgetState = (updates: Partial<WidgetState>) => {
    const newState = { ...widgetState, ...updates }
    setWidgetState(newState)
    
    try {
      localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(newState))
    } catch (error) {
      console.warn('Failed to save widget state:', error)
    }
  }

  const handleBubbleClick = () => {
    setIsOpen(true)
    updateWidgetState({
      hasInteracted: true,
      lastInteraction: Date.now()
    })
  }

  const handleModalClose = () => {
    setIsOpen(false)
    
    // Track dismissal if no form data was submitted
    const hasFormData = (() => {
      try {
        const draft = localStorage.getItem('chatWidget_formDraft')
        if (draft) {
          const parsedDraft = JSON.parse(draft)
          return parsedDraft.name || parsedDraft.email || parsedDraft.phone || parsedDraft.message
        }
      } catch (error) {
        // Ignore localStorage errors
      }
      return false
    })()

    if (!hasFormData) {
      updateWidgetState({
        dismissedCount: widgetState.dismissedCount + 1
      })
    }
  }

  // Don't render if dismissed too many times
  if (widgetState.dismissedCount >= 3) {
    return null
  }

  return (
    <>
      <ChatBubble
        onClick={handleBubbleClick}
        isOpen={isOpen}
        locale={locale}
        translations={{ bubble: translations.bubble }}
      />
      
      <ChatModal
        isOpen={isOpen}
        onClose={handleModalClose}
        locale={locale}
        translations={{
          modal: translations.modal,
          form: translations.form
        }}
      />
    </>
  )
}
