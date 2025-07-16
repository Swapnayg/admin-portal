import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Keep this secret on server only
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

    if (!record || record.used || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
      email: record.user.email,
    });

    if (getUserError || !users || users.users.length === 0) {
      return NextResponse.json({ error: 'Supabase user not found' }, { status: 404 });
    }

    const supabaseUserId = users.users[0].id;
    const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(supabaseUserId, {
      password: newPassword,
    });

    if (supabaseError) {
      return NextResponse.json({ error: 'Failed to update password in Supabase' }, { status: 500 });
    }

    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
