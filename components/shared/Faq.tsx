'use client';

import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { Button } from '../ui/Button';
import { getButtonText } from '@/lib/button-constants';
import { type Locale } from '@/lib/i18n';

type FaqCategory = 'pricing' | 'technical' | 'warranty' | 'process' | 'emergency';
type FaqPriority = 'high' | 'medium' | 'low';

interface FaqItem {
  question: string;
  answer: string;
  category?: FaqCategory;
  icon?: string;
  priority?: FaqPriority;
  showCTA?: boolean;
}

interface FaqProps {
  translations: {
    title: string;
    subtitle?: string;
    searchPlaceholder?: string;
    items?: FaqItem[];
    questions?: FaqItem[];
    loadMoreText?: string;
    cta?: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
  locale: Locale;
  showSearch?: boolean;
  showCategories?: boolean;
  maxInitialItems?: number;
}

const Faq = ({ translations, locale, showSearch = false, showCategories = false, maxInitialItems = 5 }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  // Handle undefined content gracefully - MOVED TO TOP
  if (!translations || !translations.title) {
    console.error('FAQ component received invalid translations:', translations);
    return (
      <section className="bg-white py-12 sm:py-16">
        <div className="container-custom mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">FAQ</h2>
            <p className="mt-4 text-gray-600">FAQ content is loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // Handle flexible content structure - support both 'items' and 'questions'
  const faqItems = translations.items || translations.questions || [];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Category icons mapping
  const categoryIcons: Record<FaqCategory, string> = {
    pricing: 'DollarSign',
    technical: 'Wrench',
    warranty: 'ShieldCheck',
    process: 'Clock',
    emergency: 'Zap'
  };

  // Filter FAQ items based on search and category
  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Always show all items in DOM for SEO, but control visibility with CSS
  const hasMoreItems = filteredItems.length > maxInitialItems;

  // Generate Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredItems.map((item: FaqItem) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="bg-white py-12 sm:py-16">
        <div className="container-custom mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">{translations.title}</h2>
          {translations.subtitle && (
            <p className="mt-4 text-lg text-gray-600">{translations.subtitle}</p>
          )}
        </div>
        
        {/* Search and Category Filters */}
        {(showSearch || showCategories) && (
          <div className="mt-8 mx-auto max-w-4xl">
            {showSearch && (
              <div className="mb-6">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={translations.searchPlaceholder || "Search FAQ..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {showCategories && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Questions
                </button>
                {Object.entries(categoryIcons).map(([category, iconName]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as FaqCategory)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon name={iconName as any} className="h-4 w-4" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12 mx-auto max-w-4xl">
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item: FaqItem, index: number) => {
              const isVisible = showAll || index < maxInitialItems;
              return (
                <div 
                  key={index} 
                  className={`py-6 group transition-all duration-500 ease-in-out ${
                    isVisible 
                      ? 'opacity-100 max-h-none' 
                      : 'opacity-0 max-h-0 overflow-hidden py-0'
                  }`}
                  style={{
                    maxHeight: isVisible ? 'none' : '0px',
                    paddingTop: isVisible ? '1.5rem' : '0px',
                    paddingBottom: isVisible ? '1.5rem' : '0px'
                  }}
                >
                  <dt>
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-start justify-between text-left text-gray-900 hover:text-primary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {item.category && (
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon name={categoryIcons[item.category] as any} className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-base font-semibold leading-7">{item.question}</span>
                          {item.priority === 'high' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="ml-6 flex h-7 items-center flex-shrink-0">
                        <Icon 
                          name={openIndex === index ? 'Minus' : 'Plus'} 
                          className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" 
                        />
                      </span>
                    </button>
                  </dt>
                  {openIndex === index && (
                    <dd className="mt-4 pr-12 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-4">
                        <p className="text-base leading-7 text-gray-600">{item.answer}</p>
                      </div>
                    </dd>
                  )}
                </div>
              );
            })}
          </div>
          
          {hasMoreItems && !showAll && (
            <div className="flex justify-center mt-2">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Icon name="ChevronDown" className="h-4 w-4" />
                {translations.loadMoreText || 'Show More Questions'} ({filteredItems.length - maxInitialItems} more)
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default Faq;
