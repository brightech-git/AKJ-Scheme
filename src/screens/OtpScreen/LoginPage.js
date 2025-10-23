import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./LoginStyles.js";
import userService from "../../services/UserService";
import { useNavigation } from "@react-navigation/native";

const { COLORS } = appTheme;

function LoginPage({ route }) {
  const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigation = useNavigation();

  // ✅ Google Sign-In Configuration
  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId:
          "657047091285-hetgcscq8hvli59d0c6oqvg9aoat8850.apps.googleusercontent.com",
        iosClientId:
          "657047091285-57kkictc0pkfjldtf0u133m82huit6rg.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        offlineAccess: true,
      });
    } catch (error) {
      console.error("Google SignIn configuration error:", error);
    }
  }, []);

  // ✅ Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!hasPlayServices)
        throw new Error("Google Play Services not available");

      await GoogleSignin.signOut(); // Clear previous session
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      let idToken = tokens?.idToken || userInfo?.idToken;
      if (!idToken) throw new Error("No ID token received from Google");

      await handleGoogleAuthentication(idToken, userInfo.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      handleGoogleSignInError(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignInError = (error) => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showToast("Google sign-in was cancelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      showToast("Google sign-in is already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      showToast("Google Play Services not available");
    } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      showToast("Please sign in to continue");
    } else {
      showToast(`Google sign-in failed: ${error.message || "Try again"}`);
    }
  };

  // ✅ Google Authentication → Backend (NO contact number storage)
  const handleGoogleAuthentication = async (idToken, userInfo = null) => {
    try {
      const payload = { idToken };
      if (userInfo) {
        payload.userInfo = {
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.photo,
        };
      }

      const response = await userService.googleLogin(payload);

      if (response.success && response.data) {
        const {
          token,
          id,
          email,
          username,
          picture,
          socialMedia,
          message,
          status,
        } = response.data;

        // ✅ Google login: Store everything EXCEPT contact number
        await AsyncStorage.multiSet([
          ["authToken", token],
          ["userId", String(id)],
          ["userEmail", email || ""],
          ["username", username || ""],
          ["userPicture", picture || ""],
          ["socialMedia", socialMedia || ""],
          ["userStatus", status || ""],
          ["userMessage", message || ""],
          ["userData", JSON.stringify(response.data)],
        ]);

        console.log("🟢 GOOGLE LOGIN - Stored Data (No Phone Number):", {
          authToken: token,
          userId: id,
          userEmail: email,
          username: username,
         
        });

        showToast(message || "Logged in successfully with Google");
        navigation.navigate("MpinScreen", { step: 3 });
      } else {
        showToast(response.error || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      showToast("Authentication failed. Please try again.");
    }
  };

  // ✅ Regular Login (WITH contact number storage)
// ✅ Regular Login (WITH contact number storage)
const handleLogin = async () => {
  if (!contactOrEmailOrUsername || !password) {
    return showToast("Please enter email/username and password");
  }

  setLoading(true);
  try {
    const res = await userService.loginUser({
      contactOrEmailOrUsername,
      password,
    });

    // ✅ STEP 1: Console the login response
    console.log("🔵 REGULAR LOGIN RESPONSE:", JSON.stringify(res, null, 2));

    if (res.success && res.data?.token) {
      const data = res.data;
      
      // ✅ STEP 2: Store the data - FIXED: using data.contact instead of data.contactNumber
      const storageItems = [
        ["authToken", data.token],
        ["userId", String(data.id)],
        ["userEmail", data.email || ""],
        ["username", data.username || ""],
        ["userPhoneNumber", data.contact || ""], // ✅ CHANGED: data.contact instead of data.contactNumber
        ["userData", JSON.stringify(data)],
      ];
      
      await AsyncStorage.multiSet(storageItems);

      // ✅ STEP 3: Console the stored data
      console.log("🟢 REGULAR LOGIN - Stored Data (With Phone Number):", {
        authToken: data.token,
        userId: data.id,
        userEmail: data.email,
        username: data.username,
        userPhoneNumber: data.contact, // ✅ CHANGED: data.contact
        fullData: data,
      });

      // ✅ Verify stored data by reading it back
      const storedData = await AsyncStorage.multiGet([
        "authToken", 
        "userId", 
        "userEmail", 
        "username", 
        "userPhoneNumber",
        "userData"
      ]);
      
      console.log("🟣 REGULAR LOGIN - Verified Stored Data:", {
        authToken: storedData[0][1],
        userId: storedData[1][1],
        userEmail: storedData[2][1],
        username: storedData[3][1],
        userPhoneNumber: storedData[4][1], // ✅ Now this should show "7603905056"
        userData: storedData[5][1] ? JSON.parse(storedData[5][1]) : null,
      });

      showToast("Login successful!");
      navigation.navigate("MpinScreen", { step: 3 });
    } else {
      showToast(res.error || "Invalid credentials");
    }
  } catch (err) {
    console.error("🔴 LOGIN ERROR:", err);
    showToast(err.message || "Network error");
  } finally {
    setLoading(false);
  }
};
  const navigateToRegister = () => navigation.navigate("RegisterPage");
  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground
        source={require("../../assets/bg7.jpg")}
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/image/icon2.png")}
                  style={styles.logoImage}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <Text style={styles.label}>Email or Phone</Text>
                <TextInput
                  style={styles.input}
                  value={contactOrEmailOrUsername}
                  onChangeText={setContactOrEmailOrUsername}
                  placeholder="Enter email or phone"
                  placeholderTextColor={COLORS.black1}
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.black1}
                  secureTextEntry
                />

                {/* ✅ Regular Login Button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={
                      loading
                        ? ["#555", "#444"]
                        : [COLORS.gradientcolor7, COLORS.gradientcolor8]
                    }
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.black} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Login</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* ✅ Divider */}
                {/* <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.divider} />
                </View> */}

                {/* ✅ Google Sign-In Button */}
                {/* <TouchableOpacity
                  style={[
                    styles.googleButton,
                    googleLoading && styles.disabledButton,
                  ]}
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <>
                      <View style={styles.Google}>
                        <View>
                          <Image
                            source={require("../../assets/icons/google.png")}
                            style={styles.googleIcon}
                          />
                        </View>
                        <View>
                          <Text style={styles.googleButtonText}>
                            Continue with Google
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </TouchableOpacity> */}

                {/* ✅ Register link */}
                <TouchableOpacity
                  onPress={navigateToRegister}
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={styles.linkText}>Don't have an account?</Text>
                  <Text style={styles.linkText1}> Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {(loading || googleLoading) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              {googleLoading ? "Signing in with Google..." : "Processing..."}
            </Text>
          </View>
        )}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export default LoginPage;