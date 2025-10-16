import PropTypes from "prop-types";

const TextInput = ({
  label,
  id,
  icon: Icon,
  placeholder,
  required = false,
  type = "text",
  textarea = false,
  select = false,
  selectPlaceholder = "-- Select an option --",
  options = [],
  rows = 5,
  register,
  validation = {},
  error,
  ...rest
}) => {
  return (
    <div className="w-full text-black">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-base md:text-lg font-semibold text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* Icon */}
        {Icon && (
          <Icon
            className={`absolute left-3 text-gray-400 pointer-events-none ${
              textarea
                ? "top-3 md:top-3"
                : "top-2 md:top-1/2 md:-translate-y-1/2"
            }`}
          />
        )}

        {/* Select, Textarea, or Input */}
        {select ? (
          <select
            id={id}
            required={required}
            {...(register ? register(id, validation) : {})}
            {...rest}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } border bg-white ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm py-2 md:py-3 pr-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base`}
          >
            {selectPlaceholder && (
              <option value="" disabled>
                {selectPlaceholder}
              </option>
            )}
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : textarea ? (
          <textarea
            id={id}
            placeholder={placeholder}
            required={required}
            rows={rows}
            {...(register ? register(id, validation) : {})}
            {...rest}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } border bg-white ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm py-2 md:py-3 pr-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base`}
          ></textarea>
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            required={required}
            {...(register ? register(id, validation) : {})}
            {...rest}
            className={`block w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 border bg-white ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm py-2 md:py-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base`}
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm md:text-base text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  textarea: PropTypes.bool,
  select: PropTypes.bool,
  selectPlaceholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  rows: PropTypes.number,
  register: PropTypes.func,
  validation: PropTypes.object,
  error: PropTypes.object,
};

export default TextInput;
