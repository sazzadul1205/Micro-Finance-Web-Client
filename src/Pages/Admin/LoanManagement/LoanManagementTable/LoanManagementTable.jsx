// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { FaInbox } from "react-icons/fa";
import { FaCheck, FaTimes, FaMoneyBillWave } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Components
import NumberName from "../../AllNominees/NumberName/NumberName";

const LoanManagementTable = ({
  data,
  refetch,
  LoanTypeOptions,
  repaymentOptions,
  loanDurationOptions,
}) => {
  const axiosPublic = useAxiosPublic();

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

  // Function to handle actions
  const handleAction = async (id, action) => {
    // Define status mappings
    const statusMap = {
      accept: "accepted",
      reject: "rejected",
      fullPaid: "full paid",
    };

    // Get the new status
    const newStatus = statusMap[action];

    // Validate action
    if (!newStatus) {
      console.warn(`Invalid action: ${action}`);
      return;
    }

    // Update loan status
    try {
      // Send request
      const response = await axiosPublic.put(`/LoanRequest/Status/${id}`, {
        status: newStatus,
      });

      // Handle response
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Loan status updated to "${newStatus}"`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Refetch
        refetch();
      } else {
        // Handle error
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      // Handle error
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update loan status. Please try again.",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {/* Table Header */}
        <thead>
          <tr className="text-white uppercase text-xs text-left tracking-wider bg-purple-600">
            <th className="py-4 px-6">#</th>
            <th className="py-4 px-6">Name</th>
            <th className="py-4 px-6">Loan Type</th>
            <th className="py-4 px-6">Amount</th>
            <th className="py-4 px-6">Duration</th>
            <th className="py-4 px-6">Repayment Method</th>
            <th className="py-4 px-6">Installment</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6 text-center">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 py-8 mx-auto w-full">
                  <FaInbox size={36} className="text-gray-400" />
                  <span className="text-lg font-medium text-gray-600">
                    No data found
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((loan, index) => {
              const status = loan.status?.toLowerCase();

              return (
                <tr
                  key={loan._id}
                  className="hover:bg-gray-50 transition-colors duration-150 bg-white border-b border-gray-300"
                >
                  {/* Index */}
                  <td className="py-4 px-6">{index + 1}</td>

                  {/* Name */}
                  <td className="font-semibold">
                    <NumberName phone={loan?.phone} />
                  </td>

                  {/* Loan Type */}
                  <td className="py-4 px-6">{loanTypeMap[loan.loan_type]}</td>

                  {/* Amount */}
                  <td className="py-4 px-6">
                    ৳ {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
                  </td>

                  {/* Duration */}
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
                        status === "requested"
                          ? "bg-yellow-100 text-yellow-800"
                          : status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : status === "paying"
                          ? "bg-blue-100 text-blue-800"
                          : status === "full paid"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {status === "requested"
                        ? "Pending"
                        : status === "accepted"
                        ? "Accepted"
                        : status === "rejected"
                        ? "Rejected"
                        : status === "paying"
                        ? "In Progress"
                        : status === "full paid"
                        ? "Fully Paid"
                        : loan.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    {["requested", "accepted"].includes(status) && (
                      <div className="flex justify-center gap-3">
                        {status === "requested" && (
                          <>
                            {/* Accept Button */}
                            <button
                              onClick={() => handleAction(loan._id, "accept")}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer "
                            >
                              <FaCheck /> Accept
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => handleAction(loan._id, "reject")}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition cursor-pointer "
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        )}

                        {/* Full Paid Button */}
                        {status === "accepted" && (
                          <button
                            onClick={() => handleAction(loan._id, "fullPaid")}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition cursor-pointer "
                          >
                            <FaMoneyBillWave /> Full Paid
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// Prop Vallation
LoanManagementTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      phone: PropTypes.string,
      loan_type: PropTypes.string,
      loan_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      loan_duration: PropTypes.string,
      repayment_method: PropTypes.string,
      installment_amount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      status: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func.isRequired,
  LoanTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  repaymentOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  loanDurationOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LoanManagementTable;
