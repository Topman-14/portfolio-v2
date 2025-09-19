interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimit {
  private requests = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  async limit(
    identifier: string,
    limit: number = 10,
    windowMs: number = 60 * 1000 // 1 minute default
  ): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const existing = this.requests.get(identifier);

    if (!existing || now > existing.resetTime) {
      // First request or window has reset
      this.requests.set(identifier, {
        count: 1,
        resetTime,
      });
      
      return {
        success: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    if (existing.count >= limit) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: existing.resetTime,
      };
    }

    // Increment counter
    existing.count += 1;
    this.requests.set(identifier, existing);

    return {
      success: true,
      remaining: limit - existing.count,
      resetTime: existing.resetTime,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Global instance
const rateLimiter = new InMemoryRateLimit();

// Rate limiting configurations for different endpoints
export const rateLimitConfigs = {
  // Auth endpoints - more restrictive
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // API endpoints - moderate
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // General pages - lenient
  general: {
    limit: 200,
    windowMs: 60 * 1000, // 1 minute
  },
};

export async function rateLimit(
  identifier: string,
  config: { limit: number; windowMs: number }
) {
  return rateLimiter.limit(identifier, config.limit, config.windowMs);
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback for development
  return 'localhost';
}

// Helper function to determine rate limit config based on pathname
export function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/admin/auth')) {
    return rateLimitConfigs.auth;
  }
  
  if (pathname.startsWith('/api/')) {
    return rateLimitConfigs.api;
  }
  
  return rateLimitConfigs.general;
}
