interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-neutral-50 text-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-xl max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
