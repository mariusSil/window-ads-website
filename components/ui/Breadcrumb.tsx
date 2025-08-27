import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: Locale;
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ 
  items, 
  locale, 
  className,
  showHome = true 
}: BreadcrumbProps) {
  // Early validation
  if (!items || items.length === 0) {
    return null;
  }

  // Filter out empty items and validate structure
  const validItems = items.filter(item => 
    item && 
    typeof item.label === 'string' && 
    item.label.trim() !== '' &&
    typeof item.href === 'string'
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      {validItems.map((item, index) => (
        <React.Fragment key={`${item.href}-${index}`}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              className="w-4 h-4 text-neutral-400 flex-shrink-0" 
              aria-hidden="true"
            />
          )}
          {item.current ? (
            <span 
              className="text-neutral-900 font-medium truncate" 
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href} 
              className="text-neutral-600 hover:text-primary transition-colors truncate"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Structured data for SEO (JSON-LD)
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const validItems = items.filter(item => 
    item && 
    typeof item.label === 'string' && 
    item.label.trim() !== '' &&
    typeof item.href === 'string' &&
    item.href !== '#'
  );

  if (validItems.length === 0) {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: validItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export type { BreadcrumbItem, BreadcrumbProps };
