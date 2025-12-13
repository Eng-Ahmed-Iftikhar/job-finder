/\*\*

- EXAMPLE USAGE: EditProfileContent
-
- This demonstrates how to use the refactored EditProfileContent
- in your app layout and routing.
  \*/

// 1. In your app/(dashboard)/profile.tsx or settings page:
import EditProfileContent from "@/sections/profile/EditProfileContent";
import { View, ScrollView } from "react-native";

export default function EditProfilePage() {
return (
<View className="flex-1 bg-white">
<EditProfileContent />
</View>
);
}

// 2. Full page example with header:
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen() {
const router = useRouter();

return (
<SafeAreaView className="flex-1 bg-white">
{/_ Header _/}
<View className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-200">
<Pressable onPress={() => router.back()}>
<Ionicons name="chevron-back" size={24} color="#000" />
</Pressable>
<Text className="text-lg font-semibold text-gray-900">
Edit Profile
</Text>
</View>

      {/* Form Content */}
      <EditProfileContent />
    </SafeAreaView>

);
}

// 3. Integration in routing (app.json or expo-router):
/\*
{
"app": {
"screens": {
"dashboard": {
"screens": {
"edit-profile": "edit-profile",
...
}
}
}
}
}

// Then in your navigation file:
<Stack.Screen
name="edit-profile"
options={{
    title: "Edit Profile",
    headerShown: false,
  }}
/>
\*/

// 4. Navigation from dashboard header:
import { useRouter } from "expo-router";

export function DashboardHeader() {
const router = useRouter();

return (
<Pressable
onPress={() => router.push("/(dashboard)/edit-profile")}
className="p-2" >
<Ionicons name="create-outline" size={24} color="#1eadff" />
</Pressable>
);
}

// 5. Complete edit profile route example:
/\*
// app/(dashboard)/edit-profile.tsx

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditProfileContent from "@/sections/profile/EditProfileContent";

export default function EditProfileScreen() {
const router = useRouter();

return (
<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
{/_ Header _/}
<View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
<View className="flex-row items-center gap-3 flex-1">
<Pressable onPress={() => router.back()}>
<Ionicons name="chevron-back" size={24} color="#000" />
</Pressable>
<Text className="text-xl font-bold text-gray-900">
Edit Profile
</Text>
</View>
</View>

      {/* Form */}
      <EditProfileContent />
    </SafeAreaView>

);
}
\*/

// 6. Redux integration (if needed):
/\*
// In your store middleware, you could dispatch actions after successful profile update:

const handleSubmit = async (values) => {
try {
// ... API calls ...

    // Update Redux store
    dispatch(userSlice.actions.updateProfile(values));

    // Success notification
    showToast("Profile updated successfully");

} catch (error) {
// Error handling
}
};
\*/

// 7. Testing the form:
/\*
// Example test file: sections/profile/**tests**/EditProfileContent.test.tsx

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditProfileContent from "../EditProfileContent";
import { Provider } from "react-redux";
import { store } from "@/store";

describe("EditProfileContent", () => {
it("should render form sections", () => {
const { getByText } = render(
<Provider store={store}>
<EditProfileContent />
</Provider>
);

    expect(getByText("Profile picture")).toBeTruthy();
    expect(getByText("Personal Information")).toBeTruthy();
    expect(getByText("CV/Resume")).toBeTruthy();
    expect(getByText("Experience")).toBeTruthy();
    expect(getByText("Education")).toBeTruthy();
    expect(getByText("Skills")).toBeTruthy();
    expect(getByText("Bio")).toBeTruthy();

});

it("should validate required fields", async () => {
const { getByText, queryByText } = render(
<Provider store={store}>
<EditProfileContent />
</Provider>
);

    const saveButton = getByText("Save changes");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText("First name is required")).toBeTruthy();
    });

});

it("should submit form with valid data", async () => {
// ... test implementation ...
});
});
\*/

// 8. Customization example:
/\*
// If you want to extend EditProfileContent with additional fields:

// 1. Update validationSchema.ts to add field validation
// 2. Create new section component (e.g., SocialMediaSection.tsx)
// 3. Add section to EditProfileContent JSX
// 4. Update Formik initialValues to include new field
// 5. Include new field in handleSubmit API call

Example:
// Add to EditProfileContent.tsx:
<SocialMediaSection formik={formik} />

// Create SocialMediaSection.tsx:
export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
formik,
}) => {
return (
<View className="px-4 py-6 bg-white rounded-lg mb-4">
<Text className="text-lg font-semibold text-gray-800 mb-4">
Social Media
</Text>

      <Input
        label="LinkedIn"
        placeholder="https://linkedin.com/in/..."
        value={formik.values.linkedin}
        onChangeText={formik.handleChange("linkedin")}
        error={formik.touched.linkedin && formik.errors.linkedin}
      />

      {/* ... more fields ... */}
    </View>

);
};
\*/

// 9. Theme customization:
/\*
// All azure-radiance colors used:
// - bg-azure-radiance (background)
// - text-azure-radiance (text)
// - border-azure-radiance (borders)
// - bg-azure-radiance/10 (light background)
// - bg-azure-radiance/20 (lighter background)

// To change theme, replace all instances of "azure-radiance" with your color
// For example, to use blue:
// bg-blue-500, text-blue-600, border-blue-400, etc.
\*/

export default EditProfileScreen;
