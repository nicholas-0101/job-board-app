"use client";
import { Formik, Form } from "formik";
import {
  userProfileSchema,
  adminProfileSchema,
} from "../../changeProfileSchema";
import { useProfile } from "@/lib/hooks/useProfile";

import ProfileLoadingSpinner from "@/components/profile/edit/ProfileLoadingSpinner";
import AdminFieldsSection from "@/components/profile/edit/AdminFieldsSection";
import UserFieldsSection from "@/components/profile/edit/UserFieldsSection";
import ProfileSubmitButton from "@/components/profile/edit/ProfileSubmitButton";
import ProfileEditDialog from "@/components/profile/edit/ProfileEditDialog";
import { useProfileEdit } from "@/lib/hooks/useProfileEdit";
import { useProfileEditDialog } from "@/lib/hooks/useProfileEditDialog";

export default function ProfileTab() {
  const { user, initialValues, loadingProfile, setInitialValues } = useProfile();
  const { isSaving, handleEditProfile } = useProfileEdit();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog, setDialogOpen } = useProfileEditDialog();

  const onSubmit = async (values: any) => {
    const result = await handleEditProfile(values, setInitialValues);
    if (result.success) {
      openDialog("Profile Updated!", result.message);
    } else {
      openDialog("Error", result.message);
    }
  };

  if (loadingProfile) {
    return <ProfileLoadingSpinner />;
  }

  return (
    <section>
      <Formik
        initialValues={initialValues}
        enableReinitialize={false}
        validationSchema={
          user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
        }
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-4 sm:p-8">
            {user?.role === "ADMIN" ? (
              <AdminFieldsSection setFieldValue={setFieldValue} />
            ) : (
              <UserFieldsSection setFieldValue={setFieldValue} />
            )}

            <ProfileSubmitButton isSaving={isSaving} />
          </Form>
        )}
      </Formik>

      <ProfileEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onAction={closeDialog}
      />
    </section>
  );
}
