import { Product } from "@/types/product.types";
import ProductCard from "./product-card";

interface MenuItemsProps {
  data: Product[];
}

const MenuItems = ({ data }: MenuItemsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
      {data && data.length > 0 ? (
        data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-gray-500 text-center text-sm py-8">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
