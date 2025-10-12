const Navbar = () => {
  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user");

    // Optionally, show a message
    alert("আপনি লগ আউট করেছেন!");

    // Redirect to login page
    window.location.href = "/Login";
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
