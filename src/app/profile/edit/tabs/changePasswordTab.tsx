"use client";
import { Formik, Form } from "formik";
import InputField from "../../components/inputField";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";
import { changePasswordSchema } from "../../changeProfileSchema";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PasswordTab() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const router = useRouter();

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.patch("/auth/change-password", values);
      openDialog(
        "Password Changed!",
        res.data.message || "Password changed successfully!"
      );
    } catch (err: any) {
      if (
        err.response?.data?.message ===
        "Password change not allowed for Google sign-in users"
      ) {
        openDialog(
          "Error",
          "This account does not have a password because it was created via Google login. Password changes are not allowed."
        );
      } else if (err.response?.data?.message === "Old password is incorrect") {
        openDialog("Error", "Old password is incorrect.");
      } else if (
        err.response?.data?.message ===
        "New password and confirm password do not match"
      ) {
        openDialog("Error", "New password and confirm password do not match.");
      } else {
        openDialog("Error", "Failed to change password!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
      >
        {() => (
          <Form className="relative bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
            <InputField
              name="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="Enter old password"
              label="Old Password"
              icon={Lock}
              toggleIcon={
                showOld ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )
              }
              onToggle={() => setShowOld(!showOld)}
            />

            <InputField
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              label="New Password"
              icon={Lock}
              toggleIcon={
                showNew ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )
              }
              onToggle={() => setShowNew(!showNew)}
            />

            <InputField
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              label="Confirm Password"
              icon={Lock}
              toggleIcon={
                showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )
              }
              onToggle={() => setShowConfirm(!showConfirm)}
            />

            <motion.button
              type="submit"
              className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg ${
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
                  Updating...
                </span>
              ) : (
                "Change Password"
              )}
            </motion.button>
          </Form>
        )}
      </Formik>

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
              className="bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white rounded-lg"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
