import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import VerificationCodeInput from "@/components/ui/VerificationCodeInput";

interface PhoneVerificationStepProps {
  countryCode: string;
  phoneNumber: number;
  verificationCode: string[];
  onVerificationCodeChange: (code: string[]) => void;
  onResendCode: () => void;
}

function PhoneVerificationStep({
  countryCode,
  phoneNumber,
  verificationCode,
  onVerificationCodeChange,
  onResendCode,
}: PhoneVerificationStepProps) {
  return (
    <View className="mt-4 gap-6">
      <View className="items-center">
        <Text className="text-gray-600 text-center mb-4">
          We've sent a verification code to{" "}
          <Text className="font-semibold">
            {countryCode} {phoneNumber}
          </Text>
        </Text>

        <VerificationCodeInput
          length={5}
          value={verificationCode}
          onChange={onVerificationCodeChange}
          error=""
          isError={false}
        />

        <TouchableOpacity onPress={onResendCode} className="mt-4">
          <Text className="text-blue-500 text-sm">
            Didn't receive code? Resend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PhoneVerificationStep;
