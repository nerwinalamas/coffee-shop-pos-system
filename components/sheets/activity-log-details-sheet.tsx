"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ActivityLogsWithProfile } from "@/types/activity-logs.types";
import { getActionColor } from "@/lib/utils";
import { format } from "date-fns";

interface ActivityLogDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: ActivityLogsWithProfile | null;
}

const ActivityLogDetailsSheet = ({
  open,
  onOpenChange,
  log,
}: ActivityLogDetailsSheetProps) => {
  if (!log) return null;

  const hasChanges =
    log.changes &&
    (log.changes.old !== undefined || log.changes.new !== undefined);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Activity Log Details</SheetTitle>
          <SheetDescription>
            Full details for this activity log entry
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-4">
          {/* Action & Subject */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Action
            </h4>
            <div className="flex items-center gap-2">
              <Badge className={getActionColor(log.action)}>{log.action}</Badge>
              <span className="text-sm capitalize text-muted-foreground">
                on
              </span>
              <span className="text-sm font-medium capitalize">
                {log.subject}
              </span>
            </div>
          </div>

          <Separator />

          {/* Entity */}
          {(log.entity_name || log.entity_id) && (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Entity
                </h4>
                <div className="space-y-2">
                  {log.entity_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Name
                      </span>
                      <span className="text-sm font-medium">
                        {log.entity_name}
                      </span>
                    </div>
                  )}
                  {log.entity_id && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ID</span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {log.entity_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* User */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Performed By
            </h4>
            {log.profiles ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">
                    {log.profiles.first_name} {log.profiles.last_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm">{log.profiles.email}</span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Unknown</span>
            )}
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Timestamp
            </h4>
            <span className="text-sm font-medium">
              {log.created_at
                ? format(
                    new Date(log.created_at),
                    "MMMM d, yyyy 'at' h:mm:ss a",
                  )
                : "Unknown"}
            </span>
          </div>

          {/* Changes */}
          {hasChanges && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Changes
                </h4>
                <div className="space-y-3">
                  {/* Old values */}
                  {log.changes?.old &&
                    Object.keys(log.changes.old).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-red-500 uppercase">
                          Before
                        </p>
                        <div className="rounded-lg border border-red-100 bg-red-50 p-3 space-y-1.5">
                          {Object.entries(log.changes.old).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-start gap-4"
                              >
                                <span className="text-xs text-muted-foreground capitalize shrink-0">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs font-medium text-right break-all">
                                  {String(value ?? "—")}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* New values */}
                  {log.changes?.new &&
                    Object.keys(log.changes.new).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-green-600 uppercase">
                          After
                        </p>
                        <div className="rounded-lg border border-green-100 bg-green-50 p-3 space-y-1.5">
                          {Object.entries(log.changes.new).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-start gap-4"
                              >
                                <span className="text-xs text-muted-foreground capitalize shrink-0">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs font-medium text-right break-all">
                                  {String(value ?? "—")}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityLogDetailsSheet;
