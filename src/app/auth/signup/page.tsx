"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";

import SignUpForm from "./components/signupForm";
import Header from "./components/signupHeader";
import Tabs from "./components/signupTabs";
import SocialLoginButton from "./components/signupSocialButton";
import { signUpSchema } from "./signupSchema";

export default function SignUpPage() {
  const [tab, setTab] = useState<"seeker" | "admin">("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  const handleSignUp = async (values: any) => {
    setIsLoading(true);
    try {
      const { fullName, companyName, email, password, confirmPassword } =
        values;
      const payload =
        tab === "seeker"
          ? { name: fullName, email, password, confirmPassword, role: "USER" }
          : {
              name: companyName,
              email,
              password,
              confirmPassword,
              role: "ADMIN",
            };
      const url = tab === "seeker" ? "/auth/signup/user" : "/auth/signup/admin";
      await apiCall.post(url, payload);
      alert(tab === "seeker" ? "User registered!" : "Admin registered!");
      router.replace("/auth/preverify");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const role = tab === "seeker" ? "USER" : "ADMIN";
    const nonce = Math.random().toString(36).substring(2, 15);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token id_token&scope=email profile&nonce=${nonce}`;
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const popup = window.open(
      url,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );
    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { token } = event.data;
      if (token) {
        try {
          const res = await apiCall.post("/auth/social", {
            provider: "GOOGLE",
            token,
            role,
          });
          const userData = res.data.data;
          
          // If admin, fetch companyId
          if (userData.role === "ADMIN") {
            try {
              const companyResponse = await apiCall.get("/company/admin", {
                headers: {
                  Authorization: `Bearer ${userData.token}`,
                },
              });
              const companyId = Number(
                companyResponse.data?.id ?? companyResponse.data?.data?.id
              );
              localStorage.setItem("companyId", companyId.toString());
            } catch (err) {
              console.error("Failed to fetch company ID:", err);
            }
          }
          
          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("role", userData.role);
          localStorage.setItem("userId", userData.id.toString());
          setUser(userData);
          
          // Redirect based on role
          if (userData.role === "ADMIN") {
            router.replace("/admin");
          } else {
            router.replace("/explore/jobs");
          }
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 pb-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Header tab={tab} />
        <Formik
          enableReinitialize
          initialValues={{
            fullName: "",
            companyName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: tab === "seeker" ? "USER" : "ADMIN",
          }}
          validationSchema={signUpSchema}
          onSubmit={handleSignUp}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <Form
              onSubmit={handleSubmit}
              className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8"
            >
              <Tabs tab={tab} setTab={setTab} />
              <SignUpForm
                tab={tab}
                isLoading={isLoading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                errors={errors}
                touched={touched}
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                className={`w-full px-6 py-3 mt-6 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
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
                    Creating...
                  </span>
                ) : (
                  "Create Account!"
                )}
              </motion.button>

              {/* Divider + Social */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <SocialLoginButton
                handleGoogleLogin={handleGoogleLogin}
                isGoogleLoaded={isGoogleLoaded}
              />
            </Form>
          )}
        </Formik>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-muted-foreground"
        >
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-[#467EC7] hover:text-[#A3B6CE] font-semibold cursor-pointer"
          >
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
