import { lazy } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import Login from "../pages/Login";
import TemporaryLogin from "../pages/TemporaryLogin";
import SetPassword from "../pages/SetPassword";
import OTPVerification from "../pages/OTPVerification";
import IdentityVerification from "../pages/IdentityVerification";
import ResetPassword from "../pages/ResetPassword";
import TermsAndConditions from "../pages/TermsAndConditions";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";

import { UploadIDPhoto } from "../components/forms/UploadIDPhoto";
import { LivePhotoCapture } from "../components/forms/LivePhotoCapture";

import { VerificationPending } from "../pages/PendingVerification";
import { VerificationResultScreen } from "../pages/VerificationSuccess";

const AuthRoutes = {
  path: "/auth",
  element: (
    <ErrorBoundary>
      <AuthLayout />
    </ErrorBoundary>
  ),
  children: [
    // ───────────────────────────────────────────────
    // AUTH BASICS
    // ───────────────────────────────────────────────
    { path: "login", element: <Login /> },
    { path: "temp-login", element: <TemporaryLogin /> },
    { path: "otp-verification", element: <OTPVerification /> },
    { path: "set-password", element: <SetPassword /> },

    // ───────────────────────────────────────────────
    // PASSWORD RECOVERY
    // ───────────────────────────────────────────────
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password", element: <ResetPassword /> },

    // ───────────────────────────────────────────────
    // KYC / IDENTITY VERIFICATION
    // ───────────────────────────────────────────────
    { path: "identity-verification", element: <IdentityVerification /> },
    { path: "upload-id", element: <UploadIDPhoto /> },
    { path: "live-photo", element: <LivePhotoCapture /> },
    { path: "pending", element: <VerificationPending /> },
    { path: "result", element: <VerificationResultScreen /> },

    // ───────────────────────────────────────────────
    // MISC
    // ───────────────────────────────────────────────
    { path: "terms", element: <TermsAndConditions /> },
    { path: "verify-email", element: <VerifyEmail /> },
  ],
};

export default AuthRoutes;












