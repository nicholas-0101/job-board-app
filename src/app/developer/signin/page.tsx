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

  const handleGoogleSignIn = () => {
    const role = "DEVELOPER";
    const nonce = Math.random().toString(36).substring(2, 15);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token id_token&scope=email profile&nonce=${nonce}`;
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(url, "GoogleLogin", `width=${width},height=${height},top=${top},left=${left}`);

    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { token } = event.data;
      if (token) {
        try {
          const res = await apiCall.post("/auth/social", { provider: "GOOGLE", token, role });
          const userData = res.data.data;

          // Check if user has DEVELOPER role
          if (userData.role !== "DEVELOPER") {
            alert("Access denied! This Google account is not registered as a developer.");
            window.removeEventListener("message", listener);
            return;
          }

          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);

          router.push("/developer");
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || "Google login failed");
        } finally {
          window.removeEventListener("message", listener);
        }
      }
    };
    window.addEventListener("message", listener);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Developer Portal</h1>
          <p className="text-gray-600">Sign in to access developer tools and resources</p>
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
              handleGoogleSignIn={handleGoogleSignIn}
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
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
            Go back to home
          </Link>
        </motion.p>

        {/* Developer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-800 text-center">
            <strong>Developer Access Only:</strong> This portal is restricted to users with developer privileges.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
