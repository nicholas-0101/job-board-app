"use client";

import { Formik, Form } from "formik";
import { adminProfileSchema } from "../../changeProfileSchema";
import { useAdminProfileForm } from "@/lib/hooks/useAdminProfileForm";
import { useAdminDialog } from "@/lib/hooks/useAdminDialog";
import LoadingSpinner from "@/components/admin-profile/LoadingSpinner";
import CompanyInfoSection from "@/components/admin-profile/CompanyInfoSection";
import LocationInfoSection from "@/components/admin-profile/LocationInfoSection";
import AboutCompanySection from "@/components/admin-profile/AboutCompanySection";
import SocialMediaSection from "@/components/admin-profile/SocialMediaSection";
import SubmitButton from "@/components/admin-profile/SubmitButton";
import AdminDialog from "@/components/admin-profile/AdminDialog";

export default function AdminProfileTab() {
  const { initialValues, loadingProfile, isSaving, handleEditProfile } =
    useAdminProfileForm();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog } =
    useAdminDialog();

  if (loadingProfile) {
    return <LoadingSpinner />;
  }

  const onSubmit = async (values: any, formikHelpers: any) => {
    const result = await handleEditProfile(values, formikHelpers);
    
    if (result.success) {
      openDialog("Profile Updated!", result.message);
      result.resetForm?.();
    } else {
      openDialog("Error", result.message);
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
        onSubmit={onSubmit}
      >
        {({ setFieldValue, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 space-y-6"
          >
            {/* Company Basic Info */}
            <CompanyInfoSection />

            {/* Location Info */}
            <LocationInfoSection />

            {/* Company Description */}
            <AboutCompanySection />

            {/* Social Media */}
            <SocialMediaSection />

            <SubmitButton isSaving={isSaving} />
          </Form>
        )}
      </Formik>

      <AdminDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </section>
  );
}
