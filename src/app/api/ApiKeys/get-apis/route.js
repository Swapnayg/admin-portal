import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.id;
  const keys = await prisma.apiKey.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(keys);
}
