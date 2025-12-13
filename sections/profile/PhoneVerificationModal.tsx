import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Modal from "@/components/ui/Modal";

interface PhoneVerificationModalProps {
  isVisible: boolean;
  phone: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onPhoneUpdated: (phone: string) => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isVisible,
  phone,
  onClose,
  onVerify,
  onPhoneUpdated,
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [newPhone, setNewPhone] = useState("");

  const handleSendCode = async () => {
    if (!newPhone) {
      setError("Please enter a phone number");
      return;
    }
    setStep("verify");
    setError("");
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await onVerify(code);
      onPhoneUpdated(newPhone);
      handleClose();
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setNewPhone("");
    setError("");
    setStep("input");
    onClose();
  };

  return (
    <Modal visible={isVisible} onClose={handleClose}>
      <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Verify Phone
        </Text>
        <Text className="text-sm text-gray-600 mb-6">
          We'll send a verification code to your phone number
        </Text>

        {step === "input" ? (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Current Phone
              </Text>
              <View className="bg-gray-100 p-3 rounded-lg">
                <Text className="text-gray-800">{phone}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                New Phone Number
              </Text>
              <TextInput
                placeholder="Enter new phone number"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            {error && (
              <Text className="text-red-500 text-sm mb-4">{error}</Text>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleClose}
                className="flex-1 border border-gray-300 rounded-lg py-3"
              >
                <Text className="text-gray-800 font-semibold text-center">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSendCode}
                className="flex-1 bg-azure-radiance-500 rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center">
                  Send Code
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                Verification Code
              </Text>
              <Text className="text-sm text-gray-600 mb-3">
                Enter the 6-digit code sent to {newPhone}
              </Text>
              <TextInput
                placeholder="000000"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#999"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-center text-lg tracking-widest"
              />
            </View>

            {error && (
              <Text className="text-red-500 text-sm mb-4">{error}</Text>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep("input")}
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-lg py-3"
              >
                <Text className="text-gray-800 font-semibold text-center">
                  Back
                </Text>
              </Pressable>
              <Pressable
                onPress={handleVerifyCode}
                disabled={isLoading}
                className="flex-1 bg-azure-radiance-500 rounded-lg py-3 flex-row items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Verify</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};
