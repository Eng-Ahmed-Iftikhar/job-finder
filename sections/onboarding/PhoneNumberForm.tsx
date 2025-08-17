import useOnboarding from "@/hooks/useOnboarding";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { validatePhoneNumber } from "@/utils";
import { useRouter } from "expo-router";
import {
  useSendPhoneVerificationMutation,
  useVerifyPhoneCodeMutation,
} from "@/api/services/authApi";
import { useUpdatePhoneNumberMutation } from "@/api/services/userApi";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import * as yup from "yup";
import PhoneNumberInputStep from "@/components/PhoneNumberInputStep";
import PhoneVerificationStep from "@/components/PhoneVerificationStep";
import PhoneNumberActions from "@/components/PhoneNumberActions";
import { OnboardingSteps } from "@/types/onboarding";

const formSchema = yup.object({
  countryCode: yup
    .string()
    .required("Country code is required")
    .min(2, "Country code must be at least 2 characters"),
  number: yup
    .number()
    .required("Phone number is required")
    .min(2, "Phone number must be at least 2 characters")
    .when("countryCode", (phoneCode, schema) => {
      if (phoneCode && typeof phoneCode === "string") {
        return schema.test(
          "is-valid-phone-number",
          "Invalid phone number",
          (value) => validatePhoneNumber(value, phoneCode)
        );
      }
      return schema;
    }),
  isVerified: yup.boolean().default(false),
});

type FormValues = yup.InferType<typeof formSchema>;

function PhoneNumberForm() {
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();

  const router = useRouter();
  const [sendPhoneVerification] = useSendPhoneVerificationMutation();
  const [verifyPhoneCode] = useVerifyPhoneCodeMutation();
  const [updatePhoneNumber, { isLoading: isUpdatingPhoneNumber }] =
    useUpdatePhoneNumberMutation();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const countryOptions = useCountryOptions();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!values.isVerified) {
        try {
          // Call API to send verification code
          await sendPhoneVerification({
            phone: `${values.countryCode}${values.number}`,
            countryCode: values.countryCode,
          }).unwrap();

          // Show verification step
          setShowVerification(true);
          // Reset verification code to empty
          setVerificationCode(["", "", "", "", ""]);
        } catch (error: any) {
          console.error("Failed to send verification code:", error);
          // Set API error for display
          if (error?.data?.message?.[0]) {
            setApiError(error.data.message[0]);
          }
          return;
        }
        return;
      }

      try {
        // Update profile via API
        await updatePhoneNumber(values);

        // Save to context and navigate
        handleUserProfile({ phoneNumber: values });
        handleChangeCurrentStep(OnboardingSteps.PICTURE_URL);
        router.push("/(onboarding)/profile-image");
      } catch (error) {
        console.error("Failed to update phone number:", error);
        // Handle error - you might want to show a toast
      }
    },
    [
      handleUserProfile,
      handleChangeCurrentStep,
      router,
      sendPhoneVerification,
      updatePhoneNumber,
    ]
  );

  const handleResendCode = useCallback(
    async (phoneNumber: number, countryCode: string) => {
      try {
        // Reset verification code
        setVerificationCode(["", "", "", "", ""]);

        // Call API to resend verification code
        await sendPhoneVerification({
          phone: `${countryCode}${phoneNumber}`,
          countryCode: countryCode,
        }).unwrap();

        // You might want to show a success message
      } catch (error) {
        console.error("Failed to resend verification code:", error);
        // Handle error - you might want to show a toast or error message
      }
    },
    [sendPhoneVerification]
  );

  const handleBackToPhoneInput = () => {
    setShowVerification(false);
    setVerificationCode(["", "", "", "", ""]);
  };

  return (
    <Formik
      initialValues={{
        countryCode: userProfile?.phoneNumber?.countryCode || "+92",
        number: userProfile?.phoneNumber?.number || 0,
        isVerified: userProfile?.phoneNumber?.isVerified || false,
      }}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={formSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        submitForm,
      }) => {
        const handleVerificationSubmit = async () => {
          setIsVerifying(true);

          try {
            // Call API to verify the code
            const verificationCodeString = verificationCode.join("");
            await verifyPhoneCode({
              phone: `${values.countryCode}${values.number}`,
              countryCode: values.countryCode,
              verificationCode: verificationCodeString,
            }).unwrap();

            // Verification successful
            setFieldValue("isVerified", true);
            // Submit the form after verification
            submitForm();
          } catch (error) {
            console.error("Failed to verify code:", error);
            // Handle error - you might want to show a toast or error message
            setIsVerifying(false);
          }
        };

        return (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <View className="flex-1">
              {!showVerification ? (
                <PhoneNumberInputStep
                  countryCode={values.countryCode}
                  phoneNumber={values.number}
                  countryOptions={countryOptions}
                  onCountryCodeChange={(value) => {
                    setApiError(null);
                    handleChange("countryCode")(value);
                  }}
                  onPhoneNumberChange={(value) => {
                    setApiError(null);
                    handleChange("number")(value);
                  }}
                  onPhoneNumberBlur={handleBlur("number")}
                  error={apiError || (errors.number as string)}
                  isError={
                    !!apiError ||
                    (!!errors.number && (touched.number as boolean))
                  }
                />
              ) : (
                <PhoneVerificationStep
                  countryCode={values.countryCode}
                  phoneNumber={values.number}
                  verificationCode={verificationCode}
                  onVerificationCodeChange={setVerificationCode}
                  onResendCode={() =>
                    handleResendCode(values.number, values.countryCode)
                  }
                />
              )}

              <PhoneNumberActions
                showVerification={showVerification}
                isSubmitting={isSubmitting}
                isVerifying={isVerifying}
                isUpdatingPhoneNumber={isUpdatingPhoneNumber}
                verificationCode={verificationCode}
                onBack={handleBackToPhoneInput}
                onVerify={handleVerificationSubmit}
                onNext={(e) => handleSubmit(e as any)}
              />
            </View>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
}

export default PhoneNumberForm;
