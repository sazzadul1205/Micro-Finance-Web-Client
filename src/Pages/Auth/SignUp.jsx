/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Packages
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const SignUp = () => {
  const axiosPublic = useAxiosPublic();

  // Navigation
  const navigate = useNavigate();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Form State
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch password and confirmPassword
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle form submission for SignUp
  const onSubmit = async (data) => {
    setLoading(true); // Start loading

    const { name, phone, password, confirmPassword } = data;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setLoading(false); // stop loading
      Swal.fire({
        icon: "warning",
        title: "পাসওয়ার্ড মিলছে না",
        text: "আপনার পাসওয়ার্ড সঠিক কিনা পরীক্ষা করুন।",
        confirmButtonColor: "#6366F1",
      });
      return; // stop execution
    }

    try {
      // Hash the password before sending to server
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Send registration request
      const res = await axiosPublic.post("/users", {
        name,
        phone,
        password: hashedPassword,
      });

      // If registration successful
      if (res.data?.id) {
        // Save user in localStorage with expiry (30 minutes)
        const expiryTime = new Date().getTime() + 1000 * 60 * 30;
        localStorage.setItem(
          "user",
          JSON.stringify({
            phone,
            expiry: expiryTime,
          })
        );

        Swal.fire({
          icon: "success",
          title: "অ্যাকাউন্ট তৈরি হয়েছে!",
          text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
          confirmButtonColor: "#6366F1",
        });

        reset(); // Reset form fields
        navigate("/PersonalInfo"); // Redirect to dashboard
      } else {
        // If server returns failure
        Swal.fire({
          icon: "error",
          title: "নিবন্ধন ব্যর্থ",
          text: res.data?.message || "দয়া করে পরে চেষ্টা করুন।",
          confirmButtonColor: "#6366F1",
        });
      }
    } catch (error) {
      // Handle network/server errors
      Swal.fire({
        icon: "error",
        title: "সার্ভার ত্রুটি",
        text:
          error.response?.data?.message ||
          "সার্ভারের সাথে সংযোগ করা যায়নি। পরে আবার চেষ্টা করুন।",
        confirmButtonColor: "#6366F1",
      });
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden">
      {/* Background lighting */}
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
        <h2 className="text-white text-xl md:text-2xl font-bold mb-1">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h2>

        {/* Tagline */}
        <p className="text-slate-300 text-sm mb-6 text-center">
          কমিউনিটিতে যোগ দিন
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          {/* Full Name */}
          <div className="flex items-center bg-white/10 rounded-xl p-3 mb-4 w-full focus-within:ring-2 focus-within:ring-indigo-500">
            {/* Icon */}
            <FaUser className="text-slate-400 mr-3" />

            {/* Input */}
            <input
              type="text"
              placeholder="আপনার পুরো নাম লিখুন"
              {...register("name", { required: "Name is required" })}
              className="bg-transparent outline-none text-white w-full placeholder-slate-400"
            />
          </div>

          {/* Name Error */}
          {errors.name && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.name.message}
            </p>
          )}

          {/* Phone */}
          <div className="flex items-center bg-white/10 rounded-xl p-3 mb-4 w-full focus-within:ring-2 focus-within:ring-indigo-500">
            {/* Icon */}
            <FaPhoneAlt className="text-slate-400 mr-3" />

            {/* Input */}
            <input
              type="text"
              placeholder="আপনার ফোন নম্বর লিখুন"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Enter a valid 11-digit phone number",
                },
              })}
              className="bg-transparent outline-none text-white w-full placeholder-slate-400"
            />
          </div>

          {/* Phone Error */}
          {errors.phone && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.phone.message}
            </p>
          )}

          {/* Password Field */}
          <div className="relative flex items-center bg-white/10 rounded-xl p-3 mb-4 w-full focus-within:ring-2 focus-within:ring-indigo-500">
            {/* Icon */}
            <FaLock className="text-slate-400 mr-3" />

            {/* Input */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="bg-transparent outline-none text-white w-full placeholder-slate-400 pr-8"
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-slate-300 hover:text-white transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Password Error */}
          {errors.password && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.password.message}
            </p>
          )}

          {/* Confirm Password Field */}
          <div className="relative flex items-center bg-white/10 rounded-xl p-3 mb-6 w-full focus-within:ring-2 focus-within:ring-indigo-500">
            {/* Icon */}
            <FaLock className="text-slate-400 mr-3" />

            {/* Input */}
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="আপনার পাসওয়ার্ড আবার লিখুন"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              className="bg-transparent outline-none text-white w-full placeholder-slate-400 pr-8"
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-4 text-slate-300 hover:text-white transition"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password Error */}
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm -mt-3 mb-2">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold shadow-md hover:translate-y-[-2px] hover:shadow-xl transition-all mb-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "নিবন্ধন চলছে..."
            ) : (
              <>
                <FaUserPlus className="mr-2" /> নিবন্ধন করুন
              </>
            )}
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-slate-300 text-sm sm:text-base text-center leading-relaxed flex flex-wrap justify-center gap-1">
          <span>ইতিমধ্যেই একটি অ্যাকাউন্ট আছে?</span>
          <a
            href="/"
            className="text-purple-400 font-semibold hover:underline whitespace-nowrap"
          >
            সাইন ইন করুন
          </a>
        </p>
      </div>

      {/* Fade animation */}
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

export default SignUp;
