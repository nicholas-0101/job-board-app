"use client";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { useUserStore } from "@/lib/store/userStore";
import { userProfileSchema, adminProfileSchema } from "../changeProfileSchema";

import ProfileLoading from "@/components/profile/complete/ProfileLoading";
import ProfileFormHeader from "@/components/profile/complete/ProfileFormHeader";
import AdminFieldsSection from "@/components/profile/complete/AdminFieldsSection";
import UserFieldsSection from "@/components/profile/complete/UserFieldsSection";
import ProfileSubmitButton from "@/components/profile/complete/ProfileSubmitButton";
import ProfileDialog from "@/components/profile/complete/ProfileDialog";
import { useProfileCompletion } from "@/lib/hooks/useProfileCompletion";
import { useProfileDialog } from "@/lib/hooks/useProfileDialog";
import { useProfileAccess, getInitialValues } from "@/lib/utils/profileUtils";

export default function CompleteProfilePage() {
  const { user } = useUserStore();
  const { checkingAccess } = useProfileAccess();
  const { isLoading, handleCompleteProfile } = useProfileCompletion();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog, setDialogOpen } = useProfileDialog();

  const onSubmit = async (values: any, formikBag: any) => {
    try {
      await handleCompleteProfile(values, formikBag);
    } catch (error: any) {
      openDialog("Error", error.message);
    }
  };

  if (checkingAccess) {
    return <ProfileLoading />;
  }

  return (
    <section className="min-h-screen pb-20 pt-15 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <ProfileFormHeader />

        <Formik
          enableReinitialize
          initialValues={getInitialValues(user)}
          validationSchema={
            user?.role === "ADMIN" ? adminProfileSchema : userProfileSchema
          }
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
              {user?.role === "ADMIN" ? (
                <AdminFieldsSection setFieldValue={setFieldValue} />
              ) : (
                <UserFieldsSection setFieldValue={setFieldValue} />
              )}

              <ProfileSubmitButton isLoading={isLoading} />
            </Form>
          )}
        </Formik>
      </motion.div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onAction={closeDialog}
      />
    </section>
  );
}
