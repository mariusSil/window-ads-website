import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Critical components - loaded immediately
import { Hero } from './shared/Hero'
import { ServiceCards } from './shared/ServiceCards'
import { PageHeader } from './common/PageHeader'
import { Content } from './Content'
import ContactForm from './pages/contact/ContactForm';

const CtaBanner = dynamic(() => import('./CtaBanner'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const Testimonials = dynamic(() => import('./shared/Testimonials'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const WhyChooseUs = dynamic(() => import('./shared/WhyChooseUs'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const Partners = dynamic(() => import('./shared/Partners'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const Faq = dynamic(() => import('./shared/Faq'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const ValueProposition = dynamic(() => import('./shared/ValueProposition').then(mod => ({ default: mod.ValueProposition })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const FreeDiagnostics = dynamic(() => import('./shared/FreeDiagnostics').then(mod => ({ default: mod.FreeDiagnostics })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const AccessoriesGrid = dynamic(() => import('./shared/AccessoriesGrid'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const TechnicianTeam = dynamic(() => import('./shared/TechnicianTeam'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const Transformations = dynamic(() => import('./shared/Transformations'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const PropertyTypes = dynamic(() => import('./shared/PropertyTypes'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const NewsListing = dynamic(() => import('./pages/news/NewsListing'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const PrivacyPolicy = dynamic(() => import('./pages/PrivacyPolicy'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const ServiceHero = dynamic(() => import('./pages/service/ServiceHero'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const ServiceDetails = dynamic(() => import('./pages/service/ServiceDetails'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const ProcessSteps = dynamic(() => import('./pages/ProcessSteps'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const BusinessIntro = dynamic(() => import('./pages/BusinessIntro'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const CommercialServices = dynamic(() => import('./pages/CommercialServices'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const LargeCustomers = dynamic(() => import('./pages/LargeCustomers'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const ContactPageContent = dynamic(() => import('./pages/contact/ContactPageContent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const RelatedArticles = dynamic(() => import('./pages/news/RelatedArticles'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const NewsArticleHero = dynamic(() => import('./pages/news/NewsArticleHero'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const NewsArticleContent = dynamic(() => import('./pages/news/NewsArticleContent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const NewsArticleNavigation = dynamic(() => import('./pages/news/NewsArticleNavigation'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
});

const ServiceArticle = dynamic(() => import('./pages/services/ServiceArticle'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

interface Component {
  type: string;
  props: any;
}

interface ComponentRendererProps {
  components: Component[];
}

function SingleComponentRenderer({ type, props }: { type: string; props: any }) {
  switch (type.toLowerCase()) {
    case 'hero':
      return <Hero {...props} />
    case 'servicecards':
      return <ServiceCards {...props} />
    case 'page-header':
    case 'pageheader':
      return <PageHeader {...props} />
    case 'content':
      return <Content {...props} />
    case 'contact-form':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <ContactForm {...props} />
        </Suspense>
      );
    case 'ctabanner':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
          <CtaBanner {...props} />
        </Suspense>
      );
    case 'testimonials':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <Testimonials {...props} />
        </Suspense>
      );
    case 'whychooseus':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <WhyChooseUs {...props} />
        </Suspense>
      );
    case 'partners':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
          <Partners {...props} />
        </Suspense>
      );
    case 'faq':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <Faq {...props} />
        </Suspense>
      );
    case 'valueproposition':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <ValueProposition {...props} />
        </Suspense>
      );
    case 'processsteps':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <ProcessSteps {...props} />
        </Suspense>
      );
    case 'servicehero':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <ServiceHero {...props} />
        </Suspense>
      );
    case 'servicedetails':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <ServiceDetails {...props} />
        </Suspense>
      );
    case 'freediagnostics':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <FreeDiagnostics {...props} />
        </Suspense>
      );
    case 'accessoriesgrid':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <AccessoriesGrid {...props} />
        </Suspense>
      );
    case 'technicianteam':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <TechnicianTeam {...props} />
        </Suspense>
      );
    case 'transformations':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <Transformations {...props} />
        </Suspense>
      );
    case 'propertytypes':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <PropertyTypes {...props} />
        </Suspense>
      );
    case 'newslisting':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <NewsListing {...props} />
        </Suspense>
      );
    case 'privacypolicy':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <PrivacyPolicy {...props} />
        </Suspense>
      );
    case 'businessintro':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <BusinessIntro {...props} />
        </Suspense>
      );
    case 'commercialservices':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <CommercialServices {...props} />
        </Suspense>
      );
    case 'largecustomers':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <LargeCustomers {...props} />
        </Suspense>
      );
    case 'contactpagecontent':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <ContactPageContent {...props} />
        </Suspense>
      );
    case 'relatedarticles':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <RelatedArticles {...props} />
        </Suspense>
      );
    case 'newsarticlehero':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <NewsArticleHero {...props} />
        </Suspense>
      );
    case 'newsarticlecontent':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <NewsArticleContent {...props} />
        </Suspense>
      );
    case 'newsarticlenavigation':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded-lg" />}>
          <NewsArticleNavigation {...props} />
        </Suspense>
      );
    case 'servicearticle':
      return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
          <ServiceArticle {...props} />
        </Suspense>
      );
    default:
      console.warn(`Unknown component type: ${type}`)
      return null
  }
}

export function ComponentRenderer({ components }: ComponentRendererProps) {
  return (
    <>
      {components.map((component, index) => (
        <SingleComponentRenderer
          key={`${component.type}-${index}`}
          type={component.type}
          props={component.props}
        />
      ))}
    </>
  );
}
