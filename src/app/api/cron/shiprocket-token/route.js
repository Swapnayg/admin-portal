import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');

  console.log('[CRON] Secret token received:', token);
  console.log('[CRON] Expected token:', process.env.CRON_SECRET_TOKEN);

  // 🔐 Security Check
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔁 Cron Job: Shiprocket Token Refresh - Started');

    const email = process.env.SHIPROCKET_API_EMAIL;
    const password = process.env.SHIPROCKET_API_PASSWORD;

    if (!email || !password) {
      console.error('[CRON] Missing Shiprocket credentials');
      return NextResponse.json({ message: 'Missing Shiprocket credentials' }, { status: 500 });
    }

    const authRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.token) {
      console.error('[CRON] Shiprocket auth failed:', authData);
      return NextResponse.json({ message: 'Shiprocket auth failed', details: authData }, { status: 500 });
    }

    const shiprocketToken = authData.token;

    // 🧹 Remove old token if any (global/shared token)
    await prisma.apiKey.deleteMany({
      where: {
        name: 'shiprocket',
      },
    });

    // 🆕 Save new token to api_key table (userId = 1 assumed for system/global token)
    const newToken = await prisma.apiKey.create({
      data: {
        userId: 1, // System admin user or shared account
        name: 'shiprocket',
        key: shiprocketToken,
        role: 'ADMIN',
      },
    });

    console.log('✅ Shiprocket token refreshed and saved');

    return NextResponse.json({
      message: 'Shiprocket token refreshed successfully',
      token: shiprocketToken,
      createdAt: newToken.createdAt,
    });
  } catch (err) {
    console.error('❌ Cron Job: Shiprocket Token Refresh - Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
