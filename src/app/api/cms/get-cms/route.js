import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const transformedPages = pages.map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      updatedAt: page.updatedAt,
    }));

    return NextResponse.json({ pages: transformedPages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
