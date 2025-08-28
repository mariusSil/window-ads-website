'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { type Locale } from '@/lib/i18n';

interface UseSmartNavigationReturn {
  handleNavigation: (key: string, href: string) => void;
}

export function useSmartNavigation(locale: Locale): UseSmartNavigationReturn {
  const pathname = usePathname();
  const router = useRouter();

  // Enhanced section detection - checks if element exists and is visible
  const checkSectionExists = useCallback((sectionId: string): boolean => {
    const element = document.getElementById(sectionId);
    return element !== null && element.offsetParent !== null; // Visible check
  }, []);

  // Enhanced scroll function with better error handling and offset calculation
  const scrollToSection = useCallback((elementId: string): boolean => {
    const element = document.getElementById(elementId);
    if (!element || element.offsetParent === null) {
      return false; // Element not found or not visible
    }

    // Calculate precise header offset
    const getHeaderOffset = () => {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      const headerHeight = header?.offsetHeight || 64;
      const navHeight = nav?.offsetHeight || 48;
      return headerHeight + navHeight + 20; // 20px buffer
    };

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, offsetPosition), // Prevent negative scroll
      behavior: 'smooth'
    });

    return true;
  }, []);

  // Main navigation handler with enhanced section detection logic
  const handleNavigation = useCallback((key: string, href: string) => {
    // Map navigation keys to section IDs
    const sectionMap: Record<string, string> = {
      'services': 'services',
      'accessories': 'accessories'
    };

    const targetSection = sectionMap[key];
    
    // If no section mapping exists, just navigate normally
    if (!targetSection) {
      router.push(href);
      return;
    }

    // First check if section exists on current page
    if (checkSectionExists(targetSection)) {
      // Section exists - scroll to it
      const scrollSuccess = scrollToSection(targetSection);
      if (scrollSuccess) {
        // Focus management for accessibility
        const element = document.getElementById(targetSection);
        if (element) {
          // Set tabindex temporarily for focus, then remove
          element.setAttribute('tabindex', '-1');
          element.focus();
          element.addEventListener('blur', () => {
            element.removeAttribute('tabindex');
          }, { once: true });
        }
        return; // Successfully scrolled, no navigation needed
      }
    }

    // Section doesn't exist or scroll failed - navigate to page
    router.push(href);

    // After navigation, attempt to scroll with retry logic
    const attemptScroll = (attempts = 0) => {
      if (attempts >= 10) {
        // Log warning for debugging if all retries failed
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to scroll to section "${targetSection}" after navigation to ${href}`);
        }
        return;
      }

      setTimeout(() => {
        const scrolled = scrollToSection(targetSection);
        if (!scrolled) {
          attemptScroll(attempts + 1);
        } else {
          // Focus management after successful scroll
          const element = document.getElementById(targetSection);
          if (element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
            element.addEventListener('blur', () => {
              element.removeAttribute('tabindex');
            }, { once: true });
          }
        }
      }, 100);
    };

    attemptScroll();
  }, [pathname, router, scrollToSection, checkSectionExists]);

  return {
    handleNavigation
  };
}
