import { FaFemale, FaIdCard, FaUser, FaUserTie } from "react-icons/fa";
import Loan from "../../assets/PersonalInfo/Loan.png";
import TextInput from "../../Shared/TextInput";
import { useForm } from "react-hook-form";
const PersonalInfo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className="mx-auto max-w-4xl shadow-2xl rounded-md p-4 my-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={Loan} alt="Loan Icon" className="w-15" />

        <div className="text-black">
          <h3 className="font-semibold text-2xl">ঋণ আবেদন ফর্ম</h3>
          <p>আপনার প্রয়োজনীয় ঋণের জন্য আবেদন করুন</p>
        </div>
      </div>

      {/* Divider */}
      <p className="bg-black h-[1px] w-[99%] mx-auto my-6" />

      {/* User  */}
      <div className="flex items-center gap-5 text-lg text-blue-500">
        <FaUser />
        <p className="text-black font-semibold">ব্যক্তিগত তথ্য</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="text-black">
        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* Applicant Name */}
          <TextInput
            label="নাম"
            id="name"
            icon={FaUser}
            placeholder="আপনার নাম লিখুন"
            register={register}
            validation={{ required: "নাম আবশ্যক" }}
            error={errors.name}
          />

          {/* Father's Name */}
          <TextInput
            label="পিতার নাম"
            id="fathers_name"
            icon={FaUserTie}
            placeholder="আপনার পিতার নাম লিখুন"
            register={register}
            validation={{ required: "পিতার নাম আবশ্যক" }}
            error={errors.fathers_name}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* Mother's Name */}
          <TextInput
            label="মায়ের নাম"
            id="mothers_name"
            icon={FaFemale}
            placeholder="আপনার মায়ের নাম লিখুন"
            register={register}
            validation={{ required: "মায়ের নাম আবশ্যক" }}
            error={errors.mothers_name}
          />

          {/* NID Number */}
          <TextInput
            label="জাতীয় পরিচয়পত্র নম্বর"
            id="nid_number"
            icon={FaIdCard}
            placeholder="আপনার জাতীয় পরিচয়পত্র নম্বর লিখুন"
            register={register}
            validation={{ required: "জাতীয় পরিচয়পত্র নম্বর আবশ্যক" }}
            error={errors.nid_number}
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
