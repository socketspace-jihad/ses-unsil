import { NextResponse } from 'next/server';
import { jwt } from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const secretKey = new TextEncoder().encode('your_secret_key'); // Replace with your actual secret key

export async function middleware(req) {

    console.log("MIDDLEWARE EXECUTED")
  const token = getCookie('auth-token', { req });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwt.verify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard', '/another-protected-route'], // Add all the protected routes here
};
