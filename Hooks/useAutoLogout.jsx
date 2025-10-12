import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Packages
import Swal from "sweetalert2";

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.expiry) {
        if (new Date().getTime() > userData.expiry) {
          localStorage.removeItem("user");
          Swal.fire({
            icon: "info",
            title: "Session Expired",
            text: "You have been logged out due to inactivity.",
            confirmButtonColor: "#6366F1",
          });
          navigate("/"); // Redirect to login
        }
      }
    }, 1000); // check every second

    return () => clearInterval(interval);
  }, [navigate]);
};

export default useAutoLogout;
