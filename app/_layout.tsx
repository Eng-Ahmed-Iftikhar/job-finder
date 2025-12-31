import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/globals.css"; // Ensure this is the correct path to your global styles
import { ReduxPersisted, store } from "@/store";
import AuthGuard from "@/components/AuthGuard";
import AppLoader from "@/components/AppLoader";
import NotificationProvider from "@/components/NotificationProvider";
import { GestureResponderEvent, Pressable } from "react-native";
import { setNativeEvent } from "@/store/reducers/uiSlice";
import GestureRoot from "@/components/GestureRoot";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  const handleOnPress = (event: GestureResponderEvent) => {
    store.dispatch(setNativeEvent(event.nativeEvent));
  };

  if (!loaded) {
    return null;
  }

  return (
    <ReduxPersisted>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Pressable className="flex-1" onPress={handleOnPress}>
          <StatusBar style="dark" />
          <NotificationProvider />
          <GestureRoot>
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(dashboard)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(profile)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(onboarding)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </Suspense>
            </AuthGuard>
          </GestureRoot>
        </Pressable>
      </SafeAreaView>
    </ReduxPersisted>
  );
}
