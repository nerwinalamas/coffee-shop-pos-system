"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActivityLogsWithProfile } from "@/types/activity-logs.types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { getActionColor } from "@/lib/utils";
import { useMemo, useState } from "react";
import DataTableFilter from "./data-table-filter";

const ActivityLogsTable = () => {
  const { data, isLoading, error } = useActivityLogs();

  const [filters, setFilters] = useState<{
    actions: string[];
    subjects: string[];
  }>({
    actions: [],
    subjects: [],
  });

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((log) => {
      const inAction =
        filters.actions.length === 0 || filters.actions.includes(log.action);
      const inSubject =
        filters.subjects.length === 0 || filters.subjects.includes(log.subject);
      return inAction && inSubject;
    });
  }, [data, filters]);

  const columns: ColumnDef<ActivityLogsWithProfile>[] = [
    {
      id: "user",
      header: "User",
      accessorFn: (row) =>
        row.profiles
          ? `${row.profiles.first_name} ${row.profiles.last_name}`
          : "Unknown",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">
            {row.original.profiles
              ? `${row.original.profiles.first_name} ${row.original.profiles.last_name}`
              : "Unknown"}
          </div>
          <div className="text-xs text-gray-500">
            {row.original.profiles?.email ?? "—"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Badge className={getActionColor(row.original.action)}>
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="capitalize text-sm">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Time",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.created_at
            ? formatDistanceToNow(new Date(row.original.created_at), {
                addSuffix: true,
              })
            : "Unknown"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      filterComponent={
        <DataTableFilter
          filterType="activity"
          onFilterChange={(f) =>
            setFilters({
              actions: f.actions ?? [],
              subjects: f.subjects ?? [],
            })
          }
        />
      }
      emptyMessage="No activity logs found."
      searchPlaceholder="Search by user or subject"
      isLoading={isLoading}
      loadingText="Loading activity logs..."
      error={error}
      errorText="Error loading activity logs"
    />
  );
};

export default ActivityLogsTable;
