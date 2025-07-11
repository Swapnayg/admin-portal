import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, address, status } = await req.json();

    const tempPassword = Math.random().toString(36).slice(-8); // generate random password

    // Create linked user
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0],
        password: tempPassword, // store securely (hash it if needed)
        status,
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

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ShopX Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to ShopX - Your Account Details',
      html: `
        <h3>Hi ${name},</h3>
        <p>Welcome to <strong>ShopX</strong>, your trusted shopping platform!</p>
        <p>We’ve created an account for you. Below are your login credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        <p>You can download the app and login using the credentials above.</p>
        <a href="${process.env.APP_DOWNLOAD_LINK}" style="padding: 10px 20px; background-color: #1e293b; color: white; text-decoration: none; border-radius: 5px;">Download App</a>
        <p style="margin-top: 20px;">Best regards,<br/>Team ShopX</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Customer created and email sent', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
