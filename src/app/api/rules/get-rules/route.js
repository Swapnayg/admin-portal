// /app/api/rules/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formattedRules = rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      type: rule.type === 'TAX' ? 'Tax' : 'Commission',
      value: `${rule.value.toFixed(2)}%`,
      status: rule.status === 'ACTIVE' ? 'Active' : 'Inactive',
    }));

    return NextResponse.json(formattedRules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}
