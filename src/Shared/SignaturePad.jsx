import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import PropTypes from "prop-types";

const SignaturePad = ({
  label = "দস্তখত দিন",
  onChange,
  required = false,
  defaultValue = null, // existing signature URL or Blob
  disabled = false, // parent can lock editing
}) => {
  const sigCanvas = useRef(null);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(disabled); // respect parent disabled initially
  const [preview, setPreview] = useState(null); // show existing signature if available

  // Load default signature
  useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        setPreview(defaultValue); // URL
        setLocked(true); // lock if a signature exists
      } else {
        const url = URL.createObjectURL(defaultValue);
        setPreview(url);
        setLocked(true);
      }
    }
  }, [defaultValue]);

  // Clear the signature and allow redraw
  const tryAgain = () => {
    sigCanvas.current.clear();
    setLocked(false);
    setPreview(null);
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

    const url = URL.createObjectURL(blob);
    setPreview(url);
    setLocked(true);
    setError("");
    onChange && onChange(blob); // Send the Blob to parent
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
        {!preview || !locked ? (
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
        ) : (
          <img
            src={preview}
            alt="Signature Preview"
            className="w-full h-40 object-contain rounded-md"
          />
        )}

        {/* Overlay to block interaction when locked */}
        {(locked || disabled) && (
          <div
            className="absolute inset-0 bg-transparent"
            style={{ cursor: "not-allowed" }}
          />
        )}
      </div>

      {/* Buttons */}
      <div className="mt-5">
        {!locked && !disabled ? (
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
        ) : locked && !disabled ? (
          <button
            type="button"
            onClick={tryAgain}
            className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        ) : null}
      </div>

      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};

SignaturePad.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Blob),
  ]),
  disabled: PropTypes.bool,
};

export default SignaturePad;
