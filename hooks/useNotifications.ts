"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Database } from "@/types/supabase";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export const useNotifications = (businessId: string | undefined) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery<Notification[]>({
    queryKey: ["notifications", businessId],
    enabled: !!businessId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("business_id", businessId!)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Realtime — push new notifications instantly
  useEffect(() => {
    if (!businessId) return;

    const channel = supabase
      .channel(`notifications-realtime-${businessId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["notifications", businessId],
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["notifications", businessId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, supabase, queryClient]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    queryClient.invalidateQueries({
      queryKey: ["notifications", businessId],
    });
  };

  const markAllAsRead = async () => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("business_id", businessId!)
      .eq("is_read", false);

    queryClient.invalidateQueries({
      queryKey: ["notifications", businessId],
    });
  };

  const unreadCount = query.data?.filter((n) => !n.is_read).length ?? 0;

  return { ...query, unreadCount, markAsRead, markAllAsRead };
};
