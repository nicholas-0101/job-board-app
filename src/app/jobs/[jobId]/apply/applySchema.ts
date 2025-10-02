import * as Yup from "yup";

export const jobApplicationSchema = Yup.object().shape({
  expectedSalary: Yup.number()
    .typeError("Expected salary must be a number")
    .required("Expected salary is required"),

  cvFile: Yup.mixed<File>()
    .required("CV file is required")
    .test("fileType", "Only PDF files are allowed", (file) => {
      return file instanceof File && file.type === "application/pdf";
    })
    .test("fileSize", "File size must not exceed 10MB", (file) => {
      return file instanceof File && file.size <= 10 * 1024 * 1024;
    }),
});