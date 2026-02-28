import PageTransition from "@/components/page-transition";
import TransactionHistoryTable from "./_components/transaction-history-table";

const TransactionsPage = () => {
  return (
    <PageTransition>
      <TransactionHistoryTable />;
    </PageTransition>
  );
};

export default TransactionsPage;
