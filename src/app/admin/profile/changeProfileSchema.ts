import * as Yup from "yup";

export const userProfileSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone is required"),
  gender: Yup.string().required("Gender is required").oneOf(["Male", "Female"], "Invalid gender"),
  dob: Yup.date().required("Date of birth is required").max(new Date(), "Date of birth must be in the past"),
  education: Yup.string().required("Education is required").max(100, "Education must be less than 100 characters"),
  address: Yup.string().required("Address is required").max(200, "Address too long"),
  city: Yup.string().required("City is required"), 
});

export const adminProfileSchema = Yup.object().shape({
  name: Yup.string().optional(),
  email: Yup.string().email("Invalid email").optional(),
  phone: Yup.string().optional(),
  address: Yup.string().optional(),
  locationCity: Yup.string().optional(), 
  locationProvince: Yup.string().optional(),
  website: Yup.string().optional(),
  description: Yup.string().optional(),
  socials: Yup.object().shape({
    facebook: Yup.string().optional(),
    twitter: Yup.string().optional(),
    linkedin: Yup.string().optional(),
    instagram: Yup.string().optional(),
  }).optional(),
});

export const changeEmailSchema = Yup.object().shape({
  newEmail: Yup.string().email("Invalid email").required("Email is required"),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});