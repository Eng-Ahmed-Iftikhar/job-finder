import React from "react";
import { View, Text, TextInput } from "react-native";
import { useFormikContext } from "formik";

interface FormValues {
  bio: string;
  [key: string]: any;
}

export const BioSection: React.FC = () => {
  const formik = useFormikContext<FormValues>();
  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Bio</Text>

      <TextInput
        multiline
        numberOfLines={4}
        value={formik.values.bio}
        onChangeText={formik.handleChange("bio")}
        onBlur={formik.handleBlur("bio")}
        placeholder="Tell us about yourself..."
        placeholderTextColor="#999"
        className="border border-gray-300 rounded-lg p-3 text-gray-800"
        style={{ textAlignVertical: "top" }}
      />

      <Text className="text-gray-500 text-xs mt-2">
        {formik.values.bio.length}/500 characters
      </Text>

      {formik.touched.bio && formik.errors.bio && (
        <Text className="text-red-500 text-sm mt-1">
          {formik.errors.bio as string}
        </Text>
      )}
    </View>
  );
};
