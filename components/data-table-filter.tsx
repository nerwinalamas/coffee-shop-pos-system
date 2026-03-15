"use client";

import { Fragment, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const FILTER_CONFIGS = {
  product: [
    {
      key: "categories",
      label: "Category",
      options: ["Coffee", "Food", "Dessert"],
    },
  ],
  inventory: [
    {
      key: "categories",
      label: "Category",
      options: ["Coffee", "Food", "Dessert"],
    },
    {
      key: "statuses",
      label: "Status",
      options: ["In Stock", "Low Stock", "Out of Stock"],
    },
  ],
  user: [{ key: "statuses", label: "Status", options: ["Active", "Inactive"] }],
  transaction: [
    {
      key: "statuses",
      label: "Status",
      options: ["Completed", "Pending", "Cancelled"],
    },
    {
      key: "paymentMethods",
      label: "Payment Method",
      options: ["Cash", "Credit Card", "Debit Card", "E-Wallet"],
    },
  ],
  activity: [
    {
      key: "actions",
      label: "Action",
      options: ["create", "update", "delete", "view"],
    },
    {
      key: "subjects",
      label: "Subject",
      options: [
        "product",
        "transaction",
        "inventory",
        "user",
        "profile",
        "business",
      ],
    },
  ],
} as const;

type FilterType = keyof typeof FILTER_CONFIGS;
type FilterKey =
  | "categories"
  | "statuses"
  | "paymentMethods"
  | "actions"
  | "subjects";
type FilterState = Partial<Record<FilterKey, string[]>>;

interface DataTableFilterProps {
  filterType?: FilterType;
  onFilterChange?: (filters: FilterState) => void;
}

const DataTableFilter = ({
  filterType = "product",
  onFilterChange,
}: DataTableFilterProps) => {
  const config = FILTER_CONFIGS[filterType];

  // Single state object para sa lahat ng filters
  const [filters, setFilters] = useState<FilterState>(() =>
    Object.fromEntries(config.map((group) => [group.key, []])),
  );

  const handleChange = (key: FilterKey, value: string) => {
    const current = filters[key] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = { ...filters, [key]: updated };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearAll = () => {
    const cleared = Object.fromEntries(config.map((group) => [group.key, []]));
    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const activeFilterCount = Object.values(filters).reduce(
    (sum, arr) => sum + (arr?.length ?? 0),
    0,
  );
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <Filter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {config.map((group, index) => (
              <Fragment key={group.key}>
                {index > 0 && <CommandSeparator key={`sep-${group.key}`} />}
                <CommandGroup key={group.key} heading={group.label}>
                  {group.options.map((option) => (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        handleChange(group.key as FilterKey, option)
                      }
                      className="capitalize cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            filters[group.key as FilterKey]?.includes(option) ??
                            false
                          }
                          onCheckedChange={() =>
                            handleChange(group.key as FilterKey, option)
                          }
                        />
                        <span>{option}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
          >
            Clear all filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableFilter;
