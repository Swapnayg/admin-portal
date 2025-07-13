// /app/api/pages/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/getSessionUser';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug, status, content } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;

    const page = await prisma.page.create({
      data: { title, slug, status, content , authorId:userId},
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Create Page error:', error);
    return NextResponse.json({ message: 'Failed to create page' }, { status: 500 });
  }
}
