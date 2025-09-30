"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";

export default function VerifyPage() {
  const { token } = useParams();
  const router = useRouter();
  const { user, setUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState(
    "Click verify to confirm your account"
  );

  const handleVerify = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await apiCall.get(`/auth/verify/${token}`);

      console.log("Verification response:", res.data);

      const verifiedUser = res.data.user;
      setUser(verifiedUser);
      localStorage.setItem("verifiedUser", JSON.stringify(verifiedUser));

      const verifiedToken = res.data.token;
      if (verifiedToken) {
        localStorage.setItem("verifiedToken", verifiedToken);
      } else {
        console.warn("No token returned from verification endpoint!");
      }

      setStatus("success");
      setMessage(res.data.message || "Account verified successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.response?.data?.message || "Verification failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/profile/complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 grid gap-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
              Verify Account
            </h1>
            <p className="text-muted-foreground">{message}</p>
          </motion.div>

          {status === "pending" && (
            <motion.button
              type="button"
              onClick={handleVerify}
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
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </motion.button>
          )}

          {status === "success" && (
            <motion.button
              type="button"
              onClick={handleRedirect}
              className="w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete Profile
            </motion.button>
          )}

          {status === "error" && (
            <motion.button
              type="button"
              onClick={handleVerify}
              className="w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retry
            </motion.button>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}
