import PageTransition from "@/components/page-transition";
import InventoryTable from "./_components/inventory-table";

const InventoryPage = () => {
  return (
    <PageTransition>
      <InventoryTable />
    </PageTransition>
  );
};

export default InventoryPage;
