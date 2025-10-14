import { useState, useEffect } from "react";

// Icons
import {
  FaCalculator,
  FaClock,
  FaListUl,
  FaMoneyBillWave,
} from "react-icons/fa";

// Packages
import Swal from "sweetalert2";

// Shared
import TextInput from "../../../../Shared/TextInput";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Payment Options
const LoanTypeOptions = [
  // 🧍‍♂️ Personal & Household
  { value: "personal", label: "ব্যক্তিগত ঋণ" },
  { value: "household", label: "গৃহস্থালী ঋণ" },
  { value: "marriage", label: "বিবাহ ঋণ" },
  { value: "education", label: "শিক্ষা ঋণ" },
  { value: "medical", label: "চিকিৎসা ঋণ" },
  { value: "travel", label: "ভ্রমণ ঋণ" },
  { value: "festival", label: "উৎসব ঋণ (ঈদ, পূজা ইত্যাদি)" },
  { value: "emergency", label: "জরুরি ঋণ" },
  { value: "renovation", label: "বাড়ি সংস্কার ঋণ" },
  { value: "housing", label: "বাসস্থান ঋণ" },
  { value: "vehicle", label: "যানবাহন ক্রয় ঋণ" },
  { value: "land_purchase", label: "জমি ক্রয় ঋণ" },
  { value: "appliance_purchase", label: "ইলেকট্রনিক্স ক্রয় ঋণ" },
  { value: "repayment", label: "পুরনো ঋণ পরিশোধ ঋণ" },

  // 💼 Business & Trade
  { value: "business", label: "ব্যবসায়িক ঋণ" },
  { value: "small_business", label: "ক্ষুদ্র ব্যবসা ঋণ" },
  { value: "medium_business", label: "মাঝারি ব্যবসা ঋণ" },
  { value: "retail", label: "খুচরা ব্যবসা ঋণ" },
  { value: "wholesale", label: "পাইকারি ব্যবসা ঋণ" },
  { value: "startup", label: "স্টার্টআপ ঋণ" },
  { value: "trade_license", label: "ট্রেড লাইসেন্স ভিত্তিক ঋণ" },
  { value: "ecommerce", label: "ই-কমার্স ব্যবসা ঋণ" },
  { value: "export_import", label: "রপ্তানি ও আমদানি ঋণ" },
  { value: "service_business", label: "সার্ভিস ব্যবসা ঋণ" },
  { value: "manufacturing", label: "উৎপাদন শিল্প ঋণ" },
  { value: "equipment", label: "যন্ত্রপাতি ক্রয় ঋণ" },
  { value: "warehouse", label: "গুদাম নির্মাণ ঋণ" },
  { value: "franchise", label: "ফ্র্যাঞ্চাইজি ব্যবসা ঋণ" },
  { value: "women_entrepreneur", label: "নারী উদ্যোক্তা ঋণ" },
  { value: "youth_entrepreneur", label: "যুব উদ্যোক্তা ঋণ" },

  // 🌾 Agriculture & Rural
  { value: "agriculture", label: "কৃষি ঋণ" },
  { value: "crop", label: "ফসল চাষ ঋণ" },
  { value: "livestock", label: "পশুপালন ঋণ" },
  { value: "poultry", label: "পোল্ট্রি ফার্ম ঋণ" },
  { value: "fisheries", label: "মৎস্য চাষ ঋণ" },
  { value: "dairy", label: "দুধ উৎপাদন ঋণ" },
  { value: "agro_equipment", label: "কৃষি যন্ত্রপাতি ঋণ" },
  { value: "seed", label: "বীজ ক্রয় ঋণ" },
  { value: "fertilizer", label: "সার ক্রয় ঋণ" },
  { value: "irrigation", label: "সেচ ঋণ" },
  { value: "seasonal", label: "ঋতুভিত্তিক কৃষি ঋণ" },

  // 🏗️ Infrastructure & Development
  { value: "construction", label: "নির্মাণ ঋণ" },
  { value: "real_estate", label: "রিয়েল এস্টেট ঋণ" },
  { value: "land_development", label: "জমি উন্নয়ন ঋণ" },
  { value: "solar", label: "সোলার এনার্জি ঋণ" },
  { value: "renewable_energy", label: "নবায়নযোগ্য জ্বালানি ঋণ" },
  { value: "environmental", label: "পরিবেশবান্ধব প্রকল্প ঋণ" },
  { value: "ngo_project", label: "এনজিও প্রকল্প ঋণ" },
  { value: "microfinance", label: "মাইক্রোফাইন্যান্স ঋণ" },

  // 💰 Special & Institutional
  { value: "salary_advance", label: "বেতন অগ্রিম ঋণ" },
  { value: "pension", label: "পেনশনভোগী ঋণ" },
  { value: "govt_employee", label: "সরকারি কর্মচারী ঋণ" },
  { value: "non_govt_employee", label: "বেসরকারি কর্মচারী ঋণ" },
  { value: "ngo_member", label: "এনজিও সদস্য ঋণ" },
  { value: "religious_institution", label: "ধর্মীয় প্রতিষ্ঠান ঋণ" },
  { value: "education_institution", label: "শিক্ষা প্রতিষ্ঠান ঋণ" },
  { value: "community_project", label: "কমিউনিটি উন্নয়ন ঋণ" },
];

