import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import PropTypes from "prop-types";

const SignaturePad = ({ label = "দস্তখত দিন", onChange, required = false }) => {
  const sigCanvas = useRef(null);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false); // locked after save

  // Clear the signature and allow redraw
  const tryAgain = () => {
    sigCanvas.current.clear();
    setLocked(false);
    setError("");
    onChange && onChange(null);
  };

  // Save the signature as a Blob and lock the canvas
  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      if (required) setError("দস্তখত আবশ্যক");
      return null;
    }

    const dataURL = sigCanvas.current.toDataURL("image/png");

    // Convert Base64 to Blob
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    setLocked(true);
    setError("");
    onChange && onChange(blob); // Send the Blob to the parent
    return blob;
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`relative border border-gray-300 rounded-md shadow-sm ${
          locked ? "bg-gray-50" : "bg-white"
        }`}
      >
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 200,
            className: "rounded-md",
            style: { cursor: locked ? "not-allowed" : "crosshair" },
          }}
          backgroundColor={locked ? "#f9fafb" : "#ffffff"}
          onEnd={() => setError("")}
        />

        {/* Overlay to block interaction when locked */}
        {locked && (
          <div
            className="absolute inset-0 bg-transparent"
            style={{ cursor: "not-allowed" }}
          />
        )}
      </div>

      <div className="mt-5">
        {!locked ? (
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => sigCanvas.current.clear()}
              className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 text-white transition-colors cursor-pointer"
            >
              মুছে দিন
            </button>
            <button
              type="button"
              onClick={save}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
            >
              সংরক্ষণ
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={tryAgain}
            className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};

SignaturePad.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default SignaturePad;
