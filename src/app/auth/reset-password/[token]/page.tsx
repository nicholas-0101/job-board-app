"use client";

import { Formik, Form } from "formik";
import { useState } from "react";
import { resetPasswordSchema } from "./resetPasswordSchema";
import { useResetPassword } from "@/lib/hooks/useResetPassword";
import { useResetDialog } from "@/lib/hooks/useResetDialog";
import ResetFormContainer from "@/components/auth/reset-password/ResetFormContainer";
import PasswordField from "@/components/auth/reset-password/PasswordField";
import ResetSubmitButton from "@/components/auth/reset-password/ResetSubmitButton";
import ResetDialog from "@/components/auth/reset-password/ResetDialog";

export default function ResetPasswordPage() {
  const { isLoading, handleReset } = useResetPassword();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog } =
    useResetDialog();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const result = await handleReset(values);
    if (!result.success) {
      openDialog("Error", result.message);
    }
  };

  return (
    <ResetFormContainer>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={resetPasswordSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <PasswordField
              name="password"
              label="New Password"
              placeholder="your password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              errors={errors}
              touched={touched}
            />

            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              placeholder="confirm password"
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              errors={errors}
              touched={touched}
            />

            <ResetSubmitButton isLoading={isLoading} />
          </Form>
        )}
      </Formik>

      <ResetDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </ResetFormContainer>
  );
}
