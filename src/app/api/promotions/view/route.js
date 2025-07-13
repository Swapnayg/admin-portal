import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing promotion id' }, { status: 400 });
  }

  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: parseInt(id) },
    });

    if (!promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    const usages = await prisma.promotionUsage.findMany({
      where: { promotionId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });

    const enrichedUsages = await Promise.all(
      usages.map(async (usage) => {
        // Total benefit across all promotions for the user
        const totalUserPromotionBenefit = await prisma.promotionUsage.aggregate({
          where: { userId: usage.userId },
          _sum: { benefit: true },
        });

        return {
          ...usage,
          totalSpent: usage.amountSpent,
          commission: usage.commission,
          benefit: usage.benefit,
          totalUserPromotionBenefit: totalUserPromotionBenefit._sum.benefit || 0,
        };
      })
    );

    return NextResponse.json({
      promotion,
      usages: enrichedUsages,
    });
  } catch (error) {
    console.error('Error fetching promotion view:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
