import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { OnboardingSteps } from "@/context/OnboardingContext";
import useOnboarding from "@/hooks/useOnboarding";
import { City, Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
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

function Location() {
  const router = useRouter();
  const {
    userProfile,
    handleUserProfile,
    handleChangeStepHeader,
    handleChangeCurrentStep,
  } = useOnboarding();
  const { generalInfo: { firstName = "", lastName = "" } = {} } =
    userProfile || {};

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      handleUserProfile({ location: values });
      handleChangeCurrentStep(OnboardingSteps.PHONE_NUMBER);
      router.push("/(onboarding)/phone-number");
    },
    [handleUserProfile, handleChangeCurrentStep, router]
  );

  useEffect(() => {
    handleChangeStepHeader({
      title: "Enter your location",
      description:
        "We will display the most relevant jobs based on your location.",
    });
    if (!firstName || !lastName) {
      router.replace("/(onboarding)/general-info");
    }
  }, [handleChangeStepHeader, router, firstName, lastName]);

  return (
    <Formik
      initialValues={{
        country: userProfile?.location?.country || "",
        city: userProfile?.location?.city || "",
        state: userProfile?.location?.state || "",
        address: userProfile?.location?.address || "",
      }}
      onSubmit={handleSubmit}
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
        <ScrollView className=" flex-1 p-4  bg-white">
          <View className="flex-1 ">
            <View className="  mt-4  gap-6 ">
              <Select
                placeholder={{ label: "Select country" }}
                label="Country"
                items={Country.getAllCountries().map((country) => ({
                  label: country.name,
                  value: country.isoCode,
                }))}
                onValueChange={(value: string) => {
                  setFieldValue("country", value);
                }}
                error={errors.country}
                isError={!!errors.country && touched.country}
              />
              <Select
                label="State"
                placeholder={{ label: "Select state" }}
                items={State.getStatesOfCountry(values.country).map(
                  (state) => ({
                    label: state.name,
                    value: state.isoCode,
                  })
                )}
                onValueChange={(value: string) => {
                  setFieldValue("state", value);
                }}
                error={errors.state}
                isError={!!errors.state && touched.state}
              />

              <Select
                label="City"
                placeholder={{ label: "Select city" }}
                items={City.getCitiesOfState(values.country, values.state).map(
                  (city) => ({
                    label: city.name,
                    value: city.name,
                  })
                )}
                onValueChange={(value: string) => {
                  setFieldValue("city", value);
                }}
                error={errors.city}
                isError={!!errors.city && touched.city}
              />
              <Input
                multiline
                numberOfLines={4}
                label="Address"
                type="text"
                style={{
                  textAlignVertical: "top",
                }}
                className="h-16 border border-gray-300 rounded-md  "
                placeholder="Enter your address"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                error={errors.address}
                isError={!!errors.address && touched.address}
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
      )}
    </Formik>
  );
}

export default Location;
