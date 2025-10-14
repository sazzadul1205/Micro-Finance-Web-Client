import { useState } from "react";
import {
  FaMoneyBillWave,
  FaClock,
  FaHistory,
  FaUserEdit,
  FaUsers,
  FaUniversity,
} from "react-icons/fa";
import LoanRequest from "./LoanRequest/LoanRequest";
import LoanStatus from "./LoanStatus/LoanStatus";

const Loans = () => {
  const [activeTab, setActiveTab] = useState("request");

  const menuItems = [
    // Loan Management
    { key: "request", label: "ঋণ অনুরোধ", icon: FaMoneyBillWave },
    { key: "status", label: "ঋণের অবস্থা", icon: FaClock },
    { key: "history", label: "ঋণ ইতিহাস", icon: FaHistory },

    // Divider
    { key: "divider1", label: "—", divider: true },

    // Profile Management
    { key: "editUser", label: "ইউজার তথ্য সম্পাদনা", icon: FaUserEdit },
    { key: "nominee", label: "মনোনীত ব্যক্তির তথ্য", icon: FaUsers },
    { key: "bankInfo", label: "ব্যাংক একাউন্ট তথ্য", icon: FaUniversity },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg rounded-r-2xl p-5">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center border-b pb-2">
          ঋণ ব্যবস্থাপনা
        </h2>

        <nav className="space-y-2">
          {menuItems.map(({ key, label, icon: Icon, divider }) =>
            divider ? (
              <div
                key={key}
                className="border-t border-gray-300 my-3 opacity-70"
              ></div>
            ) : (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === key
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* Placeholder for dynamic views */}
        <div className="min-h-full">
          {activeTab === "request" ? (
            <LoanRequest />
          ) : activeTab === "status" ? (
            <LoanStatus />
          ) : activeTab === "history" ? (
            "ঋণ ইতিহাস পৃষ্ঠা লোড হচ্ছে..."
          ) : activeTab === "editUser" ? (
            "ইউজার তথ্য সম্পাদনা পৃষ্ঠা লোড হচ্ছে..."
          ) : activeTab === "nominee" ? (
            "মনোনীত ব্যক্তির তথ্য পৃষ্ঠা লোড হচ্ছে..."
          ) : activeTab === "bankInfo" ? (
            "ব্যাংক একাউন্ট তথ্য পৃষ্ঠা লোড হচ্ছে..."
          ) : (
            "পৃষ্ঠা লোড হচ্ছে..."
          )}
        </div>
      </main>
    </div>
  );
};

export default Loans;
