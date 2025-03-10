import { NextResponse } from 'next/server';
import { createShortUrl } from '@/lib/url-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import config from '@/lib/config';
import { getUserByEmail } from '@/lib/user-service';

export async function POST(request: Request) {
  try {
    const { originalUrl, customShortCode } = await request.json();
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    try {
      new URL(originalUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    const user = getUserByEmail(session?.user?.email || '')
    
    if (customShortCode && !user) {
      return NextResponse.json(
        { error: 'You must be logged in to use custom short codes' },
        { status: 403 }
      );
    }
    
    try {
      const urlRecord = createShortUrl(originalUrl, user?.id, customShortCode);
      
      const shortenedUrl = `${config.baseUrl}/${urlRecord.shortCode}`;
      
      return NextResponse.json({ 
        shortenedUrl,
        shortCode: urlRecord.shortCode,
        originalUrl: urlRecord.originalUrl,
        createdAt: urlRecord.createdAt,
        isCustom: urlRecord.isCustom === 1
      });
    } catch (e) {
      if (e instanceof Error) {
        return NextResponse.json(
          { error: e.message },
          { status: 400 }
        );
      }
      throw e;
    }
  } catch (e) {
    console.error('Error shortening URL:', e);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
} 