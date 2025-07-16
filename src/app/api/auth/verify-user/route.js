import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // make sure this points to your Prisma client

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and temporary password are required' }, { status: 400 });
    }

    // Find user by email and password
    const user = await prisma.user.findFirst({
      where: {
        email,
        tempPassword:password,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
