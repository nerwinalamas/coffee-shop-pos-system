import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ActivityLogsTable from "@/components/activity-logs-table";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: "Activity Logs - Coffee Shop POS",
  description: "View system activity logs",
};

const ActivityLogsPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Activity Logs"
          description="Track all user activities including product edits, deletions, transactions, and more."
        />
        <ActivityLogsTable />
      </div>
    </PageTransition>
  );
};

export default ActivityLogsPage;