// Loan Duration
const loanDurationOptions = [
  { value: "1", label: "১ মাস" },
  { value: "2", label: "২ মাস" },
  { value: "3", label: "৩ মাস" },
  { value: "4", label: "৪ মাস" },
  { value: "5", label: "৫ মাস" },
  { value: "6", label: "৬ মাস" },
  { value: "7", label: "৭ মাস" },
  { value: "8", label: "৮ মাস" },
  { value: "9", label: "৯ মাস" },
  { value: "10", label: "১০ মাস" },
  { value: "11", label: "১১ মাস" },
  { value: "12", label: "১২ মাস" },
  { value: "13", label: "১৩ মাস" },
  { value: "14", label: "১৪ মাস" },
  { value: "15", label: "১৫ মাস" },
  { value: "16", label: "১৬ মাস" },
  { value: "17", label: "১৭ মাস" },
  { value: "18", label: "১৮ মাস" },
  { value: "19", label: "১৯ মাস" },
  { value: "20", label: "২০ মাস" },
  { value: "21", label: "২১ মাস" },
  { value: "22", label: "২২ মাস" },
  { value: "23", label: "২৩ মাস" },
  { value: "24", label: "২৪ মাস" },
  { value: "25", label: "২৫ মাস" },
  { value: "26", label: "২৬ মাস" },
  { value: "27", label: "২৭ মাস" },
  { value: "28", label: "২৮ মাস" },
  { value: "29", label: "২৯ মাস" },
  { value: "30", label: "৩০ মাস" },
  { value: "31", label: "৩১ মাস" },
  { value: "32", label: "৩২ মাস" },
  { value: "33", label: "৩৩ মাস" },
  { value: "34", label: "৩৪ মাস" },
  { value: "35", label: "৩৫ মাস" },
  { value: "36", label: "৩৬ মাস" },
  { value: "37", label: "৩৭ মাস" },
  { value: "38", label: "৩৮ মাস" },
  { value: "39", label: "৩৯ মাস" },
  { value: "40", label: "৪০ মাস" },
  { value: "41", label: "৪১ মাস" },
  { value: "42", label: "৪২ মাস" },
  { value: "43", label: "৪৩ মাস" },
  { value: "44", label: "৪৪ মাস" },
  { value: "45", label: "৪৫ মাস" },
  { value: "46", label: "৪৬ মাস" },
  { value: "47", label: "৪৭ মাস" },
  { value: "48", label: "৪৮ মাস" },
  { value: "49", label: "৪৯ মাস" },
  { value: "50", label: "৫০ মাস" },
  { value: "51", label: "৫১ মাস" },
  { value: "52", label: "৫২ মাস" },
  { value: "53", label: "৫৩ মাস" },
  { value: "54", label: "৫৪ মাস" },
  { value: "55", label: "৫৫ মাস" },
  { value: "56", label: "৫৬ মাস" },
  { value: "57", label: "৫৭ মাস" },
  { value: "58", label: "৫৮ মাস" },
  { value: "59", label: "৫৯ মাস" },
  { value: "60", label: "৬০ মাস" },
];

