// app/api/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { add } from 'date-fns';
import nodemailer from 'nodemailer';


// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Always return success to avoid revealing valid emails
    return NextResponse.json({
      message: 'If that email is registered, you’ll receive a reset link shortly.',
    });
  }

  // 1) Generate token
  const token = randomBytes(32).toString('hex');
  const expiresAt = add(new Date(), { hours: 1 });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  // 2) Build reset URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  // 3) Send email
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Password Reset Link',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>Password Reset Requested</h2>
        <p>Hi ${email},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <p style="text-align:center">
          <a href="${resetLink}"
             style="display:inline-block;padding:10px 20px;
                    background-color:#0366d6;color:#fff;text-decoration:none;
                    border-radius:4px;font-weight:bold;">
            Reset My Password
          </a>
        </p>
        <p>If that button doesn’t work, copy and paste this link in your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p><small>This link will expire in 1 hour.</small></p>
        <hr>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>Thanks,<br>Your Company Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending reset email:', err);
    // Still respond success to avoid leaking
  }

  return NextResponse.json({
    message: 'If that email is registered, you’ll receive a reset link shortly.',
  });
}
