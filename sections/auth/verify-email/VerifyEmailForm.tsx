import CircularCountdown from "@/components/CircularCountdown";
import Button from "@/components/ui/Button";
import SuccessToast from "@/components/SuccessToast";
import ErrorToast from "@/components/ErrorToast";
import React, { useEffect, useCallback, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import {
  useSendEmailVerificationMutation,
  useVerifyEmailCodeMutation,
} from "@/api/services/authApi";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setEmailVerified } from "@/store/reducers/userSlice";
import { Formik } from "formik";
import * as yup from "yup";

const verifyEmailSchema = yup.object({
  verificationCode: yup
    .string()
    .required("Verification code is required")
    .length(5, "Verification code must be exactly 5 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers"),
});

function VerifyEmailForm() {
  const [isSendAgain, setIsSendAgain] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [sendEmailVerification, { isLoading: isSending }] =
    useSendEmailVerificationMutation();
  const [verifyEmailCode, { isLoading: isVerifying }] =
    useVerifyEmailCodeMutation();

  // Send verification code on mount
  useEffect(() => {
    handleSendCode();
  }, []);

  const handleSendCode = useCallback(async () => {
    try {
      await sendEmailVerification().unwrap();
      setIsSendAgain(true);
    } catch (error: any) {
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Failed to send verification code";
      setToastMessage(errorMessage);
      setShowErrorToast(true);
    }
  }, [sendEmailVerification]);

  const handleVerifyCode = useCallback(
    async (values: { verificationCode: string }, { setFieldError }: any) => {
      try {
        const response = await verifyEmailCode({
          verificationCode: values.verificationCode,
        }).unwrap();

        if (response.message) {
          // Update email verified status directly in store
          dispatch(setEmailVerified(true));

          // Show success toast
          setToastMessage(response.message || "Email verified successfully");
          setShowSuccessToast(true);

          // Navigate after a short delay to show toast
          setTimeout(() => {
            router.replace("/(dashboard)/");
          }, 1500);
        }
      } catch (error: any) {
        // Handle server-side errors
        let errorMessage = "Invalid verification code";

        if (error?.data?.message) {
          // Handle array of error messages from server
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message[0]; // Get first error message
          } else {
            errorMessage = error.data.message;
          }
        }

        // Set field error instead of Alert for better UX
        setFieldError("verificationCode", errorMessage);
      }
    },
    [verifyEmailCode, router, dispatch]
  );

  return (
    <>
      <Formik
        initialValues={{ verificationCode: "" }}
        onSubmit={handleVerifyCode}
        validationSchema={verifyEmailSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({
          handleSubmit,
          setFieldValue,
          setFieldError,
          values,
          errors,
          touched,
        }) => (
          <View className="mt-8  w-[80%]  mx-auto">
            <OtpInput
              numberOfDigits={5}
              type="numeric"
              focusColor={"#3b82f6"} // Blue-500
              theme={{
                pinCodeContainerStyle: {
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: errors.verificationCode ? "#ef4444" : "#1eadff",
                  backgroundColor: "transparent",
                  borderRadius: 0,
                },
              }}
              onTextChange={(text) => {
                setFieldValue("verificationCode", text);
                // Clear error when user starts typing
                if (errors.verificationCode) {
                  setFieldError("verificationCode", "");
                }
              }}
              disabled={isVerifying}
            />

            {/* Display error message */}
            {errors.verificationCode && touched.verificationCode && (
              <Text className="text-red-500 text-sm mt-2 text-center">
                {errors.verificationCode}
              </Text>
            )}

            <Button
              onPress={(e) => handleSubmit(e as any)}
              className="mt-6"
              disabled={isVerifying || values.verificationCode.length !== 5}
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>

            <TouchableOpacity
              disabled={isSendAgain || isSending}
              className="mt-6 gap-3  items-center justify-center"
              onPress={handleSendCode}
            >
              <Text
                className={`${isSendAgain || isSending ? "text-gray-400" : "text-azure-radiance-500"}  text-sm font-medium  `}
              >
                {isSending
                  ? "Sending..."
                  : isSendAgain
                    ? "Code is sent"
                    : "Send code again"}
              </Text>
              {isSendAgain && (
                <CircularCountdown
                  seconds={900}
                  size={40}
                  onComplete={() => setIsSendAgain(false)}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <SuccessToast
        visible={showSuccessToast}
        message={toastMessage}
        onClose={() => setShowSuccessToast(false)}
      />
      <ErrorToast
        visible={showErrorToast}
        message={toastMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  );
}

export default VerifyEmailForm;
