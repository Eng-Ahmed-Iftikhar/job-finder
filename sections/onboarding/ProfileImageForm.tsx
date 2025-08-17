import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import Icon from "react-native-vector-icons/AntDesign";
import { Formik } from "formik";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { useUploadFileMutation } from "@/api/services/fileApi";
import { useUpdateProfilePictureMutation } from "@/api/services/userApi";

const formSchema = yup.object({
  pictureUrl: yup.string().nullable(),
});

type FormValues = yup.InferType<typeof formSchema>;

function ProfileImageForm() {
  const router = useRouter();
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();
  const [updateProfilePicture, { isLoading: isUpdatingProfile }] =
    useUpdateProfilePictureMutation();
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);

  const handleImagePick = useCallback(
    async (setFieldValue: (field: string, value: any) => void) => {
      try {
        // Request permissions
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please grant camera roll permissions to select an image."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const image = result.assets[0];

          // Check file size (2MB limit)
          if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
            Alert.alert(
              "Image too large",
              "Please select an image smaller than 2MB"
            );
            return;
          }

          setSelectedImage({
            uri: image.uri,
            name: image.fileName || "profile-image.jpg",
            size: image.fileSize || 0,
          });

          // Set the Formik value to the image URI
          setFieldValue("pictureUrl", image.uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image");
      }
    },
    []
  );

  const handleSubmit = async (values: FormValues) => {
    if (!values.pictureUrl) {
      Alert.alert("No image selected", "Please select a profile image first");
      return;
    }

    if (!selectedImage) {
      Alert.alert("No image selected", "Please select a profile image first");
      return;
    }

    try {
      // Determine MIME type based on file extension
      const getMimeType = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        switch (extension) {
          case "jpg":
          case "jpeg":
            return "image/jpeg";
          case "png":
            return "image/png";
          case "gif":
            return "image/gif";
          default:
            return "image/jpeg";
        }
      };

      // First upload the image to get the URL
      const fileUploadResponse = await uploadFile({
        file: {
          uri: selectedImage.uri,
          type: getMimeType(selectedImage.name),
          name: selectedImage.name,
        },
        fileType: "image",
        folderPath: "profile-images", // Organize profile images in a folder
        customFilename: `profile-${Date.now()}`, // Generate unique filename
      }).unwrap();

      // Then update the profile with the uploaded image URL
      await updateProfilePicture({
        pictureUrl: fileUploadResponse.url,
      }).unwrap();

      // Save to context with the uploaded image URL
      handleUserProfile({ pictureUrl: fileUploadResponse.url });
      handleChangeCurrentStep(OnboardingSteps.RESUME_URL);
      router.push("/(onboarding)/upload-cv");
    } catch (error) {
      console.error("Failed to upload image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const handleSkip = () => {
    // Skip this step and move to next
    handleChangeCurrentStep(OnboardingSteps.RESUME_URL);
    router.push("/(onboarding)/upload-cv");
  };

  return (
    <Formik
      initialValues={{
        pictureUrl: userProfile?.pictureUrl || null,
      }}
      onSubmit={handleSubmit}
      validationSchema={formSchema}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
        <ScrollView className="flex-1 bg-white px-4">
          <View className="flex-1 mt-12">
            <View className="items-center justify-center flex-1">
              <Text className="text-2xl font-bold text-center text-gray-900 mb-8">
                Upload a profile picture
              </Text>

              {/* Image Upload Area */}
              <TouchableOpacity
                onPress={() => handleImagePick(setFieldValue)}
                className="w-32 h-32 rounded-full bg-green-500 items-center justify-center mb-4"
              >
                {values.pictureUrl ? (
                  <Image
                    source={{ uri: values.pictureUrl }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Icon name="user" size={48} color="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleImagePick(setFieldValue)}>
                <Text className="text-green-500 text-lg font-semibold mb-6">
                  Upload image
                </Text>
              </TouchableOpacity>

              {/* Image Requirements */}
              <View className="mb-8">
                <Text className="text-gray-600 text-center text-sm mb-1">
                  Recommended resolution is 300×300 px.
                </Text>
                <Text className="text-gray-600 text-center text-sm mb-1">
                  Max size - 2 MB.
                </Text>
                <Text className="text-gray-600 text-center text-sm">
                  Allowed formats: *.jpg, *.jpeg, *.png, *.gif
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="w-full space-y-4">
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={
                    !values.pictureUrl ||
                    isSubmitting ||
                    isUploadingFile ||
                    isUpdatingProfile
                  }
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center ${
                    values.pictureUrl ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold text-lg ${
                      values.pictureUrl ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {isUploadingFile || isUpdatingProfile
                      ? "Processing..."
                      : "Next"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSkip}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-center"
                >
                  <Text className="text-gray-500 text-center font-semibold text-lg">
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}

export default ProfileImageForm;
