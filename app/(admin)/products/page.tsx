import PageTransition from "@/components/page-transition";
import ProductTable from "./_components/product-table";

const ProductsPage = () => {
  return (
    <PageTransition>
      <ProductTable />
    </PageTransition>
  );
};

export default ProductsPage;
