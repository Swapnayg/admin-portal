// /app/api/pages/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/getSessionUser';

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing id in query parameters' }, { status: 400 });
    }

    const body = await req.json();
    const { title, slug, status, content } = body;

    
    const session = await getSessionUser();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.id;

    const page = await prisma.page.update({
      where: { id: Number(id) },
      data: { title, slug, status, content , authorId:userId },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Update Page error:', error);
    return NextResponse.json({ message: 'Failed to update page' }, { status: 500 });
  }
}
