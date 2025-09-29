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
import { apiCall } from "@/helper/axios";
import dynamic from "next/dynamic";
import {
  Upload,
  Phone,
  MapPin,
  User,
  Calendar,
  GraduationCap,
  Home,
  Globe,
  Lock,
  Mail,
  EyeOff,
  Eye,
  FileText,
} from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import {
  userProfileSchema,
  adminProfileSchema,
  changeEmailSchema,
  changePasswordSchema,
} from "./editProfileSchema";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import { useCompanyStore } from "@/lib/store/companyStore";

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

export default function EditProfilePage() {
  const { user, setUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">(
    "profile"
  );
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
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { company, setCompany } = useCompanyStore();

  const handleEditProfile = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.append(key, values[key]);
      }

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.data.role === "USER") {
        setUser(res.data.data);
      } else if (res.data.data.adminId) {
        setCompany(res.data.data);
      }

      alert(res.data.message || "Profile updated successfully!");
      resetForm();

      // router.replace("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (values: { newEmail: string }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.patch("/auth/change-email", values);
      alert(res.data.message || "Email updated successfully!");
      router.replace("/auth/preverify");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change email!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.patch("/auth/change-password", values);
      alert(res.data.message || "Password changed successfully!");
    } catch (err: any) {
      if (
        err.response?.data?.message ===
        "Password change not allowed for Google sign-in users"
      ) {
        alert(
          "This account does not have a password because it was created via Google login. Password changes are not allowed."
        );
      } else if (err.response?.data?.message === "Old password is incorrect") {
        alert("Old password is incorrect.");
      } else if (
        err.response?.data?.message ===
        "New password and confirm password do not match"
      ) {
        alert("New password and confirm password do not match.");
      } else {
        alert("Failed to change password!");
      }
      // router.replace("/");
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

  const formatDateForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen pb-30 bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Tabs */}
        <div className="flex justify-around mb-8 border-b border-border">
          {["profile", "email", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? "text-[#467EC7] border-b-2 border-[#467EC7]"
                  : "text-muted-foreground hover:text-[#467EC7]"
              }`}
            >
              {tab === "profile"
                ? "Edit Profile"
                : tab === "email"
                ? "Change Email"
                : "Change Password"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Formik
            initialValues={
              user?.role === "ADMIN"
                ? {
                    phone: company?.phone || "",
                    location: company?.location || "",
                    description: company?.description || "",
                    website: company?.website || "",
                    logo: company?.logo || null,
                  }
                : {
                    phone: user?.phone || "",
                    gender: user?.gender || "",
                    dob: formatDateForInput(user?.dob) || "",
                    education: user?.education || "",
                    address: user?.address || "",
                    profilePicture: user?.profilePicture || null,
                  }
            }
            enableReinitialize
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

                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={logoPreview || company?.logo || ""}
                            alt="Logo Preview"
                            className="w-16 h-16 rounded-lg object-cover border"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-input bg-secondary cursor-pointer hover:bg-background transition relative w-full justify-center">
                            <Upload className="w-5 h-5 text-gray-400" /> Upload
                            Logo
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

                          {logoFileInfo ? (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>{logoFileInfo.name}</p>
                              <p className="text-xs">{logoFileInfo.size}</p>
                            </div>
                          ) : (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p className="text-xs">
                                Maximum file size 1MB. Only .jpg, .jpeg, and
                                .png are allowed.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
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

                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={preview || user?.profilePicture || ""}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-input bg-secondary cursor-pointer hover:bg-background transition relative w-full justify-center">
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

                          {fileInfo ? (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>{fileInfo.name}</p>
                              <p className="text-xs">{fileInfo.size}</p>
                            </div>
                          ) : (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p className="text-xs">
                                Maximum file size 1MB. Only .jpg, .jpeg, and
                                .png are allowed.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
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
                      Updating...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}

        {/* Email Tab */}
        {activeTab === "email" && (
          <Formik
            initialValues={{ newEmail: user?.email || "" }}
            enableReinitialize
            validationSchema={changeEmailSchema}
            onSubmit={handleChangeEmail}
          >
            <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
              <InputField
                name="newEmail"
                label="Your Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
              />

              <motion.button
                type="submit"
                className="w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Change Email"
                )}
              </motion.button>
            </Form>
          </Formik>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ errors, touched }) => {
              return (
                <Form className="relative bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
                  <InputField
                    name="oldPassword"
                    type={showOld ? "text" : "password"}
                    placeholder="Enter old password"
                    label="Old Password"
                    icon={Lock}
                    toggleIcon={
                      showOld ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )
                    }
                    onToggle={() => setShowOld(!showOld)}
                  />

                  <InputField
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    label="New Password"
                    icon={Lock}
                    toggleIcon={
                      showNew ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )
                    }
                    onToggle={() => setShowNew(!showNew)}
                  />

                  <InputField
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    label="Confirm Password"
                    icon={Lock}
                    toggleIcon={
                      showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )
                    }
                    onToggle={() => setShowConfirm(!showConfirm)}
                  />

                  <motion.button
                    type="submit"
                    className="w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Change Password"
                    )}
                  </motion.button>
                </Form>
              );
            }}
          </Formik>
        )}
      </motion.div>
    </div>
  );
}
