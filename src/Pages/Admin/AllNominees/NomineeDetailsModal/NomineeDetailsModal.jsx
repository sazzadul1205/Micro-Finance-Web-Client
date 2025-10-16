import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

const NomineeDetailsModal = ({ selectedUser, setSelectedUser }) => {
  if (!selectedUser) return null;

  // Close Modal
  const handleClose = () => {
    document.getElementById("Nominee_Details_Modal").close();
    setSelectedUser("");
  };

  const {
    nominee_name,
    nominee_phone,
    relation,
    nominee_nid,
    nominee_nid_front,
    nominee_nid_back,
    nominee_passport_photo,
    user_phone,
    submitted_at,
    created_at,
    updated_at,
  } = selectedUser;

  return (
    <div
      id="Nominee_Details_Modal"
      className="modal-box relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-full sm:max-w-xl md:max-w-3xl mx-auto max-h-[90vh] p-4 sm:p-6 text-black overflow-y-auto"
    >
      {/* Header */}
      <div>
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Title */}
        <h3 className="font-bold text-lg sm:text-xl text-center mb-4 pt-5 md:pt-0">
          Nominee Details
        </h3>
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-purple-600 mb-4" />

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>Nominee Name:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">
            {nominee_name}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>Phone:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">
            {nominee_phone}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>Relation:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">{relation}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>NID:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">{nominee_nid}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>User Phone:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">{user_phone}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>Submitted At:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">
            {new Date(submitted_at).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600">
            <strong>Created At:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">
            {new Date(created_at).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 sm:col-span-2 md:col-span-1">
          <p className="text-sm text-gray-600">
            <strong>Updated At:</strong>
          </p>
          <p className="text-base font-semibold text-gray-800">
            {new Date(updated_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-4">
        {/* Title */}
        <h4 className="font-semibold text-purple-700 mb-3">Documents</h4>

        {/* Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {/* Passport Photo */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">Passport Photo</p>
            <img
              src={nominee_passport_photo}
              alt="Passport"
              className="w-full h-48 sm:h-56 md:h-52 object-cover rounded-lg border shadow"
            />
          </div>

          {/* NID Front */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">NID Front</p>
            <img
              src={nominee_nid_front}
              alt="NID Front"
              className="w-full h-48 sm:h-56 md:h-52 object-cover rounded-lg border shadow"
            />
          </div>

          {/* NID Back */}
          <div className="flex flex-col items-center sm:col-span-2 md:col-span-1">
            <p className="text-sm font-medium mb-1">NID Back</p>
            <img
              src={nominee_nid_back}
              alt="NID Back"
              className="w-full h-48 sm:h-56 md:h-52 object-cover rounded-lg border shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Vallation
NomineeDetailsModal.propTypes = {
  selectedUser: PropTypes.shape({
    nominee_name: PropTypes.string.isRequired,
    nominee_phone: PropTypes.string.isRequired,
    relation: PropTypes.string.isRequired,
    nominee_nid: PropTypes.string.isRequired,
    nominee_nid_front: PropTypes.string.isRequired,
    nominee_nid_back: PropTypes.string.isRequired,
    nominee_passport_photo: PropTypes.string.isRequired,
    user_phone: PropTypes.string.isRequired,
    submitted_at: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }),
  setSelectedUser: PropTypes.func.isRequired,
};

export default NomineeDetailsModal;
