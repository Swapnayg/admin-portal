import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all rules
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    // Get rule by ID
    const rule = await prisma.rule.findUnique({
      where: { id: Number(id) },
    });

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json(rule);
  }

}