"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Package, ShoppingCart, CheckCheck } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const notificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "low_stock":
    case "out_of_stock":
      return <Package className="h-4 w-4 text-orange-500" />;
    case "pending_order":
      return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const NotificationBell = ({
  businessId,
}: {
  businessId: string | undefined;
}) => {
  const {
    data: notifications = [],
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(businessId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 cursor-pointer">
          <Bell className="h-4 w-4" />

          {/* Dot indicator */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}

          {/* Badge count */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    !notification.is_read && markAsRead(notification.id)
                  }
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                    !notification.is_read && "bg-muted/30",
                  )}
                >
                  {/* Icon */}
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    {notificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        !notification.is_read
                          ? "font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                      {notification.created_at
                        ? formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                            },
                          )
                        : ""}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.is_read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
