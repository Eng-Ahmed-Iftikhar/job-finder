import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { OnboardingSteps } from "@/context/OnboardingContext";
import { useAppSelector } from "@/hooks/useAppSelector";
import useOnboarding from "@/hooks/useOnboarding";
import { selectAuth } from "@/store/reducers/authSlice";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
});

type FormValues = yup.InferType<typeof formSchema>;

function GeneralInfo() {
  const {
    handleUserProfile,
    handleChangeCurrentStep,
    handleChangeStepHeader,
    userProfile,
  } = useOnboarding();
  const router = useRouter();
  const { user } = useAppSelector(selectAuth);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      handleUserProfile({ generalInfo: values });
      handleChangeCurrentStep(OnboardingSteps.LOCATION);
      router.push("/(onboarding)/location");
    },
    [handleUserProfile]
  );

  useEffect(() => {
    handleChangeStepHeader({
      title:
        "Welcome to Job finder! Let’s take a few steps to complete your profile.",
      description: "First, please enter your name",
    });
  }, [handleChangeStepHeader]);

  useEffect(() => {
    if (user) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";

      handleUserProfile({
        generalInfo: {
          firstName,
          lastName,
        },
      });
    }
  }, [user, handleUserProfile]);

  return (
    <Formik
      initialValues={{
        firstName: userProfile?.generalInfo?.firstName || "",
        lastName: userProfile?.generalInfo?.lastName || "",
      }}
      enableReinitialize
      onSubmit={handleSubmit}
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
      }) => (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            className="flex-1 p-4 bg-white"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View className="flex-1 ">
              <View className="  mt-4  gap-6 ">
                <Input
                  label="First name"
                  type="text"
                  placeholder="Enter your name"
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                  error={errors.firstName}
                  isError={!!errors.firstName && touched.firstName}
                />
                <Input
                  label="Last name"
                  type="text"
                  placeholder="Enter your name"
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                  error={errors.lastName}
                  isError={!!errors.lastName && touched.lastName}
                />
              </View>

              <Button
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={(e) => handleSubmit(e as any)}
                className="my-6"
              >
                Next
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

export default GeneralInfo;
