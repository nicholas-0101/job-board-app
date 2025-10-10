"use client";
import { Formik, Form } from "formik";
import InputField from "../../components/inputField";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";
import { useRouter } from "next/navigation";
import { changeEmailSchema } from "../../changeProfileSchema";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EmailTab() {
  const { user } = useUserStore();
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

  const router = useRouter();

  const handleChangeEmail = async (values: { newEmail: string }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.patch("/auth/change-email", values);
      openDialog(
        "Email Changed!",
        res.data.message || "Email updated successfully!"
      );
      router.replace("/auth/preverify-change");
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message || "Failed to change email!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Formik
        initialValues={{ newEmail: user?.email || "" }}
        enableReinitialize
        validationSchema={changeEmailSchema}
        onSubmit={handleChangeEmail}
      >
        <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
          <InputField
            name="newEmail"
            label="Your Email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
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
              "Change Email"
            )}
          </motion.button>
        </Form>
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
