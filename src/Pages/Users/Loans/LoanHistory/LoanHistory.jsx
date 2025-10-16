// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaInbox } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Lists
import { LoanTypeOptions } from "../../../../Shared/Lists/LoanTypeOptions";
import { repaymentOptions } from "../../../../Shared/Lists/repaymentOptions";
import { loanDurationOptions } from "../../../../Shared/Lists/loanDurationOptions";

const LoanHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

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

  return (
    <div className="text-black">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-700 mb-3 pt-4 md:pt-0">
        ঋণ ইতিহাস
      </h2>

      {/* Loan Table — Responsive Version */}
      <div className="w-full">
        {/*  Desktop / Tablet View */}
        <div className="hidden sm:block overflow-x-auto">
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
              {/* Default Message */}
              {loanRequests?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white rounded-lg">
                    <div className="flex flex-col items-center justify-center gap-2 py-8 mx-auto w-full">
                      {/* Default Icon */}
                      <FaInbox size={36} className="text-gray-400" />

                      {/* Default Message */}
                      <span className="text-lg font-medium text-gray-600">
                        কোন তথ্য নেই
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                // Loan Requests
                loanRequests?.map((loan, index) => (
                  <tr
                    key={loan._id}
                    className="hover:bg-gray-50 transition-colors duration-150 bg-white border-b border-gray-300 cursor-pointer"
                  >
                    {/* Table Index */}
                    <td className="py-4 px-6">{index + 1}</td>

                    {/* Loan Type */}
                    <td className="py-4 px-6">{loanTypeMap[loan.loan_type]}</td>

                    {/* Loan Amount */}
                    <td className="py-4 px-6">
                      ৳ {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
                    </td>

                    {/* Loan Duration */}
                    <td className="py-4 px-6">
                      {durationMap[loan.loan_duration]}
                    </td>

                    {/* Repayment Method */}
                    <td className="py-4 px-6">
                      {repaymentMap[loan.repayment_method]}
                    </td>

                    {/* Installment */}
                    <td className="py-4 px-6">
                      ৳{" "}
                      {parseFloat(loan.installment_amount).toLocaleString(
                        "en-BD"
                      )}
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
                              return loan.status;
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

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {/* Default Message */}
          {loanRequests?.length === 0 ? (
            // Empty Card
            <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 py-8 mx-auto w-full">
              {/* Inbox Icon */}
              <FaInbox size={36} className="text-gray-400" />

              {/* Text */}
              <span className="text-lg font-medium text-gray-600">
                কোন তথ্য নেই
              </span>
            </div>
          ) : (
            loanRequests?.map((loan, index) => (
              <div
                key={loan._id}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  {/* Loan Number */}
                  <span className="text-sm text-gray-500 font-semibold">
                    #{index + 1}
                  </span>

                  {/* Status */}
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
                          return loan.status;
                      }
                    })()}
                  </span>
                </div>

                {/* Loan Details */}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">ঋণের ধরন:</span>{" "}
                  {loanTypeMap[loan.loan_type]}
                </p>

                {/* Loan Amount */}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">পরিমাণ:</span> ৳{" "}
                  {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
                </p>

                {/* Loan Duration */}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">মেয়াদ:</span>{" "}
                  {durationMap[loan.loan_duration]}
                </p>

                {/* Repayment Method */}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">পরিশোধ পদ্ধতি:</span>{" "}
                  {repaymentMap[loan.repayment_method]}
                </p>

                {/* Installment */}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">কিস্তি:</span> ৳{" "}
                  {parseFloat(loan.installment_amount).toLocaleString("en-BD")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanHistory;
