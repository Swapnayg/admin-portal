import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/getSessionUser';

export async function POST(req) {
  const body = await req.json();

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.id;
  const { name, key, role } = body;

  if (!name || !key || !role || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newKey = await prisma.apiKey.create({
    data: {
      name,
      key,
      role,
      userId: Number(userId),
    },
  });

  return NextResponse.json(newKey);
}
