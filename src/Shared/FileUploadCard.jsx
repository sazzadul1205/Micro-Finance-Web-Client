import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

const FileUploadCard = ({
  label = "ফাইল আপলোড করুন",
  icon: Icon,
  multiple = false,
  accept = { "image/*": [], "application/pdf": [] },
  maxFiles = 1,
  onChange,
  initialFiles = [],
  validate,
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  // Initialize with initial files (e.g., preloaded URLs)
  useEffect(() => {
    if (initialFiles.length > 0) {
      const mapped = initialFiles.map((f) =>
        typeof f === "string"
          ? { preview: f, name: f, isRemote: true }
          : Object.assign(f, { preview: URL.createObjectURL(f) })
      );
      setFiles(mapped);
    }
  }, [initialFiles]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      const updatedFiles = multiple
        ? [...files, ...mapped].slice(0, maxFiles)
        : mapped.slice(0, 1);

      setFiles(updatedFiles);
      setError(""); // clear error on drop
      onChange && onChange(updatedFiles);
    },
    [files, maxFiles, multiple, onChange]
  );

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  // Remove a file
  const removeFile = (index) => {
    const removed = files.filter((_, i) => i !== index);
    setFiles(removed);
    onChange && onChange(removed);
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () =>
      files.forEach((file) => {
        if (!file.isRemote && file.preview) URL.revokeObjectURL(file.preview);
      });
  }, [files]);

  // Validation function: call this in parent before submit
  // eslint-disable-next-line no-unused-vars
  const checkValid = () => {
    if (validate) {
      const result = validate(files);
      setError(typeof result === "string" ? result : "");
      return result === true;
    }
    if (!files.length) {
      setError("এই ফাইলটি আবশ্যক");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed rounded-md p-6 my-4 flex flex-col items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${
                    isDragActive
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 bg-white"
                  }
                  hover:border-purple-500 hover:bg-purple-50`}
    >
      <input {...getInputProps()} />

      {/* Empty State */}
      {!files.length ? (
        <div className="flex flex-col items-center space-y-4 text-center">
          {Icon && <Icon className="text-6xl text-gray-400" />}
          <h3 className="text-xl font-semibold text-gray-700">{label}</h3>
          <p className="text-gray-500 text-sm">
            ফাইল এখানে টেনে আনুন অথবা ক্লিক করে নির্বাচন করুন
            {multiple ? "গুলো" : ""}
          </p>
        </div>
      ) : (
        // Centered Previews
        <div className="w-full flex flex-wrap justify-center gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative border rounded-md overflow-hidden shadow-sm p-2 flex flex-col items-center justify-center"
              style={{ width: "250px" }}
            >
              {file.preview && (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-40 object-contain rounded-md"
                />
              )}
              <p className="text-gray-700 mt-2 truncate text-center w-full">
                {file.name}
              </p>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

FileUploadCard.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
  multiple: PropTypes.bool,
  accept: PropTypes.object,
  maxFiles: PropTypes.number,
  onChange: PropTypes.func,
  initialFiles: PropTypes.array,
  validate: PropTypes.func,
};

export default FileUploadCard;
