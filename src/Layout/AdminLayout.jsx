import { Outlet, NavLink } from "react-router-dom";

// Icons
import {
  FaUsers,
  FaUserFriends,
  FaMoneyCheckAlt,
  FaCogs,
} from "react-icons/fa";

// Shared
import AdminNav from "../Shared/AdminNav";

const AdminLayout = () => {
  // Sidebar Links
  const sidebarLinks = [
    { name: "All Users", path: "/Admin/AllUsers", icon: <FaUsers /> },
    {
      name: "All Nominees",
      path: "/Admin/AllNominees",
      icon: <FaUserFriends />,
    },
    {
      name: "Loan Management",
      path: "/Admin/LoanManagement",
      icon: <FaMoneyCheckAlt />,
    },
    { name: "Settings", path: "/Admin/Settings", icon: <FaCogs /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      {/* Main Content */}
      <main className="flex flex-1 ">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-6 text-xl font-bold text-purple-600 border-b border-gray-200">
            Admin Options
          </div>

          {/* Sidebar Links */}
          <nav className="mt-6 flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-6 text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                    isActive ? "bg-purple-100 text-purple-600" : ""
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Outlet */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
