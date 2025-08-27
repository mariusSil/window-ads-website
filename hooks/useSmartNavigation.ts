'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { type Locale } from '@/lib/i18n';
// Remove the problematic import - we'll handle this differently

interface UseSmartNavigationReturn {
  handleNavigation: (key: string, href: string) => void;
}

export function useSmartNavigation(locale: Locale): UseSmartNavigationReturn {
  const pathname = usePathname();
  const router = useRouter();

  // Smooth scroll function with header offset
  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      return false;
    }

    // Calculate header offset (header + navigation)
    const getHeaderOffset = () => {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      const headerHeight = header ? header.offsetHeight : 64;
      const navHeight = nav ? nav.offsetHeight : 48;
      return headerHeight + navHeight; // 20px buffer
    };

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getHeaderOffset();

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    return true;
  }, []);

  // Main navigation handler
  const handleNavigation = useCallback((key: string, href: string) => {
    // Use the provided href directly since it should already be localized
    const targetUrl = href;

    // Check if we're already on the target page
    if (pathname === targetUrl || pathname === `${targetUrl}/`) {
      // If on the same page, scroll to the relevant section
      const targetSection = key === 'services' ? 'services' : 'accessories';
      scrollToSection(targetSection);
    } else {
      // Navigate to the page first, then scroll after a short delay
      router.push(targetUrl);
      
      // Set a timeout to scroll after navigation completes
      setTimeout(() => {
        const targetSection = key === 'services' ? 'services' : 'accessories';
        scrollToSection(targetSection);
      }, 100); // Small delay to ensure page has loaded
    }
  }, [pathname, router, scrollToSection]);

  return {
    handleNavigation
  };
}
