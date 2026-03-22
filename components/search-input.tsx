"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
  className,
}: SearchInputProps) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
};

export default SearchInput;
