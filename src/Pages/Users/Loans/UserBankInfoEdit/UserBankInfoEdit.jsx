import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import {
  FaUser,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUniversity,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Shared
import TextInput from "../../../../Shared/TextInput";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Payment Options
const paymentOptions = [
  { value: "bkash", label: "Bkash" },
  { value: "nogad", label: "Nogad" },
  { value: "rocket", label: "Rocket" },
  { value: "upay", label: "Upay" },
  { value: "surecash", label: "SureCash" },
  { value: "bank_transfer", label: "ব্যাংক ট্রান্সফার" },
];

const UserBankInfoEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Form handler
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Loading states
  const [loading, setLoading] = useState(false);
  const [finalSaveLoading, setFinalSaveLoading] = useState(false);

  // Form state
  const [accounts, setAccounts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Fetch user bank info
  const {
    data: BankInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["BankInfo", user?.phone],
    queryFn: () =>
      axiosPublic.get(`/Users/Phone/${user?.phone}`).then((res) => res.data),
    enabled: !!user?.phone,
  });

  // Populate existing accounts
  useEffect(() => {
    if (BankInfo?.BillInfo?.length) {
      setAccounts(BankInfo.BillInfo);
    }
  }, [BankInfo]);

  // Save individual account (add new)
  const onSubmit = (data) => {
    if (!paymentMethod) return Swal.fire("পেমেন্ট মেথড নির্বাচন করুন!");

    setLoading(true);

    setTimeout(() => {
      setAccounts((prev) => [
        ...prev,
        { ...data, payment_method: paymentMethod },
      ]);
      reset();
      setPaymentMethod("");
      setLoading(false);
    }, 500);
  };

  // Delete account
  const handleDelete = (idx) => {
    setAccounts(accounts.filter((_, i) => i !== idx));
  };

  // Final submit (update server)
  const onFinalSubmit = async () => {
    if (!user?.phone) {
      return Swal.fire({
        icon: "error",
        title: "Phone Missing",
        text: "ব্যবহারকারীর ফোন নম্বর পাওয়া যায়নি।",
      });
    }
    if (accounts.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "কোন তথ্য নেই!",
        text: "দয়া করে অন্তত একটি একাউন্ট যোগ করুন।",
      });
    }

    setFinalSaveLoading(true);

    try {
      await axiosPublic.put(`/Users/Phone/${user.phone}`, {
        BillInfo: accounts,
      });

      Swal.fire({
        icon: "success",
        title: "তথ্য সংরক্ষণ সম্পন্ন!",
        text: "আপনার একাউন্ট তথ্য সফলভাবে সংরক্ষিত হয়েছে।",
      });

      navigate("/Loans");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "তথ্য সংরক্ষণে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
      });
    } finally {
      setFinalSaveLoading(false);
    }
  };

  // Loading State
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
        <span className="ml-3 text-purple-700 font-semibold">Loading...</span>
      </div>
    );

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg p-6 border border-red-300">
        <p className="text-red-600 font-semibold text-lg mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-red-500 text-sm">
          {error?.message || "Unable to load data. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center space-y-3 items-center gap-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 py-5 text-white rounded-t-3xl">
        <h3 className="text-3xl font-semibold">ব্যাংক একাউন্ট তথ্য</h3>
        <p className="text-lg">
          আপনার ঋণ পরিশোধ ও প্রাপ্তির জন্য অ্যাকাউন্ট বিবরণী
        </p>
      </div>

      {/* Payment tabs */}
      <div className="mt-5 px-5">
        <div className="flex border-b border-gray-300">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPaymentMethod(option.value)}
              className={`flex-1 text-center py-2 font-semibold transition-colors border-b-2 cursor-pointer ${
                paymentMethod === option.value
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-700 hover:text-purple-600 hover:border-purple-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 grid grid-cols-2 gap-3 mt-4 px-5 pb-10 text-black"
      >
        {["bkash", "nogad", "rocket", "upay", "surecash"].includes(
          paymentMethod
        ) && (
          <TextInput
            label="মোবাইল নাম্বার"
            id="mobile_number"
            icon={FaMobileAlt}
            required
            placeholder="মোবাইল নাম্বার লিখুন"
            register={register}
            validation={{ required: "মোবাইল নাম্বার আবশ্যক" }}
            error={errors.mobile_number}
          />
        )}

        {paymentMethod === "bank_transfer" && (
          <>
            <TextInput
              label="ব্যাংকের নাম"
              id="bank_name"
              icon={FaUniversity}
              required
              placeholder="ব্যাংকের নাম লিখুন"
              register={register}
              validation={{ required: "ব্যাংকের নাম আবশ্যক" }}
              error={errors.bank_name}
            />
            <TextInput
              label="একাউন্ট নাম্বার"
              id="account_number"
              icon={FaMoneyBillWave}
              required
              placeholder="একাউন্ট নাম্বার লিখুন"
              register={register}
              validation={{ required: "একাউন্ট নাম্বার আবশ্যক" }}
              error={errors.account_number}
            />
            <TextInput
              label="শাখার নাম"
              id="branch_name"
              icon={FaUniversity}
              required
              placeholder="শাখার নাম লিখুন"
              register={register}
              validation={{ required: "শাখার নাম আবশ্যক" }}
              error={errors.branch_name}
            />
          </>
        )}

        <TextInput
          label="একাউন্ট হোল্ডারের নাম"
          id="account_holder_name"
          icon={FaUser}
          required
          placeholder="একাউন্ট হোল্ডারের নাম লিখুন"
          register={register}
          validation={{ required: "নাম আবশ্যক" }}
          error={errors.account_holder_name}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 w-full py-3 text-white font-semibold rounded-md transition-colors cursor-pointer ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "সেভ হচ্ছে..." : "একাউন্ট তথ্য সংরক্ষণ করুন"}
        </button>
      </form>

      {/* Preview existing accounts */}
      {accounts.length > 0 && (
        <div className="px-5 pb-5 mt-3 space-y-6">
          {/* Header */}
          <h3 className="text-2xl font-semibold text-gray-800">
            সংরক্ষিত একাউন্টসমূহ
          </h3>

          {/* Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((acc, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative"
              >
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="absolute top-5 right-5 text-red-500 font-bold hover:text-red-700 cursor-pointer"
                >
                  <ImCross />
                </button>

                <h4 className="text-lg font-bold mb-3 text-purple-700">
                  {acc.payment_method === "bank_transfer"
                    ? "ব্যাংক ট্রান্সফার"
                    : acc.payment_method.charAt(0).toUpperCase() +
                      acc.payment_method.slice(1)}
                </h4>

                {acc.mobile_number && (
                  <p className="flex items-center gap-2 text-gray-700 mb-1">
                    মোবাইল নাম্বার: {acc.mobile_number}
                  </p>
                )}
                {acc.bank_name && (
                  <p className="flex items-center gap-2 text-gray-700 mb-1">
                    ব্যাংকের নাম: {acc.bank_name}
                  </p>
                )}
                {acc.account_number && (
                  <p className="flex items-center gap-2 text-gray-700 mb-1">
                    একাউন্ট নাম্বার: {acc.account_number}
                  </p>
                )}
                {acc.branch_name && (
                  <p className="flex items-center gap-2 text-gray-700 mb-1">
                    শাখা: {acc.branch_name}
                  </p>
                )}
                <p className="flex items-center gap-2 text-gray-700 mt-2">
                  একাউন্ট হোল্ডার: {acc.account_holder_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final save */}
      <div className="p-5">
        <button
          type="button"
          onClick={onFinalSubmit}
          disabled={finalSaveLoading}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors cursor-pointer ${
            finalSaveLoading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {finalSaveLoading ? "সেভ হচ্ছে..." : "সব তথ্য সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
};

export default UserBankInfoEdit;
