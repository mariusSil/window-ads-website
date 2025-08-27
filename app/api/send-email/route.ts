import { NextRequest, NextResponse } from 'next/server';
import { globalRateLimiter } from '@/lib/email/rate-limiter';
import { checkForSpam, checkForDuplicate } from '@/lib/email/spam-protection';
import { processFormData } from '@/lib/email/validation';
import { sendBusinessNotification, sendCustomerConfirmation } from '@/lib/email/email-service';

// Helper to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return 'unknown';
}

// Helper to create error response
function createErrorResponse(
  error: string, 
  message: string, 
  status: number = 400, 
  details?: string[]
) {
  return NextResponse.json({
    success: false,
    error,
    message,
    details
  }, { status });
}

// Helper to create success response
function createSuccessResponse(message: string, id?: string) {
  return NextResponse.json({
    success: true,
    message,
    id
  });
}

// Logging function
function logRequest(data: {
  ip: string;
  formType: string;
  locale: string;
  success: boolean;
  error?: string;
  spamScore?: number;
  processingTime: number;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };
  
  // In production, you might want to use a proper logging service
  console.log('Email API Request:', JSON.stringify(logEntry));
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Parse request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      logRequest({
        ip: clientIP,
        formType: 'unknown',
        locale: 'unknown',
        success: false,
        error: 'Invalid JSON',
        processingTime: Date.now() - startTime
      });
      
      return createErrorResponse(
        'INVALID_REQUEST',
        'Invalid JSON in request body',
        400
      );
    }
    
    // Add system fields
    const enrichedData = {
      ...requestData,
      ip: clientIP,
      userAgent,
      timestamp: requestData.timestamp || new Date().toISOString()
    };
    
    // Rate limiting check
    const rateLimitResult = globalRateLimiter.isAllowed(clientIP);
    if (!rateLimitResult.allowed) {
      logRequest({
        ip: clientIP,
        formType: enrichedData.formType || 'unknown',
        locale: enrichedData.locale || 'unknown',
        success: false,
        error: 'Rate limited',
        processingTime: Date.now() - startTime
      });
      
      return NextResponse.json({
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many requests. Please wait before submitting again.',
        retryAfter: rateLimitResult.retryAfter
      }, { 
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
        }
      });
    }
    
    // Input validation and sanitization
    const validation = processFormData(enrichedData);
    if (!validation.success) {
      logRequest({
        ip: clientIP,
        formType: enrichedData.formType || 'unknown',
        locale: enrichedData.locale || 'unknown',
        success: false,
        error: 'Validation failed',
        processingTime: Date.now() - startTime
      });
      
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid input data',
        400,
        validation.errors
      );
    }
    
    const validatedData = validation.data!;
    
    // Spam protection
    const spamCheck = checkForSpam(validatedData);
    if (spamCheck.isSpam) {
      logRequest({
        ip: clientIP,
        formType: validatedData.formType,
        locale: validatedData.locale,
        success: false,
        error: 'Spam detected',
        spamScore: spamCheck.score,
        processingTime: Date.now() - startTime
      });
      
      return createErrorResponse(
        'SPAM_DETECTED',
        'Submission blocked due to suspicious content',
        403
      );
    }
    
    // Duplicate detection
    const isDuplicate = checkForDuplicate(validatedData);
    if (isDuplicate) {
      logRequest({
        ip: clientIP,
        formType: validatedData.formType,
        locale: validatedData.locale,
        success: false,
        error: 'Duplicate submission',
        spamScore: spamCheck.score,
        processingTime: Date.now() - startTime
      });
      
      return createErrorResponse(
        'DUPLICATE_SUBMISSION',
        'This form was already submitted recently. Please wait before submitting again.',
        409
      );
    }
    
    // Send business notification email
    const businessEmailResult = await sendBusinessNotification(validatedData);
    if (!businessEmailResult.success) {
      logRequest({
        ip: clientIP,
        formType: validatedData.formType,
        locale: validatedData.locale,
        success: false,
        error: 'Email delivery failed',
        spamScore: spamCheck.score,
        processingTime: Date.now() - startTime
      });
      
      return createErrorResponse(
        'EMAIL_DELIVERY_FAILED',
        'Failed to send notification. Please try again or contact us directly.',
        500
      );
    }
    
    // Send customer confirmation (optional, only if email provided)
    let customerEmailResult = null;
    if (validatedData.email) {
      customerEmailResult = await sendCustomerConfirmation(validatedData);
      // Don't fail the request if customer confirmation fails
      if (!customerEmailResult?.success) {
        console.warn('Customer confirmation email failed:', customerEmailResult?.error);
      }
    }
    
    // Generate unique request ID for tracking
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log successful request
    logRequest({
      ip: clientIP,
      formType: validatedData.formType,
      locale: validatedData.locale,
      success: true,
      spamScore: spamCheck.score,
      processingTime: Date.now() - startTime
    });
    
    return createSuccessResponse(
      'Email sent successfully',
      requestId
    );
    
  } catch (error) {
    console.error('Unexpected error in email API:', error);
    
    logRequest({
      ip: clientIP,
      formType: 'unknown',
      locale: 'unknown',
      success: false,
      error: 'Internal server error',
      processingTime: Date.now() - startTime
    });
    
    return createErrorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred. Please try again later.',
      500
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Only POST requests are supported',
    405
  );
}

export async function PUT() {
  return createErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Only POST requests are supported',
    405
  );
}

export async function DELETE() {
  return createErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Only POST requests are supported',
    405
  );
}
