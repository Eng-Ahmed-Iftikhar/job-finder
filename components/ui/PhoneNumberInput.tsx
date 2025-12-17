import React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import Select, { SelectItem } from "./Select";

type PhoneNumberInputProps = {
  label?: string;
  error?: string;
  isError?: boolean;
  countryCodeValue?: string;
  countryCodeItems?: SelectItem[];
  countryCodePlaceholder?: string;
  onCountryCodeChange?: (value: any) => void;
  inputNumberProps?: React.ComponentProps<typeof TextInput>;
  disabled?: boolean;
};

function PhoneNumberInput({
  label = "label",
  isError,
  error,
  countryCodeValue,
  countryCodeItems = [],
  countryCodePlaceholder = "Code",
  onCountryCodeChange,
  inputNumberProps,
  disabled = false,
}: PhoneNumberInputProps) {
  return (
    <View>
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <View className="flex-row items-center gap-2">
        <View className="w-[30%]">
          <Select
            placeholder={countryCodePlaceholder}
            items={countryCodeItems}
            value={countryCodeValue}
            onValueChange={onCountryCodeChange}
            disabled={disabled}
          />
        </View>
        <View className="border flex justify-center h-12 w-[68%] border-gray-300 rounded-lg px-3">
          <TextInput
            className="text-sm text-gray-900"
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            {...inputNumberProps}
          />
        </View>
      </View>
      {isError && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

export default PhoneNumberInput;
