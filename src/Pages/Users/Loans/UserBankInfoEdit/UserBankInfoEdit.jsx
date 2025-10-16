import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import {
  FaUser,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUniversity,
  FaInbox,
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
import { BiSolidErrorAlt } from "react-icons/bi";

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

  // Navigation
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

  // Centered Loading
  if (isLoading)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/80 z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <span className="text-purple-700 font-semibold text-lg">
          Loading, please wait...
        </span>
      </div>
    );

  // Centered Error
  if (error)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-red-50 text-center border-t border-red-200 z-50">
        <BiSolidErrorAlt className="text-red-500 text-8xl mb-3" />
        <p className="text-red-600 font-bold text-xl mb-2">
          Oops! Something went wrong.
        </p>
        <p className="text-red-500 text-base max-w-md">
          {error?.message || "Unable to load data. Please try again later."}
        </p>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2 sm:gap-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 py-5 px-4 md:rounded-t-3xl">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
          ব্যাংক একাউন্ট তথ্য
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-white max-w-md">
          আপনার ঋণ পরিশোধ ও প্রাপ্তির জন্য অ্যাকাউন্ট বিবরণী
        </p>
      </div>

      {/* Payment tabs */}
      <div className="mt-5 overflow-x-auto">
        <div className="hidden md:flex min-w-max border-b border-gray-300">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPaymentMethod(option.value)}
              className={`flex-1 text-center py-2 px-3 sm:px-4 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                paymentMethod === option.value
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-700 hover:text-purple-600 hover:border-purple-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid md:hidden grid-cols-2 sm:flex sm:overflow-x-auto border-b border-gray-300">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPaymentMethod(option.value)}
              className={`w-full sm:w-auto text-center py-2 px-3 sm:px-4 font-semibold transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors cursor-pointer ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "সেভ হচ্ছে..." : "একাউন্ট তথ্য সংরক্ষণ করুন"}
        </button>
      </form>

      {/* Preview existing accounts */}
      {accounts.length > 0 ? (
        <div className="px-2 md:px-5 pb-6 mt-4 space-y-6">
          {/* Header */}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
            সংরক্ষিত একাউন্টসমূহ
          </h3>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {accounts.map((acc, idx) => (
              <div
                key={idx}
                className="relative p-4 sm:p-5 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
                  aria-label="অ্যাকাউন্ট মুছুন"
                >
                  <ImCross size={14} />
                </button>

                {/* Account type */}
                <h4 className="text-lg sm:text-xl font-bold mb-2 text-purple-700">
                  {acc.payment_method === "bank_transfer"
                    ? "ব্যাংক ট্রান্সফার"
                    : acc.payment_method.charAt(0).toUpperCase() +
                      acc.payment_method.slice(1)}
                </h4>

                {/* Account details */}
                <div className="space-y-1 text-sm sm:text-base text-gray-700">
                  {acc.mobile_number && (
                    <p>
                      <span className="font-semibold">মোবাইল নাম্বার:</span>{" "}
                      {acc.mobile_number}
                    </p>
                  )}
                  {acc.bank_name && (
                    <p>
                      <span className="font-semibold">ব্যাংকের নাম:</span>{" "}
                      {acc.bank_name}
                    </p>
                  )}
                  {acc.account_number && (
                    <p>
                      <span className="font-semibold">একাউন্ট নাম্বার:</span>{" "}
                      {acc.account_number}
                    </p>
                  )}
                  {acc.branch_name && (
                    <p>
                      <span className="font-semibold">শাখা:</span>{" "}
                      {acc.branch_name}
                    </p>
                  )}
                  <p className="pt-1 border-t border-gray-100">
                    <span className="font-semibold">একাউন্ট হোল্ডার:</span>{" "}
                    {acc.account_holder_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fallback when no accounts
        <div className="px-4 py-8 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm mt-5">
          <FaInbox size={40} className="text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium text-lg">
            কোন একাউন্ট সংরক্ষিত নেই
          </p>
        </div>
      )}

      {/* Final submit button */}
      <div className="mt-6 px-2 sm:px-0 pb-6">
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
