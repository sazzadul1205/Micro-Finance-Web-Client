import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { FaPhoneAlt, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const Login = () => {
  const axiosPublic = useAxiosPublic();

  // Inside your component
  const [loading, setLoading] = useState(false);

  // Password Visible State
  const [showPassword, setShowPassword] = useState(false);

  // Handle submit
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle submit
  const onSubmit = async (data) => {
    setLoading(true);

    const { phone, password } = data;

    if (!phone || !password) {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        title: "ফাঁকা ক্ষেত্র",
        text: "ফোন এবং পাসওয়ার্ড আবশ্যক",
        confirmButtonColor: "#6366F1",
      });
      return;
    }

    try {
      const res = await axiosPublic.post("/Users/Login", { phone, password });

      if (res.data?.success) {
        const expiryTime = new Date().getTime() + 1000 * 60 * 30;
        localStorage.setItem(
          "user",
          JSON.stringify({
            phone,
            role: res.data.role || "user",
            expiry: expiryTime,
          })
        );

        Swal.fire({
          icon: "success",
          title: "লগইন সফল ✅",
          text: "স্বাগতম!",
          confirmButtonColor: "#6366F1",
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
        }).then(() => {
          setLoading(false);

          // Redirect based on role
          const redirectURL =
            res.data.role === "admin" ? "/Admin/AllUsers" : "/PersonalInfo";
          window.location.href = redirectURL;
        });
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "লগইন ব্যর্থ",
          text: res.data.message || "দয়া করে পুনরায় চেষ্টা করুন",
          confirmButtonColor: "#6366F1",
        });
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "সার্ভার ত্রুটি",
        text: err.response?.data?.message || "সার্ভারের সাথে সংযোগ করা যায়নি",
        confirmButtonColor: "#6366F1",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden">
      {/* Background soft circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-md px-2 py-6 md:px-6 md:py-6 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center animate-fadeIn">
        {/* Logo */}
        <div className="mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/World_Bank_logo.svg"
            alt="Logo"
            className="w-20 h-20 p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform"
          />
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-1">আপনাকে স্বাগতম</h2>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-6 text-center">
          আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          {/* Phone */}
          <div className="flex items-center w-full bg-white/10 rounded-xl p-3 mb-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            {/* Icon */}
            <FaPhoneAlt className="text-slate-400 mr-3" />

            {/* Input */}
            <input
              type="text"
              placeholder="আপনার ফোন নম্বর লিখুন"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Enter a valid 11-digit phone number",
                },
              })}
              className="bg-transparent outline-none text-white w-full placeholder-slate-400"
            />
          </div>

          {/* Error message */}
          {errors.phone && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.phone.message}
            </p>
          )}

          {/* Password */}
          <div className="relative flex items-center w-full bg-white/10 rounded-xl p-3 mb-6 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            {/* Icon */}
            <FaLock className="text-slate-400 mr-3" />

            {/* Password Input */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="bg-transparent outline-none text-white w-full placeholder-slate-400 pr-10"
                style={{
                  WebkitTextSecurity: showPassword ? "none" : "disc", // hides default toggle in some browsers
                }}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-purple-300 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errors.password && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.password.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold shadow-md hover:translate-y-[-2px] hover:shadow-xl transition-all mb-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "প্রবেশ চলছে..." : "সাইন ইন করুন"}
          </button>
        </form>

        {/* Sign up */}
        <p className="text-slate-300 text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <a
            href="/SignUp"
            className="text-purple-400 font-semibold hover:underline"
          >
            নতুন অ্যাকাউন্ট তৈরি করুন
          </a>
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease; }
        `}
      </style>
    </div>
  );
};

export default Login;
