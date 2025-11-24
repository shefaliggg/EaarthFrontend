/**
 * @file validationSchema.js
 * @description Contains all Yup validation schemas for authentication and verification forms.
 */

import * as Yup from "yup";

/* -------------------------------------------------------------------------- */
/*                               SHARED RULES                                 */
/* -------------------------------------------------------------------------- */

const emailValidation = Yup.string()
  .trim()
  .email("Invalid email address")
  .required("Email is required");

const passwordValidation = Yup.string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .matches(/[0-9]/, "Password requires at least one number")
  .matches(/[a-z]/, "Password requires a lowercase letter")
  .matches(/[A-Z]/, "Password requires an uppercase letter")
  .required("Password is required");

const confirmPasswordValidation = Yup.string()
  .oneOf([Yup.ref("password"), null], "Passwords must match")
  .required("Confirm password is required");

const termsValidation = Yup.boolean()
  .oneOf([true], "You must accept the terms and conditions");

/* -------------------------------------------------------------------------- */
/*                         AUTHENTICATION SCHEMAS                             */
/* -------------------------------------------------------------------------- */

export const setPasswordValidation = Yup.object().shape({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

export const signUpValidation = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

export const loginValidation = Yup.object().shape({
  email: emailValidation,
  password: Yup.string().required("Password is required"),
});

export const forgotPasswordValidation = Yup.object().shape({
  email: emailValidation,
});

export const resetPasswordValidation = Yup.object().shape({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

/* -------------------------------------------------------------------------- */
/*                          VERIFICATION SCHEMAS                              */
/* -------------------------------------------------------------------------- */

export const studioValidationSchema = Yup.object().shape({
  studioName: Yup.string().trim().required("Studio name is required"),
  studioPhone: Yup.string().trim().required("Studio phone is required"),
  studioAddress: Yup.string().trim().required("Studio address is required"),
  studioCity: Yup.string().trim().required("City is required"),
  studioCountry: Yup.string().trim().required("Country is required"),
  ownerFullname: Yup.string().trim().required("Owner name is required"),
  ownerPhone: Yup.string().trim().required("Owner phone is required"),
  termsAgreed: termsValidation,
});

export const agencyValidationSchema = Yup.object().shape({
  agencyName: Yup.string().trim().required("Agency name is required"),
  agencyPhone: Yup.string().trim().required("Agency phone is required"),
  agencyAddress: Yup.string().trim().required("Agency address is required"),
  agencyCity: Yup.string().trim().required("City is required"),
  agencyCountry: Yup.string().trim().required("Country is required"),
  agentFullname: Yup.string().trim().required("Agent name is required"),
  agentPhone: Yup.string().trim().required("Agent phone is required"),
  termsAgreed: termsValidation,
});

export const userValidationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  termsAgreed: termsValidation,
});




