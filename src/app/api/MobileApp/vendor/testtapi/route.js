// app/api/app/vendor/posttapi/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { withRole } from '@/lib/withRole';

export const POST = withRole(['VENDOR'], async (req, user) => {
  const body = await req.json();

  // Example logic: echo the data with user info
  return NextResponse.json({
    message: 'POST Access granted for VENDOR!',
    user,
    received: body,
  });
});
