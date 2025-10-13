"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import { signUpSchema } from "./signupSchema";
import { useSignUp } from "@/lib/hooks/useSignUp";
import { useSignUpGoogleAuth } from "@/lib/hooks/useSignUpGoogleAuth";
import { useSignUpDialog } from "@/lib/hooks/useSignUpDialog";
import SignUpForm from "../../../components/auth/signup/signupForm";
import Tabs from "../../../components/auth/signup/signupTabs";
import SocialLoginButton from "../../../components/auth/signup/signupSocialButton";
import SignUpContainer from "@/components/auth/signup/SignUpContainer";
import SignUpPageHeader from "@/components/auth/signup/SignUpPageHeader";
import SignInLink from "@/components/auth/signup/SignInLink";
import SignUpSubmitButton from "@/components/auth/signup/SignUpSubmitButton";
import SignUpDivider from "@/components/auth/signup/SignUpDivider";
import SignUpDialog from "@/components/auth/signup/SignUpDialog";

export default function SignUpPage() {
  const [tab, setTab] = useState<"seeker" | "admin">("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(true);
  
  const { isLoading, handleSignUp } = useSignUp();
  const { handleGoogleLogin } = useSignUpGoogleAuth();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog } =
    useSignUpDialog();

  const onSubmit = async (values: any) => {
    const result = await handleSignUp(values, tab);
    if (!result.success) {
      openDialog("Error", result.message);
    }
  };

  return (
    <SignUpContainer>
      <SignUpPageHeader tab={tab} />
      
      <Formik
        enableReinitialize
        initialValues={{
          fullName: "",
          companyName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: tab === "seeker" ? "USER" : "ADMIN",
        }}
        validationSchema={signUpSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-4 sm:p-8"
          >
            <Tabs tab={tab} setTab={setTab} />
            <SignUpForm
              tab={tab}
              isLoading={isLoading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              errors={errors}
              touched={touched}
            />

            <SignUpSubmitButton isLoading={isLoading} />

            <SignUpDivider>Or continue with</SignUpDivider>
            
            <SocialLoginButton
              handleGoogleLogin={() => handleGoogleLogin(tab)}
              isGoogleLoaded={isGoogleLoaded}
            />
          </Form>
        )}
      </Formik>

      <SignInLink />

      <SignUpDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </SignUpContainer>
  );
}
