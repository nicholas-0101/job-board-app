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

export default function EmailTab() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChangeEmail = async (values: { newEmail: string }) => {
    setIsLoading(true);
    try {
      const res = await apiCall.patch("/auth/change-email", values);
      alert(res.data.message || "Email updated successfully!");
      router.replace("/auth/preverify-change");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change email!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            isLoading ? "cursor-not-allowed opacity-70" : "hover:shadow-xl cursor-pointer"
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
  );
}