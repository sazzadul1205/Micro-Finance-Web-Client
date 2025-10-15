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
  const [locked, setLocked] = useState(disabled);
  const [preview, setPreview] = useState(null);

  // Load default signature
  useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        setPreview(defaultValue);
        setLocked(true);
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

  // Save the signature
  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      if (required) setError("দস্তখত আবশ্যক");
      return null;
    }

    const dataURL = sigCanvas.current.toDataURL("image/png");
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
    onChange && onChange(blob);
    return blob;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Signature Area */}
      <div
        className={`relative border border-gray-300 rounded-md shadow-sm overflow-hidden ${
          locked ? "bg-gray-50" : "bg-white"
        }`}
      >
        {!preview || !locked ? (
          <div className="w-full">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "rounded-md w-full h-40 sm:h-48 md:h-56",
                style: {
                  width: "100%",
                  height: "auto",
                  cursor: locked ? "not-allowed" : "crosshair",
                },
              }}
              backgroundColor={locked ? "#f9fafb" : "#ffffff"}
              onEnd={() => setError("")}
            />
          </div>
        ) : (
          <img
            src={preview}
            alt="Signature Preview"
            className="w-full h-40 sm:h-48 md:h-56 object-contain rounded-md"
          />
        )}

        {(locked || disabled) && (
          <div
            className="absolute inset-0 bg-transparent"
            style={{ cursor: "not-allowed" }}
          />
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-row justify-center sm:justify-between items-center gap-3">
        {!locked && !disabled ? (
          <>
            <button
              type="button"
              onClick={() => sigCanvas.current.clear()}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 text-white transition-colors cursor-pointer"
            >
              মুছে দিন
            </button>
            <button
              type="button"
              onClick={save}
              className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
            >
              সংরক্ষণ
            </button>
          </>
        ) : locked && !disabled ? (
          <button
            type="button"
            onClick={tryAgain}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        ) : null}
      </div>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
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
