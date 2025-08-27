'use client';

import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number;
  offset?: number;
  disabled?: boolean;
  mobileSpeed?: number;
}

export function useParallax({ 
  speed = 0.5, 
  offset = 0, 
  disabled = false,
  mobileSpeed = 0.2 
}: UseParallaxOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState('translateY(0px)');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (disabled || !elementRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const element = elementRef.current;
    let animationId: number;
    const effectiveSpeed = isMobile ? mobileSpeed : speed;

    const updateParallax = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -effectiveSpeed;
      const yPos = Math.round(rate + offset);
      
      setTransform(`translate3d(0, ${yPos}px, 0)`);
    };

    const handleScroll = () => {
      animationId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateParallax(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed, offset, disabled, mobileSpeed, isMobile]);

  return { elementRef, transform };
}
