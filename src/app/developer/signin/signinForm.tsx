"use client";
import { motion } from "framer-motion";
import { Field, Form, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff, Code } from "lucide-react";

interface DeveloperSignInFormProps {
  errors: any;
  touched: any;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
}

export default function DeveloperSignInForm({
  errors,
  touched,
  showPassword,
  setShowPassword,
  isLoading,
}: DeveloperSignInFormProps) {
  return (
    <Form className="bg-white rounded-2xl shadow-lg border border-[#467EC7]/20 p-8">
      {/* Developer Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#467EC7] text-white rounded-full text-sm font-medium">
          <Code className="w-4 h-4" />
          Developer Access
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            name="email"
            type="email"
            placeholder="developer@example.com"
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-gray-50 ${
              errors.email && touched.email
                ? "border-red-400 bg-red-50"
                : "border-gray-300 focus:border-[#467EC7] bg-white"
            }`}
          />
        </div>
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="your password"
            className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-gray-50 ${
              errors.password && touched.password
                ? "border-red-400 bg-red-50"
                : "border-gray-300 focus:border-[#467EC7] bg-white"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
          className="text-red-500 text-sm mt-1"
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        className={`w-full px-6 py-3 rounded-xl bg-[#467EC7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
          isLoading
            ? "cursor-not-allowed opacity-70"
            : "hover:shadow-xl cursor-pointer hover:bg-[#467EC7]/90"
        }`}
        whileHover={isLoading ? {} : { scale: 1.02 }}
        whileTap={isLoading ? {} : { scale: 0.98 }}
        disabled={isLoading}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              <Code className="w-4 h-4" />
              Sign In as Developer
            </>
          )}
        </div>
      </motion.button>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-[#467EC7]/10 border border-[#467EC7]/20 rounded-lg">
        <p className="text-xs text-[#467EC7] text-center">
          🔒 This is a secure developer portal. Only authorized developer
          accounts can access this area.
        </p>
      </div>
    </Form>
  );
}
