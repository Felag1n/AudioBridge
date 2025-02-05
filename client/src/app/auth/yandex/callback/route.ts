import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const REDIRECT_URI = 'http://localhost:3001/auth/yandex/callback';
const API_BASE_URL = 'http://localhost:8000/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return new NextResponse('No code provided', { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/auth/yandex/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: REDIRECT_URI
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from backend:', errorText);
      return new NextResponse(
        'Authentication failed: ' + (errorText.substring(0, 100) + '...'), 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    }

    if (data.token) {
      cookies().set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return NextResponse.redirect(new URL('/profile', request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}

