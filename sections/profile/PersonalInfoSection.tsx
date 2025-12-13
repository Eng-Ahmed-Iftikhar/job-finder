import React from "react";
import { View, Text, Pressable } from "react-native";
import { useFormikContext } from "formik";
import Input from "@/components/ui/Input";

interface PersonalInfoSectionProps {
  onChangeEmail: () => void;
  onChangePhone: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  zip: string;
  email: string;
  phoneNumber: string;
  bio: string;
  [key: string]: any;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  onChangeEmail,
  onChangePhone,
}) => {
  const formik = useFormikContext<FormValues>();
  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Personal Information
      </Text>

      <View className="mb-4">
        <Input
          label="First Name"
          placeholder="Enter first name"
          value={formik.values.firstName}
          onChangeText={formik.handleChange("firstName")}
          onBlur={formik.handleBlur("firstName")}
          error={
            formik.touched.firstName && formik.errors.firstName
              ? (formik.errors.firstName as string)
              : undefined
          }
        />
      </View>

      <View className="mb-4">
        <Input
          label="Last Name"
          placeholder="Enter last name"
          value={formik.values.lastName}
          onChangeText={formik.handleChange("lastName")}
          onBlur={formik.handleBlur("lastName")}
          error={
            formik.touched.lastName && formik.errors.lastName
              ? (formik.errors.lastName as string)
              : undefined
          }
        />
      </View>

      <View className="mb-4">
        <Input
          label="ZIP/Location"
          placeholder="Enter ZIP or location"
          value={formik.values.zip}
          onChangeText={formik.handleChange("zip")}
          onBlur={formik.handleBlur("zip")}
          error={
            formik.touched.zip && formik.errors.zip
              ? (formik.errors.zip as string)
              : undefined
          }
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-gray-700 font-medium">Email</Text>
          <Pressable onPress={onChangeEmail}>
            <Text className="text-azure-radiance font-semibold">Change</Text>
          </Pressable>
        </View>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-800">{formik.values.email}</Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-gray-700 font-medium">Phone Number</Text>
          <Pressable onPress={onChangePhone}>
            <Text className="text-azure-radiance font-semibold">Change</Text>
          </Pressable>
        </View>
        <View className="bg-gray-100 p-3 rounded-lg">
          <Text className="text-gray-800">{formik.values.phoneNumber}</Text>
        </View>
      </View>
    </View>
  );
};
