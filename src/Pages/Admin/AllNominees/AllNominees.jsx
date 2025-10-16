import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaTrash, FaInfoCircle } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Components
import NumberName from "./NumberName/NumberName";

// Modal
import NomineeDetailsModal from "./NomineeDetailsModal/NomineeDetailsModal";

const AllNominees = () => {
  const axiosPublic = useAxiosPublic();

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");

  // Selected User
  const [selectedUser, setSelectedUser] = useState(null);

  // Nominees APIs
  const {
    data: allNominees,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["AllNominees"],
    queryFn: () => axiosPublic.get("/NomineeInfo").then((res) => res.data),
  });

  // Filter nominees by search term and relation
  const filteredNominees = allNominees?.filter((nominee) => {
    const matchesSearch = [nominee.nominee_name, nominee.nominee_phone]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRelation =
      !selectedRelation || nominee.relation === selectedRelation;

    return matchesSearch && matchesRelation;
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
        await axiosPublic.delete(`/NomineeInfo/${userId}`);

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
        All Nominees
      </h1>

      {/*  Filters  */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        {/* Search Input */}
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="mb-1 font-semibold text-gray-700">
            Search by Name or Phone
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter name or phone..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Relation Filter */}
        <div className="flex flex-col w-full md:w-1/4">
          <label
            htmlFor="relation"
            className="mb-1 font-semibold text-gray-700"
          >
            Filter by Relation
          </label>
          <select
            id="relation"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
          >
            <option value="">All Relations</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="brother">Brother</option>
            <option value="sister">Sister</option>
            <option value="spouse">Spouse</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-lg shadow-lg border border-gray-200">
        {/* Table for Desktop */}
        <div className="hidden md:block overflow-x-auto w-full rounded-lg shadow-lg border border-gray-200">
          <table className="table w-full">
            <thead className="bg-purple-600 text-white uppercase text-sm tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b text-center">#</th>
                <th className="px-4 py-3 border-b">User Name</th>
                <th className="px-4 py-3 border-b">Nominee Name</th>
                <th className="px-4 py-3 border-b">Phone</th>
                <th className="px-4 py-3 border-b">Relation</th>
                <th className="px-4 py-3 border-b">NID</th>
                <th className="px-4 py-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredNominees.length > 0 ? (
                filteredNominees.map((nominee, index) => (
                  <tr
                    key={nominee._id}
                    className="hover:bg-purple-50 transition-colors duration-200"
                  >
                    <td className="text-center font-medium">{index + 1}</td>
                    <td className="font-semibold">
                      <NumberName phone={nominee?.user_phone} />
                    </td>
                    <td className="font-semibold">{nominee.nominee_name}</td>
                    <td>{nominee.nominee_phone}</td>
                    <td>{nominee.relation}</td>
                    <td>{nominee.nominee_nid}</td>
                    <td className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(nominee);
                          document
                            .getElementById("Nominee_Details_Modal")
                            ?.showModal();
                        }}
                        className="flex items-center gap-2 px-5 py-2 text-md bg-blue-500 text-white rounded-lg shadow-md hover:shadow-2xl hover:bg-blue-600 transition-transform duration-200 cursor-pointer"
                      >
                        <FaInfoCircle /> Details
                      </button>
                      <button
                        onClick={() => handleDelete(nominee?._id)}
                        className="flex items-center gap-2 px-5 py-2 text-md bg-red-500 text-white rounded-lg shadow-md hover:shadow-2xl hover:bg-red-600 transition-transform duration-200 cursor-pointer"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No nominees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {filteredNominees.length > 0 ? (
            filteredNominees.map((nominee, index) => (
              <div
                key={nominee._id}
                className="bg-white rounded-lg shadow-md p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-700">
                    {nominee.nominee_name}
                  </p>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>User:</strong>{" "}
                  <NumberName phone={nominee?.user_phone} />
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {nominee.nominee_phone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Relation:</strong> {nominee.relation}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>NID:</strong> {nominee.nominee_nid}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setSelectedUser(nominee);
                      document
                        .getElementById("Nominee_Details_Modal")
                        ?.showModal();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    <FaInfoCircle /> Details
                  </button>
                  <button
                    onClick={() => handleDelete(nominee?._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 transition-all cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
              No nominees found.
            </div>
          )}
        </div>
      </div>

      {/* ----- Modals ----- */}
      {/*  ----- User Details Modal -----  */}
      <dialog id="Nominee_Details_Modal" className="modal">
        <NomineeDetailsModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </dialog>
    </div>
  );
};

export default AllNominees;
