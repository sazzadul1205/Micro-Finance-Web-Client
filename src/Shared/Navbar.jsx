import { useNavigate } from "react-router-dom";

// Packages
import Swal from "sweetalert2";

const Navbar = () => {
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
    <nav className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md px-5 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-center md:text-left">
      {/* Title */}
      <div className="text-white text-lg md:text-2xl font-bold">
        Naziur Rojman Banking Website
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-purple-600 font-semibold px-8 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer w-full md:w-auto"
      >
        লগ আউট
      </button>
    </nav>
  );
};

export default Navbar;
