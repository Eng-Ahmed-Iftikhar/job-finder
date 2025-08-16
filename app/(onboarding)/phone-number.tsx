import Button from "@/components/ui/Button";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { OnboardingSteps } from "@/context/OnboardingContext";
import useOnboarding from "@/hooks/useOnboarding";
import getFlagEmoji from "@/utils/getflagEmoji";
import { Country } from "country-state-city";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { isValidPhoneNumber } from "libphonenumber-js";
import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  countryCode: yup
    .string()
    .required("Country code is required")
    .min(2, "Country code must be at least 2 characters"),
  number: yup
    .number()
    .required("Phone number is required")
    .min(2, "Phone number must be at least 2 characters")
    .when("countryCode", (phoneCode, schema) =>
      phoneCode
        ? schema.test(
            "is-valid-phone-number",
            "Invalid phone number",
            (value) => {
              const country = Country.getAllCountries().find(
                (country) =>
                  country.phonecode === (phoneCode as unknown as string)
              );
              const code = country?.isoCode || "PK";
              console.log(
                { value, code },
                isValidPhoneNumber(`+${value}`, code as any)
              );
              console.log({ value, code });

              return isValidPhoneNumber(`+${value}`, code as any);
            }
          )
        : schema
    ),
  isVerified: yup
    .boolean()
    .default(false)
    .when("number", (number, schema) =>
      number ? schema.oneOf([true], "Phone number is not verified") : schema
    ),
});

type FormValues = yup.InferType<typeof formSchema>;

function PhoneNumber() {
  const {
    handleUserProfile,
    handleChangeCurrentStep,
    handleChangeStepHeader,
    userProfile,
  } = useOnboarding();

  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      handleUserProfile({ phoneNumber: values });
      handleChangeCurrentStep(OnboardingSteps.PICTURE_URL);
      router.push("/(onboarding)/picture-url");
    },
    [handleUserProfile, handleChangeCurrentStep, router]
  );
  const { location: { city = "" } = {} } = userProfile || {};

  const countryOptions = useMemo(() => {
    return Country.getAllCountries()
      .map((country) => {
        const { phonecode = "" } = country || {};
        if (phonecode.includes("and")) {
          const newPhonecodes = phonecode.split("and");
          return [
            ...newPhonecodes.map((newPhonecode) => {
              return {
                ...country,
                phonecode: newPhonecode,
              };
            }),
          ];
        }
        return country;
      })
      .flat(1)
      .map((country) => {
        const phonecode = `${country.phonecode.startsWith("+") ? country.phonecode : "+" + country.phonecode}`;
        const label = `${getFlagEmoji(country.isoCode)} ${phonecode}`;

        return {
          label,
          value: country.phonecode.startsWith("+")
            ? country.phonecode
            : "+" + country.phonecode,
        };
      });
  }, [Country]);

  useEffect(() => {
    handleChangeStepHeader({
      title: "Enter your phone number",
      description:
        "Phone number will help protect your account as well as let employers contact you much easier.",
    });
    if (!city) {
      router.replace("/(onboarding)/location");
    }
  }, [handleChangeStepHeader]);

  return (
    <Formik
      initialValues={{
        countryCode: userProfile?.phoneNumber?.countryCode || "+92",
        number: userProfile?.phoneNumber?.number || 0,
        isVerified: userProfile?.phoneNumber?.isVerified || false,
      }}
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
                <PhoneNumberInput
                  selectCodeProps={{
                    onValueChange: handleChange("countryCode"),
                    value: values.countryCode,
                    items: countryOptions,
                  }}
                  inputNumberProps={{
                    maxLength: 10,
                    onChangeText: handleChange("number"),
                    onBlur: handleBlur("number"),
                    value: values.number as any,
                    placeholder: "Enter your phone number",
                    keyboardType: "phone-pad",
                    style: {
                      paddingVertical: 10,

                      fontSize: 12,
                      lineHeight: 22,

                      textAlignVertical: "center", // for Android only
                      color: "#000",
                    },
                  }}
                  error={errors.number}
                  isError={!!errors.number && touched.number}
                  label="Phone number"
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

export default PhoneNumber;
