"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  User2,
  BuildingIcon,
} from "lucide-react";
import { apiCall } from "@/helper/axios";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [tab, setTab] = useState<"seeker" | "admin">("seeker");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      const payload =
        tab === "seeker"
          ? {
              name: fullName,
              email,
              password,
              confirmPassword,
              role: "USER",
            }
          : {
              name: companyName,
              email,
              password,
              confirmPassword,
              role: "ADMIN",
            };

      const url = tab === "seeker" ? "/auth/signup/user" : "/auth/signup/admin";

      const res = await apiCall.post(url, payload);

      alert(
        tab === "seeker"
          ? "User registered successfully!"
          : "Admin registered successfully!"
      );
      router.push("/preverify");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Create account to find your dream career
          </p>
        </motion.div>

        {/* Sign Up Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8"
        >
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setTab("seeker")}
              className={`flex-1 py-2 text-sm font-medium rounded-t-xl transition-colors ${
                tab === "seeker"
                  ? "border-b-2 border-[#467EC7] text-[#467EC7]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`flex-1 py-2 text-sm font-medium rounded-t-xl transition-colors ${
                tab === "admin"
                  ? "border-b-2 border-[#467EC7] text-[#467EC7]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Company Admin
            </button>
          </div>

          {/* Forms */}
          <div className="grid gap-4">
            {tab === "seeker" ? (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="your name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="your password"
                      required
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
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={handleSignUp}
                  className="w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>Create Account!</>
                    )}
                  </span>
                </motion.button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Company Name
                  </label>
                  <div className="relative">
                    <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="company name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="your password"
                      required
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
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-all bg-secondary hover:bg-background"
                      placeholder="confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={handleSignUp}
                  className="w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <>Create Account!</>
                    )}
                  </span>
                </motion.button>
              </>
            )}
          </div>

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

          {/* Social Login */}
          <div className="w-full">
            <motion.button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-[#ebebeb] shadow-lg hover:shadow-xl bg-[#F0F5F9] transition-all font-medium text-[#467EC7]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Chrome className="w-5 h-5 text-[#467EC7]" />
              Google
            </motion.button>
          </div>
        </motion.form>

        {/* Sign In Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-muted-foreground"
        >
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#467EC7] hover:text-[#A3B6CE] font-semibold"
          >
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
