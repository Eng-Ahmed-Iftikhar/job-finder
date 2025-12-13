/\*\*

- INTEGRATION GUIDE: Email and Phone Verification
-
- This file shows how to integrate the email/phone verification flows
- in the EditProfileContent component.
  \*/

// 1. Import the verification API functions in EditProfileContent.tsx:
// import {
// sendEmailVerificationCode,
// verifyEmailCode,
// sendPhoneVerificationCode,
// verifyPhoneCode,
// } from "@/api/services/verificationApi";

// 2. Update the EmailVerificationModal to use the API:
/_
const handleEmailVerify = async (code: string) => {
try {
const result = await verifyEmailCode(formik.values.email, code);
if (result.verified) {
// Email was verified successfully
// The modal will call onEmailUpdated() which updates Formik
return;
} else {
throw new Error(result.message);
}
} catch (error) {
console.error("Email verification failed:", error);
throw error;
}
};
_/

// 3. Update the PhoneVerificationModal to use the API:
/_
const handlePhoneVerify = async (code: string) => {
try {
const result = await verifyPhoneCode(formik.values.phoneNumber, code);
if (result.verified) {
// Phone was verified successfully
// The modal will call onPhoneUpdated() which updates Formik
return;
} else {
throw new Error(result.message);
}
} catch (error) {
console.error("Phone verification failed:", error);
throw error;
}
};
_/

// 4. Update EmailVerificationModal's handleSendCode to call API:
/\*
const handleSendCode = async () => {
if (!newEmail) {
setError("Please enter an email address");
return;
}

try {
setIsLoading(true);
setError("");
const result = await sendEmailVerificationCode(newEmail);
if (result.success) {
setStep("verify");
// Optional: Show remaining time before code expires
// if (result.expiresIn) {
// startCountdown(result.expiresIn);
// }
} else {
setError(result.message || "Failed to send verification code");
}
} catch (err) {
setError("Failed to send verification code. Please try again.");
} finally {
setIsLoading(false);
}
};
\*/

// 5. Update PhoneVerificationModal's handleSendCode to call API:
/\*
const handleSendCode = async () => {
if (!newPhone) {
setError("Please enter a phone number");
return;
}

try {
setIsLoading(true);
setError("");
const result = await sendPhoneVerificationCode(newPhone);
if (result.success) {
setStep("verify");
// Optional: Show remaining time before code expires
// if (result.expiresIn) {
// startCountdown(result.expiresIn);
// }
} else {
setError(result.message || "Failed to send verification code");
}
} catch (err) {
setError("Failed to send verification code. Please try again.");
} finally {
setIsLoading(false);
}
};
\*/

// API Endpoints Implementation:
// Backend should provide these endpoints:

// POST /api/profile/send-email-verification
// Request: { email: string }
// Response: { success: boolean, message: string, expiresIn?: number }

// POST /api/profile/verify-email
// Request: { email: string, code: string }
// Response: { success: boolean, message: string, verified?: boolean }

// POST /api/profile/send-phone-verification
// Request: { phoneNumber: string }
// Response: { success: boolean, message: string, expiresIn?: number }

// POST /api/profile/verify-phone
// Request: { phoneNumber: string, code: string }
// Response: { success: boolean, message: string, verified?: boolean }

// Flow Diagram:
// User clicks "Change Email" →
// EmailVerificationModal opens (step="input") →
// User enters new email →
// User clicks "Send Code" →
// Modal calls sendEmailVerificationCode(newEmail) →
// Backend sends code to email →
// Modal switches to step="verify" →
// User enters 6-digit code →
// User clicks "Verify" →
// Modal calls verifyEmailCode(email, code) →
// Backend validates code →
// Modal calls onEmailUpdated(newEmail) →
// Formik updates email field →
// Modal closes
