// /app/api/pages/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: { id: Number(id) },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Get Page Error:', error);
    return NextResponse.json({ message: 'Failed to fetch page' }, { status: 500 });
  }
}
