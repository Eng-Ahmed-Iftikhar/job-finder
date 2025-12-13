import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Formik, FormikHelpers } from "formik";
import { editProfileValidationSchema } from "./validationSchema";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { CVSection } from "./CVSection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { BioSection } from "./BioSection";
import { EmailVerificationModal } from "./EmailVerificationModal";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import {
  useGetCvDetailsQuery,
  useUpdateCvDetailsMutation,
  useUpdateGeneralInfoMutation,
  useUpdateProfilePictureMutation,
} from "@/api/services/userApi";
import { useAppSelector } from "@/hooks/useAppSelector";

interface EditProfileFormValues {
  firstName: string;
  lastName: string;
  zip: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
  cvFile: { uri: string; name: string; size?: number } | null;
  experiences: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  bio: string;
}

const FloatingActions: React.FC<{
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}> = ({ visible, onSubmit, onCancel, disabled, isSubmitting }) => {
  const translateY = React.useRef(new Animated.Value(80)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onSubmit}
            disabled={disabled}
            className="bg-azure-radiance-500 h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Save changes
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            className="border-2 border-gray-200 bg-white h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default function EditProfileContent() {
  const user = useAppSelector((state) => state.user.user);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cvDetails, isLoading: isCvDetailsLoading } =
    useGetCvDetailsQuery();
  const [updateCvDetails] = useUpdateCvDetailsMutation();
  const [updateGeneralInfo] = useUpdateGeneralInfoMutation();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const rawInitialValues: EditProfileFormValues = {
    firstName: user?.profile?.generalInfo?.firstName || "",
    lastName: user?.profile?.generalInfo?.lastName || "",
    zip: "", // TODO: Get from location API
    email: user?.email || "",
    phoneNumber: (user?.profile?.phoneNumber as any)?.number?.toString() || "",
    profilePicture: user?.profile?.pictureUrl || null,
    cvFile: null,
    experiences:
      cvDetails?.experiences?.map((exp: any) => ({
        position: exp.position || "",
        company: exp.company || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.isCurrent || false,
      })) || [],
    educations:
      cvDetails?.educations?.map((edu: any) => ({
        degree: edu.degree || "",
        institution: edu.school || "",
        startDate: edu.yearStarted?.toString() || "",
        endDate: edu.yearGraduated?.toString() || "",
      })) || [],
    skills: cvDetails?.skillIds || [],
    bio: cvDetails?.bio || "",
  };

  // Cast with validation schema to align shapes/types with Formik's values
  const initialValues = editProfileValidationSchema.cast(rawInitialValues, {
    stripUnknown: false,
  }) as EditProfileFormValues;

  const handleSubmit = async (
    values: EditProfileFormValues,
    { setSubmitting }: FormikHelpers<EditProfileFormValues>
  ) => {
    try {
      setIsSubmitting(true);

      // Update general info
      await updateGeneralInfo({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }).unwrap();

      // Update profile picture if changed
      if (
        values.profilePicture &&
        values.profilePicture !== user?.profile?.pictureUrl
      ) {
        await updateProfilePicture({
          pictureUrl: values.profilePicture,
        }).unwrap();
      }

      // Update CV details
      await updateCvDetails({
        bio: values.bio,
        experiences: values.experiences.map((exp) => ({
          position: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.current,
        })),
        educations: values.educations.map((edu) => ({
          school: edu.institution,
          degree: edu.degree,
          yearStarted: parseInt(edu.startDate),
          yearGraduated: edu.endDate ? parseInt(edu.endDate) : undefined,
        })),
        skillIds: values.skills,
        resumeUrl: values.cvFile?.uri,
      }).unwrap();

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEmailVerify = async (code: string) => {
    // TODO: Call email verification API
    console.log("Email verification code:", code);
  };

  const handlePhoneVerify = async (code: string) => {
    // TODO: Call phone verification API
    console.log("Phone verification code:", code);
  };

  if (isCvDetailsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1eadff" />
      </View>
    );
  }

  return (
    <Formik<EditProfileFormValues>
      initialValues={initialValues}
      enableReinitialize
      validationSchema={editProfileValidationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const pickImage = async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            formik.setFieldValue("profilePicture", result.assets[0].uri);
          }
        };

        // Custom change detection using Formik's own initialValues
        const normalize = (v: any): any => {
          if (v === undefined) return null;
          if (Array.isArray(v)) return v.map(normalize);
          if (v && typeof v === "object") {
            const out: any = {};
            for (const key of Object.keys(v)) out[key] = normalize(v[key]);
            return out;
          }
          return v;
        };

        const deepEqual = (a: any, b: any): boolean => {
          if (a === b) return true;
          if (a instanceof Date && b instanceof Date)
            return a.getTime() === b.getTime();
          if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
              if (!deepEqual(a[i], b[i])) return false;
            }
            return true;
          }
          if (a && b && typeof a === "object" && typeof b === "object") {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;
            for (const key of aKeys) {
              if (!bKeys.includes(key)) return false;
              if (!deepEqual(a[key], b[key])) return false;
            }
            return true;
          }
          return false;
        };

        const hasChanges = !deepEqual(
          normalize(formik.values),
          normalize(formik.initialValues)
        );

        return (
          <View className="flex-1 bg-white">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hasChanges ? 120 : 20 }}
            >
              <View className="px-4 pt-4">
                {/* Profile Picture */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Profile picture
                  </Text>
                  <Pressable onPress={pickImage} className="relative">
                    <View className="w-16 h-16 rounded-full bg-azure-radiance-500 items-center relative justify-center">
                      {formik.values.profilePicture ? (
                        <Image
                          source={{ uri: formik.values.profilePicture }}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <Ionicons name="person" size={32} color="white" />
                      )}
                    </View>
                    <View className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                      <Ionicons name="pencil" size={12} color="#6B7280" />
                    </View>
                  </Pressable>
                </View>

                {/* Personal Information Section */}
                <PersonalInfoSection
                  onChangeEmail={() => setIsEmailModalVisible(true)}
                  onChangePhone={() => setIsPhoneModalVisible(true)}
                />

                {/* CV Section */}
                <CVSection />

                {/* Experience Section */}
                <ExperienceSection />

                {/* Education Section */}
                <EducationSection />

                {/* Skills Section */}
                <SkillsSection />

                {/* Bio Section */}
                <BioSection />
              </View>
            </ScrollView>

            {/* Floating Action Buttons - Animated */}
            <FloatingActions
              visible={hasChanges}
              onSubmit={() => formik.handleSubmit()}
              onCancel={() => formik.resetForm()}
              disabled={isSubmitting || !formik.isValid}
              isSubmitting={isSubmitting}
            />

            {/* Email Verification Modal */}
            <EmailVerificationModal
              isVisible={isEmailModalVisible}
              email={formik.values.email}
              onClose={() => setIsEmailModalVisible(false)}
            />

            {/* Phone Verification Modal */}
            <PhoneVerificationModal
              isVisible={isPhoneModalVisible}
              phone={formik.values.phoneNumber}
              onClose={() => setIsPhoneModalVisible(false)}
              onVerify={handlePhoneVerify}
              onPhoneUpdated={(newPhone) => {
                formik.setFieldValue("phoneNumber", newPhone);
                setIsPhoneModalVisible(false);
              }}
            />
          </View>
        );
      }}
    </Formik>
  );
}
