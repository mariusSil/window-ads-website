import React from 'react';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import ContentLoader from '../common/ContentLoader';

interface TechnicianMember {
  name: string;
  role: string;
  experience: string;
  description: string;
  avatar: string;
}

interface TechnicianTeamProps {
  locale: Locale;
  translations: {
    title: string;
    subtitle: string;
    members: TechnicianMember[];
  };
  className?: string;
}

const TechnicianTeam = ({ locale, translations, className = '' }: TechnicianTeamProps) => {
  if (!translations || !Array.isArray(translations.members) || translations.members.length === 0) {
    return <ContentLoader locale={locale} componentType="team" message="loading" />;
  }

  return (
    <section className={`py-20 bg-neutral-50 ${className}`}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h1 text-neutral-900 mb-4">
            {translations.title}
          </h2>
          <p className="text-body text-neutral-600 max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {translations.members.map((member: TechnicianMember, index: number) => (
            <div key={index} className="flex flex-col items-center text-center rounded-card shadow-card bg-white p-6">
              {/* Profile Photo with Experience Badge */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-200">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-600 font-medium text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                {/* Experience Badge */}
                <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {member.experience}
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-primary">
                  {member.role}
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicianTeam;
