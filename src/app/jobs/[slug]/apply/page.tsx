"use client";

import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import Container from "@/components/common/Container";
import { jobApplicationSchema } from "./applySchema";
import { useJobApplication } from "@/lib/hooks/useJobApplication";
import JobApplicationLoading from "@/components/job-application/JobApplicationLoading";
import JobApplicationHeader from "@/components/job-application/JobApplicationHeader";
import PreselectionStatusBanner from "@/components/job-application/PreselectionStatusBanner";
import SalaryInputField from "@/components/job-application/SalaryInputField";
import CVUploadField from "@/components/job-application/CVUploadField";
import SubmitButton from "@/components/job-application/SubmitButton";
import JobApplicationDialog from "@/components/job-application/JobApplicationDialog";

export default function JobApplicationPage() {
  const {
    success,
    jobName,
    isLoading,
    dialogOpen,
    dialogTitle,
    dialogMessage,
    preselectionStatus,
    checkingPreselection,
    initialValues,
    handleSubmit,
    closeDialog,
  } = useJobApplication();

  // Show loading state while checking preselection
  if (checkingPreselection) {
    return <JobApplicationLoading />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 py-20">
      <Container className="py-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card text-card-foreground border border-border rounded-2xl shadow-md p-8"
        >
          <JobApplicationHeader jobName={jobName} />

          <PreselectionStatusBanner preselectionStatus={preselectionStatus} />

          <Formik
            initialValues={initialValues}
            validationSchema={jobApplicationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                await handleSubmit(values);
              } catch (error: any) {
                setErrors({ expectedSalary: error.message });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, errors, touched, values }) => (
              <Form className="space-y-6">
                <SalaryInputField errors={errors} touched={touched} />

                <CVUploadField
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  values={values}
                />

                <SubmitButton isLoading={isLoading} />
              </Form>
            )}
          </Formik>
        </motion.div>
      </Container>

      <JobApplicationDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </section>
  );
}
