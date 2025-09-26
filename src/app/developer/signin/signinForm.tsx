"use client";
import { motion } from "framer-motion";
import { Field, Form, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff, Chrome, Code } from "lucide-react";

interface DeveloperSignInFormProps {
  errors: any;
  touched: any;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  handleGoogleSignIn: () => void;
}

export default function DeveloperSignInForm({
  errors,
  touched,
  showPassword,
  setShowPassword,
  isLoading,
  handleGoogleSignIn,
}: DeveloperSignInFormProps) {
  return (
    <Form className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8">
      {/* Developer Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium">
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
                : "border-gray-300 focus:border-blue-500 bg-white"
            }`}
          />
        </div>
        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
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
                : "border-gray-300 focus:border-blue-500 bg-white"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
          isLoading ? "cursor-not-allowed opacity-70" : "hover:shadow-xl cursor-pointer hover:from-blue-600 hover:to-indigo-700"
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

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google */}
      <div className="w-full mt-6">
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-gray-50 hover:bg-gray-100 font-medium text-gray-700 cursor-pointer border border-gray-300 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Chrome className="w-5 h-5 text-blue-500" />
          Continue with Google
        </motion.button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800 text-center">
          🔒 This is a secure developer portal. Only authorized developer accounts can access this area.
        </p>
      </div>
    </Form>
  );
}
