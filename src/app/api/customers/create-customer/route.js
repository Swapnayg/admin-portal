import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Prisma } from '@prisma/client'; 

export const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your provider
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { name, email, phone, address, status } = await req.json();

    const tempPassword = Math.random().toString(36).slice(-8); // generate random password

    // Create linked user
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0],
        password: tempPassword,         // optionally hash this
        tempPassword,                   // send via email, delete after first login
        role: 'CUSTOMER',               // optional, defaults to CUSTOMER
        isActive: true,                 // optional, defaults to true
      },
    });


    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        address,
        userId: user.id,
      },
    });


    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 10px; color: #333;">
          <h2 style="color: #1e293b;">Welcome to <span style="color: #3b82f6;">ShopX</span>!</h2>
          
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>

          <p style="font-size: 15px; line-height: 1.6;">
            We’re thrilled to have you onboard in the world of smart shopping! 🎉<br />
            Your account has been successfully created on <strong>ShopX</strong> — your new favorite place to explore top products and unbeatable deals.
          </p>

          <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb;">
            <h3 style="margin-top: 0; color: #1f2937;">Your Account Details</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p style="margin: 10px 0; color: #6b7280;">You can change your password after logging in.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_ANDROID_APP_CUSTOMER_LINK}" style="background: #1e293b; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; display: inline-block; font-weight: bold;">Download the App</a>
          </div>

          <p style="font-size: 15px; line-height: 1.6;">
            If you have any questions or need assistance, our support team is always here for you.
          </p>

          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            Happy shopping!<br />
            <strong>The ShopX Team</strong>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 20px;">
            You are receiving this email because your account was created on ShopX.<br />
            &copy; ${new Date().getFullYear()} ShopX. All rights reserved.
          </p>
        </div>
      `;

    await transporter.sendMail({
        from:  `"ShopX Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Welcome to ShopX - Your Account Details',
        html: htmlContent,
    });

    return NextResponse.json({ message: 'Customer created and email sent', customer });
  } catch (error) {
  console.error('Error creating customer:', error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const field = error.meta?.target?.[0];

      const fieldMessageMap = {
        email: 'Email already exists. Please use a different email.',
        username: 'Username already exists. Please choose another username.',
      };

      return NextResponse.json(
        {
          error: fieldMessageMap[field] || 'A user with the same credentials already exists.',
        },
        { status: 400 }
      );
    }
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

}
