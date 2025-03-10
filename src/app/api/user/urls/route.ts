import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserUrls } from '@/lib/url-service';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email || '';
    const urls = getUserUrls(userEmail);
    
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
} 