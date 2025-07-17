import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (record.used) {
      return NextResponse.json({ error: 'Token already used' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    const userEmail = record.user.email;

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed, tempPassword: newPassword},
    });

    // Get all users (email filtering not supported by Supabase)
    const { data, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    if (getUserError) {
      return NextResponse.json({ error: 'Failed to fetch users from Supabase' }, { status: 500 });
    }

    const matchedUser = data.users.find(
      (user) => user.email?.toLowerCase() === userEmail.toLowerCase()
    );

    if (!matchedUser) {
      return NextResponse.json({ error: 'Supabase user not found' }, { status: 404 });
    }

    const supabaseUserId = matchedUser.id;

    const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(supabaseUserId, {
      password: newPassword,
    });

    if (supabaseError) {
      return NextResponse.json({ error: 'Failed to update password in Supabase' }, { status: 500 });
    }

    // Optional: update DB to mark token as used
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
