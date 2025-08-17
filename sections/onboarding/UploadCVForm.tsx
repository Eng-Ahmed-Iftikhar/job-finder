import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Formik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import * as yup from "yup";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import { useUpdateResumeMutation } from "@/api/services/userApi";
import { useUploadFileMutation } from "@/api/services/fileApi";

const formSchema = yup.object({
  resumeUrl: yup.string().required("Resume is required"),
});

type FormValues = yup.InferType<typeof formSchema>;

type UploadState = "initial" | "uploading" | "ready";

function UploadCVForm() {
  const router = useRouter();
  const { handleUserProfile, userProfile } = useOnboarding();
  const [uploadState, setUploadState] = useState<UploadState>("initial");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    uri: string;
  } | null>(null);
  const [updateResume, { isLoading: isUpdatingResume }] =
    useUpdateResumeMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();

  const handleFilePick = useCallback(
    async (setFieldValue: (field: string, value: any) => void) => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets[0]) {
          const file = result.assets[0];

          // Check file size (5MB limit)
          if (file.size && file.size > 5 * 1024 * 1024) {
            Alert.alert(
              "File too large",
              "Please select a file smaller than 5MB"
            );
            return;
          }

          setSelectedFile({
            name: file.name,
            size: file.size || 0,
            uri: file.uri,
          });

          // Set the Formik value to the file URI
          setFieldValue("resumeUrl", file.uri);

          // Simulate upload process
          setUploadState("uploading");
          setUploadProgress(0);

          // Simulate upload progress
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                setUploadState("ready");
                return 100;
              }
              return prev + 10;
            });
          }, 200);

          // Cleanup interval after 2 seconds
          setTimeout(() => {
            clearInterval(interval);
          }, 2000);
        }
      } catch (error) {
        console.error("Error picking document:", error);
        Alert.alert("Error", "Failed to pick document");
      }
    },
    []
  );

  const handleRemoveFile = useCallback(
    (setFieldValue: (field: string, value: any) => void) => {
      setSelectedFile(null);
      setUploadState("initial");
      setUploadProgress(0);
      setFieldValue("resumeUrl", "");
    },
    []
  );

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!values.resumeUrl) {
        Alert.alert("No file selected", "Please select a resume file first");
        return;
      }

      if (!selectedFile) {
        Alert.alert("No file selected", "Please select a resume file first");
        return;
      }

      try {
        // Determine MIME type based on file extension
        const getMimeType = (fileName: string) => {
          const extension = fileName.split(".").pop()?.toLowerCase();
          switch (extension) {
            case "pdf":
              return "application/pdf";
            case "doc":
              return "application/msword";
            case "docx":
              return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
              return "application/pdf";
          }
        };

        // First upload the file to get the URL
        const fileUploadResponse = await uploadFile({
          file: {
            uri: selectedFile.uri,
            type: getMimeType(selectedFile.name),
            name: selectedFile.name,
          },
          fileType: "document",
          folderPath: "resumes", // Organize resumes in a folder
          customFilename: `resume-${Date.now()}-${selectedFile.name}`, // Generate unique filename
        }).unwrap();

        // Then update the resume with the uploaded file URL
        await updateResume({
          resumeUrl: fileUploadResponse.url,
          fileName: selectedFile.name,
        }).unwrap();

        // Save to context
        handleUserProfile({
          resumeUrl: fileUploadResponse.url,
        });

        // Navigate to dashboard
        router.replace("/(dashboard)");
      } catch (error) {
        console.error("Failed to upload resume:", error);
        Alert.alert("Error", "Failed to upload resume. Please try again.");
      }
    },
    [selectedFile, uploadFile, updateResume, handleUserProfile, router]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderInitialState = (
    setFieldValue: (field: string, value: any) => void
  ) => (
    <View className="items-center">
      <TouchableOpacity
        onPress={() => handleFilePick(setFieldValue)}
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center bg-gray-50"
      >
        <View className="items-center">
          <View className="w-12 h-12 bg-gray-200 rounded-lg justify-center items-center mb-2">
            <Text className="text-2xl">📄</Text>
          </View>
          <Text className="text-black font-medium text-center">
            Click to upload your CV
          </Text>
          <Text className="text-gray-500 text-sm mt-1">Max size 5 MB</Text>
        </View>
      </TouchableOpacity>

      <View className="mt-6">
        <Text className="text-gray-500 text-center mb-3">or</Text>
        <TouchableOpacity className="bg-green-100 px-6 py-3 rounded-lg">
          <Text className="text-green-700 font-medium text-center">
            Fill a generic application instead
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUploadingState = (
    setFieldValue: (field: string, value: any) => void
  ) => (
    <View className="w-full bg-gray-100 rounded-lg p-4">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-green-100 rounded-lg justify-center items-center mr-3">
          <Text className="text-lg">📄</Text>
        </View>
        <View className="flex-1">
          <Text className="text-black font-medium">{selectedFile?.name}</Text>
          <Text className="text-gray-600 text-sm">
            Uploading... {uploadProgress}%
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveFile(setFieldValue)}
          className="p-2"
        >
          <Text className="text-gray-400 text-xl">🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View className="mt-3 bg-gray-200 rounded-full h-2">
        <View
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${uploadProgress}%` }}
        />
      </View>
    </View>
  );

  const renderReadyState = (
    setFieldValue: (field: string, value: any) => void
  ) => (
    <View className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-green-100 rounded-lg justify-center items-center mr-3">
          <Text className="text-lg">✅</Text>
        </View>
        <View className="flex-1">
          <Text className="text-black font-medium">{selectedFile?.name}</Text>
          <Text className="text-green-600 text-sm">
            Upload Complete • {formatFileSize(selectedFile?.size || 0)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveFile(setFieldValue)}
          className="p-2"
        >
          <Text className="text-gray-400 text-xl">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Formik
      initialValues={{
        resumeUrl: userProfile?.resumeUrl || "",
      }}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={formSchema}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
        <View className="flex-1 pt-4 ">
          <View className="mb-8 ">
            {uploadState === "initial" && renderInitialState(setFieldValue)}
            {uploadState === "uploading" && renderUploadingState(setFieldValue)}
            {uploadState === "ready" && renderReadyState(setFieldValue)}
          </View>

          {values.resumeUrl && (
            <Button
              disabled={
                uploadState !== "ready" ||
                isSubmitting ||
                isUpdatingResume ||
                isUploadingFile
              }
              loading={isSubmitting || isUpdatingResume || isUploadingFile}
              onPress={() => handleSubmit()}
              className="w-full"
            >
              Save & Finish
            </Button>
          )}
        </View>
      )}
    </Formik>
  );
}

export default UploadCVForm;
