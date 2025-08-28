import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Bundle related components together to reduce HTTP requests
const SharedComponentsBundle = dynamic(() => 
  Promise.all([
    import('./shared/Testimonials'),
    import('./shared/WhyChooseUs'),
    import('./shared/Partners'),
    import('./shared/Faq')
  ]).then(([Testimonials, WhyChooseUs, Partners, Faq]) => ({
    default: {
      Testimonials: Testimonials.default,
      WhyChooseUs: WhyChooseUs.default,
      Partners: Partners.default,
      Faq: Faq.default
    }
  })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }
);

const ServiceComponentsBundle = dynamic(() => 
  Promise.all([
    import('./shared/AccessoriesGrid'),
    import('./shared/TechnicianTeam'),
    import('./shared/Transformations'),
    import('./shared/PropertyTypes')
  ]).then(([AccessoriesGrid, TechnicianTeam, Transformations, PropertyTypes]) => ({
    default: {
      AccessoriesGrid: AccessoriesGrid.default,
      TechnicianTeam: TechnicianTeam.default,
      Transformations: Transformations.default,
      PropertyTypes: PropertyTypes.default
    }
  })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }
);

export { SharedComponentsBundle, ServiceComponentsBundle };
