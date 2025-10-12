import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar";

const MainLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <Outlet />
    </div>
  );
};

export default MainLayout;
