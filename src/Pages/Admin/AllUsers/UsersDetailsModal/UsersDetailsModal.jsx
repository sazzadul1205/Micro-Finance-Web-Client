// Icons
import { ImCross } from "react-icons/im";

// Packages
import PropTypes from "prop-types";

const UsersDetailsModal = ({ selectedUser, setSelectedUser }) => {
  if (!selectedUser) return null;

  // Close Modal
  const handleClose = () => {
    document.getElementById("Users_Details_Modal").close();
    setSelectedUser("");
  };

  const {
    name,
    phone,
    blood_group,
    fathers_name,
    mothers_name,
    job,
    nid_number,
    permanent_address,
    temporary_address,
    passportPhoto,
    nidFront,
    nidBack,
    signature,
    BillInfo,
  } = selectedUser;

  return (
    <div
      id="Users_Details_Modal"
      className="modal-box relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-full sm:max-w-xl md:max-w-3xl mx-auto max-h-[90vh] p-4 sm:p-6 text-black overflow-y-auto"
    >
      {/* Header */}
      <div>
        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Title */}
        <h3 className="font-bold text-lg sm:text-xl text-center mb-4 pt-5 md:pt-0">
          User Details
        </h3>
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-purple-600 mb-4" />

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Blood Group:</strong> {blood_group}
        </p>
        <p>
          <strong>Job:</strong> {job}
        </p>
        <p>
          <strong>Father’s Name:</strong> {fathers_name}
        </p>
        <p>
          <strong>Mother’s Name:</strong> {mothers_name}
        </p>
        <p>
          <strong>NID Number:</strong> {nid_number}
        </p>
      </div>

      {/* Address Info */}
      <div className="mb-4">
        <h4 className="font-semibold text-purple-700 mb-2">
          Address Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p>
              <strong>Permanent Address:</strong>
            </p>
            <p className="text-gray-700">{permanent_address}</p>
          </div>
          <div>
            <p>
              <strong>Temporary Address:</strong>
            </p>
            <p className="text-gray-700">{temporary_address}</p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-4">
        <h4 className="font-semibold text-purple-700 mb-3">Documents</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">Passport</p>
            <img
              src={passportPhoto}
              alt="Passport"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">NID Front</p>
            <img
              src={nidFront}
              alt="NID Front"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">NID Back</p>
            <img
              src={nidBack}
              alt="NID Back"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
            />
          </div>
          <div className="flex flex-col items-center col-span-2 sm:col-span-1">
            <p className="text-sm font-medium mb-1">Signature</p>
            <img
              src={signature}
              alt="Signature"
              className="w-full h-[200px] object-contain rounded-md border shadow"
            />
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div>
        <h4 className="font-semibold text-purple-700 mb-3">
          Billing Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BillInfo?.map((bill, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow hover:shadow-2xl"
            >
              <p className="font-semibold text-lg pb-5">
                {bill.payment_method}
              </p>
              {bill.account_holder_name && (
                <p>
                  <strong>Account Holder:</strong> {bill.account_holder_name}
                </p>
              )}
              {bill.mobile_number && (
                <p>
                  <strong>Mobile:</strong> {bill.mobile_number}
                </p>
              )}
              {bill.bank_name && (
                <p>
                  <strong>Bank:</strong> {bill.bank_name}
                </p>
              )}
              {bill.account_number && (
                <p>
                  <strong>Account No:</strong> {bill.account_number}
                </p>
              )}
              {bill.branch_name && (
                <p>
                  <strong>Branch:</strong> {bill.branch_name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// PropTypes
UsersDetailsModal.propTypes = {
  selectedUser: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    blood_group: PropTypes.string,
    fathers_name: PropTypes.string,
    mothers_name: PropTypes.string,
    job: PropTypes.string,
    nid_number: PropTypes.string,
    permanent_address: PropTypes.string,
    temporary_address: PropTypes.string,
    passportPhoto: PropTypes.string,
    nidFront: PropTypes.string,
    nidBack: PropTypes.string,
    signature: PropTypes.string,
    BillInfo: PropTypes.arrayOf(
      PropTypes.shape({
        account_holder_name: PropTypes.string,
        mobile_number: PropTypes.string,
        bank_name: PropTypes.string,
        account_number: PropTypes.string,
        branch_name: PropTypes.string,
        payment_method: PropTypes.string,
      })
    ),
  }),
  setSelectedUser: PropTypes.func.isRequired,
};

export default UsersDetailsModal;
