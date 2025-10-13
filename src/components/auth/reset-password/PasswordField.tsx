"use client";

import { Field, ErrorMessage } from "formik";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  errors: any;
  touched: any;
}

export default function PasswordField({
  name,
  label,
  placeholder,
  showPassword,
  onTogglePassword,
  errors,
  touched,
}: PasswordFieldProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <Field
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background text-sm sm:text-base ${
            errors[name] && touched[name]
              ? "border-red-400 bg-red-50"
              : "border-input focus:border-primary bg-secondary"
          }`}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-xs mt-1"
      />
    </div>
  );
}
