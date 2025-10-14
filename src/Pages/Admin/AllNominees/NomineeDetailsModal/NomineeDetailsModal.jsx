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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <p>
          <strong>Name:</strong> {nominee_name}
        </p>
        <p>
          <strong>Phone:</strong> {nominee_phone}
        </p>
        <p>
          <strong>Relation:</strong> {relation}
        </p>
        <p>
          <strong>NID:</strong> {nominee_nid}
        </p>
        <p>
          <strong>User Phone:</strong> {user_phone}
        </p>
        <p>
          <strong>Submitted At:</strong>{" "}
          {new Date(submitted_at).toLocaleString()}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(created_at).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong> {new Date(updated_at).toLocaleString()}
        </p>
      </div>

      {/* Documents */}
      <div className="mb-4">
        <h4 className="font-semibold text-purple-700 mb-3">Documents</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">Passport Photo</p>
            <img
              src={nominee_passport_photo}
              alt="Passport"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium mb-1">NID Front</p>
            <img
              src={nominee_nid_front}
              alt="NID Front"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
            />
          </div>
          <div className="flex flex-col col-span-2 items-center w-1/2 mx-auto">
            <p className="text-sm font-medium mb-1">NID Back</p>
            <img
              src={nominee_nid_back}
              alt="NID Back"
              className="w-full h-[200px] object-cover rounded-lg border shadow"
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
