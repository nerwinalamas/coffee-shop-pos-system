import Menu from "./_components/menu";
import OrderDetails from "./_components/order-details";

const Home = () => {
  const isLoggedIn = true;

  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 h-screen p-4">
      {isLoggedIn ? (
        <>
          <Menu />
          <OrderDetails />
        </>
      ) : (
        // POS login page
        <div className="col-span-full bg-white rounded-lg shadow-sm h-full p-4 space-y-4 max-h-screen"></div>
      )}
    </div>
  );
};

export default Home;
