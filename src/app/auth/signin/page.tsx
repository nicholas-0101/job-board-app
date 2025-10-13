"use client";

import { Formik } from "formik";
import { useState } from "react";
import { signInSchema } from "./signinSchema";
import { useSignIn } from "@/lib/hooks/useSignIn";
import { useGoogleSignIn } from "@/lib/hooks/useGoogleSignIn";
import { useSignInDialog } from "@/lib/hooks/useSignInDialog";
import SignInForm from "../../../components/auth/signin/signinForm";
import SignInContainer from "@/components/auth/signin/SignInContainer";
import SignInHeader from "@/components/auth/signin/SignInHeader";
import SignUpLink from "@/components/auth/signin/SignUpLink";
import SignInDialog from "@/components/auth/signin/SignInDialog";

export default function SignInPage() {
  const { isLoading, handleSignIn } = useSignIn();
  const { handleGoogleSignIn } = useGoogleSignIn();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog } =
    useSignInDialog();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    const result = await handleSignIn(values);
    if (!result.success) {
      openDialog("Error", result.message);
    }
  };

  return (
    <SignInContainer>
      <SignInHeader />

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <SignInForm
            errors={errors}
            touched={touched}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            handleGoogleSignIn={handleGoogleSignIn}
          />
        )}
      </Formik>

      <SignUpLink />

      <SignInDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </SignInContainer>
  );
}
