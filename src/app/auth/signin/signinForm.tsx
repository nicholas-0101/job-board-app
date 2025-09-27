"use client";
import { motion } from "framer-motion";
import { Field, Form, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";

interface SignInFormProps {
  errors: any;
  touched: any;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  handleGoogleSignIn: () => void;
}

export default function SignInForm({
  errors,
  touched,
  showPassword,
  setShowPassword,
  isLoading,
  handleGoogleSignIn,
}: SignInFormProps) {
  return (
    <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
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
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
              errors.email && touched.email
                ? "border-red-400 bg-red-50"
                : "border-input focus:border-primary bg-secondary"
            }`}
          />
        </div>
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-400 text-sm mt-1"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="your password"
            className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
              errors.password && touched.password
                ? "border-red-400 bg-red-50"
                : "border-input focus:border-primary bg-secondary"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <ErrorMessage
          name="password"
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
            <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </motion.button>

      {/* Divider */}
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

      {/* Google */}
      <div className="w-full mt-6">
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#F0F5F9] font-medium text-[#467EC7] cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Chrome className="w-5 h-5 text-[#467EC7]" />
          Google
        </motion.button>
      </div>
    </Form>
  );
}
