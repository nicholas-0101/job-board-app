"use client";
import { Field, ErrorMessage } from "formik";
import { Mail, Lock, Eye, EyeOff, User2, BuildingIcon } from "lucide-react";

interface SignUpFormProps {
  tab: "seeker" | "admin";
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  errors: any;
  touched: any;
}

export default function SignUpForm({
  tab,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errors,
  touched,
}: SignUpFormProps) {
  const getInputClass = (field: string) =>
    `w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
      errors[field] && touched[field]
        ? "border-red-400 bg-red-50"
        : "border-input focus:border-primary bg-secondary"
    }`;

  return (
    <div className="grid gap-4">
      {/* Name / Company */}
      {tab === "seeker" ? (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <div className="relative">
            <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Field
              type="text"
              name="fullName"
              className={getInputClass("fullName")}
              placeholder="your name"
            />
          </div>
          <ErrorMessage
            name="fullName"
            component="div"
            className="text-red-400 text-xs mt-1"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
          <div className="relative">
            <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Field
              type="text"
              name="companyName"
              className={getInputClass("companyName")}
              placeholder="company name"
            />
          </div>
          <ErrorMessage
            name="companyName"
            component="div"
            className="text-red-400 text-xs mt-1"
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            type="email"
            name="email"
            className={getInputClass("email")}
            placeholder={tab === "seeker" ? "you@example.com" : "company@example.com"}
          />
        </div>
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-400 text-xs mt-1"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            type={showPassword ? "text" : "password"}
            name="password"
            className={getInputClass("password")}
            placeholder="your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <ErrorMessage
          name="password"
          component="div"
          className="text-red-400 text-xs mt-1"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Field
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className={getInputClass("confirmPassword")}
            placeholder="confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <ErrorMessage
          name="confirmPassword"
          component="div"
          className="text-red-400 text-xs mt-1"
        />
      </div>
    </div>
  );
}