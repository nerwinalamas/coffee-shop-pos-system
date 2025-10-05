import PageHeader from "@/components/page-header";
import InventoryTable from "./_components/inventory-table";

const InventoryPage = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Inventory"
        description="Track and manage your stock levels"
      />
      <InventoryTable />
    </div>
  );
};

export default InventoryPage;
