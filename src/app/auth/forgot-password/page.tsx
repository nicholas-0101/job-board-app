"use client";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail } from "lucide-react";
import { useState } from "react";
import { apiCall } from "@/helper/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleForgotPassword = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await apiCall.post("/auth/forgot-password", { email: values.email });
      setSubmitted(true);
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-4 sm:p-8 w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#467EC7]">
          Forgot Password
        </h2>

        {submitted ? (
          <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
            Reset password link has sended. Please check your email.
          </p>
        ) : (
          <Formik initialValues={{ email: "" }} onSubmit={handleForgotPassword}>
            {() => (
              <Form>
                {/* Email */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-input bg-secondary focus:outline-none focus:border-primary hover:bg-background transition-all text-sm sm:text-base"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all text-sm sm:text-base ${
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
                      <motion.div
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-label="Loading spinner"
                      />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md !rounded-3xl mx-2 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-[#467EC7]">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg text-muted-foreground">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                dialogAction?.();
              }}
              className="bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
