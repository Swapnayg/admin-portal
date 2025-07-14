"use client";

import { BellIcon, EyeIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/admin/read-status?id=${id}&read=true`, {
        method: "POST",
      });
      // Refresh notifications after marking one as read
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full">
          <BellIcon className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 max-h-80 p-4 bg-white border border-gray-200 shadow-xl rounded-md z-50"
      >
        <div className="text-sm font-semibold mb-2">Notifications</div>
        <div className="space-y-2 max-h-60 overflow-auto pr-1">
          {notifications.slice(0, 5).map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={clsx(
                "p-2 rounded border cursor-pointer transition",
                n.read
                  ? "bg-white hover:bg-gray-50 border-gray-200"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              )}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{n.title}</div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-slate-500" />}
              </div>
              <div className="text-xs text-gray-600">{n.message}</div>
              <div className="text-[10px] text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <Link href="/notifications">
            <button className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium hover:underline hover:text-slate-700 transition cursor-pointer">
              <EyeIcon className="w-4 h-4" />
              View All
            </button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
