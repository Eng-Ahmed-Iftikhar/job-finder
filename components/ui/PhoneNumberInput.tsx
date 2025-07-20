import React from "react";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
import { Text, View } from "react-native";
import { TextInput } from "react-native";

type SelectProps = {
  label?: string;
  error?: string;
  isError?: boolean;
  selectCodeProps: PickerSelectProps;
  inputNumberProps?: React.ComponentProps<typeof TextInput>;
};

function PhoneNumberInput({
  label = "label",
  isError,
  error,
  selectCodeProps,
  inputNumberProps,
}: SelectProps) {
  return (
    <View>
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <View className=" flex-row items-center  gap-2  rounded-lg  text-base">
        <View className="w-[40%] border  border-gray-300 rounded-lg  text-base">
          <RNPickerSelect
            style={{
              viewContainer: {
                height: 36,
              },

              placeholder: {
                marginTop: -10,
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
            {...selectCodeProps}
          />
        </View>
        <View className="border flex justify-center h-[38px]  w-[60%] border-gray-300 rounded-lg  ">
          <TextInput {...inputNumberProps} />
        </View>
      </View>
      {isError && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

export default PhoneNumberInput;
