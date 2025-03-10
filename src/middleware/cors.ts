import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import config from '@/lib/config';

export function corsMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin') || '';
    
    const isAllowedOrigin = 
      config.corsAllowedOrigins.includes(origin) || 
      (config.isDevelopment && (origin.startsWith('http://localhost:') || origin === ''));
    
    if (!isAllowedOrigin) {
      return new NextResponse(null, {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    const response = NextResponse.rewrite(request.nextUrl);
    
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    return response;
  }
  
  return NextResponse.rewrite(request.nextUrl);
} 