import { NextResponse } from 'next/server';
import { createUser } from '@/lib/user-service';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    const user = await createUser(name, email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User already exists or could not be created' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (e) {
    console.error('Error registering user:', e);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 