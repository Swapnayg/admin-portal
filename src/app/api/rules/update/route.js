// /app/api/rules/update/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE rule by query string `id`
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, type, value, status } = body;

    const updatedRule = await prisma.rule.update({
      where: { id: Number(id) },
      data: { name, type, value, status },
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}
