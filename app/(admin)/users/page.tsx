import PageTransition from "@/components/page-transition";
import UserTable from "./_components/user-table";

const UsersPage = () => {
  return (
    <PageTransition>
      <UserTable />;
    </PageTransition>
  );
};

export default UsersPage;
