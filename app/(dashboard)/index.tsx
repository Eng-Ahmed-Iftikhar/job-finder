import { useUser } from "@/hooks/useUser";
import { useLogoutMutation } from "@/api/services/authApi";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Logo from "@/assets/logo.png";
import ConfirmationModal from "@/components/ConfirmationModal";

function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    try {
      await logoutApi().unwrap();
      // The auth slice matcher will automatically clear the state
      // and the auth layout will redirect to auth screens
    } catch (error) {
      console.error("Logout API error:", error);
      // Even if API fails, we should still logout locally
      // The auth slice matcher will handle this
    }
  }, [logoutApi]);

  const handleGoToOnboarding = useCallback(() => {
    router.push("/(onboarding)");
  }, [router]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="h-[56px] flex-row items-center justify-between px-4 bg-white border-b border-gray-200">
        <View className="w-6 h-6" />
        <Image source={Logo} className="h-[40px] w-[76px]" />
        <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut}>
          <Text
            className={`text-sm font-semibold ${isLoggingOut ? "text-gray-400" : "text-azure-radiance-500"}`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back!
        </Text>

        {user && (
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              {user.profile?.generalInfo?.firstName}{" "}
              {user.profile?.generalInfo?.lastName}
            </Text>
            <Text className="text-gray-600">{user.email}</Text>
          </View>
        )}

        <View className="space-y-4">
          <TouchableOpacity
            className="bg-azure-radiance-500 p-4 rounded-lg"
            onPress={handleGoToOnboarding}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Complete Onboarding
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg">
            <Text className="text-gray-800 text-center font-semibold text-lg">
              View Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg">
            <Text className="text-gray-800 text-center font-semibold text-lg">
              Job Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="bg-red-500"
        icon="logout"
        iconColor="#EF4444"
      />
    </View>
  );
}

export default Dashboard;
