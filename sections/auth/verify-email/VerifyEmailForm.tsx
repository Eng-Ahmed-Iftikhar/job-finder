import CircularCountdown from "@/components/CircularCountdown";
import Button from "@/components/ui/Button";
import React, { useEffect, useCallback } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import {
  useSendEmailVerificationMutation,
  useVerifyEmailCodeMutation,
} from "@/api/services/authApi";
import { useRouter } from "expo-router";
import { useLazyMeQuery } from "@/api/services/authApi";
import { Formik } from "formik";
import * as yup from "yup";

const verifyEmailSchema = yup.object({
  verificationCode: yup
    .string()
    .required("Verification code is required")
    .length(6, "Verification code must be exactly 6 digits")
    .matches(/^\d+$/, "Verification code must contain only numbers"),
});

function VerifyEmailForm() {
  const [isSendAgain, setIsSendAgain] = React.useState<boolean>(false);
  const router = useRouter();

  const [sendEmailVerification, { isLoading: isSending }] =
    useSendEmailVerificationMutation();
  const [verifyEmailCode, { isLoading: isVerifying }] =
    useVerifyEmailCodeMutation();
  const [getMe] = useLazyMeQuery();

  // Send verification code on mount
  useEffect(() => {
    handleSendCode();
  }, []);

  const handleSendCode = useCallback(async () => {
    try {
      await sendEmailVerification().unwrap();
      setIsSendAgain(true);
    } catch (error: any) {
      console.error("Failed to send verification code:", error);
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Failed to send verification code";
      Alert.alert("Error", errorMessage);
    }
  }, [sendEmailVerification]);

  const handleVerifyCode = useCallback(
    async (values: { verificationCode: string }, { setFieldError }: any) => {
      try {
        const response = await verifyEmailCode({
          verificationCode: values.verificationCode,
        }).unwrap();

        if (response.message) {
          Alert.alert("Success", response.message, [
            {
              text: "OK",
              onPress: async () => {
                // Refresh user data to get updated verification status
                await getMe();
                router.replace("/(dashboard)/");
              },
            },
          ]);
        }
      } catch (error: any) {
        console.error("Verification failed:", error);

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
    [verifyEmailCode, router, getMe]
  );

  return (
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
            numberOfDigits={6}
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
            disabled={isVerifying || values.verificationCode.length !== 6}
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
                seconds={60}
                size={25}
                onComplete={() => setIsSendAgain(false)}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

export default VerifyEmailForm;
