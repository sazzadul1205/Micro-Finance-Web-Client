import { Outlet } from "react-router-dom";

// Shared
import Navbar from "../Shared/Navbar";

const AdminLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <Outlet />
    </div>
  );
};

export default AdminLayout;
