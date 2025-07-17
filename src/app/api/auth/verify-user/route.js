import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // make sure this points to your Prisma client
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    console.log('Incoming request to verify user');

    const body = await req.json();
    console.log('Request body:', body);

    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and temporary password are required' }, { status: 400 });
    }

    console.log('Hashing password...');
    const hashed = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashed);

    console.log('Querying user from Prisma...');
    const user = await prisma.user.findFirst({
      where: {
        email,
        tempPassword: password,
        //password: hashed, // ⚠️ This check likely won't work — see note below
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log('Prisma query result:', user);

    if (!user) {
      console.log('User not found or invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('User verified:', user);
    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
