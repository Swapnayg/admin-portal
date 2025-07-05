import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
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

  // Update user password
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  });

  // Mark token used
  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  return NextResponse.json({ message: 'Password has been reset' });
}
