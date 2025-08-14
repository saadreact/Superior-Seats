import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Make request to the actual backend authentication service
    const response = await fetch('https://superiorseats.ali-khalid.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success - return the actual response from backend
      return NextResponse.json(data, { status: 200 });
    } else {
      // Error - return the error message from backend
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 