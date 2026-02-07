import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AvailabilityFilterProps {
  availabilityFilter: "All" | "Available" | "Out of Stock";
  setAvailabilityFilter: (filter: "All" | "Available" | "Out of Stock") => void;
}

const AvailabilityFilter = ({
  availabilityFilter,
  setAvailabilityFilter,
}: AvailabilityFilterProps) => {
  const options = [
    { value: "All", label: "All" },
    { value: "Available", label: "Available" },
    { value: "Out of Stock", label: "Out of Stock" },
  ] as const;

  return (
    <Select
      value={availabilityFilter}
      onValueChange={(value) =>
        setAvailabilityFilter(value as "All" | "Available" | "Out of Stock")
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by availability" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AvailabilityFilter;
