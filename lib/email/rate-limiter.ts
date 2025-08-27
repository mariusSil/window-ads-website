interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private readonly WINDOW_MS: number;
  private readonly MAX_REQUESTS: number;
  
  constructor(windowMs: number = 60000, maxRequests: number = 2) {
    this.WINDOW_MS = windowMs;
    this.MAX_REQUESTS = maxRequests;
  }
  
  isAllowed(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.store.get(ip);
    
    // Clean up expired entries periodically
    this.cleanup(now);
    
    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
        lastRequest: now
      });
      return { allowed: true };
    }
    
    if (entry.count >= this.MAX_REQUESTS) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }
    
    // Increment counter
    entry.count++;
    entry.lastRequest = now;
    return { allowed: true };
  }
  
  private cleanup(now: number) {
    // Remove expired entries to prevent memory leaks
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime + this.WINDOW_MS) {
        this.store.delete(ip);
      }
    }
  }
  
  // Get current status for an IP
  getStatus(ip: string): { count: number; remaining: number; resetTime: number } {
    const entry = this.store.get(ip);
    const now = Date.now();
    
    if (!entry || now > entry.resetTime) {
      return {
        count: 0,
        remaining: this.MAX_REQUESTS,
        resetTime: now + this.WINDOW_MS
      };
    }
    
    return {
      count: entry.count,
      remaining: Math.max(0, this.MAX_REQUESTS - entry.count),
      resetTime: entry.resetTime
    };
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '2')
);
