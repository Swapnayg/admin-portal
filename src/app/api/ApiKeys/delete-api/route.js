import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing API key ID' }, { status: 400 });
  }

  try {
    const deleted = await prisma.apiKey.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Key not found or already deleted' }, { status: 404 });
  }
}
