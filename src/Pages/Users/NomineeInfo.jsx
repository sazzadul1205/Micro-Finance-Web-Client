import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import {
  FaIdCard,
  FaPaperclip,
  FaPhone,
  FaUser,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";

// Packages
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Shared
import TextInput from "../../Shared/TextInput";
import FileUploadCard from "../../Shared/FileUploadCard";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Image Uploader
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;
const ImgBB_Album_Key = import.meta.env.VITE_IMAGE_ALBUM_KEY;

const NomineeInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  // Hooks
  const navigate = useNavigate();

  // Form Handler
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Form State
  const [nomineeNidBack, setNomineeNidBack] = useState([]);
  const [nomineeNidFront, setNomineeNidFront] = useState([]);
  const [nomineePassportPhoto, setNomineePassportPhoto] = useState([]);

  // Check if basic info already submitted
  const { data: NomineeInfoExistCheck, isLoading } = useQuery({
    queryKey: ["NomineeInfoExistCheck", user?.phone],
    queryFn: () =>
      axiosPublic
        .get(`/NomineeInfo/NomineeInfoExistCheck/${user?.phone}`)
        .then((res) => res.data),
    enabled: !!user?.phone, // only run if phone exists
  });

  // Redirect if basic info already submitted
  useEffect(() => {
    if (!isLoading && NomineeInfoExistCheck?.nomineeInfoSubmitted) {
      navigate("/BankInfo"); // redirect if nominee info already submitted
    }
  }, [NomineeInfoExistCheck, isLoading, navigate]);

  // Image Uploader
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

  // On Submit Handler
  const onSubmit = async (data) => {
    if (!user?.phone) {
      return Swal.fire({
        icon: "error",
        title: "Phone Missing",
        text: "ব্যবহারকারীর ফোন নম্বর পাওয়া যায়নি।",
      });
    }

    // Validate attachments
    if (!nomineeNidFront.length)
      return Swal.fire("ত্রুটি", "নমিনির এনআইডি সামনের ছবি আবশ্যক", "error");
    if (!nomineeNidBack.length)
      return Swal.fire("ত্রুটি", "নমিনির এনআইডি পিছনের ছবি আবশ্যক", "error");
    if (!nomineePassportPhoto.length)
      return Swal.fire("ত্রুটি", "নমিনির পাসপোর্ট সাইজের ছবি আবশ্যক", "error");

    setLoading(true);

    try {
      // Upload all images to ImgBB
      const nidFrontUrl = await uploadToImgBB(nomineeNidFront[0]);
      const nidBackUrl = await uploadToImgBB(nomineeNidBack[0]);
      const passportUrl = await uploadToImgBB(nomineePassportPhoto[0]);

      // Prepare nominee data
      const nomineeData = {
        nominee_name: data.nominee_name,
        nominee_phone: data.nominee_phone,
        relation: data.relation,
        nominee_nid: data.nominee_nid,
        nominee_nid_front: nidFrontUrl,
        nominee_nid_back: nidBackUrl,
        nominee_passport_photo: passportUrl,
        user_phone: user.phone,
        submitted_at: new Date().toISOString(),
      };

      // Send to backend
      const res = await axiosPublic.post("/NomineeInfo", nomineeData);

      if (res.data?.insertedId || res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে সংরক্ষণ করা হয়েছে!",
          text: "নমিনির তথ্য সফলভাবে জমা হয়েছে।",
        });
      } else {
        throw new Error("নমিনির তথ্য জমা দিতে ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি ঘটেছে!",
        text:
          error?.response?.data?.message ||
          error.message ||
          "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
      navigate("/BankInfo");
    }
  };

  return (
    <div className="mx-auto max-w-4xl shadow-2xl rounded-md p-4">
      <div className="py-4 rounded-2xl my-4">
        {/* Header */}
        <div className="flex items-center gap-4 bg-blue-500 py-3 px-5 rounded-2xl text-white">
          <FaUser className="text-3xl" />
          <h3 className="font-semibold text-2xl">নমিনীর তথ্য</h3>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-4 py-3 rounded-2xl text-black">
          <RiErrorWarningFill className="text-3xl text-blue-500" />
          <p>
            আপনার মনোনীত ব্যক্তির তথ্য দিন (যিনি আপনার অনুপস্থিতিতে দায়িত্ব
            পালন করবেন)
          </p>
        </div>

        {/* Horizontal Line */}
        <p className="bg-gray-400 h-[1px] w-[99%] mx-auto my-1" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-black space-y-6"
        >
          {/* Nominee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 space-y-3">
            {/* Nominee Name */}
            <TextInput
              label="নমিনীর নাম"
              id="nominee_name"
              icon={FaUser}
              required
              placeholder="আপনার নমিনীর নাম লিখুন"
              register={register}
              validation={{ required: "নমিনীর নাম আবশ্যক" }}
              error={errors.nominee_name}
            />

            {/* Nominee Phone */}
            <TextInput
              label="নমিনীর ফোন নম্বর"
              id="nominee_phone"
              icon={FaPhone}
              required
              placeholder="আপনার নমিনীর ফোন নম্বর লিখুন"
              register={register}
              validation={{ required: "নমিনীর ফোন নম্বর আবশ্যক" }}
              error={errors.nominee_phone}
            />

            {/* Relation */}
            <TextInput
              label="সম্পর্ক"
              id="relation"
              icon={FaUserFriends}
              select
              selectPlaceholder="সম্পর্ক নির্বাচন করুন"
              required
              options={[
                { value: "father", label: "পিতা" },
                { value: "mother", label: "মাতা" },
                { value: "brother", label: "ভাই" },
                { value: "sister", label: "বোন" },
                { value: "spouse", label: "স্বামী/স্ত্রী" },
                { value: "other", label: "অন্যান্য" },
              ]}
              register={register}
              validation={{ required: "সম্পর্ক আবশ্যক" }}
              error={errors.relation}
            />

            {/* Nominee NID */}
            <TextInput
              label="নমিনীর জাতীয় পরিচয়পত্র নম্বর"
              id="nominee_nid"
              icon={FaIdCard}
              required
              placeholder="নমিনীর জাতীয় পরিচয়পত্র নম্বর লিখুন"
              register={register}
              validation={{ required: "নমিনীর জাতীয় পরিচয়পত্র নম্বর আবশ্যক" }}
              error={errors.nominee_nid}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FaPaperclip className="text-gray-500" />
              এটাচমেন্ট বা কাগজপত্রসমূহ
            </h3>

            <FileUploadCard
              label="নমিনির এনআইডি কার্ড সামনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNomineeNidFront}
            />

            <FileUploadCard
              label="নমিনির এনআইডি কার্ড পিছনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNomineeNidBack}
            />

            <FileUploadCard
              label="নমিনির পাসপোর্ট সাইজের ছবি"
              icon={FaUserCircle}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNomineePassportPhoto}
            />
          </div>

          {/* Submit Button */}

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
    </div>
  );
};

export default NomineeInfo;
