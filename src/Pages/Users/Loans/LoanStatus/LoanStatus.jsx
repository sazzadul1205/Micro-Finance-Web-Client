import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaInbox } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Lists
import { LoanTypeOptions } from "../../../../Shared/Lists/LoanTypeOptions";
import { repaymentOptions } from "../../../../Shared/Lists/repaymentOptions";
import { loanDurationOptions } from "../../../../Shared/Lists/loanDurationOptions";

const LoanStatus = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  // Tabs
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch loan requests by phone
  const { data: loanRequests = [], isLoading } = useQuery({
    queryKey: ["LoanRequest", user?.phone],
    queryFn: () =>
      axiosPublic
        .get(`/LoanRequest/Phone/${user?.phone}`)
        .then((res) => res.data),
    enabled: !!user?.phone,
  });

  // Loading
  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // Filter data for tabs (case-insensitive)
  const pendingLoans = loanRequests.filter(
    (loan) => loan.status?.trim().toLowerCase() === "requested"
  );

  const acceptedLoans = loanRequests.filter(
    (loan) => loan.status?.trim().toLowerCase() === "accepted"
  );

  const rejectedLoans = loanRequests.filter(
    (loan) => loan.status?.trim().toLowerCase() === "rejected"
  );

  const fullPaidLoans = loanRequests.filter(
    (loan) => loan.status?.trim().toLowerCase() === "full paid"
  );

  // Combine Rejected / Accepted tab
  const rejectedAcceptedLoans = [...rejectedLoans, ...acceptedLoans];

  return (
    <div className="p-2 text-black">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-2">
        ঋণের অবস্থা
      </h2>

      {/* Tabs */}
      <div className="flex space-x-3 bg-gray-100 p-2 rounded-xl shadow-inner mb-6">
        {/* Pending */}
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

        {/* Rejected / Accepted */}
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

        {/* Full Paid */}
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
        {activeTab === "pending" && renderTable(pendingLoans)}
        {activeTab === "rejectedAccepted" && renderTable(rejectedAcceptedLoans)}
        {activeTab === "fullPaid" && renderTable(fullPaidLoans)}
      </div>
    </div>
  );
};

export default LoanStatus;

// Helper to map loan type values to Bangla labels
const loanTypeMap = Object.fromEntries(
  LoanTypeOptions.map((opt) => [opt.value, opt.label])
);

// Helper to map repayment method values to Bangla
const repaymentMap = Object.fromEntries(
  repaymentOptions.map((opt) => [opt.value, opt.label])
);

// Helper to map loan duration values to Bangla
const durationMap = Object.fromEntries(
  loanDurationOptions.map((opt) => [opt.value, opt.label])
);

const renderTable = (data) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      {/* Table Header */}
      <thead>
        <tr className="text-white uppercase text-xs text-left tracking-wider bg-purple-600">
          <th className="py-4 px-6">#</th>
          <th className="py-4 px-6">ঋণের ধরন</th>
          <th className="py-4 px-6">পরিমাণ</th>
          <th className="py-4 px-6">মেয়াদ</th>
          <th className="py-4 px-6">পরিশোধ পদ্ধতি</th>
          <th className="py-4 px-6">কিস্তি</th>
          <th className="py-4 px-6">অবস্থা</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {data.length === 0 ? (
          // No data Found
          <tr>
            <td colSpan={7}>
              <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 py-8 mx-auto w-full">
                <FaInbox size={36} className="text-gray-400" />
                <span className="text-lg font-medium text-gray-600">
                  কোন তথ্য নেই
                </span>
              </div>
            </td>
          </tr>
        ) : (
          data.map((loan, index) => (
            // Table Row
            <tr
              key={loan._id}
              className="hover:bg-gray-50 transition-colors duration-150 bg-white border-b border-gray-300"
            >
              {/* Table Cells */}
              <td className="py-4 px-6">{index + 1}</td>

              {/* Loan Type */}
              <td className="py-4 px-6">{loanTypeMap[loan.loan_type]}</td>

              {/* Loan Amount */}
              <td className="py-4 px-6">
                ৳ {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
              </td>

              {/* Loan Duration */}
              <td className="py-4 px-6">{durationMap[loan.loan_duration]}</td>

              {/* Repayment Method */}
              <td className="py-4 px-6">
                {repaymentMap[loan.repayment_method]}
              </td>

              {/* Installment */}
              <td className="py-4 px-6">
                ৳ {parseFloat(loan.installment_amount).toLocaleString("en-BD")}
              </td>

              {/* Status */}
              <td className="py-4 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    loan.status?.toLowerCase() === "requested"
                      ? "bg-yellow-100 text-yellow-800"
                      : loan.status?.toLowerCase() === "accepted"
                      ? "bg-green-100 text-green-800"
                      : loan.status?.toLowerCase() === "rejected"
                      ? "bg-red-100 text-red-800"
                      : loan.status?.toLowerCase() === "paying"
                      ? "bg-blue-100 text-blue-800"
                      : loan.status?.toLowerCase() === "full paid"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {(() => {
                    const status = loan.status?.toLowerCase();
                    switch (status) {
                      case "requested":
                        return "বিচারাধীন";
                      case "accepted":
                        return "গ্রহণযোগ্য";
                      case "rejected":
                        return "প্রত্যাখ্যাত";
                      case "paying":
                        return "পরিশোধ প্রক্রিয়াধীন";
                      case "full paid":
                        return "সম্পূর্ণ পরিশোধিত";
                      default:
                        return loan.status; // fallback
                    }
                  })()}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
