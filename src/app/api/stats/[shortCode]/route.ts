import { NextResponse } from 'next/server';
import { getUrlStats } from '@/lib/url-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;
  
  const stats = getUrlStats(shortCode);
  
  if (!stats) {
    return NextResponse.json(
      { error: 'URL not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(stats);
} 