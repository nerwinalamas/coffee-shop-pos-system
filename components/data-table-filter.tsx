"use client";

import { useState } from "react";
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

const CATEGORIES = ["Coffee", "Food", "Dessert"];
const STATUS = ["In Stock", "Low Stock", "Out of Stock"];

interface DataTableFilterProps {
  onFilterChange?: (filters: {
    categories: string[];
    statuses: string[];
  }) => void;
}

const DataTableFilter = ({ onFilterChange }: DataTableFilterProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    const newCategories = categoryFilter.includes(category)
      ? categoryFilter.filter((c) => c !== category)
      : [...categoryFilter, category];

    setCategoryFilter(newCategories);
    onFilterChange?.({ categories: newCategories, statuses: statusFilter });
  };

  const handleStatusChange = (status: string) => {
    const newStatuses = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];

    setStatusFilter(newStatuses);
    onFilterChange?.({ categories: categoryFilter, statuses: newStatuses });
  };

  const handleClearAll = () => {
    setCategoryFilter([]);
    setStatusFilter([]);
    onFilterChange?.({ categories: [], statuses: [] });
  };

  const hasActiveFilters = categoryFilter.length > 0 || statusFilter.length > 0;
  const activeFilterCount = categoryFilter.length + statusFilter.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
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
          <CommandInput placeholder="Filter inventory..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Category">
              {CATEGORIES.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => handleCategoryChange(category)}
                  className="capitalize"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={categoryFilter.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Status">
              {STATUS.map((status) => (
                <CommandItem
                  key={status}
                  onSelect={() => handleStatusChange(status)}
                  className="capitalize"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => handleStatusChange(status)}
                    />
                    <span>{status}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground"
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
