import GoogleLogin from "@/components/GoogleLogin";
import Divider from "@/components/ui/Divider";
import RegisterForm from "@/sections/auth/register/RegisterForm";
import RegisterHeader from "@/sections/auth/register/RegisterHeader";
import React from "react";
import { ScrollView, View } from "react-native";

function RegisterScreen() {
  return (
    <ScrollView className="flex-1  bg-white px-4">
      <View className="flex-1 mt-12">
        <RegisterHeader />
        <View className="mt-8 ">
          <GoogleLogin />
        </View>
        <Divider text="or" />

        <RegisterForm />
      </View>
    </ScrollView>
  );
}

export default RegisterScreen;
