"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";

export default function VerifyPage() {
  const { token: rawToken } = useParams();
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const router = useRouter();
  const { user, setUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "expired" | "sent"
  >("pending");
  const [message, setMessage] = useState(
    "Click verify to confirm your account"
  );
  const [resending, setResending] = useState(false);

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
      }

      setStatus("success");
      setMessage(res.data.message || "Account verified successfully!");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Verification failed!";
      setMessage(msg);

      if (msg.toLowerCase().includes("expired")) {
        setStatus("expired");
      } else if (msg.toLowerCase().includes("already verified")) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      let email = user?.email;

      if (!email) {
        const pendingEmail = localStorage.getItem("pendingEmail");
        if (pendingEmail) {
          email = pendingEmail;
        }
      }

      if (!email && token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          email = payload?.email;
        } catch (err) {
          console.warn("Could not decode token to get email", err);
        }
      }

      console.log("Resend verification email for:", email);

      if (!email) {
        setMessage("User email not found. Please sign up again.");
        setResending(false);
        return;
      }

      const res = await apiCall.post("/auth/resend-verification", { email });

      setMessage(res.data.message || "Verification email resent successfully!");
      setStatus("sent");
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setResending(false);
    }
  };

  const handleRedirect = () => {
    router.push("/profile/complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 flex items-center justify-center p-4 relative overflow-hidden">
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

          {status === "expired" && (
            <motion.button
              type="button"
              onClick={handleResend}
              className={`w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all ${
                resending ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
              whileHover={resending ? {} : { scale: 1.02 }}
              whileTap={resending ? {} : { scale: 0.98 }}
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend Verification Email"}
            </motion.button>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}
