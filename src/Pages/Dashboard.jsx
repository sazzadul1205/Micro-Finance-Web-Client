import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Dashboard = () => {
  // const axiosPublic = useAxiosPublic();
  const user = JSON.parse(localStorage.getItem("User"));

  // Fetch User Data By Phone
  // const {
  //   data: userData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["UserData", user.phone],
  //   queryFn: () =>
  //     axiosPublic.get(`/Users/Phone/${user.phone}`).then((res) => res.data),
  //   enabled: !!user.phone,
  // });

  // if (isLoading) return <p>Loading user data...</p>;
  // if (error) return <p>Error fetching user data</p>;

  return <div className="p-6"></div>;
};

export default Dashboard;
