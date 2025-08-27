'use client';

import Icon from '@/components/ui/Icon';

interface ValuePoint {
  icon: string;
  title: string;
  description: string;
}

interface ValuePropositionProps {
  content: {
    title: string;
    points: ValuePoint[];
  };
}

const iconMap: { [key: string]: string } = {
  faCertificate: 'Award',
  faClock: 'Clock',
  faShieldAlt: 'Shield',
  faDollarSign: 'DollarSign'
};

export function ValueProposition({ content }: ValuePropositionProps) {
  if (!content || !content.points) {
    return null;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">{content.title}</h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {content.points.map((point) => (
              <div key={point.title} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <Icon 
                      name={iconMap[point.icon] as any} 
                      className="h-8 w-8 text-primary" 
                    />
                  </div>
                  {point.title}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{point.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
