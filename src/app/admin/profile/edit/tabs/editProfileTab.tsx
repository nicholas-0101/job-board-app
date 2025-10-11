"use client";

import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import InputField from "../../components/inputField";
import QuillField from "../../components/quillField";
import CityField from "../../components/cityField";
import { FileUploader } from "../../components/fileUploader";
import { Phone, Building, Globe, Mail, MapPin, Loader } from "lucide-react";
import {
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { adminProfileSchema } from "../../changeProfileSchema";
import { useProfile } from "@/lib/hooks/useProfile";
import { apiCall } from "@/helper/axios";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";
import { useState } from "react";
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

export default function AdminProfileTab() {
  const { user, initialValues, loadingProfile, setInitialValues } =
    useProfile();
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
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  const handleEditProfile = async (values: any, { resetForm }: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        if (val instanceof Blob) {
          formData.append(key, val);
        } else if (typeof val === "object") {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res.data?.data ?? res.data;
      if (payload?.role === "ADMIN" || payload?.adminId) {
        setCompany(payload);
        setInitialValues(mapPayloadToInitialValues(payload));
      }

      openDialog(
        "Profile Updated!",
        res.data?.message ?? "Profile updated successfully!"
      );
      resetForm({ values });
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
        enableReinitialize={true}
        validateOnBlur
        validateOnChange
        validationSchema={adminProfileSchema}
        onSubmit={handleEditProfile}
      >
        {({ setFieldValue, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 space-y-6"
          >
            {/* Company Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Company Information
              </h3>

              <InputField
                name="name"
                label="Company Name"
                placeholder="Enter company name"
                icon={Building}
              />

              <InputField
                name="email"
                label="Company Email"
                placeholder="contact@company.com"
                icon={Mail}
                type="email"
              />

              <InputField
                name="phone"
                label="Company Phone"
                placeholder="+628123456789"
                icon={Phone}
              />

              <InputField
                name="website"
                label="Website"
                placeholder="https://example.com"
                icon={Globe}
              />
            </div>

            {/* Location Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Location
              </h3>

              <InputField
                name="address"
                label="Full Address"
                placeholder="Jl. Sudirman No. 123"
                icon={MapPin}
              />

              <CityField
                name="locationCity"
                label="City"
                placeholder="Select city..."
              />
            </div>

            {/* Company Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                About Company
              </h3>

              <QuillField
                name="description"
                label="Company Description"
                placeholder="Write something about your company..."
              />

              <FileUploader name="logoUrl" label="Company Logo" />
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Social Media (Optional)
              </h3>

              <InputField
                name="socials.facebook"
                label="Facebook"
                placeholder="https://facebook.com/company-name"
                icon={FaFacebook}
              />

              <InputField
                name="socials.twitter"
                label="Twitter/X"
                placeholder="https://twitter.com/company-name"
                icon={FaTwitter}
              />

              <InputField
                name="socials.linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/company/company-name"
                icon={FaLinkedinIn}
              />

              <InputField
                name="socials.instagram"
                label="Instagram"
                placeholder="https://instagram.com/company-name"
                icon={FaInstagram}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
              disabled={isSaving}
              className={`w-full mt-8 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all 
              ${
                isSaving
                  ? "bg-[#24cfa7]/80 cursor-not-allowed"
                  : "bg-[#24cfa7] hover:bg-[#24cfa7]/80 cursor-pointer"
              }`}
            >
              {isSaving ? "Updating..." : "Save Changes"}
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
