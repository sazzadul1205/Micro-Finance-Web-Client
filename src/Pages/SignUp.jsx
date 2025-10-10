import { useState } from "react";
import { FaUser, FaPhoneAlt, FaLock, FaUserPlus } from "react-icons/fa";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Add your registration logic here
    console.log("Full Name:", fullName);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden">
      {/* Background soft circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[120px]"></div>

      <div className="z-10 w-full max-w-md p-6 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center animate-fadeIn">
        <div className="mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/World_Bank_logo.svg"
            alt="Logo"
            className="w-20 h-20 p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform"
          />
        </div>

        <h2 className="text-white text-2xl font-bold mb-1">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h2>
        <p className="text-slate-300 text-sm mb-6 text-center">
          কমিউনিটিতে যোগ দিন
        </p>

        {/* Full Name */}
        <div className="flex items-center bg-white/10 rounded-xl p-3 mb-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all w-full">
          <FaUser className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="আপনার পুরো নাম লিখুন"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-slate-400"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center bg-white/10 rounded-xl p-3 mb-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all w-full">
          <FaPhoneAlt className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="আপনার ফোন নম্বর লিখুন"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-slate-400"
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white/10 rounded-xl p-3 mb-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all w-full">
          <FaLock className="text-slate-400 mr-3" />
          <input
            type="password"
            placeholder="একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-slate-400"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex items-center bg-white/10 rounded-xl p-3 mb-6 focus-within:ring-2 focus-within:ring-indigo-500 transition-all w-full">
          <FaLock className="text-slate-400 mr-3" />
          <input
            type="password"
            placeholder="আপনার পাসওয়ার্ড আবার লিখুন"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-slate-400"
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold shadow-md hover:translate-y-[-2px] hover:shadow-xl transition-all mb-4"
        >
          <FaUserPlus className="mr-2" /> নিবন্ধন করুন
        </button>

        <p className="text-slate-300 text-sm">
          ইতিমধ্যেই একটি অ্যাকাউন্ট আছে?{" "}
          <a href="/" className="text-purple-400 font-semibold hover:underline">
            সাইন ইন করুন
          </a>
        </p>
      </div>

      {/* Fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease;
          }
        `}
      </style>
    </div>
  );
};

export default SignUp;
