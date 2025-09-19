import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiters = new Map<string, RateLimiterMemory>();

function getRateLimiter(limit: number, windowMs: number): RateLimiterMemory {
  const key = `${limit}-${windowMs}`;
  
  if (!rateLimiters.has(key)) {
    rateLimiters.set(key, new RateLimiterMemory({
      points: limit,
      duration: Math.floor(windowMs / 1000), // Convert ms to seconds
      blockDuration: Math.floor(windowMs / 1000),
    }));
  }
  
  return rateLimiters.get(key)!;
}

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
): Promise<{
  success: boolean;
  remaining: number;
  resetTime: number;
}> {
  const limiter = getRateLimiter(config.limit, config.windowMs);
  
  try {
    const result = await limiter.consume(identifier);
    
    return {
      success: true,
      remaining: result.remainingPoints || 0,
      resetTime: Date.now() + (result.msBeforeNext || config.windowMs),
    };
  } catch (rejRes) {
    const rateLimitRejection = rejRes as { msBeforeNext?: number; remainingPoints?: number };
    return {
      success: false,
      remaining: 0,
      resetTime: Date.now() + (rateLimitRejection.msBeforeNext || config.windowMs),
    };
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'localhost';
}

export function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/admin/auth')) {
    return rateLimitConfigs.auth;
  }
  
  if (pathname.startsWith('/api/')) {
    return rateLimitConfigs.api;
  }
  
  return rateLimitConfigs.general;
}
