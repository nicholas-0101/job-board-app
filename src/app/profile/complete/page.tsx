"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import dynamic from "next/dynamic";
import { apiCall } from "@/helper/axios";
import { Upload, Phone, MapPin, Globe } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface AdminFormValues {
  phone: string;
  location: string;
  description: string;
  website: string;
  logo: File | null;
}

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
}

export default function EditProfilePage() {
  const { user } = useUserStore();
  const isAdmin = user?.role === "ADMIN";

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileInfo, setLogoFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleEditProfile = async (
    values: AdminFormValues,
    { resetForm }: FormikHelpers<AdminFormValues>
  ) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("location", values.location);
      formData.append("description", values.description);
      formData.append("website", values.website);

      if (values.logo) formData.append("logo", values.logo);

      const res = await apiCall.put("/profile/edit", formData);
      alert(res.data.message || "Profile updated successfully!");
      resetForm();
      setLogoPreview(null);
      setLogoFileInfo(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    icon: Icon,
    type = "text",
  }: InputFieldProps) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input bg-secondary focus:outline-none focus:border-primary hover:bg-background transition-all"
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="min-h-screen pb-30 bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mt-10 mb-5">
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Complete your profile!
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        {isAdmin && (
          <Formik<AdminFormValues>
            initialValues={{
              phone: "",
              location: "",
              description: "",
              website: "",
              logo: null,
            }}
            onSubmit={handleEditProfile}
          >
            {({ values, setFieldValue }) => (
              <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
                <InputField
                  name="phone"
                  label="Company Phone"
                  placeholder="Enter company phone"
                  icon={Phone}
                  value={values.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("phone", e.target.value)
                  }
                />

                <InputField
                  name="location"
                  label="Location"
                  placeholder="Company location"
                  icon={MapPin}
                  value={values.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("location", e.target.value)
                  }
                />

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <ReactQuill
                    value={values.description}
                    onChange={(val) => setFieldValue("description", val)}
                    className="bg-white rounded-xl"
                  />
                </div>

                <InputField
                  name="website"
                  label="Website"
                  placeholder="https://example.com"
                  icon={Globe}
                  value={values.website}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("website", e.target.value)
                  }
                />

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Logo
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-input bg-secondary cursor-pointer hover:bg-background transition relative">
                    <Upload className="w-5 h-5 text-gray-400" /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.currentTarget.files?.[0];
                        setFieldValue("logo", file);
                        if (file) {
                          setLogoPreview(URL.createObjectURL(file));
                          setLogoFileInfo({
                            name: file.name,
                            size:
                              file.size / 1024 / 1024 < 1
                                ? (file.size / 1024).toFixed(1) + " KB"
                                : (file.size / 1024 / 1024).toFixed(1) + " MB",
                          });
                        }
                      }}
                    />
                  </label>
                  {logoPreview && (
                    <div className="mt-4 flex items-center gap-4">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="text-sm text-muted-foreground">
                        <p>{logoFileInfo?.name}</p>
                        <p className="text-xs">{logoFileInfo?.size}</p>
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
                    isLoading
                      ? "cursor-not-allowed opacity-70"
                      : "hover:shadow-xl cursor-pointer"
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
                    "Save Profile"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}
      </motion.div>
    </motion.div>
  );
}
