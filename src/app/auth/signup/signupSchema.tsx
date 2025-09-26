import * as Yup from "yup";

export const signUpSchema = Yup.object({
  fullName: Yup.string().when("role", {
    is: "USER",
    then: (schema) => schema.required("Full Name is required"),
  }),
  companyName: Yup.string().when("role", {
    is: "ADMIN",
    then: (schema) => schema.required("Company Name is required"),
  }),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(/(?=.*\d)/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});