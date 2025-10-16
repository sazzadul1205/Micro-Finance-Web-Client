import axios from "axios";

const axiosPublic = axios.create({
  // baseURL: "http://localhost:5000",
  // baseURL: "http://192.168.0.3:5000",
  baseURL: "https://naziur-rahman-server.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
