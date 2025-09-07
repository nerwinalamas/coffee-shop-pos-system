import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants";
import { ProductCategory } from "@/types/product.types";
import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  selectedCategory: "All" | ProductCategory;
  setSelectedCategory: (selectedCategory: "All" | ProductCategory) => void;
}

const CategoryTabs = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryTabsProps) => {
  return (
    <div className="flex items-center gap-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selectedCategory === category
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
