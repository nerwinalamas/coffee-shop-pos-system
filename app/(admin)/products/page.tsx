import PageHeader from "@/components/page-header";
import ProductTable from "./_components/product-table";

const ProductsPage = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        description="Manage your product inventory and details"
      />
      <ProductTable />
    </div>
  );
};

export default ProductsPage;
