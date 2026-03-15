"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Target,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SalesTargetData } from "@/hooks/useDashboardData";
import { useSalesTarget } from "@/hooks/useSalesTarget";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const ADMIN_ROLES = ["Owner", "Admin"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface SalesTargetProps {
  data: SalesTargetData | null;
  isLoading?: boolean;
}

const SalesTarget = ({ data, isLoading }: SalesTargetProps) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: profile } = useProfile();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [pickerYear, setPickerYear] = useState(currentYear);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const canEdit = ADMIN_ROLES.includes(profile?.role ?? "");
  const isCurrentMonth =
    selectedYear === currentYear && selectedMonth === currentMonth;
  const isPastMonth =
    selectedYear < currentYear ||
    (selectedYear === currentYear && selectedMonth < currentMonth);

  const { data: pastData, isLoading: isPastLoading } = useSalesTarget(
    selectedYear,
    selectedMonth,
  );

  const activeData = isCurrentMonth ? data : pastData;
  const activeLoading = isCurrentMonth ? isLoading : isPastLoading;

  const currentRevenue = activeData?.currentRevenue ?? 0;
  const targetAmount = activeData?.targetAmount ?? 0;
  const progressPercent = activeData?.progressPercent ?? 0;
  const remaining = activeData?.remaining ?? 0;
  const isAchieved = activeData?.isAchieved ?? false;

  const handleMonthSelect = (monthIndex: number) => {
    if (
      pickerYear > currentYear ||
      (pickerYear === currentYear && monthIndex > currentMonth)
    )
      return;
    setSelectedYear(pickerYear);
    setSelectedMonth(monthIndex);
    setIsEditing(false);
    setInputValue("");
    setPopoverOpen(false);
  };

  const handleSave = async () => {
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid target amount.");
      return;
    }

    const thisMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;

    const { error } = await supabase.from("sales_targets").upsert(
      {
        business_id: profile?.business_id,
        month: thisMonthKey,
        target_amount: amount,
        created_by: profile?.id,
      },
      { onConflict: "business_id,month" },
    );

    if (error) {
      toast.error("Failed to save target. Please try again.");
      return;
    }

    toast.success("Sales target updated!");
    setIsEditing(false);
    setInputValue("");
    await queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue("");
  };

  const progressColor = () => {
    if (!activeData) return "bg-muted";
    if (isAchieved) return "bg-green-500";
    if (progressPercent >= 75) return "bg-blue-500";
    if (progressPercent >= 40) return "bg-amber-500";
    return "bg-red-400";
  };

  const monthLabel = new Date(selectedYear, selectedMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" },
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          Sales Target
        </CardTitle>

        <div className="flex items-center gap-1">
          {canEdit && isCurrentMonth && !isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer"
              onClick={() => {
                setInputValue(activeData?.targetAmount.toFixed(2) ?? "");
                setIsEditing(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
              >
                {monthLabel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => setPickerYear((y) => y - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{pickerYear}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => setPickerYear((y) => y + 1)}
                  disabled={pickerYear >= currentYear}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((month, index) => {
                  const isFuture =
                    pickerYear > currentYear ||
                    (pickerYear === currentYear && index > currentMonth);
                  const isSelected =
                    pickerYear === selectedYear && index === selectedMonth;
                  const isToday =
                    pickerYear === currentYear && index === currentMonth;

                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      disabled={isFuture}
                      className={cn(
                        "rounded-md py-1.5 text-xs transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground font-medium"
                          : isToday
                            ? "border border-primary text-primary font-medium hover:bg-muted"
                            : isFuture
                              ? "text-muted-foreground opacity-40 cursor-not-allowed"
                              : "hover:bg-muted text-foreground",
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {activeLoading ? (
          <div className="space-y-3">
            <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
          </div>
        ) : isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="Enter monthly target"
              className="h-8 text-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 cursor-pointer text-green-600"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 cursor-pointer text-destructive"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : !activeData ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              No target set for this {isPastMonth ? "period" : "month"}.
            </p>
            {canEdit && isCurrentMonth && (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setInputValue("");
                  setIsEditing(true);
                }}
              >
                Set target
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">
                  ${currentRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of ${targetAmount.toFixed(2)} target
                </p>
              </div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isAchieved ? "text-green-600" : "text-muted-foreground",
                )}
              >
                {progressPercent}%
              </p>
            </div>

            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progressColor(),
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {isAchieved
                ? `Target achieved! $${(currentRevenue - targetAmount).toFixed(2)} over goal.`
                : isPastMonth
                  ? `Fell short by $${remaining.toFixed(2)}.`
                  : `$${remaining.toFixed(2)} remaining to reach target.`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTarget;
