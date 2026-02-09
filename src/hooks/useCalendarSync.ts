"use client";

import { useState } from "react";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { toast } from "sonner";

// Google Calendar Event interface
interface GoogleCalendarEvent {
  id: string;
  summary: string;
  htmlLink?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

export const useCalendarSync = () => {
  const { session } = useSupabaseAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedEvents, setSyncedEvents] = useState<GoogleCalendarEvent[]>([]);

  const syncToCalendar = async (todo: { content: string; date?: Date }) => {
    if (!session?.provider_token) {
      // Toast already shows error to user
      toast.error(
        "Không tìm thấy quyền truy cập Google Calendar. Vui lòng đăng xuất và đăng nhập lại.",
      );
      return;
    }

    setIsSyncing(true);
    try {
      const event = {
        summary: todo.content,
        start: {
          dateTime: (todo.date || new Date()).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(
            (todo.date || new Date()).getTime() + 60 * 60 * 1000,
          ).toISOString(), // 1 hour later
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google API Error:", errorData);
        throw new Error(
          errorData.error?.message || "Failed to sync to Google Calendar",
        );
      }

      const data = await response.json();
      toast.success("Đã đồng bộ công việc lên Google Calendar!");
      setSyncedEvents((prev) => [...prev, data]);
      return data;
    } catch (error: unknown) {
      console.error("Calendar sync error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Lỗi đồng bộ: ${message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return { syncToCalendar, isSyncing };
};
