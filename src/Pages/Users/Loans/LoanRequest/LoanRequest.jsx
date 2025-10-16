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

// Lists
import { LoanTypeOptions } from "../../../../Shared/Lists/LoanTypeOptions";
import { repaymentOptions } from "../../../../Shared/Lists/repaymentOptions";
import { loanDurationOptions } from "../../../../Shared/Lists/loanDurationOptions";

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
      status: "Requested",
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
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-8 text-gray-800 py-5">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-purple-700">
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
          className="w-full"
        />

        <TextInput
          label="ঋণের পরিমাণ (টাকা)"
          id="loan_amount"
          icon={FaMoneyBillWave}
          type="text"
          placeholder="ঋণের পরিমাণ লিখুন"
          value={loanAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/,/g, "");
            if (!isNaN(numericValue)) {
              setLoanAmount(numericValue);
            }
          }}
          className="w-full"
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
          className="w-full"
        />

        {/* Repayment Method Buttons */}
        <div className="mt-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            কিস্তি পরিশোধের পদ্ধতি
          </label>
          <div className="flex flex-wrap border-b border-gray-300 -mb-1">
            {repaymentOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setRepaymentMethod(opt.value)}
                className={`flex-1 sm:flex-auto text-center py-2 font-semibold transition-colors border-b-2 cursor-pointer mb-1 sm:mb-0 ${
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
