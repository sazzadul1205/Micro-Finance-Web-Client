/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

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

  // Initialize with initial files (URLs or File objects)
  useEffect(() => {
    if (initialFiles.length > 0) {
      const mapped = initialFiles.map((f) =>
        typeof f === "string"
          ? { preview: f, name: f.split("/").pop(), isRemote: true }
          : Object.assign(f, {
              preview: URL.createObjectURL(f),
              isRemote: false,
            })
      );
      setFiles(mapped);
    }
  }, [initialFiles]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          isRemote: false,
        })
      );

      const updatedFiles = multiple
        ? [...files, ...mapped].slice(0, maxFiles)
        : mapped.slice(0, 1);

      setFiles(updatedFiles);
      setError("");
      onChange?.(updatedFiles);
    },
    [files, multiple, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  // Remove a file
  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  // Cleanup URLs for local files
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (!f.isRemote && f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  // Manual validation
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
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-md p-6 my-4 flex flex-col items-center justify-center text-center
          transition-all duration-300 cursor-pointer
          ${
            isDragActive
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 bg-white"
          }
          hover:border-purple-500 hover:bg-purple-50`}
      >
        <input {...getInputProps()} />

        {/* --- When No Files Selected --- */}
        {!files.length ? (
          <div className="flex flex-col items-center space-y-4 text-center px-4">
            {Icon && <Icon className="text-6xl text-gray-400" />}
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 break-words">
              {label}
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              ফাইল এখানে টেনে আনুন অথবা ক্লিক করে নির্বাচন করুন{" "}
              {multiple ? "গুলো" : ""}
            </p>
          </div>
        ) : (
          /* --- File Previews --- */
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative border rounded-md overflow-hidden shadow-sm p-2 flex flex-col items-center justify-center bg-white"
              >
                {file.preview && (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-36 sm:h-40 object-contain rounded-md"
                  />
                )}
                <p className="text-gray-700 mt-2 truncate text-center w-full text-sm sm:text-base">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <ImCross size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
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
