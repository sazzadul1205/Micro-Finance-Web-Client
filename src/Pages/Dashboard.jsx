import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Dashboard = () => {
  const axiosPublic = useAxiosPublic();
  const user = JSON.parse(localStorage.getItem("User"));

  // Fetch User Data By Phone
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UserData", user.phone],
    queryFn: () =>
      axiosPublic.get(`/Users/Phone/${user.phone}`).then((res) => res.data),
    enabled: !!user.phone,
  });

  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p>Error fetching user data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        <strong>Name:</strong> {userData?.name || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {userData?.email || "N/A"}
      </p>
      <p>
        <strong>Phone:</strong> {userData?.phone || "N/A"}
      </p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Dashboard;
