interface ContentSection {
  title: string;
  content: Array<{
    subtitle: string;
    text: string;
  }>;
}

interface ContentProps {
  content: string | {
    hero?: {
      title: string;
      subtitle: string;
      lastUpdated?: string;
    };
    sections?: ContentSection[];
  }
}

export function Content({ content }: ContentProps) {
  // Handle simple string content
  if (typeof content === 'string') {
    return (
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Handle complex structured content (like privacy policy)
  if (typeof content === 'object' && content.sections) {
    return (
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Last Updated Info */}
          {content.hero?.lastUpdated && (
            <div className="mb-8 text-sm text-gray-600 border-l-4 border-primary pl-4">
              {content.hero.lastUpdated}
            </div>
          )}
          
          {/* Sections */}
          <div className="space-y-12">
            {content.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {section.title}
                </h2>
                
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">
                        {item.subtitle}
                      </h3>
                      <div className="text-gray-700 leading-relaxed">
                        {item.text.split('\n').map((line, lineIndex) => (
                          <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Fallback for unknown content structure
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600">Content structure not recognized</p>
      </div>
    </section>
  )
}
