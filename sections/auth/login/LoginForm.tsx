import React from "react";
import { Formik } from "formik";
import { View } from "react-native";
import Input from "@/components/ui/Input";
import { Link } from "expo-router";
import Checkbox from "expo-checkbox";
import { Text } from "react-native";
import Button from "@/components/ui/Button";

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      onSubmit={(values) => console.log(values)}
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
          <Button onPress={() => handleSubmit()} className="mt-6">
            Login
          </Button>
        </View>
      )}
    </Formik>
  );
}

export default LoginForm;
