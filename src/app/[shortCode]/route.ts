import { NextResponse } from 'next/server';
import { getUrlByShortCode, recordVisit } from '@/lib/url-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode }= await params;
  
  // Skip redirection for known routes
  if (['api', 'stats', 'login', 'register', 'dashboard'].includes(shortCode)) {
    return NextResponse.next();
  }

  const url = getUrlByShortCode(shortCode);
  
  if (!url) {
    return new NextResponse('Short URL not found', { status: 404 });
  }
  
  const referrer = request.headers.get('referer');
  const userAgent = request.headers.get('user-agent');
  recordVisit(url.id, referrer, userAgent);
  
  return NextResponse.redirect(url.originalUrl);
} 