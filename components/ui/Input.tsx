import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons"; // or 'react-native-vector-icons/Ionicons'

type InputProps = {
  label: string;
  type?: "text" | "password";
  error?: string;
  isError?: boolean;
} & React.ComponentProps<typeof TextInput>;

export default function Input({
  label = "email",
  type = "text",
  error = "",
  isError = false,
  ...props
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const input = useMemo(() => {
    switch (type) {
      case "text":
        return (
          <TextInput
            className={`border ${isError ? "border-red-500" : "border-gray-300"}  rounded-lg px-4 py-2 text-base`}
            {...props}
          />
        );

      case "password":
        return (
          <View
            className={`flex-row items-center border ${isError ? "border-red-500" : "border-gray-300 "} rounded-lg px-3`}
          >
            <TextInput
              secureTextEntry={!passwordVisible}
              className="flex-1 py-2 text-base"
              {...props}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye-closed" : "eye"}
                size={16}
                color="#6B7280" // Tailwind's gray-500
              />
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <TextInput
            className="border border-gray-300 rounded-lg  text-base"
            {...props}
          />
        );
    }
  }, [passwordVisible, props, type]);

  return (
    <View className=" flex-1">
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      {input}
      {isError && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
