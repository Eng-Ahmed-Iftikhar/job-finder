import CircularCountdown from "@/components/CircularCountdown";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

function VerifyEmailForm() {
  const [value, setValue] = React.useState<string>("");
  const [isSendAgain, setIsSendAgain] = React.useState<boolean>(false);

  return (
    <View className="mt-8  w-[80%]  mx-auto">
      <OtpInput
        numberOfDigits={4}
        type="numeric"
        focusColor={"#3b82f6"} // Blue-500
        theme={{
          pinCodeContainerStyle: {
            borderWidth: 0,
            borderBottomWidth: 1,
            borderColor: "#1eadff", // Gray-300
            backgroundColor: "transparent",
            borderRadius: 0,
          },
        }}
        onTextChange={setValue}
      />
      <TouchableOpacity
        disabled={isSendAgain}
        className="mt-6 gap-3  items-center justify-center"
        onPress={() => {
          setIsSendAgain(true);
        }}
      >
        <Text
          className={`${isSendAgain ? "text-gray-400" : "text-azure-radiance-500"}  text-sm font-medium  `}
        >
          {isSendAgain ? "Code is sent" : "Send code again"}
        </Text>
        {isSendAgain && (
          <CircularCountdown
            seconds={20}
            size={25}
            onComplete={() => setIsSendAgain(false)}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default VerifyEmailForm;
