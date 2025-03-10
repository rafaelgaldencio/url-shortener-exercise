import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';

export function middleware(request: NextRequest) {
  // Apply CORS middleware
  const corsResponse = corsMiddleware(request);
  if (corsResponse.status !== 200) {
    return corsResponse;
  }
  
  // Apply rate limiting middleware
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse.status !== 200) {
    return rateLimitResponse;
  }
  
  // If all middlewares pass, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
}; 