import { FiShare2 } from "react-icons/fi";
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

  // Share Handler
  const handleShare = async () => {
    const shareData = {
      title: "Naziur Rojman Banking Website",
      text: "Check out this banking website!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Website link copied to clipboard!");
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md px-5 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3 text-center md:text-left relative">
      {/* Left: Title */}
      <div className="text-white text-md md:text-2xl font-bold">
        Naziur Rojman Banking Website
      </div>

      {/* Center: Role/Info */}
      <div className="text-white font-medium text-center text-sm md:text-xl">
        Admin Dashboard
      </div>

      {/* Buttons Container */}
      <div className="flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-white text-purple-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <FiShare2 className="w-5 h-5" />
          Share
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-purple-600 font-semibold px-8 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          লগ আউট
        </button>
      </div>

      {/* Mobile Menu Button — bottom-right inside navbar */}
      <label
        htmlFor="mobile-drawer"
        className="absolute z-10 -bottom-6 right-1 md:hidden bg-purple-700 text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-purple-800 transition-all duration-200"
        aria-label="Open Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>
    </nav>
  );
};

export default AdminNav;
