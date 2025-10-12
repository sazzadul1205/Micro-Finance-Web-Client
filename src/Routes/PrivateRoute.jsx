import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in
    return <Navigate to="/Login" replace />;
  }

  if (new Date().getTime() > user.expiry) {
    // Session expired
    localStorage.removeItem("user");
    Swal.fire({
      icon: "info",
      title: "Session Expired",
      text: "You have been logged out due to inactivity.",
      confirmButtonColor: "#6366F1",
    });
    return <Navigate to="/Login" replace />;
  }

  return children; // Session valid, render the component
};

export default PrivateRoute;
