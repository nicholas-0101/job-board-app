"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { apiCall } from "@/helper/axios";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function EditProfilePage() {
  const { user } = useUserStore();
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
      alert(res.data.message || "Profile updated successfully!");
      resetForm();
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
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
  }: any) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
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
            onSubmit={handleEditProfile}
          >
            {({ setFieldValue, values, errors, touched }) => (
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

                    <div className="mb-6 relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Gender
                      </label>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>

                        <Field
                          as="select"
                          name="gender"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-input bg-secondary focus:outline-none focus:border-primary hover:bg-background transition-all appearance-none"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Field>

                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
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
                    </div>

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
          <Formik initialValues={{ newEmail: "" }} onSubmit={handleChangeEmail}>
            <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
              <InputField
                name="newEmail"
                label="New Email"
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
            onSubmit={handleChangePassword}
          >
            {({ errors, touched }) => {
              return (
                <Form className="relative bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
                  {/* Old Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Old Password
                    </label>
                    <div className="relative">
                      <InputField
                        name="oldPassword"
                        type={showOld ? "text" : "password"}
                        placeholder="Enter old password"
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                          errors.oldPassword && touched.oldPassword
                            ? "border-red-400 bg-red-50"
                            : "border-input focus:border-primary bg-secondary"
                        }`}
                        icon={Lock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showOld ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* New Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <InputField
                        name="newPassword"
                        type={showNew ? "text" : "password"}
                        placeholder="Enter new password"
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                          errors.newPassword && touched.newPassword
                            ? "border-red-400 bg-red-50"
                            : "border-input focus:border-primary bg-secondary"
                        }`}
                        icon={Lock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNew ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <InputField
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-400 bg-red-50"
                            : "border-input focus:border-primary bg-secondary"
                        }`}
                        icon={Lock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

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
