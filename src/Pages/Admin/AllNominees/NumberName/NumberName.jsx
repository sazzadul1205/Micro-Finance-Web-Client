import PropTypes from "prop-types";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const NumberName = ({ phone }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch data
  const {
    data: Names,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Names", phone],
    queryFn: () =>
      axiosPublic.get(`/Users/NameByPhone/${phone}`).then((res) => res.data),
  });

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Unknown</div>;
  }

  // Render
  return <div>{Names?.name}</div>;
};

// Prop validation
NumberName.propTypes = {
  phone: PropTypes.string.isRequired,
};

export default NumberName;
