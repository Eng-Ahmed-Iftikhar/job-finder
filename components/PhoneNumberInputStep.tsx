import React from "react";
import { View } from "react-native";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";

interface PhoneNumberInputStepProps {
  countryCode: string;
  phoneNumber: string;
  countryOptions: Array<{ label: string; value: string }>;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onPhoneNumberBlur: (e?: any) => void;
  error?: string;
  isError?: boolean;
}

function PhoneNumberInputStep({
  countryCode,
  phoneNumber,
  countryOptions,
  onCountryCodeChange,
  onPhoneNumberChange,
  onPhoneNumberBlur,
  error,
  isError,
}: PhoneNumberInputStepProps) {
  return (
    <View className="mt-4 gap-6">
      <PhoneNumberInput
        selectCodeProps={{
          onValueChange: onCountryCodeChange,
          value: countryCode,
          items: countryOptions,
        }}
        inputNumberProps={{
          onChangeText: onPhoneNumberChange,
          onBlur: onPhoneNumberBlur,
          value: phoneNumber as any,
          placeholder: "Enter your phone number",
          keyboardType: "phone-pad",
          style: {
            paddingVertical: 10,
            fontSize: 13,
            lineHeight: 22,
            textAlignVertical: "center", // for Android only
            color: "#000",
          },
        }}
        error={error}
        isError={isError}
        label="Phone number"
      />
    </View>
  );
}

export default PhoneNumberInputStep;
