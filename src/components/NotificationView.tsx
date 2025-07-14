"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tab, setTab] = useState<"all" | "read" | "unread">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const res = await fetch(`/api/admin/notificationPage?page=${page}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    if (data.notifications?.length < PAGE_SIZE) setHasMore(false);

    setNotifications((prev) => [...prev, ...data.notifications]);
    loadingRef.current = false;
  }, [page]);


  const markAllAsRead = async () => {
        try {
            setLoading(true);
            await fetch("/api/admin/mark-all-read", { method: "POST" });
            refreshNotifications();
        } catch (error) {
            console.error("Failed to mark all as read", error);
        } finally {
            setLoading(false);
        }
    };

  const markOneAsRead = async (id: number) => {
    await fetch(`/api/admin/read-status?id=${id}&read=true`, { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const refreshNotifications = async () => {
    const res = await fetch(`/api/admin/notificationPage?page=1&limit=${page * PAGE_SIZE}`);
    const data = await res.json();
    setNotifications(data.notifications);
    setHasMore(data.notifications.length >= page * PAGE_SIZE);
  };

  const filtered = notifications.filter((n) => {
    if (tab === "read") return n.read;
    if (tab === "unread") return !n.read;
    return true;
  });

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore]);

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={loading}
            className="border border-slate-300 bg-slate-700 hover:bg-slate-600 text-white cursor-pointer disabled:opacity-60"
            >
            {loading ? "Marking..." : "Mark All as Read"}
        </Button>

      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setTab(value as any)}>
        <TabsList className="mb-4 bg-slate-100 rounded-lg p-1">
         <TabsTrigger
            value="all"
            className="px-4 py-2 rounded-md text-slate-600 data-[state=active]:bg-slate-700 data-[state=active]:text-white cursor-pointer"
            >
            All
            </TabsTrigger>

            <TabsTrigger
            value="unread"
            className="px-4 py-2 rounded-md text-slate-600 data-[state=active]:bg-slate-700 data-[state=active]:text-white cursor-pointer"
            >
            Unread
            </TabsTrigger>

            <TabsTrigger
            value="read"
            className="px-4 py-2 rounded-md text-slate-600 data-[state=active]:bg-slate-700 data-[state=active]:text-white cursor-pointer"
            >
            Read
            </TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-sm text-slate-500">No notifications found.</div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className={clsx(
                    "p-4 rounded-lg border shadow-sm transition duration-150 relative",
                    n.read
                      ? "bg-white border-slate-200 hover:bg-slate-50"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">{n.title}</h2>
                      <p className="text-sm text-slate-700 mt-1">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="h-2 w-2 mt-1 rounded-full bg-blue-500" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-blue-600 hover:underline cursor-pointer"
                          onClick={() => markOneAsRead(n.id)}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {hasMore && (
              <div ref={observerRef} className="text-center text-sm text-slate-500 py-4">
                Loading more...
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
