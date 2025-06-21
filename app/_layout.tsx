import { COLORS } from "@/constants/theme";
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ShadowsIntoLight': require('../assets/fonts/ShadowsIntoLight-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
};
