// /app/api/admin/notifications/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from '@/lib/getSessionUser';// Or your auth provider

export async function GET() {

  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.id;
  // Get adminId linked to the logged-in user
  const admin = await prisma.admin.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!admin) {
    return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  }

  const notifications = await prisma.notification.findMany({
    where: { adminId: admin.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const unreadCount = await prisma.notification.count({
    where: { adminId: admin.id, read: false },
  });

  return NextResponse.json({ notifications: notifications ?? [], unreadCount });
}
