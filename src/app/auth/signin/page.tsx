"use client";
import { motion } from "framer-motion";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";
import { signInSchema } from "./signinSchema";
import SignInForm from "./components/signinForm";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!values.email || !values.password) {
        alert("Email and password are required.");
        setIsLoading(false);
        return;
      }
      // Sanitize input
      const sanitizedValues = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      const res = await apiCall.post("/auth/signin", sanitizedValues);
      const { token, user } = res.data;

      // Validate response data
      if (!token || !user || !user.id || !user.role) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id.toString());

      // Get company ID for admin
      if (user.role === "ADMIN") {
        try {
          const companyResponse = await apiCall.get("/company/admin", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const companyId = Number(
            companyResponse.data?.id ?? companyResponse.data?.data?.id
          );
          localStorage.setItem("companyId", companyId.toString());
        } catch (err) {
          // Ignore company fetch error
        }
      }

      setUser(user);
      
      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth sign-in via popup. Defaults to USER role when creating a new account.
  const handleGoogleSignIn = () => {
    const role = "USER" as const;
    const nonce = Math.random().toString(36).substring(2, 15);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token id_token&scope=email profile&nonce=${nonce}`;
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(url, "GoogleLogin", `width=${width},height=${height},top=${top},left=${left}`);

    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { token } = event.data as { token?: string };
      if (token) {
        try {
          const res = await apiCall.post("/auth/social", { provider: "GOOGLE", token, role });
          const userData = res.data.data;

          // If admin, fetch companyId like in password sign-in
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
              // ignore company fetch error
            }
          }

          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("role", userData.role);
          localStorage.setItem("userId", userData.id.toString());
          setUser(userData);
          router.push("/");
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
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
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </motion.div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={signInSchema}
          onSubmit={handleSignIn}
        >
          {({ errors, touched }) => (
            <SignInForm
              errors={errors}
              touched={touched}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              handleGoogleSignIn={handleGoogleSignIn}
            />
          )}
        </Formik>

        {/* Sign Up Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-muted-foreground"
        >
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[#467EC7] hover:text-[#A3B6CE] font-semibold cursor-pointer"
          >
            Sign up for free
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
