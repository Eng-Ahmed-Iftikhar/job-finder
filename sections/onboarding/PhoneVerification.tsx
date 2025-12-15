import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import {
  useSendPhoneVerificationMutation,
  useVerifyPhoneCodeMutation,
} from "@/api/services/authApi";
import SuccessToast from "@/components/SuccessToast";
import ErrorToast from "@/components/ErrorToast";
import CircularCountdown from "@/components/CircularCountdown";
import { UserPhoneNumber } from "@/types/api/auth";

function PhoneVerificationScreen() {
  const { handleChangeCurrentStep, handleUserProfile, userProfile } =
    useOnboarding();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [canResend, setCanResend] = useState(false);

  const [sendPhoneVerification, { isLoading: isSending }] =
    useSendPhoneVerificationMutation();
  const [verifyPhoneCode, { isLoading: isVerifying }] =
    useVerifyPhoneCodeMutation();

  const handleResendCode = useCallback(async () => {
    try {
      setError("");
      await sendPhoneVerification().unwrap();
      setCanResend(false);
      setToastMessage("Verification code sent");
      setShowSuccessToast(true);
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Failed to resend verification code";
      setToastMessage(msg);
      setShowErrorToast(true);
    }
  }, [sendPhoneVerification]);

  const handleVerifyCode = async () => {
    if (!code.trim() || code.trim().length !== 5) {
      setError("Verification code must be 5 digits");
      return;
    }
    try {
      setError("");
      await verifyPhoneCode({
        verificationCode: code.trim(),
      }).unwrap();
      handleUserProfile({
        phoneNumber: {
          ...(userProfile?.phoneNumber as UserPhoneNumber),
          isVerified: true,
        },
      });
      setToastMessage("Phone verified successfully!");
      setShowSuccessToast(true);

      // Navigate to next step after a short delay
      setTimeout(() => {
        handleChangeCurrentStep(OnboardingSteps.PICTURE_URL);
      }, 1500);
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Verification failed. Please try again.";
      setError(msg);
      setToastMessage(msg);
      setShowErrorToast(true);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="flex-1 justify-start">
        <View className="mb-6">
          <OtpInput
            numberOfDigits={5}
            type="numeric"
            focusColor={"#3b82f6"}
            theme={{
              pinCodeContainerStyle: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: error ? "#ef4444" : "#1eadff",
                backgroundColor: "transparent",
                borderRadius: 0,
              },
            }}
            onTextChange={(text) => {
              setCode(text);
              if (error) setError("");
            }}
            disabled={isVerifying}
          />

          {error ? (
            <Text className="text-red-500 text-sm mt-2 text-center">
              {error}
            </Text>
          ) : null}
        </View>

        <Button
          onPress={handleVerifyCode}
          disabled={isVerifying || code.length !== 5}
          loading={isVerifying}
          className="mb-4"
        >
          {isVerifying ? "Verifying..." : "Verify Phone"}
        </Button>

        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Button
            onPress={handleResendCode}
            disabled={isSending || !canResend}
            variant="outline"
            className="flex-row items-center gap-2 max-w-[150px]"
          >
            <Text
              className={`text-sm font-medium ${
                isSending || !canResend
                  ? "text-gray-400"
                  : "text-azure-radiance-500"
              }`}
            >
              {isSending ? "Sending..." : "Resend Code"}
            </Text>
          </Button>
          {!canResend && (
            <CircularCountdown
              seconds={900}
              size={28}
              onComplete={() => setCanResend(true)}
            />
          )}
        </View>
      </View>

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
    </View>
  );
}

export default PhoneVerificationScreen;
