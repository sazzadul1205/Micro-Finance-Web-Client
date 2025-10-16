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
    <div className="w-full">
      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block w-full rounded-lg shadow-lg border border-gray-200">
        <table className="table w-full">
          <thead className="bg-purple-600 text-white uppercase text-sm tracking-wider">
            <tr>
              <th className="py-4 px-6">#</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Loan Type</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Duration</th>
              <th className="py-4 px-6">Repayment</th>
              <th className="py-4 px-6">Installment</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
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
                    <td className="py-4 px-6">{index + 1}</td>
                    <td className="font-semibold">
                      <NumberName phone={loan?.phone} />
                    </td>
                    <td className="py-4 px-6">{loanTypeMap[loan.loan_type]}</td>
                    <td className="py-4 px-6">
                      ৳ {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
                    </td>
                    <td className="py-4 px-6">
                      {durationMap[loan.loan_duration]}
                    </td>
                    <td className="py-4 px-6">
                      {repaymentMap[loan.repayment_method]}
                    </td>
                    <td className="py-4 px-6">
                      ৳{" "}
                      {parseFloat(loan.installment_amount).toLocaleString(
                        "en-BD"
                      )}
                    </td>
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
                    <td className="py-4 px-6 text-center">
                      {["requested", "accepted"].includes(status) && (
                        <div className="flex justify-center gap-3 flex-wrap">
                          {status === "requested" && (
                            <>
                              <button
                                onClick={() => handleAction(loan._id, "accept")}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer"
                              >
                                <FaCheck /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(loan._id, "reject")}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition cursor-pointer"
                              >
                                <FaTimes /> Reject
                              </button>
                            </>
                          )}
                          {status === "accepted" && (
                            <button
                              onClick={() => handleAction(loan._id, "fullPaid")}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition cursor-pointer"
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

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4 p-1 md:p-2">
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 py-8 mx-auto w-full">
            <FaInbox size={36} className="text-gray-400" />
            <span className="text-lg font-medium text-gray-600">
              No data found
            </span>
          </div>
        ) : (
          data.map((loan, index) => {
            const status = loan.status?.toLowerCase();
            return (
              <div
                key={loan._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">#{index + 1}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Name:</strong> <NumberName phone={loan?.phone} />
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Loan Type:</strong> {loanTypeMap[loan.loan_type]}
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Amount:</strong> ৳{" "}
                  {parseFloat(loan.loan_amount).toLocaleString("en-BD")}
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Duration:</strong> {durationMap[loan.loan_duration]}
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Repayment:</strong>{" "}
                  {repaymentMap[loan.repayment_method]}
                </div>

                {/*  */}
                <div className="text-sm">
                  <strong>Installment:</strong> ৳{" "}
                  {parseFloat(loan.installment_amount).toLocaleString("en-BD")}
                </div>

                {["requested", "accepted"].includes(status) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {status === "requested" && (
                      <>
                        <button
                          onClick={() => handleAction(loan._id, "accept")}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() => handleAction(loan._id, "reject")}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                        >
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                    {status === "accepted" && (
                      <button
                        onClick={() => handleAction(loan._id, "fullPaid")}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                      >
                        <FaMoneyBillWave /> Full Paid
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
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
