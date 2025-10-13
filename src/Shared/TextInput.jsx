
import PropTypes from "prop-types";

const TextInput = ({
  label,
  id,
  icon: Icon,
  placeholder,
  required = false,
  type = "text",
  textarea = false,
  rows = 3,
  register,
  validation = {},
  error,
  ...rest
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* Icon (only for input fields, not textarea) */}
        {!textarea && Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}

        {/* Input or Textarea */}
        {textarea ? (
          <textarea
            id={id}
            placeholder={placeholder}
            required={required}
            rows={rows}
            {...(register ? register(id, validation) : {})}
            {...rest}
            className={`block w-full border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          ></textarea>
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            required={required}
            {...(register ? register(id, validation) : {})}
            {...rest}
            className={`block w-full pl-10 pr-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

// ✅ PropTypes validation
TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  textarea: PropTypes.bool,
  rows: PropTypes.number,
  register: PropTypes.func, // from react-hook-form
  validation: PropTypes.object, // validation rules
  error: PropTypes.object, // error object from RHF
};

export default TextInput;
