'use client'

interface ContactFormProps {
  email: string
  phone?: string
  fields: string[]
  title?: string
  subtitle?: string
  showTrustIndicators?: boolean
  responseTime?: string
  className?: string
}

export function ContactForm({ 
  email, 
  phone,
  fields,
  title = "Get Your Free Estimate",
  subtitle = "Fill out the form below and we'll get back to you within 24 hours.",
  showTrustIndicators = true,
  responseTime = "24 hours",
  className = ""
}: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log('Form submitted:', data)

    // In a real app, you might send this to an API endpoint
    alert('Form submitted! Check console for data.')
  }

  return (
    <section className={`section bg-neutral-50 ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {fields.includes('name') && (
                  <div>
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                {fields.includes('email') && (
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>
                )}

                {fields.includes('phone') && (
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}

                {fields.includes('service') && (
                  <div>
                    <label htmlFor="service" className="form-label">
                      Service Needed
                    </label>
                    <select id="service" name="service" className="form-input">
                      <option value="">Select a service</option>
                      <option value="installation">Window Installation</option>
                      <option value="repair">Window Repair</option>
                      <option value="replacement">Window Replacement</option>
                      <option value="maintenance">Window Maintenance</option>
                      <option value="consultation">Free Consultation</option>
                    </select>
                  </div>
                )}

                {fields.includes('message') && (
                  <div>
                    <label htmlFor="message" className="form-label">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="form-input"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                )}

                <div>
                  <button type="submit" className="btn-primary w-full">
                    Get Free Estimate
                  </button>
                </div>

                <p className="text-sm text-neutral-600 text-center">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </div>

            {/* Contact Information & Trust Indicators */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div className="card">
                <h3 className="text-h3 text-navy-800 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  {phone && (
                    <div className="trust-indicator">
                      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <p className="font-medium text-navy-800">Call Us</p>
                        <a href={`tel:${phone}`} className="text-primary-600 hover:text-primary-700">
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="trust-indicator">
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p className="font-medium text-navy-800">Email Us</p>
                      <a href={`mailto:${email}`} className="text-primary-600 hover:text-primary-700">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="trust-indicator">
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-navy-800">Response Time</p>
                      <p className="text-neutral-600">Within {responseTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              {showTrustIndicators && (
                <div className="card">
                  <h3 className="text-h3 text-navy-800 mb-4">Why Choose Us?</h3>
                  <div className="space-y-3">
                    <div className="trust-indicator">
                      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700">Licensed & Insured</span>
                    </div>
                    <div className="trust-indicator">
                      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700">10+ Years Experience</span>
                    </div>
                    <div className="trust-indicator">
                      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-neutral-700">5-Year Warranty</span>
                    </div>
                    <div className="trust-indicator">
                      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700">Free Estimates</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
