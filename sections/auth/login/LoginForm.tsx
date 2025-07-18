import { useSignInMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Checkbox from "expo-checkbox";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean(),
});

function LoginForm() {
  const [loginUser] = useSignInMutation();

  const handleLogin = useCallback(
    async (values: { email: string; password: string }) => {
      await loginUser(values);
    },
    []
  );

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      onSubmit={handleLogin}
      validationSchema={loginSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
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
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
          </View>

          <View className="mt-2">
            <Link
              href="/(auth)/verify-email"
              className="text-azure-radiance-500 text-sm"
            >
              Forgot Password?
            </Link>
          </View>
          <View className="flex-row items-center mt-4">
            <Checkbox
              color={"#1eadff"}
              value={values.rememberMe}
              onValueChange={(value) => {
                setFieldValue("rememberMe", value);
              }}
            />
            <Text className="text-sm  ml-2">Keep me logged in</Text>
          </View>
          <Button onPress={(e) => handleSubmit(e as any)} className="mt-6">
            Login
          </Button>
        </View>
      )}
    </Formik>
  );
}

export default LoginForm;
