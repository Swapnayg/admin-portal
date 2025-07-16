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

    console.log('📩 Incoming request body:', body);

    if (!token || !newPassword) {
      console.warn('❗Missing token or newPassword');
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      console.warn('❗Password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    console.log('🔍 Looking up token in DB...');
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      console.warn('❌ Token not found in DB');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (record.used) {
      console.warn('❌ Token already used');
      return NextResponse.json({ error: 'Token already used' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      console.warn('❌ Token expired');
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    console.log('👤 Found user for token:', record.user);

    // 1. Update local DB password
    const hashed = await bcrypt.hash(newPassword, 10);
    console.log('🔐 Updating password in Prisma...');
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    // 2. Update Supabase user password
    console.log('🔗 Updating password in Supabase for userId:', record.user.supabaseUserId);
    const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(record.user.supabaseUserId, {
      password: newPassword,
    });

    if (supabaseError) {
      console.error('🔥 Supabase update failed:', supabaseError);
      return NextResponse.json({ error: 'Failed to update password in Supabase' }, { status: 500 });
    }

    // 3. Mark token used
    console.log('✅ Marking token as used...');
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    console.log('🎉 Password reset successful');
    return NextResponse.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    console.error('💥 Unexpected server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