// Repayment Options
const repaymentOptions = [
  { value: "monthly", label: "মাসিক কিস্তি" },
  { value: "one_time", label: "এককালীন পরিশোধ" },
  { value: "half_yearly", label: "অর্ধবার্ষিক কিস্তি" },
];

const LoanRequest = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  //Form State
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [repaymentMethod, setRepaymentMethod] = useState("");
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Calculate Installment instantly whenever inputs change
  useEffect(() => {
    const amount = parseFloat(loanAmount);
    const duration = parseFloat(loanDuration);

    if (!amount || !duration || !repaymentMethod) {
      setMonthlyInstallment(0);
      return;
    }

    let installment = 0;
    if (repaymentMethod === "one_time") {
      installment = amount;
    } else if (repaymentMethod === "half_yearly") {
      installment = amount / (duration / 6);
    } else if (repaymentMethod === "monthly") {
      installment = amount / duration;
    }
    setMonthlyInstallment(installment.toFixed(2));
  }, [loanAmount, loanDuration, repaymentMethod]);

  // Check if form is valid
  const isFormValid = loanType && loanAmount && loanDuration && repaymentMethod;

  // Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    const finalData = {
      phone: user?.phone,
      loan_type: loanType,
      loan_amount: loanAmount,
      loan_duration: loanDuration,
      repayment_method: repaymentMethod,
      installment_amount: monthlyInstallment,
    };

    try {
      // Replace '/LoanRequest' with your API endpoint
      const response = await axiosPublic.post("/LoanRequest", finalData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে জমা হয়েছে!",
          text: "আপনার ঋণ আবেদনটি সফলভাবে জমা হয়েছে।",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Reset all fields
        setLoanType("");
        setLoanAmount("");
        setLoanDuration("");
        setRepaymentMethod("");
        setMonthlyInstallment(0);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি ঘটেছে!",
          text: "দয়া করে আবার চেষ্টা করুন।",
        });
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি ঘটেছে!",
        text: error?.response?.data?.message || "দয়া করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-8 text-gray-800 mt-5">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
        ঋণ আবেদন ফর্ম
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="ঋণের ধরন"
          id="loan_type"
          icon={FaListUl}
          select
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          selectPlaceholder="ঋণের ধরন নির্বাচন করুন"
          options={LoanTypeOptions}
        />

        <TextInput
          label="ঋণের পরিমাণ (টাকা)"
          id="loan_amount"
          icon={FaMoneyBillWave}
          type="text" // keep as text to allow commas
          placeholder="ঋণের পরিমাণ লিখুন"
          value={loanAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={(e) => {
            // Remove commas before saving to state
            const numericValue = e.target.value.replace(/,/g, "");
            if (!isNaN(numericValue)) {
              setLoanAmount(numericValue);
            }
          }}
        />

        <TextInput
          label="ঋণের মেয়াদ"
          id="loan_duration"
          icon={FaClock}
          select
          value={loanDuration}
          onChange={(e) => setLoanDuration(e.target.value)}
          selectPlaceholder="ঋণের মেয়াদ নির্বাচন করুন"
          options={loanDurationOptions}
        />

        {/* Repayment Method Buttons */}
        <div className="mt-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            কিস্তি পরিশোধের পদ্ধতি
          </label>
          <div className="flex border-b border-gray-300">
            {repaymentOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setRepaymentMethod(opt.value)}
                className={`flex-1 text-center py-2 font-semibold transition-colors border-b-2 cursor-pointer ${
                  repaymentMethod === opt.value
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-700 hover:text-purple-600 hover:border-purple-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Installment Display */}
        <div className="w-full mt-3">
          <label className="block text-lg font-semibold text-gray-700 mb-1">
            কিস্তি পরিমাণ (টাকা)
          </label>
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md py-3 px-4 text-gray-700 font-semibold">
            <FaCalculator className="text-gray-400" />
            {monthlyInstallment > 0
              ? `${Number(monthlyInstallment).toLocaleString("en-IN")} টাকা`
              : "—"}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors cursor-pointer ${
            loading || !isFormValid
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "জমা হচ্ছে..." : "ঋণ আবেদন জমা দিন"}
        </button>
      </form>
    </div>
  );
};

export default LoanRequest;
