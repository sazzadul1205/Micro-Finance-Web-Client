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
import Loan from "../../assets/PersonalInfo/Loan.png";
import TextInput from "../../Shared/TextInput";
import { useForm } from "react-hook-form";
import FileUploadCard from "../../Shared/FileUploadCard";
import SignaturePad from "../../Shared/SignaturePad";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;
const ImgBB_Album_Key = import.meta.env.VITE_IMAGE_ALBUM_KEY;

const PersonalInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const axiosPublic = useAxiosPublic();

  // Hooks
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [nidFront, setNidFront] = useState([]);
  const [nidBack, setNidBack] = useState([]);
  const [passportPhoto, setPassportPhoto] = useState([]);
  const [signature, setSignature] = useState(null); // Blob
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data) => {
    // Check if user is logged in
    if (!user?.phone) {
      return Swal.fire({
        icon: "error",
        title: "Phone Missing",
        text: "ব্যবহারকারীর ফোন নম্বর পাওয়া যায়নি।",
      });
    }

    // Check if all required fields are filled
    if (!nidFront.length) return alert("এনআইডি সামনের ছবি আবশ্যক");
    if (!nidBack.length) return alert("এনআইডি পিছনের ছবি আবশ্যক");
    if (!passportPhoto.length) return alert("পাসপোর্ট ছবি আবশ্যক");
    if (!signature) return alert("দস্তখত আবশ্যক");

    // Start loading
    setLoading(true);

    try {
      // Upload images/signature
      const nidFrontUrl = await uploadToImgBB(nidFront[0]);
      const nidBackUrl = await uploadToImgBB(nidBack[0]);
      const passportUrl = await uploadToImgBB(passportPhoto[0]);
      const signatureUrl = await uploadToImgBB(signature);

      // Prepare form data
      const formData = {
        ...data,
        nidFront: nidFrontUrl,
        nidBack: nidBackUrl,
        passportPhoto: passportUrl,
        signature: signatureUrl,
      };

      // Update the user by phone
      await axiosPublic.put(`/Users/Phone/${user.phone}`, formData);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Form Submitted!",
        text: "আপনার তথ্য সফলভাবে জমা হয়েছে।",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
      navigate
    }
  };

  return (
    <div className="mx-auto max-w-4xl shadow-2xl rounded-md p-4">
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img src={Loan} alt="Loan Icon" className="w-15" />
          <div className="text-black">
            <h3 className="font-semibold text-2xl">ঋণ আবেদন ফর্ম</h3>
            <p>আপনার প্রয়োজনীয় ঋণের জন্য আবেদন করুন</p>
          </div>
        </div>

        <p className="bg-black h-[1px] w-[99%] mx-auto my-6" />

        <div className="flex items-center gap-5 text-lg text-blue-500">
          <FaUser />
          <p className="text-black font-semibold">ব্যক্তিগত তথ্য</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-black space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FaPaperclip className="text-gray-500" />
              এটাচমেন্ট বা কাগজপত্রসমূহ
            </h3>

            <FileUploadCard
              label="এনআইডি কার্ড সামনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNidFront}
            />

            <FileUploadCard
              label="এনআইডি কার্ড পিছনের দিক"
              icon={FaIdCard}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setNidBack}
            />

            <FileUploadCard
              label="পাসপোর্ট সাইজের ছবি"
              icon={FaUserCircle}
              multiple={false}
              maxFiles={1}
              accept={{ "image/*": [] }}
              onChange={setPassportPhoto}
            />

            {/* SignaturePad returns a Blob now */}
            <SignaturePad label="দস্তখত দিন" required onChange={setSignature} />
          </div>

          <div className="flex pt-4">
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
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

export default PersonalInfo;
