"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useField,
  useFormikContext,
} from "formik";
import dynamic from "next/dynamic";
import {
  Upload,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Home,
  Globe,
  FileText,
  User,
} from "lucide-react";
import { apiCall } from "@/helper/axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import {
  userProfileSchema,
  adminProfileSchema,
} from "../edit/editProfileSchema";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<any>;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

interface QuillFieldProps {
  name: string;
  label: string;
  icon?: React.ElementType;
  placeholder?: string;
}

export default function CompleteProfilePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileInfo, setLogoFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleCompleteProfile = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.append(key, values[key]);
      }
      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "Profile completed successfully!");
      resetForm();
      router.replace("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete profile!");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    name,
    label,
    placeholder,
    type = "text",
    icon: Icon,
    toggleIcon,
    onToggle,
  }: InputFieldProps & {
    toggleIcon?: React.ReactNode;
    onToggle?: () => void;
  }) => {
    const [field, meta] = useField(name);

    return (
      <div className="mb-6">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            id={name}
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
              meta.touched && meta.error
                ? "border-red-400 bg-red-50"
                : "border-input focus:border-primary bg-secondary"
            }`}
          />

          {toggleIcon ? (
            <button
              type="button"
              onClick={onToggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {toggleIcon}
            </button>
          ) : type === "date" ? (
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  name
                ) as HTMLInputElement | null;
                if (input) {
                  (input as any).showPicker?.();
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Calendar className="w-5 h-5" />
            </button>
          ) : null}
        </div>

        <ErrorMessage
          name={name}
          component="div"
          className="text-red-400 text-sm mt-1"
        />
      </div>
    );
  };

  const SelectField = ({ name, label, options }: SelectFieldProps) => {
    const [field, meta] = useField(name);

    return (
      <div className="mb-6 relative">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>

          <select
            id={name}
            {...field}
            className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 focus:outline-none transition-all appearance-none ${
              meta.touched && meta.error
                ? "border-red-400 bg-red-50"
                : "border-input focus:border-primary bg-secondary hover:bg-background"
            }`}
          >
            <option value="">Select gender</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <ErrorMessage
          name={name}
          component="div"
          className="text-red-400 text-sm mt-1"
        />
      </div>
    );
  };

  const QuillField = ({
    name,
    label,
    icon: Icon = FileText,
    placeholder,
  }: QuillFieldProps) => {
    const { values, errors, touched, setFieldValue, setFieldTouched } =
      useFormikContext<any>();

    return (
      <div className="mb-6">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>

        <div
          className={`relative rounded-xl border-2 transition-all ${
            touched[name] && errors[name]
              ? "border-red-400 bg-red-50"
              : "border-input bg-secondary focus-within:border-primary hover:bg-background"
          }`}
        >
          {Icon && (
            <Icon className="absolute left-4 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          )}

          <ReactQuill
            id={name}
            value={values[name]}
            onChange={(val) => setFieldValue(name, val)}
            onBlur={() => setFieldTouched(name, true)}
            className="custom-quill w-full pl-12 pr-4"
            placeholder={placeholder}
          />
        </div>

        {touched[name] && errors[name] && (
          <div className="text-red-400 text-sm mt-1">
            {errors[name] as string}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-30 bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Complete your profile
          </h1>
          <p className="text-muted-foreground">
            Please fill in your details to complete your profile
          </p>
        </motion.div>

        <Formik
          initialValues={
            user?.role === "ADMIN"
              ? {
                  phone: "",
                  location: "",
                  description: "",
                  website: "",
                  logo: null,
                }
              : {
                  phone: "",
                  gender: "",
                  dob: "",
                  education: "",
                  address: "",
                  profilePicture: null,
                }
          }
          validationSchema={
            user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
          }
          onSubmit={handleCompleteProfile}
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
                    label="Location"
                    placeholder="Company location"
                    icon={MapPin}
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
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          setFieldValue("logo", file);
                          if (file) {
                            const objectUrl = URL.createObjectURL(file);
                            setLogoPreview(objectUrl);
                            setLogoFileInfo({
                              name: file.name,
                              size:
                                file.size / 1024 / 1024 < 1
                                  ? (file.size / 1024).toFixed(1) + " KB"
                                  : (file.size / 1024 / 1024).toFixed(1) +
                                    " MB",
                            });
                          }
                        }}
                      />
                    </label>

                    {logoPreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Preview
                        </p>
                        <div className="flex items-center gap-4">
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
                      </div>
                    )}
                  </div>
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
                    icon={Calendar}
                  />

                  <InputField
                    name="education"
                    label="Education"
                    placeholder="Your education"
                    icon={GraduationCap}
                  />

                  <InputField
                    name="address"
                    label="Address"
                    placeholder="Your address"
                    icon={Home}
                  />

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profile Picture
                    </label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-input bg-secondary cursor-pointer hover:bg-background transition relative">
                      <Upload className="w-5 h-5 text-gray-400" /> Upload
                      Profile Picture
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          setFieldValue("profilePicture", file);
                          if (file) {
                            const objectUrl = URL.createObjectURL(file);
                            setPreview(objectUrl);
                            setFileInfo({
                              name: file.name,
                              size:
                                file.size / 1024 / 1024 < 1
                                  ? (file.size / 1024).toFixed(1) + " KB"
                                  : (file.size / 1024 / 1024).toFixed(1) +
                                    " MB",
                            });
                          }
                        }}
                      />
                    </label>

                    {preview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Preview
                        </p>
                        <div className="flex items-center gap-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                          <div className="text-sm text-muted-foreground">
                            <p>{fileInfo?.name}</p>
                            <p className="text-xs">{fileInfo?.size}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

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
