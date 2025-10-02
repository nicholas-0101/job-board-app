import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .max(100, "Email is too long")
    .required("Email is required")
    .test('no-xss', 'Invalid characters detected', value => {
      if (!value) return true;
      return !/<script|javascript:|on\w+\s*=/i.test(value);
    }),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long")
    .required("Password is required")
    .test('no-xss', 'Invalid characters detected', value => {
      if (!value) return true;
      return !/<script|javascript:|on\w+\s*=/i.test(value);
    }),
});