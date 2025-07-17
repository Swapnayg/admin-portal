import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET =  process.env.JWT_SECRET || 'fb394f9f8ad3e145b75e4202ee6e5fd7319a48a77232af34e1c0d91c118da61f5b7f5c33b0cb9059ef0c24954f8abf36b44d4c7cc1ea89724a160688cd1bfc4b';// Put in .env in production

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { admin: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Determine token & cookie lifetimes
    const tokenExpiry  = rememberMe ? '30d' : '1h';
    const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined; // 30 days vs session

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.username, },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Strip password before returning user
    const { password: _, ...userWithoutPassword } = user;

    // Send JWT in HttpOnly cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: cookieMaxAge,
    });

    return response;
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

