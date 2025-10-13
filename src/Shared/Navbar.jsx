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
    <div className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md flex justify-between items-center">
      {/* Title */}
      <div className="text-white text-xl font-bold">Naziur Rojman Website</div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-purple-600 font-semibold px-5 py-2 rounded-full hover:bg-purple-50 hover:scale-105 transition-transform duration-200 cursor-pointer"
      >
        লগ আউট
      </button>
    </div>
  );
};

export default Navbar;
