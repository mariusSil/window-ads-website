import nodemailer from 'nodemailer';
import { type Locale } from '@/lib/i18n';
import { type UnifiedEmailData } from './validation';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Create transporter with fallback configuration
function createTransporter() {
  const config = {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined,
    // Fallback to sendmail if SMTP not configured
    sendmail: !process.env.SMTP_HOST,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  };

  return nodemailer.createTransporter(config);
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@langu-remontas.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      // Add headers for better deliverability
      headers: {
        'X-Mailer': 'Langu-Remontas Contact System',
        'X-Priority': '3',
        'Importance': 'Normal'
      }
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error'
    };
  }
}

// Send business notification email
export async function sendBusinessNotification(data: UnifiedEmailData): Promise<EmailResult> {
  const businessEmail = process.env.BUSINESS_EMAIL || 'info@langu-remontas.com';
  const template = generateBusinessEmailTemplate(data);
  
  return sendEmail({
    to: businessEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: data.email || undefined
  });
}

// Send customer confirmation email (optional)
export async function sendCustomerConfirmation(data: UnifiedEmailData): Promise<EmailResult | null> {
  if (!data.email) {
    return null; // No email provided, skip confirmation
  }
  
  const template = generateCustomerConfirmationTemplate(data);
  
  return sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}

