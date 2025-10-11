"use client";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import InputField from "../../components/inputField";
import SelectField from "../../components/selectField";
import QuillField from "../../components/quillField";
import CityField from "../../components/cityField";
import { FileUploader } from "../../components/fileUploader";
import {
  Phone,
  Building,
  Globe,
  CalendarDaysIcon,
  GraduationCap,
  Home,
  Loader,
} from "lucide-react";
import {
  userProfileSchema,
  adminProfileSchema,
} from "../../changeProfileSchema";
import { useProfile } from "@/lib/hooks/useProfile";
import { apiCall } from "@/helper/axios";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProfileTab() {
  const { user, initialValues, loadingProfile, setInitialValues } =
    useProfile();
  const { setUser } = useUserStore();
  const { setCompany } = useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);
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

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  const handleEditProfile = async (values: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res.data?.data ?? res.data;
      if (payload?.role === "USER") {
        setUser(payload);
      } else if (payload?.role === "ADMIN" || payload?.adminId) {
        setCompany(payload);
      }

      if (payload) setInitialValues(mapPayloadToInitialValues(payload));
      openDialog(
        "Profile Updated!",
        res.data?.message ?? "Profile updated successfully!"
      );
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message || "Failed to update profile!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <Formik
        initialValues={initialValues}
        enableReinitialize={false}
        validationSchema={
          user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
        }
        onSubmit={handleEditProfile}
      >
        {({ setFieldValue }) => (
          <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-4 sm:p-8">
            {user?.role === "ADMIN" ? (
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
                  icon={Building}
                />
                <CityField
                  name="city"
                  label="City"
                  placeholder="Search your city..."
                />
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
                <FileUploader name="logo" label="Logo" />
              </>
            ) : (
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
                  icon={CalendarDaysIcon}
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
                <CityField
                  name="city"
                  label="City"
                  placeholder="Search your city..."
                />
                <FileUploader
                  name="profilePicture"
                  label="Profile Picture"
                  isRounded
                />
              </>
            )}

            <motion.button
              type="submit"
              className={`w-full mt-4 sm:mt-6 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all text-sm sm:text-base ${
                isSaving
                  ? "cursor-not-allowed opacity-70"
                  : "hover:shadow-xl cursor-pointer"
              }`}
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Save Changes"}
            </motion.button>
          </Form>
        )}
      </Formik>

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
