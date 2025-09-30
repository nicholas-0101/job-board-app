"use client";
import { Formik, Form } from "formik";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import { apiCall } from "@/helper/axios";
import { motion } from "framer-motion";
import InputField from "../../components/inputField";
import SelectField from "../../components/selectField";
import QuillField from "../../components/quillField";
import CityField from "../../components/cityField";
import { FileUploader } from "../../components/fileUploader";
import { Phone, Building, Globe, CalendarDaysIcon, GraduationCap, Home } from "lucide-react";
import { userProfileSchema, adminProfileSchema } from "../../changeProfileSchema";
import { useState } from "react";


export default function ProfileTab() {
  const { user, setUser } = useUserStore();
  const { company, setCompany } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(false);

  const formatDateForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`;
  };

  const handleEditProfile = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in values) if (values[key]) formData.append(key, values[key]);

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.data.role === "USER") setUser(res.data.data);
      else if (res.data.data.adminId) setCompany(res.data.data);

      alert(res.data.message || "Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={
        user?.role === "ADMIN"
          ? {
              phone: company?.phone || "",
              location: company?.location || "",
              city: company?.city || "",
              description: company?.description || "",
              website: company?.website || "",
              logo: company?.logo || null,
            }
          : {
              phone: user?.phone || "",
              gender: user?.gender || "",
              dob: formatDateForInput(user?.dob),
              education: user?.education || "",
              address: user?.address || "",
              city: user?.city || "",
              profilePicture: user?.profilePicture || null,
            }
      }
      enableReinitialize
      validationSchema={user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema}
      onSubmit={handleEditProfile}
    >
      {({ setFieldValue }) => (
        <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
          {/* ADMIN Fields */}
          {user?.role === "ADMIN" ? (
            <>
              <InputField name="phone" label="Company Phone" placeholder="Enter company phone" icon={Phone} />
              <InputField name="location" label="Full Address" placeholder="Company full address" icon={Building} />
              <CityField name="city" label="City" placeholder="Search your city..." />
              <InputField name="website" label="Website" placeholder="https://example.com" icon={Globe} />
              <QuillField name="description" label="Description" placeholder="Write something about your company..." />
              <FileUploader name="logo" label="Logo" />
            </>
          ) : (
            <>
              {/* USER Fields */}
              <InputField name="phone" label="Phone" placeholder="Enter your phone" icon={Phone} />
              <SelectField name="gender" label="Gender" options={[{value:"Male",label:"Male"},{value:"Female",label:"Female"}]}  />
              <InputField name="dob" label="Date of Birth" type="date" icon={CalendarDaysIcon} />
              <InputField name="education" label="Education" placeholder="Your education" icon={GraduationCap} />
              <InputField name="address" label="Full Address" placeholder="Your full address" icon={Home} />
              <CityField name="city" label="City" placeholder="Search your city..." />
              <FileUploader name="profilePicture" label="Profile Picture" isRounded />
            </>
          )}

          <motion.button
            type="submit"
            className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
              isLoading ? "cursor-not-allowed opacity-70" : "hover:shadow-xl cursor-pointer"
            }`}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
}