import { COLORS } from "@/constants/theme";
import { useFonts } from 'expo-font';
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ShadowsIntoLight': require('../assets/fonts/ShadowsIntoLight-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

 
  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} onLayout={onLayoutRootView}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
        <StatusBar style="light"/>
    </ClerkAndConvexProvider>
  )
};
