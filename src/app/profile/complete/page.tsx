"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Phone, MapPin, Calendar, GraduationCap, Home, Globe } from "lucide-react";
import { apiCall } from "@/helper/axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { userProfileSchema, adminProfileSchema } from "../changeProfileSchema";

import CityField from "../components/cityField";
import InputField from "../components/inputField";
import SelectField from "../components/selectField";
import QuillField from "../components/quillField";
import { FileUploader } from "../components/fileUploader";

export default function CompleteProfilePage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("verifiedUser");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const handleCompleteProfile = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      if (values.dob) values.dob = new Date(values.dob).toISOString();
      const formData = new FormData();
      for (const key in values) if (values[key]) formData.append(key, values[key]);
      const res = await apiCall.put("/profile/complete", formData);
      alert(res.data.message || "Profile completed successfully!");
      resetForm();
      router.replace("/auth/signin");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to complete profile!");
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdminFields = (setFieldValue: any) => (
    <>
      <InputField name="phone" label="Company Phone" placeholder="Enter company phone" icon={Phone} />
      <InputField name="location" label="Full Address" placeholder="Company full address" icon={MapPin} />
      <CityField name="city" label="City" placeholder="Search your city..." />
      <InputField name="website" label="Website" placeholder="https://example.com" icon={Globe} />
      <QuillField name="description" label="Description" placeholder="Write something about your company..." />
      <FileUploader name="logoUrl" label="Logo" />
    </>
  );

  const renderUserFields = (setFieldValue: any) => (
    <>
      <InputField name="phone" label="Phone" placeholder="Enter your phone" icon={Phone} />
      <SelectField
        name="gender"
        label="Gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />
      <InputField name="dob" label="Date of Birth" type="date" icon={Calendar} />
      <InputField name="education" label="Education" placeholder="Your education" icon={GraduationCap} />
      <InputField name="address" label="Full Address" placeholder="Your full address" icon={Home} />
      <CityField name="city" label="City" placeholder="Search your city..." />
      <FileUploader name="profilePicture" label="Profile Picture" isRounded />
    </>
  );

  return (
    <div className="min-h-screen pb-30 bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">Complete your profile</h1>
          <p className="text-muted-foreground">Please fill in your details to complete your profile</p>
        </motion.div>

        <Formik
          initialValues={
            user?.role === "ADMIN"
              ? { phone: "", location: "", description: "", website: "", logo: null }
              : { phone: "", gender: "", dob: "", education: "", address: "", profilePicture: null }
          }
          validationSchema={user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema}
          onSubmit={handleCompleteProfile}
        >
          {({ setFieldValue }) => (
            <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
              {user?.role === "ADMIN" ? renderAdminFields(setFieldValue) : renderUserFields(setFieldValue)}

              <motion.button
                type="submit"
                className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
                  isLoading ? "cursor-not-allowed opacity-70" : "hover:shadow-xl cursor-pointer"
                }`}
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Complete Profile"
                )}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}