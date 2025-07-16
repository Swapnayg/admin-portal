import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Never expose this in client code
);

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();
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

    const user = record.user;

    // 1. Update password in your local database
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    // 2. Update password in Supabase
    const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(user.supabaseUserId, {
      password: newPassword,
    });

    if (supabaseError) {
      console.error('Supabase update error:', supabaseError);
      return NextResponse.json({ error: 'Failed to update password in Supabase' }, { status: 500 });
    }

    // 3. Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    console.error('Reset error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
