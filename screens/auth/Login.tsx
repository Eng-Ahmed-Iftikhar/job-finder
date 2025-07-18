import GoogleLogin from "@/components/GoogleLogin";
import Divider from "@/components/ui/Divider";
import LoginForm from "@/sections/auth/login/LoginForm";
import LoginHeader from "@/sections/auth/login/LoginHeader";
import React from "react";
import { ScrollView, View } from "react-native";

function LoginScreen() {
  return (
    <ScrollView className="flex-1  bg-white px-4">
      <View className="flex-1 mt-12">
        <LoginHeader />
        <View className="mt-8 ">
          <GoogleLogin />
        </View>
        <Divider text="or" />

        <LoginForm />
      </View>
    </ScrollView>
  );
}

export default LoginScreen;
