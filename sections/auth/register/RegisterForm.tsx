import { useSignUpMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import * as yup from "yup";

const registerSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(6, "Confirm password must be at least 6 characters")
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

function RegisterForm() {
  const [registerUser] = useSignUpMutation();

  const handleSubmit = useCallback(
    async (values: { email: string; password: string }) => {
      const { email, password } = values;
      await registerUser({ email, password }).unwrap();
    },
    []
  );

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={handleSubmit}
      validationSchema={registerSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View>
          <View className=" flex gap-6 ">
            <Input
              label="Email"
              type="text"
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
              isError={!!errors.email && touched.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={errors.password}
              isError={!!errors.password && touched.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              error={errors.confirmPassword}
              isError={!!errors.confirmPassword && touched.confirmPassword}
            />
          </View>

          <View className=" mt-6">
            <Text className="text-sm text-gray-500">
              By signing up, you confirm that you agree to{" "}
              <Link
                href="/terms-and-conditions"
                className="text-azure-radiance-500 text-sm"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-azure-radiance-500 text-sm"
              >
                Privacy Policy
              </Link>
            </Text>
          </View>

          <Button onPress={(e) => handleSubmit(e as any)} className="mt-6">
            Sign up
          </Button>
        </View>
      )}
    </Formik>
  );
}

export default RegisterForm;
