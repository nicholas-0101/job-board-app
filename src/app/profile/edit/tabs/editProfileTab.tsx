"use client";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import InputField from "../../components/inputField";
import SelectField from "../../components/selectField";
import QuillField from "../../components/quillField";
import CityField from "../../components/cityField";
import { FileUploader } from "../../components/fileUploader";
import {
  Phone,
  Building,
  Globe,
  CalendarDaysIcon,
  GraduationCap,
  Home,
  Loader,
} from "lucide-react";
import {
  userProfileSchema,
  adminProfileSchema,
} from "../../changeProfileSchema";
import { useProfile } from "@/lib/hooks/useProfile";
import { apiCall } from "@/helper/axios";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";

export default function ProfileTab() {
  const { user, initialValues, loadingProfile, setInitialValues } =
    useProfile();
  const { setUser } = useUserStore();
  const { setCompany } = useCompanyStore();

  const [isSaving, setIsSaving] = useState(false);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  const handleEditProfile = async (values: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res.data?.data ?? res.data;
      if (payload?.role === "USER") {
        setUser(payload);
      } else if (payload?.role === "ADMIN" || payload?.adminId) {
        setCompany(payload);
      }

      if (payload) setInitialValues(mapPayloadToInitialValues(payload));
      alert(res.data?.message ?? "Profile updated");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={
        user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
      }
      onSubmit={handleEditProfile}
    >
      {({ setFieldValue }) => (
        <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
          {user?.role === "ADMIN" ? (
            <>
              <InputField
                name="phone"
                label="Company Phone"
                placeholder="Enter company phone"
                icon={Phone}
              />
              <InputField
                name="location"
                label="Full Address"
                placeholder="Company full address"
                icon={Building}
              />
              <CityField
                name="city"
                label="City"
                placeholder="Search your city..."
              />
              <InputField
                name="website"
                label="Website"
                placeholder="https://example.com"
                icon={Globe}
              />
              <QuillField
                name="description"
                label="Description"
                placeholder="Write something about your company..."
              />
              <FileUploader name="logo" label="Logo" />
            </>
          ) : (
            <>
              <InputField
                name="phone"
                label="Phone"
                placeholder="Enter your phone"
                icon={Phone}
              />
              <SelectField
                name="gender"
                label="Gender"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />
              <InputField
                name="dob"
                label="Date of Birth"
                type="date"
                icon={CalendarDaysIcon}
              />
              <InputField
                name="education"
                label="Education"
                placeholder="Your education"
                icon={GraduationCap}
              />
              <InputField
                name="address"
                label="Full Address"
                placeholder="Your full address"
                icon={Home}
              />
              <CityField
                name="city"
                label="City"
                placeholder="Search your city..."
              />
              <FileUploader
                name="profilePicture"
                label="Profile Picture"
                isRounded
              />
            </>
          )}

          <motion.button
            type="submit"
            className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
              isSaving
                ? "cursor-not-allowed opacity-70"
                : "hover:shadow-xl cursor-pointer"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Updating..." : "Save Changes"}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
}
