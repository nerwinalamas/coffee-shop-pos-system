import Menu from "./_components/menu";
import OrderDetails from "./_components/order-details";

const Home = () => {
  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 h-screen p-4">
      <Menu />
      <OrderDetails />
    </div>
  );
};

export default Home;
