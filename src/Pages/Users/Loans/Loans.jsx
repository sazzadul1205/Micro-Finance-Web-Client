import { useState } from "react";

// Icons
import {
  FaMoneyBillWave,
  FaClock,
  FaHistory,
  FaUserEdit,
  FaUsers,
  FaUniversity,
} from "react-icons/fa";

// Components
import LoanStatus from "./LoanStatus/LoanStatus";
import LoanHistory from "./LoanHistory/LoanHistory";
import LoanRequest from "./LoanRequest/LoanRequest";
import UserNomineeEdit from "./UserNomineeEdit/UserNomineeEdit";
import UserBankInfoEdit from "./UserBankInfoEdit/UserBankInfoEdit";
import UserInformationEdit from "./UserInformationEdit/UserInformationEdit";

const Loans = () => {
  const [activeTab, setActiveTab] = useState("request");

  const menuItems = [
    { key: "request", label: "ঋণ অনুরোধ", icon: FaMoneyBillWave },
    { key: "status", label: "ঋণের অবস্থা", icon: FaClock },
    { key: "history", label: "ঋণ ইতিহাস", icon: FaHistory },
    { key: "divider1", label: "—", divider: true },
    { key: "editUser", label: "ইউজার তথ্য সম্পাদনা", icon: FaUserEdit },
    { key: "nominee", label: "মনোনীত ব্যক্তির তথ্য", icon: FaUsers },
    { key: "bankInfo", label: "ব্যাংক একাউন্ট তথ্য", icon: FaUniversity },
  ];

  return (
    <div className="min-h-screen">
      <div className="drawer md:drawer-open">
        {/* Drawer Toggle Input */}
        <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

        {/* Drawer Content */}
        <div className="drawer-content flex flex-col md:flex-row bg-gray-100">
          {/* Main Content */}
          <main className="flex-1 p-1 md:p-8">
            <div className="min-h-full">
              {activeTab === "request" ? (
                <LoanRequest />
              ) : activeTab === "status" ? (
                <LoanStatus />
              ) : activeTab === "history" ? (
                <LoanHistory />
              ) : activeTab === "editUser" ? (
                <UserInformationEdit />
              ) : activeTab === "nominee" ? (
                <UserNomineeEdit />
              ) : activeTab === "bankInfo" ? (
                <UserBankInfoEdit />
              ) : (
                "পৃষ্ঠা লোড হচ্ছে..."
              )}
            </div>
          </main>
        </div>

        {/* Drawer Sidebar for Mobile */}
        <div className="drawer-side md:hidden">
          <label
            htmlFor="mobile-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-white min-h-full w-72 p-5 space-y-2">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center border-b pb-2">
              ঋণ ব্যবস্থাপনা
            </h2>

            {menuItems.map(({ key, label, icon: Icon, divider }) =>
              divider ? (
                <div
                  key={key}
                  className="border-t border-gray-300 my-3 opacity-70"
                ></div>
              ) : (
                <li key={key}>
                  <label
                    htmlFor="mobile-drawer"
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                      activeTab === key
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-black hover:bg-purple-100 hover:text-purple-700"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {Icon && <Icon size={18} />}
                    {label}
                  </label>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loans;
