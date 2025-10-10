"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import { jobApplicationSchema } from "./applySchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [success, setSuccess] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobId, setJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [preselectionStatus, setPreselectionStatus] = useState<{
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null>(null);
  const [checkingPreselection, setCheckingPreselection] = useState(true);

  const initialValues = {
    expectedSalary: "",
    cvFile: null as File | null,
  };

  useEffect(() => {
    async function fetchJob() {
      const response = await apiCall.get(`/job/${slug}`);
      setJobName(response.data.data.title);
      try {
        const response = await apiCall.get(`/job/${slug}`);
        const job = response.data.data;
        setJobName(job.title);
        setJobId(job.id);
      } catch (err) {
        console.error("Failed to fetch job name", err);
      }
    }

    if (slug) fetchJob();
  }, [slug]);

  // Check preselection test status
  useEffect(() => {
    const checkPreselectionStatus = async () => {
      if (!jobId) return;
      
      try {
        const response = await apiCall.get(`/preselection/jobs/${jobId}/my-status`);
        const status = response.data.data;
        setPreselectionStatus(status);
        
        // Redirect if test is required but not completed or failed
        if (status.required && !status.submitted) {
          alert("Please complete the pre-selection test before applying for this job.");
          router.push(`/jobs/${slug}/pretest`);
          return;
        }
        
        if (status.required && status.submitted && !status.isPassed) {
          alert("Your pre-selection test score does not meet the passing criteria for this job.");
          router.push(`/explore/jobs/${slug}`);
          return;
        }
      } catch (error) {
        console.error("Failed to check preselection status:", error);
      } finally {
        setCheckingPreselection(false);
      }
    };

    if (jobId) {
      checkPreselectionStatus();
    }
  }, [jobId, slug, router]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("expectedSalary", values.expectedSalary);
      if (values.cvFile) {
        formData.append("cvFile", values.cvFile);
      }

      await apiCall.post(`/application/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      openDialog("Submitted!", "Application submitted successfully!", () =>
        router.replace(`/explore/jobs/${slug}`)
      );
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking preselection
  if (checkingPreselection) {
    return (
      <div className="min-h-screen bg-background py-20">
        <Container className="py-10 max-w-2xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#24CFA7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Checking requirements...</p>
            </div>
          </div>
        </Container>
      </div>
    );
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
          <h1 className="text-2xl text-center font-bold text-[#467EC7] mb-6">
            Apply for {jobName}
          </h1>
          
          {/* Show preselection test passed status */}
          {preselectionStatus?.required && preselectionStatus.isPassed && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm text-center">
                ✓ Pre-selection Test Passed (Score: {preselectionStatus.score}/{preselectionStatus.passingScore || 25})
              </p>
            </div>
          )}

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
                {/* Expected Salary */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expected Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                      IDR
                    </span>

                    <Field name="expectedSalary">
                      {({ field, form }: any) => {
                        const formatRupiah = (value: string | number) => {
                          const numeric =
                            typeof value === "number"
                              ? value
                              : value.replace(/\D/g, "");
                          return numeric
                            ? Number(numeric).toLocaleString("id-ID")
                            : "";
                        };

                        const handleChange = (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          form.setFieldValue(field.name, rawValue);
                        };

                        return (
                          <input
                            {...field}
                            type="text"
                            value={formatRupiah(field.value)}
                            onChange={handleChange}
                            placeholder="e.g., 10.000.000"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-all hover:bg-background ${
                              form.errors.expectedSalary &&
                              form.touched.expectedSalary
                                ? "border-red-400 bg-red-50"
                                : "border-input focus:border-primary bg-secondary"
                            }`}
                          />
                        );
                      }}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="expectedSalary"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload CV
                  </label>
                  <div className="w-full">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFieldValue("cvFile", e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="cvFile"
                    />

                    <label
                      htmlFor="cvFile"
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm ${
                        errors.cvFile && touched.cvFile
                          ? "border-red-400 bg-red-50 text-red-400"
                          : "border-input bg-secondary hover:bg-background text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>
                          {values.cvFile
                            ? values.cvFile.name
                            : "Choose PDF File. Max 10 MB"}
                        </span>
                      </div>
                      {values.cvFile && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {(values.cvFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      )}
                    </label>
                  </div>
                  <ErrorMessage
                    name="cvFile"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className={`w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
                    isLoading
                      ? "cursor-not-allowed opacity-70"
                      : "hover:shadow-xl cursor-pointer"
                  }`}
                  whileHover={isLoading ? {} : { scale: 1.02 }}
                  whileTap={isLoading ? {} : { scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </Container>

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
