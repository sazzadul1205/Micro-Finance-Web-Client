import { useEffect, useState } from "react";

// Packages
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaBriefcase,
  FaFemale,
  FaHome,
  FaIdCard,
  FaMapMarkerAlt,
  FaPaperclip,
  FaTint,
  FaUser,
  FaUserCircle,
  FaUserTie,
} from "react-icons/fa";

// Assets
import Loan from "../../../../assets/PersonalInfo/Loan.png";

// Shared
import TextInput from "../../../../Shared/TextInput";
import SignaturePad from "../../../../Shared/SignaturePad";
import FileUploadCard from "../../../../Shared/FileUploadCard";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { BiSolidErrorAlt } from "react-icons/bi";

// Image Uploader
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;
const ImgBB_Album_Key = import.meta.env.VITE_IMAGE_ALBUM_KEY;

const UserInformationEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  // Form Handler
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Loading State
  const [loading, setLoading] = useState(false);

  // User Form State
  const [nidBack, setNidBack] = useState([]);
  const [nidFront, setNidFront] = useState([]);
  const [signature, setSignature] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState([]);

  // Fetch existing user info
  const {
    data: UserBasicInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UserBasicInfo", user?.phone],
    queryFn: () =>
      axiosPublic.get(`/Users/Phone/${user?.phone}`).then((res) => res.data),
    enabled: !!user?.phone,
  });

  // Populate default values when UserBasicInfo is fetched
  useEffect(() => {
    if (!UserBasicInfo) return;

    setValue("name", UserBasicInfo.name || "");
    setValue("fathers_name", UserBasicInfo.fathers_name || "");
    setValue("mothers_name", UserBasicInfo.mothers_name || "");
    setValue("nid_number", UserBasicInfo.nid_number || "");
    setValue("blood_group", UserBasicInfo.blood_group || "");
    setValue("permanent_address", UserBasicInfo.permanent_address || "");
    setValue("temporary_address", UserBasicInfo.temporary_address || "");
    setValue("job", UserBasicInfo.job || "");

    // Preload uploaded files URLs
    if (UserBasicInfo.nidFront) setNidFront([UserBasicInfo.nidFront]);
    if (UserBasicInfo.nidBack) setNidBack([UserBasicInfo.nidBack]);
    if (UserBasicInfo.passportPhoto)
      setPassportPhoto([UserBasicInfo.passportPhoto]);
    if (UserBasicInfo.signature) setSignature(UserBasicInfo.signature);
  }, [UserBasicInfo, setValue]);

  // Helper: upload file To Imgbb
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("album", ImgBB_Album_Key);

    try {
      const res = await axios.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.display_url;
    } catch (error) {
      throw new Error(
        error?.response?.data?.error?.message ||
          error.message ||
          "Image upload failed"
      );
    }
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      // Check if user is logged in
      if (!user?.phone) {
        return Swal.fire({
          icon: "error",
          title: "Phone Missing",
          text: "ব্যবহারকারীর ফোন নম্বর পাওয়া যায়নি।",
        });
      }

      // Set loading
      setLoading(true);

      // Helper: upload file if new
      const uploadIfNew = async (file) => {
        if (!file) return "";
        if (typeof file === "string") return file;
        return await uploadToImgBB(file);
      };

      // Upload new files (or keep old)
      const nidFrontUrl =
        nidFront.length > 0
          ? await uploadIfNew(nidFront[0])
          : UserBasicInfo?.nidFront || "";

      const nidBackUrl =
        nidBack.length > 0
          ? await uploadIfNew(nidBack[0])
          : UserBasicInfo?.nidBack || "";

      const passportUrl =
        passportPhoto.length > 0
          ? await uploadIfNew(passportPhoto[0])
          : UserBasicInfo?.passportPhoto || "";

      const signatureUrl = signature
        ? await uploadIfNew(signature)
        : UserBasicInfo?.signature || "";

      // Prepare final data
      const updatedData = {
        ...data,
        phone: user.phone,
        nidFront: nidFrontUrl,
        nidBack: nidBackUrl,
        passportPhoto: passportUrl,
        signature: signatureUrl,
      };

      // Send update request
      const response = await axiosPublic.put(
        `/Users/Phone/${user?.phone}`,
        updatedData
      );

      // Correct success check
      if (
        response?.status === 200 &&
        response?.data?.message?.toLowerCase().includes("success")
      ) {
        Swal.fire({
          icon: "success",
          title: "আপডেট সম্পন্ন!",
          text: "তথ্য সফলভাবে আপডেট হয়েছে।",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "আপডেট ব্যর্থ",
          text:
            response?.data?.message ||
            "তথ্য আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text:
          error?.response?.data?.message ||
          "আপডেটের সময় একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
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
    <div className="py-4 rounded-2xl">
      {/* Header */}
      <div className="flex flex-row items-center sm:items-start gap-4 text-left">
        {/* Icon */}
        <img src={Loan} alt="Loan Icon" className="w-16 sm:w-20" />

        {/* Text */}
        <div className="text-black">
          <h3 className="font-semibold text-2xl sm:text-3xl">ঋণ আবেদন ফর্ম</h3>
          <p className="text-sm sm:text-base text-gray-600">
            আপনার প্রয়োজনীয় ঋণের জন্য আবেদন করুন
          </p>
        </div>
      </div>

      {/* Divider */}
      <p className="bg-black h-[1px] w-[99%] mx-auto my-6" />

      {/* Title */}
      <div className="flex items-center gap-5 text-lg text-blue-500">
        <FaUser />
        <p className="text-black font-semibold">ব্যক্তিগত তথ্য</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="text-black space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Name */}
          <TextInput
            label="নাম"
            id="name"
            icon={FaUser}
            required
            placeholder="আপনার নাম লিখুন"
            register={register}
            validation={{ required: "নাম আবশ্যক" }}
            error={errors.name}
          />

          {/* Fathers Name */}
          <TextInput
            label="পিতার নাম"
            id="fathers_name"
            icon={FaUserTie}
            required
            placeholder="আপনার পিতার নাম লিখুন"
            register={register}
            validation={{ required: "পিতার নাম আবশ্যক" }}
            error={errors.fathers_name}
          />
          <TextInput
            label="মায়ের নাম"
            id="mothers_name"
            icon={FaFemale}
            required
            placeholder="আপনার মায়ের নাম লিখুন"
            register={register}
            validation={{ required: "মায়ের নাম আবশ্যক" }}
            error={errors.mothers_name}
          />
          <TextInput
            label="জাতীয় পরিচয়পত্র নম্বর"
            id="nid_number"
            icon={FaIdCard}
            required
            placeholder="আপনার জাতীয় পরিচয়পত্র নম্বর লিখুন"
            register={register}
            validation={{ required: "জাতীয় পরিচয়পত্র নম্বর আবশ্যক" }}
            error={errors.nid_number}
          />
        </div>

        <TextInput
          label="রক্তের গ্রুপ"
          id="blood_group"
          icon={FaTint}
          select
          selectPlaceholder="রক্তের গ্রুপ নির্বাচন করুন"
          required
          options={[
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
          ]}
          register={register}
          validation={{ required: "রক্তের গ্রুপ আবশ্যক" }}
          error={errors.blood_group}
        />

        <TextInput
          label="স্থায়ী ঠিকানা"
          id="permanent_address"
          icon={FaHome}
          placeholder="আপনার স্থায়ী ঠিকানা লিখুন"
          textarea
          required
          register={register}
          validation={{ required: "স্থায়ী ঠিকানা আবশ্যক" }}
          error={errors.permanent_address}
        />

        <TextInput
          label="অস্থায়ী ঠিকানা"
          id="temporary_address"
          icon={FaMapMarkerAlt}
          placeholder="আপনার অস্থায়ী ঠিকানা লিখুন"
          textarea
          required
          register={register}
          validation={{ required: "অস্থায়ী ঠিকানা আবশ্যক" }}
          error={errors.temporary_address}
        />

        <TextInput
          label="পেশা"
          id="job"
          icon={FaBriefcase}
          placeholder="আপনার পেশা লিখুন"
          required
          register={register}
          validation={{ required: "আপনার পেশা আবশ্যক" }}
          error={errors.job}
        />

        {/* Attachments */}
        <div className="space-y-2 md:space-y-6">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaPaperclip className="text-gray-500" />
            এটাচমেন্ট বা কাগজপত্রসমূহ
          </h3>

          {/* Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
            <FileUploadCard
              label="এনআইডি কার্ড সামনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNidFront}
              initialFiles={nidFront}
            />

            <FileUploadCard
              label="এনআইডি কার্ড পিছনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNidBack}
              initialFiles={nidBack}
            />

            <div className="md:col-span-2 min-w-full md:min-w-1/2 mx-auto">
              <FileUploadCard
                label="পাসপোর্ট সাইজের ছবি"
                icon={FaUserCircle}
                multiple={false}
                maxFiles={1}
                accept={{ "image/*": [] }}
                onChange={setPassportPhoto}
                initialFiles={passportPhoto}
              />
            </div>
          </div>

          <SignaturePad
            label="দস্তখত দিন"
            required
            disabled={true}
            onChange={setSignature}
            defaultValue={signature}
          />
        </div>

        {/* Submit */}
        <div className="flex pt-4">
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "জমা হচ্ছে..." : "সাবমিট করুন"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInformationEdit;
