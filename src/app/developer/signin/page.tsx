"use client";
import { motion } from "framer-motion";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";
import { signInSchema } from "./signinSchema";
import DeveloperSignInForm from "./signinForm";

export default function DeveloperSignInPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.post("/auth/signin", values);
      const { token, user } = res.data;

      // Check if user has DEVELOPER role
      if (user.role !== "DEVELOPER") {
        alert("Access denied! This page is only for developers.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      alert(res.data.message || "Developer signed in successfully!");
      router.push("/developer");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Sign in failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#467EC7] rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Developer Portal
          </h1>
          <p className="text-gray-600">
            Sign in to access developer tools and resources
          </p>
        </motion.div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={signInSchema}
          onSubmit={handleSignIn}
        >
          {({ errors, touched }) => (
            <DeveloperSignInForm
              errors={errors}
              touched={touched}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
            />
          )}
        </Formik>

        {/* Back to Home Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-gray-600"
        >
          Not a developer?{" "}
          <Link
            href="/"
            className="text-[#467EC7] hover:text-[#467EC7]/80 font-semibold cursor-pointer"
          >
            Go back to home
          </Link>
        </motion.p>

        {/* Developer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-[#467EC7]/10 border border-[#467EC7]/20 rounded-lg"
        >
          <p className="text-sm text-[#467EC7] text-center">
            <strong>Developer Access Only:</strong> This portal is restricted to
            users with developer privileges.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
