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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address i.e @gmail.com' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // TODO: Replace this with your actual user registration logic
    // This is a placeholder implementation
    console.log('Sign up attempt:', { email, password });

    // Example: Make a request to your user registration service
    // const response = await fetch('YOUR_AUTH_SERVICE_URL/signup', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password }),
    // });

    // For demo purposes, simulate a successful response
    // Replace this with actual registration logic
    if (email && password) {
      return NextResponse.json(
        { 
          message: 'Account created successfully',
          user: { email, id: 'demo-user-id' }
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to create account' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 