// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const JWT_SECRET =  process.env.JWT_SECRET || 'fb394f9f8ad3e145b75e4202ee6e5fd7319a48a77232af34e1c0d91c118da61f5b7f5c33b0cb9059ef0c24954f8abf36b44d4c7cc1ea89724a160688cd1bfc4b';// Put in .env in production
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Define your public pages here:
  const publicRoutes = ['/login', '/vendor-registration','/reset-password', '/contact-admin'];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = !isPublicRoute;

  // 1) If there's no token and it's a protected page → redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2) If there is a token, verify it
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);

      // If already logged in and hitting a public page → send to home
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Otherwise, allow
      return NextResponse.next();
    } catch {
      // Invalid/expired token → clear cookie & force login
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('token', '', { maxAge: 0, path: '/' });
      return res;
    }
  }

  // 3) Let public pages through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Apply to everything in your App Router except:
       - /api/*
       - /_next/*
       - /static/*
       - /vendor-registration        <- public signup
       - any file extension (png/jpg/ico/svg/…)
    */
    '/((?!api/|_next/|static/|vendor-registration|.*\\..*).*)',
  ],
};
