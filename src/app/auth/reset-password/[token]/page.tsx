"use client";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { resetPasswordSchema } from "./resetPasswordSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Notice");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  const openDialog = (title: string, message: string, action?: () => void) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(() => action || null);
    setDialogOpen(true);
  };

  const handleReset = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      await apiCall.post(`/auth/reset-password/${token}`, {
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      router.replace("/auth/signin");
    } catch (err: any) {
      openDialog("Error", err.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#467EC7]">
          Reset Password
        </h2>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleReset}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
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

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="confirm password"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-400 bg-red-50"
                        : "border-input focus:border-primary bg-secondary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md !rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#467EC7]">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                dialogAction?.();
              }}
              className="bg-[#24CFA7] hover:bg-bg-[#24CFA7]/80 text-white rounded-lg"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
