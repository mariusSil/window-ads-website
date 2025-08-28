'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { type Locale } from '@/lib/i18n'

interface ChatBubbleProps {
  onClick: () => void
  isOpen: boolean
  locale: Locale
  translations: {
    bubble: {
      tooltip: string
      ariaLabel: string
    }
  }
}

export function ChatBubble({ onClick, isOpen, locale, translations }: ChatBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    // Show widget after 3 second delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    // Start pulse animation after widget is visible
    const pulseTimer = setTimeout(() => {
      setShowPulse(true)
    }, 4000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(pulseTimer)
    }
  }, [])

  useEffect(() => {
    // Pulse every 10 seconds when not open
    if (!isOpen && showPulse) {
      const interval = setInterval(() => {
        setShowPulse(false)
        setTimeout(() => setShowPulse(true), 100)
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [isOpen, showPulse])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 chat-widget-bubble">
      {/* Tooltip */}
      <div 
        id="chat-tooltip"
        className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap"
      >
        {translations.bubble.tooltip}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>

      <Button
        onClick={onClick}
        variant="default"
        size="icon"
        className={`
          group relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
          ${showPulse && !isOpen ? 'animate-pulse-custom' : ''}
          ${isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-primary hover:bg-primary/90'}
          hover:scale-110 active:scale-95
          safe-area-bottom safe-area-right
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
        aria-label={translations.bubble.ariaLabel}
        aria-describedby="chat-tooltip"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
      >
        {isOpen ? (
          <Icon name="X" className="w-6 h-6 text-white" />
        ) : (
          <Icon name="MessageSquare" className="w-6 h-6 text-white" />
        )}
        
        {/* Badge indicator for first-time visitors */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        )}
      </Button>

      <style jsx>{`
        @keyframes pulse-custom {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); 
          }
          70% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); 
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); 
          }
        }
        
        .animate-pulse-custom {
          animation: pulse-custom 2s infinite;
        }
        
        .safe-area-bottom {
          bottom: calc(24px + env(safe-area-inset-bottom));
        }
        
        .safe-area-right {
          right: calc(24px + env(safe-area-inset-right));
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .chat-widget-bubble {
            bottom: calc(20px + env(safe-area-inset-bottom));
            right: calc(20px + env(safe-area-inset-right));
          }
          
          .chat-widget-bubble button {
            width: 3.5rem;
            height: 3.5rem;
            min-height: 44px; /* Minimum touch target */
            min-width: 44px;
          }
          
          .chat-widget-bubble button svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          /* Tooltip adjustments for mobile */
          .chat-widget-bubble #chat-tooltip {
            font-size: 0.75rem;
            padding: 0.5rem;
            max-width: 200px;
            word-wrap: break-word;
          }
        }
        
        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1024px) {
          .chat-widget-bubble button {
            width: 3.75rem;
            height: 3.75rem;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .chat-widget-bubble button {
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
        }
        
        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-custom {
            animation: none;
          }
          
          .chat-widget-bubble button {
            transition: none;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .chat-widget-bubble #chat-tooltip {
            background-color: #1f2937;
            border: 1px solid #374151;
          }
        }
      `}</style>
    </div>
  )
}
