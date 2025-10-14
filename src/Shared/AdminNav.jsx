import { useNavigate } from "react-router-dom";

// Packages
import Swal from "sweetalert2";

const AdminNav = () => {
  // Hooks
  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: "আপনি কি লগ আউট করতে চান?",
      text: "লগ আউট করলে আবার লগইন করতে হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, লগ আউট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");

        Swal.fire({
          title: "লগ আউট সম্পন্ন!",
          text: "আপনি সফলভাবে লগ আউট করেছেন।",
          icon: "success",
          confirmButtonColor: "#6366F1",
          confirmButtonText: "ঠিক আছে",
        }).then(() => {
          navigate("/Login");
        });
      }
    });
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
      {/* Left: Title */}
      <div className="text-white text-xl font-bold md:text-2xl">
        Naziur Rojman Banking Website
      </div>

      {/* Center: Role/Info */}
      <div className="text-white text-lg font-medium text-center md:text-xl">
        Admin Dashboard
      </div>

      {/* Right: Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-purple-600 font-semibold px-10 py-2 rounded-xl hover:bg-gray-200 transition-transform duration-200 shadow-md hover:shadow-2xl cursor-pointer"
      >
        লগ আউট
      </button>
    </nav>
  );
};

export default AdminNav;
