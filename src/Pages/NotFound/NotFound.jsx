import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden cursor-pointer">
      {/* Background animated soft circles */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[150px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[150px] animate-pulse-slow z-0" />

      {/* Floating particle effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-indigo-400 rounded-full opacity-50 animate-float`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Overlay and content */}
      <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center z-10">
        <div className="text-center px-4 animate-fadeIn">
          <h1 className="text-white text-[12rem] sm:text-[16rem] md:text-[20rem] leading-none relative inline-block">
            <span className="animate-wobble inline-block">404</span>
            {/* Glowing halo */}
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-full blur-[80px] -z-10"></span>
          </h1>

          <p className="text-white text-3xl sm:text-4xl md:text-5xl mt-4 tracking-wider animate-fadeIn delay-200">
            PAGE NOT FOUND
          </p>

          <div className="flex justify-center mt-10 animate-fadeIn delay-400">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
            >
              <IoMdArrowRoundBack className="text-xl text-blue-600 hover:text-white transition-colors duration-300" />
              <span>Go Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease forwards; }

          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }
          .animate-wobble { animation: wobble 2s ease-in-out infinite; }

          @keyframes float {
            0% { transform: translateY(0px); opacity: 0.5; }
            50% { transform: translateY(-20px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.5; }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse 6s infinite alternate; }
        `}
      </style>
    </div>
  );
};

export default NotFound;
