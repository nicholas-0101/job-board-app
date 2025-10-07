"use client";

import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import InputField from "../../components/inputField";
import SelectField from "../../components/selectField";
import QuillField from "../../components/quillField";
import CityField from "../../components/cityField";
import { FileUploader } from "../../components/fileUploader";
import { Phone, Building, Globe } from "lucide-react";
import { adminProfileSchema } from "../../changeProfileSchema";
import { useProfile } from "@/lib/hooks/useProfile";
import { apiCall } from "@/helper/axios";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";
import { useState } from "react";
import { useCompanyStore } from "@/lib/store/companyStore";

export default function AdminProfileTab() {
  const { user, initialValues, loadingProfile, setInitialValues } =
    useProfile();
  const { setCompany } = useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);

  if (loadingProfile || !initialValues) {
    console.log("Admin initialValues →", initialValues);
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile…</p>
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

      alert(res.data?.message ?? "Profile updated successfully!");
      resetForm({ values });
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
          <InputField
            name="phone"
            label="Company Phone"
            placeholder="Enter company phone"
            icon={Phone}
          />
          <InputField
            name="address"
            label="Full Address"
            placeholder="Company full address"
            icon={Building}
          />
          <CityField
            name="locationCity"
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
          <FileUploader name="logoUrl" label="Logo" />

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
  );
}
