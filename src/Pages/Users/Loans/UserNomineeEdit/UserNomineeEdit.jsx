import { useEffect, useState } from "react";

// Packages
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaIdCard,
  FaPaperclip,
  FaPhone,
  FaUser,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";

// Shared
import TextInput from "../../../../Shared/TextInput";
import FileUploadCard from "../../../../Shared/FileUploadCard";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image Uploader
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;
const ImgBB_Album_Key = import.meta.env.VITE_IMAGE_ALBUM_KEY;

const UserNomineeEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  console.log(user.phone);

  // Form Handler
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Nominee Form State
  const [nomineeNidFront, setNomineeNidFront] = useState([]);
  const [nomineeNidBack, setNomineeNidBack] = useState([]);
  const [nomineePassportPhoto, setNomineePassportPhoto] = useState([]);

  // Fetch nominee info
  const { data: NomineeInfo, isLoading } = useQuery({
    queryKey: ["NomineeInfo", user?.phone],
    queryFn: () =>
      axiosPublic
        .get(`/NomineeInfo/Phone/${user?.phone}`)
        .then((res) => res.data),
    enabled: !!user?.phone,
  });

  // Populate existing data
  useEffect(() => {
    if (!NomineeInfo) return;

    setValue("nominee_name", NomineeInfo.nominee_name || "");
    setValue("nominee_phone", NomineeInfo.nominee_phone || "");
    setValue("relation", NomineeInfo.relation || "");
    setValue("nominee_nid", NomineeInfo.nominee_nid || "");

    if (NomineeInfo.nominee_nid_front)
      setNomineeNidFront([NomineeInfo.nominee_nid_front]);
    if (NomineeInfo.nominee_nid_back)
      setNomineeNidBack([NomineeInfo.nominee_nid_back]);
    if (NomineeInfo.nominee_passport_photo)
      setNomineePassportPhoto([NomineeInfo.nominee_passport_photo]);
  }, [NomineeInfo, setValue]);

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

  // Submit handler
  const onSubmit = async (data) => {
    try {
      // Check if user logged in
      if (!user?.phone) {
        return Swal.fire({
          icon: "error",
          title: "Phone Missing",
          text: "ব্যবহারকারীর ফোন নম্বর পাওয়া যায়নি।",
        });
      }

      setLoading(true);

      const uploadIfNew = async (file) => {
        if (!file) return "";
        if (typeof file === "string") return file;
        return await uploadToImgBB(file);
      };

      const nomineeNidFrontUrl =
        nomineeNidFront.length > 0
          ? await uploadIfNew(nomineeNidFront[0])
          : NomineeInfo?.nominee_nid_front || "";

      const nomineeNidBackUrl =
        nomineeNidBack.length > 0
          ? await uploadIfNew(nomineeNidBack[0])
          : NomineeInfo?.nominee_nid_back || "";

      const nomineePassportUrl =
        nomineePassportPhoto.length > 0
          ? await uploadIfNew(nomineePassportPhoto[0])
          : NomineeInfo?.nominee_passport_photo || "";

      const updatedData = {
        ...data,
        user_phone: user.phone,
        nominee_nid_front: nomineeNidFrontUrl,
        nominee_nid_back: nomineeNidBackUrl,
        nominee_passport_photo: nomineePassportUrl,
      };

      const response = await axiosPublic.put(
        `/NomineeInfo/Phone/${user?.phone}`,
        updatedData
      );

      if (response?.data?.success || response?.data?.message) {
        Swal.fire({
          icon: "success",
          title: "আপডেট সম্পন্ন!",
          text: "নমিনীর তথ্য সফলভাবে আপডেট হয়েছে।",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "আপডেট ব্যর্থ",
          text: "তথ্য আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "আপডেটের সময় একটি সমস্যা হয়েছে।",
      });
    } finally {
      setLoading(false);
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

  return (
    <div>
      <div className="py-4 rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 text-black">
          <FaUser className="text-3xl" />
          <h3 className="font-semibold text-2xl">নমিনীর তথ্য</h3>
        </div>

        {/* Divider */}
        <p className="bg-black h-[1px] w-[99%] mx-auto my-6" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-black space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 space-y-3">
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

            <div className="grid grid-cols-2 gap-2">
              <FileUploadCard
                label="নমিনির এনআইডি কার্ড সামনের দিক"
                icon={FaIdCard}
                multiple={false}
                maxFiles={1}
                accept={{ "image/*": [] }}
                onChange={setNomineeNidFront}
                initialFiles={nomineeNidFront}
              />

              <FileUploadCard
                label="নমিনির এনআইডি কার্ড পিছনের দিক"
                icon={FaIdCard}
                multiple={false}
                maxFiles={1}
                accept={{ "image/*": [] }}
                onChange={setNomineeNidBack}
                initialFiles={nomineeNidBack}
              />

              <div className="col-span-2 min-w-1/2 mx-auto">
                <FileUploadCard
                  label="নমিনির পাসপোর্ট সাইজের ছবি"
                  icon={FaUserCircle}
                  multiple={false}
                  maxFiles={1}
                  accept={{ "image/*": [] }}
                  onChange={setNomineePassportPhoto}
                  initialFiles={nomineePassportPhoto}
                />
              </div>
            </div>
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
    </div>
  );
};

export default UserNomineeEdit;
