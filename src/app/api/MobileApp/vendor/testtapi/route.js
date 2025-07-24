// app/api/app/vendor/testtapi/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { withRole } from '@/lib/withRole';

export const GET = withRole(['VENDOR'], async (req, user) => {
  return NextResponse.json({
    message: 'Access granted for VENDOR!',
    user,
  });
});
