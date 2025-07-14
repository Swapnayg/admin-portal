// /app/api/rules/delete/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE rule by query string `id`
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.rule.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
}
