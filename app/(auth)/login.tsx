import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, LogBox, Text, TouchableOpacity, View } from "react-native";

export default function login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  useEffect(() => {
    LogBox.ignoreLogs(['Cross-Origin-Opener-Policy']);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      LogBox.ignoreLogs([
        "Cross-Origin-Opener-Policy policy would block the window.closed call."
      ]);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google"});

      if (setActive && createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  return (
    <View style={styles.container}>

        {/* BRAND */}
        <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
                <Ionicons name="images" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>Instavives</Text>
            <Text style={styles.tagline}>Share your favorite moments</Text>
            
        </View>
        
        {/* ILLUSTRAION */}
        <View style={styles.illustrationContainer}>
            <Image 
            source={require("@/assets/images/coverImage.png")}
            style={styles.illustration}
            resizeMode='cover'
            />
        </View>

        {/* LOGIN */}
        
        <View style={styles.loginSection}>
            <TouchableOpacity 
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                activeOpacity={0.9}    
                >
                <View style={styles.googleIconContainer}>
                    <Ionicons name="logo-google" size={20} color={COLORS.surface}/>
                </View>
                
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>By continuing, you agree to our Privacy Policy</Text>
        </View>

        
    </View>
  );
}