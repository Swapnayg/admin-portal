// lib/notifications.ts
import prisma from '@/lib/prisma';
import { NotificationType } from "@prisma/client";

/**
 * Notify all admins
 */
export async function notifyAdmins(
  title: string,
  message: string,
  type: NotificationType
) {
  try {
    const admins = await prisma.admin.findMany({ select: { id: true } });

    if (!admins.length) return;

    const notifications = admins.map((admin) => ({
      title,
      message,
      type,
      adminId: admin.id,
    }));

    await prisma.notification.createMany({ data: notifications });
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}

/**
 * Notify a specific user (vendor, customer, or user)
 */
export async function notifyUser({
  title,
  message,
  type,
  userId,
  vendorId,
  customerId,
  adminId,
  productId,
  orderId,
}: {
  title: string;
  message: string;
  type: NotificationType;
  userId?: number;
  vendorId?: number;
  customerId?: number;
  adminId?: number;
  productId?: number;
  orderId?: number;
}) {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        vendorId,
        customerId,
        adminId,
        productId,
        orderId,
      },
    });
  } catch (error) {
    console.error("Failed to notify user:", error);
  }
}
