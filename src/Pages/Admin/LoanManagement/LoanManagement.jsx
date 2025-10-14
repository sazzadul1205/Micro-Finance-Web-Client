import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { BiSolidErrorAlt } from "react-icons/bi";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Components
import LoanManagementTable from "./LoanManagementTable/LoanManagementTable";

// Lists
import { LoanTypeOptions } from "../../../Shared/Lists/LoanTypeOptions";
import { repaymentOptions } from "../../../Shared/Lists/repaymentOptions";
import { loanDurationOptions } from "../../../Shared/Lists/loanDurationOptions";

const LoanManagement = () => {
  const axiosPublic = useAxiosPublic();

  // Selected Tab
  const [activeTab, setActiveTab] = useState("pending");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedRepayment, setSelectedRepayment] = useState("");

  // Fetch loan requests
  const {
    data: LoanRequestData = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["LoanRequestData"],
    queryFn: () => axiosPublic.get("/LoanRequest").then((res) => res.data),
  });

  // Filter loans by status for tabs
  const pendingLoans = LoanRequestData?.filter(
    (loan) => loan.status?.trim().toLowerCase() === "requested"
  );
  const acceptedLoans = LoanRequestData?.filter(
    (loan) => loan.status?.trim().toLowerCase() === "accepted"
  );
  const rejectedLoans = LoanRequestData?.filter(
    (loan) => loan.status?.trim().toLowerCase() === "rejected"
  );
  const fullPaidLoans = LoanRequestData?.filter(
    (loan) => loan.status?.trim().toLowerCase() === "full paid"
  );

  const rejectedAcceptedLoans = [...acceptedLoans, ...rejectedLoans];

  // Function to apply filters
  const applyFilters = (loans) => {
    return loans.filter((loan) => {
      const matchesName =
        loan.user_name
          ?.toLowerCase()
          ?.includes(searchTerm.trim().toLowerCase()) ?? true;

      const matchesLoanType =
        selectedLoanType === "" || loan.loan_type === selectedLoanType;

      const matchesDuration =
        selectedDuration === "" || loan.loan_duration === selectedDuration;

      const matchesRepayment =
        selectedRepayment === "" || loan.repayment_method === selectedRepayment;

      return (
        matchesName && matchesLoanType && matchesDuration && matchesRepayment
      );
    });
  };

  // Centered Loading
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <span className="text-purple-700 font-semibold text-lg">
          Loading, please wait...
        </span>
      </div>
    );

  // Centered Error
  if (error)
    return (
      <div className="flex flex-col justify-center items-center bg-red-50 text-center border-t border-red-200 w-full">
        <BiSolidErrorAlt className="text-red-500 text-8xl" />
        <p className="text-red-600 font-bold text-xl mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-red-500 text-base max-w-md">
          {error?.message || "Unable to load data. Please try again later."}
        </p>
      </div>
    );

  // Filtered datasets for tabs
  const filteredPending = applyFilters(pendingLoans);
  const filteredRejectedAccepted = applyFilters(rejectedAcceptedLoans);
  const filteredFullPaid = applyFilters(fullPaidLoans);

  return (
    <div className="p-6 text-black w-full">
      <h1 className="text-purple-600 text-2xl font-bold text-center pb-5">
        All Loans
      </h1>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Search by Name</label>
          <input
            type="text"
            placeholder="Enter user name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loan Type */}
        <div>
          <label className="block font-semibold mb-1">Loan Type</label>
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={selectedLoanType}
            onChange={(e) => setSelectedLoanType(e.target.value)}
          >
            <option value="">All Types</option>
            {LoanTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold mb-1">Loan Duration</label>
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
          >
            <option value="">All Durations</option>
            {loanDurationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Repayment */}
        <div>
          <label className="block font-semibold mb-1">Repayment Method</label>
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={selectedRepayment}
            onChange={(e) => setSelectedRepayment(e.target.value)}
          >
            <option value="">All Methods</option>
            {repaymentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 bg-gray-100 p-2 rounded-xl shadow-inner mb-6">
        {/* Pending Button */}
        <button
          className={`flex-1 py-2 font-semibold rounded-lg transition-all duration-200 text-center cursor-pointer ${
            activeTab === "pending"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>

        {/* Rejected / Accepted Button */}
        <button
          className={`flex-1 py-2 font-semibold rounded-lg transition-all duration-200 text-center cursor-pointer ${
            activeTab === "rejectedAccepted"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          }`}
          onClick={() => setActiveTab("rejectedAccepted")}
        >
          Rejected / Accepted
        </button>

        {/* Full Paid Button */}
        <button
          className={`flex-1 py-2 font-semibold rounded-lg transition-all duration-200 text-center cursor-pointer ${
            activeTab === "fullPaid"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          }`}
          onClick={() => setActiveTab("fullPaid")}
        >
          Full Paid
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "pending" && (
          <LoanManagementTable
            refetch={refetch}
            data={filteredPending}
            LoanTypeOptions={LoanTypeOptions}
            repaymentOptions={repaymentOptions}
            loanDurationOptions={loanDurationOptions}
          />
        )}
        {activeTab === "rejectedAccepted" && (
          <LoanManagementTable
            refetch={refetch}
            data={filteredRejectedAccepted}
            LoanTypeOptions={LoanTypeOptions}
            repaymentOptions={repaymentOptions}
            loanDurationOptions={loanDurationOptions}
          />
        )}
        {activeTab === "fullPaid" && (
          <LoanManagementTable
            refetch={refetch}
            data={filteredFullPaid}
            LoanTypeOptions={LoanTypeOptions}
            repaymentOptions={repaymentOptions}
            loanDurationOptions={loanDurationOptions}
          />
        )}
      </div>
    </div>
  );
};

export default LoanManagement;
