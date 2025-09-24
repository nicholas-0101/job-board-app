"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gradient" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: PremiumButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl overflow-hidden group";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50",
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-5 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Animated background for gradient variant */}
      {variant === "gradient" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Ripple effect */}
      {!disabled && (
        <motion.span
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          whileHover={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ borderRadius: "50%" }}
        />
      )}
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : icon ? (
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        ) : null}
        {children}
        {variant === "gradient" && !loading && (
          <motion.span
            className="ml-1"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        )}
      </span>
    </motion.button>
  );
}
