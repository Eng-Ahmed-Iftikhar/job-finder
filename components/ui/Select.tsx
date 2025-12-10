import React from "react";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
import { Text, View } from "react-native";

type SelectProps = {
  label?: string;
  error?: string;
  isError?: boolean;
} & PickerSelectProps;

function Select({ label = "label", isError, error, ...props }: SelectProps) {
  return (
    <View className="flex-1">
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <View className="border h-12 border-gray-300 rounded-lg  text-base">
        <RNPickerSelect
          style={{
            viewContainer: {
              height: 36,
            },

            placeholder: {
              marginTop: -8,
              fontSize: 12,
              fontWeight: "400",
              color: "#6B7280",
            },
            inputIOS: {
              fontSize: 12,
            },

            inputAndroid: {
              fontSize: 12,
              marginTop: -10,
            },
          }}
          {...props}
        />
      </View>
      {isError && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

export default Select;
