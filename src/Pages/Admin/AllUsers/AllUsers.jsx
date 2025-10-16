import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaTrash, FaInfoCircle } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Modal
import UsersDetailsModal from "./UsersDetailsModal/UsersDetailsModal";

const AllUsers = () => {
  const axiosPublic = useAxiosPublic();

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");

  // Selected User
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: allUsers,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: () => axiosPublic.get("/Users").then((res) => res.data),
  });

  // Filter out admins and apply search/blood filters
  const filteredUsers = allUsers
    ?.filter((user) => user.role !== "admin")
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchesBlood =
        !selectedBloodGroup || user.blood_group === selectedBloodGroup;

      return matchesSearch && matchesBlood;
    });

  // Handle Delete
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/Users/${userId}`);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });

        refetch();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete user.",
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    }
  };

  // Centered Loading
  if (isLoading)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/80 z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <span className="text-purple-700 font-semibold text-lg">
          Loading, please wait...
        </span>
      </div>
    );

  // Centered Error
  if (error)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-red-50 text-center border-t border-red-200 z-50">
        <BiSolidErrorAlt className="text-red-500 text-8xl mb-3" />
        <p className="text-red-600 font-bold text-xl mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-red-500 text-base max-w-md">
          {error?.message || "Unable to load data. Please try again later."}
        </p>
      </div>
    );

  return (
    <div className="p-1 md:p-6 text-black w-full">
      {/* Title */}
      <h1 className="text-purple-600 text-2xl font-bold text-center pt-3 md:pt-0 pb-5">
        All Users
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-6 mb-4 w-full">
        {/* Search by Name or Phone */}
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="mb-1 font-semibold text-gray-700">
            Search by Name or Phone
          </label>
          <input
            id="search"
            type="text"
            placeholder="Type name or phone..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Blood Group */}
        <div className="flex flex-col w-full md:w-1/6 mt-2 md:mt-0">
          <label
            htmlFor="bloodGroup"
            className="mb-1 font-semibold text-gray-700"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-lg shadow-lg border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            {/* Table Header */}
            <thead className="bg-purple-600 text-white uppercase text-sm tracking-wider">
              <tr>
                <th className="text-center">#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Father&apos;s Name</th>
                <th>Mother&apos;s Name</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-700">
              {filteredUsers?.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-purple-50 transition-colors duration-200"
                  >
                    <td className="text-center font-medium">{index + 1}</td>
                    <td className="font-semibold">{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.blood_group || "N/A"}</td>
                    <td>{user.fathers_name || "N/A"}</td>
                    <td>{user.mothers_name || "N/A"}</td>
                    <td className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          document
                            .getElementById("Users_Details_Modal")
                            ?.showModal();
                        }}
                        className="flex items-center gap-2 px-5 py-2 text-md bg-blue-500 text-white rounded-lg 
                            shadow-md hover:shadow-2xl hover:bg-blue-600 transition-transform duration-200 cursor-pointer"
                      >
                        <FaInfoCircle /> Details
                      </button>
                      <button
                        onClick={() => handleDelete(user?._id)}
                        className=" flex items-center gap-2 px-5 py-2 text-md bg-red-500 text-white rounded-lg 
                            shadow-md hover:shadow-2xl hover:bg-red-600 transition-transform duration-200 cursor-pointer"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4 p-1 md:p-2">
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow duration-200"
              >
                {/* User Index */}
                <div className="text-gray-500 text-sm mb-1">#{index + 1}</div>

                {/* User Info */}
                <div className="flex flex-col gap-1">
                  {/*  */}
                  <div className="text-sm">
                    <span className="font-semibold">Name:</span> {user.name}
                  </div>

                  {/*  */}
                  <div className="text-sm">
                    <span className="font-semibold">Phone:</span> {user.phone}
                  </div>

                  {/*  */}
                  <div className="text-sm">
                    <span className="font-semibold">Blood Group:</span>{" "}
                    {user.blood_group || "N/A"}
                  </div>

                  {/*  */}
                  <div className="text-sm">
                    <span className="font-semibold">Father&apos;s Name:</span>{" "}
                    {user.fathers_name || "N/A"}
                  </div>

                  {/*  */}
                  <div className="text-sm">
                    <span className="font-semibold">Mother&apos;s Name:</span>{" "}
                    {user.mothers_name || "N/A"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      document
                        .getElementById("Users_Details_Modal")
                        ?.showModal();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
                  >
                    <FaInfoCircle /> Details
                  </button>
                  <button
                    onClick={() => handleDelete(user?._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>

      {/* ---------- Modals ---------- */}
      {/* --------- User Details Modal --------- */}
      <dialog id="Users_Details_Modal" className="modal">
        <UsersDetailsModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </dialog>
    </div>
  );
};

export default AllUsers;
