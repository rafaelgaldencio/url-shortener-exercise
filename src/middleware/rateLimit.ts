import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import config from '@/lib/config';

// Simple in-memory store for rate limiting
// In production, you would use Redis or another distributed store
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimitMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    const now = Date.now();
    
    if (!rateLimitStore[ip] || rateLimitStore[ip].resetTime < now) {
      rateLimitStore[ip] = {
        count: 0,
        resetTime: now + config.rateLimitWindowMs,
      };
    }
    
    rateLimitStore[ip].count++;
    
    if (rateLimitStore[ip].count > config.rateLimitMax) {
      const timeUntilReset = Math.ceil((rateLimitStore[ip].resetTime - now) / 1000);
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${timeUntilReset} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': timeUntilReset.toString(),
          },
        }
      );
    }
    
    const response = NextResponse.rewrite(request.nextUrl);
    response.headers.set('X-RateLimit-Limit', config.rateLimitMax.toString());
    response.headers.set('X-RateLimit-Remaining', (config.rateLimitMax - rateLimitStore[ip].count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitStore[ip].resetTime / 1000).toString());
    
    return response;
  }
  
  // For non-API routes, just rewrite the URL (equivalent to continuing)
  return NextResponse.rewrite(request.nextUrl);
} 