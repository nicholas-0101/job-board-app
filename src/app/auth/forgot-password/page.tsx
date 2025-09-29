"use client";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail } from "lucide-react";
import { useState } from "react";
import { apiCall } from "@/helper/axios";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await apiCall.post("/auth/forgot-password", { email: values.email });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#467EC7]">
          Forgot Password
        </h2>

        {submitted ? (
          <p className="text-muted-foreground text-center">
            Reset password link has sended. Please check your email.
          </p>
        ) : (
          <Formik initialValues={{ email: "" }} onSubmit={handleForgotPassword}>
            {() => (
              <Form>
                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input bg-secondary focus:outline-none focus:border-primary hover:bg-background transition-all"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className={`w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
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
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-label="Loading spinner"
                      />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}
      </motion.div>
    </div>
  );
}