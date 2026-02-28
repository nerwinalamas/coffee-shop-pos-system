import PageTransition from "@/components/page-transition";
import SalesReportTable from "./_components/sales-report-table";

const SalesPage = () => {
  return (
    <PageTransition>
      <SalesReportTable />;
    </PageTransition>
  );
};

export default SalesPage;
