import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';


const ruleSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  value: z.union([z.string(), z.number()]).transform(val =>
    typeof val === 'string' ? parseFloat(val.replace('%', '')) : val
  ),
  status: z.string().min(1),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = ruleSchema.parse(body);

    const newRule = await prisma.rule.create({
      data: {
        name: parsed.name,
        type: parsed.type,
        value: parsed.value,
        status: parsed.status,
      },
    });

    return NextResponse.json(newRule);
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json(
      { error: 'Failed to create rule', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
