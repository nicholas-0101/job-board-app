"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Home,
  Globe,
} from "lucide-react";
import { apiCall } from "@/helper/axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { userProfileSchema, adminProfileSchema } from "../changeProfileSchema";

import CityField from "../components/cityField";
import InputField from "../components/inputField";
import SelectField from "../components/selectField";
import QuillField from "../components/quillField";
import { FileUploader } from "../components/fileUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CompleteProfilePage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
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

  useEffect(() => {
    if (!user) {
      const savedUser =
        localStorage.getItem("user") || localStorage.getItem("verifiedUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore invalid cached data
        }
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    const evaluateAccess = () => {
      const storedCompletion = localStorage.getItem("isProfileComplete") === "true";
      const resolvedRole =
        user?.role ||
        (localStorage.getItem("role") as "ADMIN" | "USER" | null) ||
        null;

      if (storedCompletion || user?.isProfileComplete) {
        const target =
          resolvedRole === "ADMIN"
            ? "/admin"
            : resolvedRole === "USER"
            ? "/"
            : "/";
        router.replace(target);
        return;
      }

      setCheckingAccess(false);
    };

    evaluateAccess();
  }, [user, router]);

  const handleCompleteProfile = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      if (values.dob) values.dob = new Date(values.dob).toISOString();
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      }

      const res = await apiCall.put("/profile/complete", formData);
      const payload = res.data?.data;

      const currentRole =
        user?.role ||
        (localStorage.getItem("role") as "ADMIN" | "USER" | null) ||
        (payload?.user?.role ?? payload?.role ?? null);

      let nextUser = user ?? null;

      if (currentRole === "ADMIN") {
        const updatedUser = payload?.user ?? payload;
        nextUser = {
          ...(user ?? {}),
          ...(updatedUser ?? {}),
          isProfileComplete: true,
        };

        const companyId =
          payload?.company?.id ?? payload?.company?.data?.id ?? null;
        if (companyId) {
          localStorage.setItem("companyId", companyId.toString());
        }
      } else {
        nextUser = {
          ...(user ?? {}),
          ...(payload ?? {}),
          isProfileComplete: true,
        };
      }

      if (nextUser) {
        try {
          localStorage.setItem("user", JSON.stringify(nextUser));
        } catch {
          // ignore storage write errors
        }
        setUser(nextUser as any);
      }

      localStorage.setItem("isProfileComplete", "true");
      if (currentRole) {
        localStorage.setItem("role", currentRole);
      }
      if (nextUser && "id" in nextUser && nextUser.id) {
        localStorage.setItem("userId", nextUser.id.toString());
      }

      resetForm();

      if (currentRole === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message ||
          err.message ||
          "Failed to complete profile!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdminFields = (setFieldValue: any) => (
    <>
      <InputField
        name="phone"
        label="Company Phone"
        placeholder="Enter company phone"
        icon={Phone}
      />
      <InputField
        name="location"
        label="Full Address"
        placeholder="Company full address"
        icon={MapPin}
      />
      <CityField name="city" label="City" placeholder="Search your city..." />
      <InputField
        name="website"
        label="Website"
        placeholder="https://example.com"
        icon={Globe}
      />
      <QuillField
        name="description"
        label="Description"
        placeholder="Write something about your company..."
      />
      <FileUploader name="logoUrl" label="Logo" />
    </>
  );

  const renderUserFields = (setFieldValue: any) => (
    <>
      <InputField
        name="phone"
        label="Phone"
        placeholder="Enter your phone"
        icon={Phone}
      />
      <SelectField
        name="gender"
        label="Gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />
      <InputField
        name="dob"
        label="Date of Birth"
        type="date"
        icon={Calendar}
      />
      <InputField
        name="education"
        label="Education"
        placeholder="Your education"
        icon={GraduationCap}
      />
      <InputField
        name="address"
        label="Full Address"
        placeholder="Your full address"
        icon={Home}
      />
      <CityField name="city" label="City" placeholder="Search your city..." />
      <FileUploader name="profilePicture" label="Profile Picture" isRounded />
    </>
  );

  if (checkingAccess) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center text-muted-foreground"
        >
          Checking profile status...
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pb-20 pt-15 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Complete your profile
          </h1>
          <p className="text-muted-foreground">
            Please fill in your details to complete your profile
          </p>
        </motion.div>

        <Formik
          enableReinitialize
          initialValues={
            user?.role === "ADMIN"
              ? {
                  phone: "",
                  location: "",
                  city: "",
                  description: "",
                  website: "",
                  logoUrl: null,
                }
              : {
                  phone: "",
                  gender: "",
                  dob: "",
                  education: "",
                  address: "",
                  city: "",
                  profilePicture: null,
                }
          }
          validationSchema={
            user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
          }
          onSubmit={handleCompleteProfile}
        >
          {({ setFieldValue }) => (
            <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
              {user?.role === "ADMIN"
                ? renderAdminFields(setFieldValue)
                : renderUserFields(setFieldValue)}

              <motion.button
                type="submit"
                className={`w-full mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
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
                    Saving...
                  </span>
                ) : (
                  "Complete Profile"
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
