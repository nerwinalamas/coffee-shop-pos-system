"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export type DatePreset =
  | "today"
  | "this_week"
  | "this_month"
  | "last_month"
  | "custom";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

export function getPresetDateRange(preset: DatePreset): DateRangeValue {
  const now = new Date();
  switch (preset) {
    case "today": {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "this_week": {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "this_month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "last_month": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    default: {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
  }
}

interface DateRangeFilterProps {
  defaultPreset?: DatePreset;
  onChange: (range: DateRangeValue) => void;
}

const DateRangeFilter = ({
  defaultPreset = "this_month",
  onChange,
}: DateRangeFilterProps) => {
  const [preset, setPreset] = useState<DatePreset>(defaultPreset);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handlePresetChange = (value: DatePreset) => {
    setPreset(value);
    if (value !== "custom") {
      onChange(getPresetDateRange(value));
    }
  };

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range?.from && range?.to) {
      setCalendarOpen(false);
      const to = new Date(range.to);
      to.setHours(23, 59, 59, 999);
      onChange({ from: range.from, to });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={preset}
        onValueChange={(v) => handlePresetChange(v as DatePreset)}
      >
        <SelectTrigger className="w-[150px] text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this_week">Last 7 Days</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="last_month">Last Month</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <CalendarIcon className="h-3.5 w-3.5" />
              {customRange?.from && customRange?.to
                ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`
                : "Pick dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateRangeFilter;
