import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import useOnboarding from "@/hooks/useOnboarding";
import { useUpdateLocationMutation } from "@/api/services/userApi";
import { OnboardingSteps } from "@/types/onboarding";
import { City, Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useMemo } from "react";
import { View, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(4, "Address must be at least 4 characters"),
});

type FormValues = yup.InferType<typeof formSchema>;

function LocationForm() {
  const router = useRouter();
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();
  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useUpdateLocationMutation();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        // Update profile via API
        await updateLocation(values).unwrap();

        // Save to context and navigate
        handleUserProfile({ location: values });
        handleChangeCurrentStep(OnboardingSteps.PHONE_NUMBER);
        router.push("/(onboarding)/phone-number");
      } catch (error) {
        console.error("Failed to update location:", error);
        // Handle error - you might want to show a toast
      }
    },
    [handleUserProfile, handleChangeCurrentStep, router, updateLocation]
  );

  // Memoize country options
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name, // Use full name instead of isoCode
    }));
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
    >
      <Formik
        initialValues={{
          country: userProfile?.location?.country || "",
          city: userProfile?.location?.city || "",
          state: userProfile?.location?.state || "",
          address: userProfile?.location?.address || "",
        }}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={formSchema}
      >
        {({
          handleSubmit,
          setFieldValue,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View className="flex-1">
            <View className="mt-4 gap-6">
              <Select
                placeholder={{ label: "Select country" }}
                items={countryOptions}
                value={values.country}
                onValueChange={(value) => {
                  setFieldValue("country", value);
                  // Reset state and city when country changes
                  setFieldValue("state", "");
                  setFieldValue("city", "");
                }}
                error={errors.country as string}
                isError={!!errors.country && (touched.country as boolean)}
                label="Country"
              />

              <Select
                placeholder={{ label: "Select state" }}
                items={(() => {
                  if (!values.country) return [];
                  // Find country by name to get isoCode for state lookup
                  const selectedCountry = Country.getAllCountries().find(
                    (c) => c.name === values.country
                  );
                  if (!selectedCountry) return [];

                  return State.getStatesOfCountry(selectedCountry.isoCode).map(
                    (state) => ({
                      label: state.name,
                      value: state.name, // Use full name instead of isoCode
                    })
                  );
                })()}
                value={values.state}
                onValueChange={(value) => {
                  setFieldValue("state", value);
                  // Reset city when state changes
                  setFieldValue("city", "");
                }}
                error={errors.state as string}
                isError={!!errors.state && (touched.state as boolean)}
                label="State"
                disabled={!values.country}
              />

              <Select
                placeholder={{ label: "Select city" }}
                items={(() => {
                  if (!values.country || !values.state) return [];
                  // Find country by name to get isoCode for city lookup
                  const selectedCountry = Country.getAllCountries().find(
                    (c) => c.name === values.country
                  );
                  if (!selectedCountry) return [];

                  // Find state by name to get isoCode for city lookup
                  const selectedState = State.getStatesOfCountry(
                    selectedCountry.isoCode
                  ).find((s) => s.name === values.state);
                  if (!selectedState) return [];

                  return City.getCitiesOfState(
                    selectedCountry.isoCode,
                    selectedState.isoCode
                  ).map((city) => ({
                    label: city.name,
                    value: city.name,
                  }));
                })()}
                value={values.city}
                onValueChange={(value) => setFieldValue("city", value)}
                error={errors.city as string}
                isError={!!errors.city && (touched.city as boolean)}
                label="City"
                disabled={!values.country || !values.state}
              />

              <Input
                label="Address"
                placeholder="Enter your full address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                error={errors.address as string}
                isError={!!errors.address && (touched.address as boolean)}
                multiline
                numberOfLines={3}
              />
            </View>

            <Button
              disabled={isSubmitting || isUpdatingLocation}
              loading={isSubmitting || isUpdatingLocation}
              onPress={(e) => handleSubmit(e as any)}
              className="mt-8"
            >
              Next
            </Button>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

export default LocationForm;