// Generate business notification email template
function generateBusinessEmailTemplate(data: UnifiedEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const isRequestTechnician = data.formType === 'technician';
  
  // Subject line with locale prefix
  const subjects = {
    technician: {
      en: `[EN] New Technician Request - ${data.name}`,
      lt: `[LT] Nauja meistro užklausa - ${data.name}`,
      pl: `[PL] Nowe zgłoszenie technika - ${data.name}`,
      uk: `[UK] Новий запит техніка - ${data.name}`
    },
    contact: {
      en: `[EN] New Contact Form - ${data.name}`,
      lt: `[LT] Nauja kontaktų forma - ${data.name}`,
      pl: `[PL] Nowy formularz kontaktowy - ${data.name}`,
      uk: `[UK] Нова контактна форма - ${data.name}`
    }
  };
  
  const subject = subjects[data.formType][data.locale] || subjects[data.formType].en;
  
  // Generate HTML template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-left: 3px solid #DC2626; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .priority { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .urgent { background: #f8d7da; border: 1px solid #f5c6cb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔧 ${isRequestTechnician ? 'Technician Request' : 'Contact Form'}</h1>
          <p>New submission from langu-remontas.com</p>
        </div>
        
        <div class="content">
          ${isRequestTechnician && data.triggerType === 'technician' ? 
            '<div class="priority urgent"><strong>⚡ URGENT REQUEST</strong> - Customer needs immediate technician assistance</div>' : 
            isRequestTechnician && data.triggerType === 'consultation' ?
            '<div class="priority"><strong>💬 CONSULTATION</strong> - Customer interested in consultation</div>' : ''
          }
          
          <div class="field">
            <div class="label">👤 Customer Name:</div>
            <div class="value">${data.name}</div>
          </div>
          
          ${data.phone ? `
          <div class="field">
            <div class="label">📞 Phone:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}
          
          ${data.email ? `
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ` : ''}
          
          ${data.city ? `
          <div class="field">
            <div class="label">📍 City:</div>
            <div class="value">${data.city}</div>
          </div>
          ` : ''}
          
          ${data.service ? `
          <div class="field">
            <div class="label">🔧 Service Requested:</div>
            <div class="value">${getServiceLabel(data.service, data.locale)}</div>
          </div>
          ` : ''}
          
          ${data.message ? `
          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">🌐 Language:</div>
            <div class="value">${data.locale.toUpperCase()}</div>
          </div>
          
          <div class="field">
            <div class="label">⏰ Submitted:</div>
            <div class="value">${new Date(data.timestamp).toLocaleString()}</div>
          </div>
          
          ${isRequestTechnician ? `
          <div class="field">
            <div class="label">✅ Privacy Policy:</div>
            <div class="value">${data.privacy ? 'Accepted' : 'Not accepted'}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This email was automatically generated from the langu-remontas.com website.</p>
          <p>Please respond to the customer within 2 hours for best conversion rates.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Generate plain text version
  const text = `
${isRequestTechnician ? 'TECHNICIAN REQUEST' : 'CONTACT FORM'} - ${data.name}

Customer Details:
- Name: ${data.name}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.email ? `- Email: ${data.email}` : ''}
${data.city ? `- City: ${data.city}` : ''}
${data.service ? `- Service: ${getServiceLabel(data.service, data.locale)}` : ''}

${data.message ? `Message:\n${data.message}` : ''}

Submission Details:
- Language: ${data.locale.toUpperCase()}
- Time: ${new Date(data.timestamp).toLocaleString()}
${isRequestTechnician ? `- Privacy Policy: ${data.privacy ? 'Accepted' : 'Not accepted'}` : ''}

---
This email was automatically generated from langu-remontas.com
Please respond to the customer within 2 hours for best conversion rates.
  `.trim();
  
  return { subject, html, text };
}

// Generate customer confirmation email template
function generateCustomerConfirmationTemplate(data: UnifiedEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const confirmationMessages = {
    technician: {
      en: {
        subject: 'Request Received - Langu Remontas',
        title: 'Thank you for your request!',
        message: 'We have received your technician request and will contact you within 2 hours.',
        next: 'Our expert will call you to discuss your needs and schedule a convenient time.'
      },
      lt: {
        subject: 'Užklausa gauta - Langu Remontas',
        title: 'Ačiū už jūsų užklausą!',
        message: 'Gavome jūsų meistro užklausą ir susisieksime per 2 valandas.',
        next: 'Mūsų ekspertas jums paskambins aptarti poreikius ir susitarti dėl patogaus laiko.'
      },
      pl: {
        subject: 'Zapytanie otrzymane - Langu Remontas',
        title: 'Dziękujemy za zapytanie!',
        message: 'Otrzymaliśmy Twoje zgłoszenie technika i skontaktujemy się w ciągu 2 godzin.',
        next: 'Nasz ekspert zadzwoni, aby omówić Twoje potrzeby i umówić dogodny termin.'
      },
      uk: {
        subject: 'Запит отримано - Langu Remontas',
        title: 'Дякуємо за ваш запит!',
        message: 'Ми отримали ваш запит техніка і зв\'яжемося протягом 2 годин.',
        next: 'Наш експерт зателефонує, щоб обговорити ваші потреби та домовитися про зручний час.'
      }
    },
    contact: {
      en: {
        subject: 'Message Received - Langu Remontas',
        title: 'Thank you for contacting us!',
        message: 'We have received your message and will respond within 24 hours.',
        next: 'Our team will review your inquiry and provide a detailed response.'
      },
      lt: {
        subject: 'Žinutė gauta - Langu Remontas',
        title: 'Ačiū, kad susisiekėte!',
        message: 'Gavome jūsų žinutę ir atsakysime per 24 valandas.',
        next: 'Mūsų komanda peržiūrės jūsų užklausą ir pateiks išsamų atsakymą.'
      },
      pl: {
        subject: 'Wiadomość otrzymana - Langu Remontas',
        title: 'Dziękujemy za kontakt!',
        message: 'Otrzymaliśmy Twoją wiadomość i odpowiemy w ciągu 24 godzin.',
        next: 'Nasz zespół przeanalizuje Twoje zapytanie i udzieli szczegółowej odpowiedzi.'
      },
      uk: {
        subject: 'Повідомлення отримано - Langu Remontas',
        title: 'Дякуємо за звернення!',
        message: 'Ми отримали ваше повідомлення і відповімо протягом 24 годин.',
        next: 'Наша команда розгляне ваш запит і надасть детальну відповідь.'
      }
    }
  };
  
  const messages = confirmationMessages[data.formType][data.locale] || confirmationMessages[data.formType].en;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${messages.subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #DC2626; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .contact-info { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ${messages.title}</h1>
        </div>
        
        <div class="content">
          <p><strong>Hello ${data.name},</strong></p>
          <p>${messages.message}</p>
          <p>${messages.next}</p>
          
          <div class="contact-info">
            <h3>Contact Information:</h3>
            <p>📞 Phone: +370 123 456 789</p>
            <p>📧 Email: info@langu-remontas.com</p>
            <p>🌐 Website: langu-remontas.com</p>
          </div>
          
          <p>Best regards,<br>
          <strong>Langu Remontas Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This is an automated confirmation email.</p>
          <p>If you have urgent questions, please call us directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
${messages.title}

Hello ${data.name},

${messages.message}
${messages.next}

Contact Information:
Phone: +370 123 456 789
Email: info@langu-remontas.com
Website: langu-remontas.com

Best regards,
Langu Remontas Team

---
This is an automated confirmation email.
If you have urgent questions, please call us directly.
  `.trim();
  
  return {
    subject: messages.subject,
    html,
    text
  };
}

// Helper function to get service label by locale
function getServiceLabel(service: string, locale: Locale): string {
  const serviceLabels: Record<string, Record<Locale, string>> = {
    'window-repair': {
      en: 'Window Repair',
      lt: 'Langų remontas',
      pl: 'Naprawa okien',
      uk: 'Ремонт вікон'
    },
    'door-repair': {
      en: 'Door Repair',
      lt: 'Durų remontas',
      pl: 'Naprawa drzwi',
      uk: 'Ремонт дверей'
    },
    'installation': {
      en: 'Installation',
      lt: 'Montavimas',
      pl: 'Instalacja',
      uk: 'Встановлення'
    },
    'consultation': {
      en: 'Consultation',
      lt: 'Konsultacija',
      pl: 'Konsultacja',
      uk: 'Консультація'
    }
  };
  
  return serviceLabels[service]?.[locale] || service;
}
